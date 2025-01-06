import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
