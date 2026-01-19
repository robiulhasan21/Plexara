import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Short description for listings / top of product page
  description: { type: String, required: true },
  // Full description for detailed tab on product page
  fullDescription: { type: String, default: "" },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  images: { type: Array, required: true },
  category: { type: String, required: true },
  subType: { type: String, required: true },
  type: { type: String, required: true },
  sizes: { type: Array, required: true },
  quantity: { type: Number, default: 0 }, // <-- New field
  bestseller: { type: Boolean, default: false },
  date: { type: Number, default: Date.now },
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;
