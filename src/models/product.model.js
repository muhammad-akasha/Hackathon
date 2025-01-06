import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderItem: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], //order id
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
