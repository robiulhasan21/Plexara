import express from "express";
import SSLCommerzPayment from "sslcommerz-lts";
import Order from "../models/orderModel.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === "true";

// Note: SSLCOMMERZ gateway will show all payment options including BKash and Nagad
// Users can select their preferred payment method on the gateway page

// 1️⃣ INITIATE PAYMENT
router.post("/sslcommerz/initiate", userAuth, async (req, res) => {
  try {
    const { items = [], address, cus_name, cus_email, cus_phone, amount: reqAmount, paymentMethod } = req.body;

    if (!address || !cus_name || !cus_email || !cus_phone) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const userId = req.userId;

    // Prefer the amount sent by frontend; fallback to computed amount
    const amount = Number(reqAmount) || items.reduce((sum, item) => {
      const qty = item.quantity ?? item.qty ?? item.q ?? 0;
      return sum + (Number(item.price) || 0) * Number(qty);
    }, 0);

    if (amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const tran_id = "TXN_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

    // Create order with pending status initially
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentMethod: paymentMethod || 'SSLCOMMERZ',
      payment: false, // Will be set to true after successful payment
      paymentStatus: "pending",
      customer: { name: cus_name, email: cus_email, phone: cus_phone },
      transactionId: tran_id,
    });

    // Ensure BACKEND_URL is set
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      console.error("[payment/initiate] BACKEND_URL environment variable is not set");
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error. Please contact administrator." 
      });
    }

    const data = {
      total_amount: amount,
      currency: "BDT",
      tran_id,
      success_url: `${backendUrl}/api/payment/sslcommerz/success`,
      fail_url: `${backendUrl}/api/payment/sslcommerz/fail`,
      cancel_url: `${backendUrl}/api/payment/sslcommerz/cancel`,
      ipn_url: `${backendUrl}/api/payment/sslcommerz/ipn`,

      product_name: "Ecommerce Order",
      product_category: "General",
      product_profile: "general",

      cus_name: cus_name.trim(),
      cus_email: cus_email.trim(),
      cus_phone: cus_phone.trim(),
      cus_add1: (address.street || '').trim(),
      cus_city: (address.city || '').trim(),
      cus_country: address.country || 'Bangladesh',
      cus_postcode: (address.zipcode || '').trim(),
      cus_state: (address.state || '').trim(),

      // Additional required fields for SSLCOMMERZ
      shipping_method: "NO",
      num_of_item: items.length || 1,

      value_a: tran_id,
      value_b: paymentMethod || 'SSLCOMMERZ',
    };

    // Validate required fields
    if (!data.cus_name || !data.cus_email || !data.cus_phone) {
      return res.status(400).json({ 
        success: false, 
        message: "Customer name, email, and phone are required" 
      });
    }

    if (!store_id || !store_passwd) {
      return res.status(500).json({ success: false, message: "Payment gateway not configured. Please contact administrator." });
    }

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    
    let apiResponse;
    try {
      apiResponse = await sslcz.init(data);
    } catch (initError) {
      console.error("[payment/initiate] SSLCOMMERZ init error:", initError);
      console.error("[payment/initiate] Error stack:", initError.stack);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to connect to payment gateway. Please check your credentials and try again.",
        error: initError.message || 'Connection error',
        debug: process.env.NODE_ENV === 'development' ? {
          error: initError.toString(),
          stack: initError.stack
        } : undefined
      });
    }

    console.log("[payment/initiate] SSLCOMMERZ credentials check:", {
      store_id: store_id ? `${store_id.substring(0, 4)}...` : 'MISSING',
      store_passwd: store_passwd ? 'SET' : 'MISSING',
      is_live: is_live
    });
    console.log("[payment/initiate] request data:", JSON.stringify(data, null, 2));
    console.log("[payment/initiate] sslcz.init response type:", typeof apiResponse);
    console.log("[payment/initiate] sslcz.init response:", JSON.stringify(apiResponse, null, 2));

    // Handle case where response might be a string (URL directly)
    if (typeof apiResponse === 'string') {
      if (apiResponse.startsWith('http')) {
        console.log("[payment/initiate] Response is direct URL:", apiResponse);
        return res.json({ success: true, url: apiResponse });
      }
    }

    // Check if response is an error
    if (apiResponse?.status === 'FAILED' || apiResponse?.status === 'FAILURE' || apiResponse?.failedreason) {
      console.error("[payment/initiate] SSLCOMMERZ returned error:", apiResponse);
      return res.status(400).json({ 
        success: false, 
        message: apiResponse?.failedreason || apiResponse?.error || "Payment gateway returned an error. Please check your credentials and try again.",
        error: apiResponse
      });
    }

    // Try multiple possible URL fields returned by provider
    // SSLCOMMERZ typically returns: GatewayPageURL, redirectGatewayURL, or redirect_url
    const url = apiResponse?.GatewayPageURL || 
                apiResponse?.GatewayPageUrl || 
                apiResponse?.gatewayPageURL ||
                apiResponse?.redirectGatewayURL ||
                apiResponse?.redirectGatewayUrl ||
                apiResponse?.redirect_url || 
                apiResponse?.redirectUrl || 
                apiResponse?.url ||
                apiResponse?.redirectURL ||
                apiResponse?.redirecturl ||
                (apiResponse?.data && (apiResponse.data.GatewayPageURL || apiResponse.data.url)) ||
                null;

    if (!url) {
      console.error("[payment/initiate] No redirect URL in response. Full response:", JSON.stringify(apiResponse, null, 2));
      console.error("[payment/initiate] Response keys:", Object.keys(apiResponse || {}));
      
      // Check if it's a validation error
      if (apiResponse?.error || apiResponse?.errors) {
        return res.status(400).json({ 
          success: false, 
          message: apiResponse?.error || "Invalid payment data. Please check all fields.",
          errors: apiResponse?.errors,
          debug: process.env.NODE_ENV === 'development' ? apiResponse : undefined
        });
      }

      // Provide helpful error message
      const errorMessage = !store_id || !store_passwd 
        ? "Payment gateway credentials are not configured. Please contact administrator."
        : "Payment gateway did not return redirect URL. Please verify your SSLCOMMERZ store credentials are correct.";

      return res.status(500).json({ 
        success: false, 
        message: errorMessage,
        error: "No redirect URL in response",
        debug: process.env.NODE_ENV === 'development' ? {
          response: apiResponse,
          responseType: typeof apiResponse,
          responseKeys: Object.keys(apiResponse || {}),
          credentialsConfigured: !!(store_id && store_passwd)
        } : undefined
      });
    }

    console.log("[payment/initiate] Redirect URL found:", url);
    res.json({ success: true, url });
  } catch (err) {
    console.error("[payment/initiate] Error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Failed to initialize payment. Please try again." 
    });
  }
});

// Helper function to extract callback data from both body and query
const getCallbackData = (req) => {
  return {
    val_id: req.body?.val_id || req.query?.val_id,
    tran_id: req.body?.tran_id || req.query?.tran_id,
    status: req.body?.status || req.query?.status,
  };
};

// 2️⃣ SUCCESS - Handle both GET and POST
// This is called by SSLCOMMERZ after user completes payment (enters OTP and confirms)
router.all("/sslcommerz/success", async (req, res) => {
  try {
    console.log("[payment/success] Callback received - Method:", req.method);
    console.log("[payment/success] Query params:", req.query);
    console.log("[payment/success] Body params:", req.body);
    
    const { val_id, tran_id, status } = getCallbackData(req);

    if (!tran_id) {
      console.error("[payment/success] Missing transaction ID");
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-failed`);
    }

    console.log("[payment/success] Processing transaction:", { tran_id, val_id, status });

    if (!store_id || !store_passwd) {
      console.error("[payment/success] SSLCOMMERZ not configured");
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-failed`);
    }

    // Check if order exists
    const existingOrder = await Order.findOne({ transactionId: tran_id });
    if (!existingOrder) {
      console.error("[payment/success] Order not found for transaction:", tran_id);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-failed`);
    }

    // If val_id is provided, validate the transaction with SSLCOMMERZ
    if (val_id) {
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      try {
        console.log("[payment/success] Validating transaction with SSLCOMMERZ...");
        const validation = await sslcz.validate({ val_id });
        console.log("[payment/success] Validation response:", validation);
        
        if (validation.status === "VALID" || validation.status === "VALIDATED") {
          await Order.findOneAndUpdate(
            { transactionId: tran_id },
            { 
              paymentStatus: "paid",
              payment: true,
              status: "Order Placed"
            }
          );
          console.log("[payment/success] ✅ Payment validated and order updated:", tran_id);
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success`);
        } else {
          console.error("[payment/success] Validation failed:", validation);
          // Still update order but mark as pending for manual review
          await Order.findOneAndUpdate(
            { transactionId: tran_id },
            { 
              paymentStatus: "pending",
              payment: false
            }
          );
        }
      } catch (validationError) {
        console.error("[payment/success] Validation error:", validationError);
        // Continue to check status field
      }
    }
    
    // Check status field from SSLCOMMERZ response
    if (status === "VALID" || req.body?.status === "VALID" || req.query?.status === "VALID") {
      await Order.findOneAndUpdate(
        { transactionId: tran_id },
        { 
          paymentStatus: "paid",
          payment: true,
          status: "Order Placed"
        }
      );
      console.log("[payment/success] ✅ Payment confirmed (status=VALID):", tran_id);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success`);
    }

    // If we reach here, payment might have failed or status is unclear
    console.warn("[payment/success] ⚠️ Payment status unclear, redirecting to failed page");
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-failed`);
  } catch (err) {
    console.error("[payment/success] Error:", err);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-failed`);
  }
});

// 3️⃣ FAIL - Handle both GET and POST
router.all("/sslcommerz/fail", async (req, res) => {
  try {
    const { tran_id } = getCallbackData(req);
    
    if (tran_id) {
      await Order.findOneAndUpdate(
        { transactionId: tran_id },
        { 
          paymentStatus: "failed",
          payment: false
        }
      );
      console.log("[payment/fail] Payment failed for transaction:", tran_id);
    }
    
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-failed`);
  } catch (err) {
    console.error("[payment/fail] Error:", err);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-failed`);
  }
});

// 4️⃣ CANCEL - Handle both GET and POST
router.all("/sslcommerz/cancel", async (req, res) => {
  try {
    const { tran_id } = getCallbackData(req);
    
    if (tran_id) {
      await Order.findOneAndUpdate(
        { transactionId: tran_id },
        { 
          paymentStatus: "cancelled",
          payment: false
        }
      );
      console.log("[payment/cancel] Payment cancelled for transaction:", tran_id);
    }
    
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-cancel`);
  } catch (err) {
    console.error("[payment/cancel] Error:", err);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-cancel`);
  }
});

// 5️⃣ IPN (Instant Payment Notification) - Handle both GET and POST
router.all("/sslcommerz/ipn", async (req, res) => {
  try {
    const { val_id, tran_id, status } = getCallbackData(req);

    if (!tran_id) {
      console.error("[payment/ipn] Missing transaction ID");
      return res.status(400).send("IPN FAILED - Missing transaction ID");
    }

    if (!store_id || !store_passwd) {
      console.error("[payment/ipn] SSLCOMMERZ not configured");
      return res.status(500).send("IPN FAILED - Gateway not configured");
    }

    // Validate transaction if val_id is provided
    if (val_id) {
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      try {
        const validation = await sslcz.validate({ val_id });
        
        if (validation.status === "VALID") {
          await Order.findOneAndUpdate(
            { transactionId: tran_id },
            { 
              paymentStatus: "paid",
              payment: true,
              status: "Order Placed"
            }
          );
          console.log("[payment/ipn] Payment validated and order updated:", tran_id);
          return res.send("IPN OK");
        } else {
          console.error("[payment/ipn] Validation failed:", validation);
          return res.status(400).send("IPN FAILED - Invalid transaction");
        }
      } catch (validationError) {
        console.error("[payment/ipn] Validation error:", validationError);
        return res.status(500).send("IPN FAILED - Validation error");
      }
    } else if (status === "VALID") {
      // If status is VALID but no val_id, still update order
      await Order.findOneAndUpdate(
        { transactionId: tran_id },
        { 
          paymentStatus: "paid",
          payment: true,
          status: "Order Placed"
        }
      );
      console.log("[payment/ipn] Payment confirmed without validation:", tran_id);
      return res.send("IPN OK");
    }

    res.status(400).send("IPN FAILED - Invalid status");
  } catch (err) {
    console.error("[payment/ipn] Error:", err);
    res.status(500).send("IPN FAILED - Server error");
  }
});

export default router;

