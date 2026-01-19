import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }, // Short description
  fullDescription: { type: String, default: "" }, // Full description for product page
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
