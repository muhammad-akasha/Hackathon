import mongoose from "mongoose";
import { getUserDetail } from "./user.controller.js";
import ordermodel from "../models/order.model.js";
import productModel from "../models/product.model.js";
import usermodel from "../models/usermodel.js";

// place order
const placeOrder = async (req, res) => {
  const { products } = req.body; // get array of products IDS

  if (!Array.isArray(products)) {
    return res.status(400).json({ message: "'products' should be an array" }); // check product id found or not
  }
  try {
    const user = await getUserDetail(req); // get Login user detail using cookie
    if (!user) {
      return res.status(404).json({ message: user });
    }

    const productsOrder = await productModel.find({ _id: { $in: products } }); // get product using ID

    let totalPrice = 0;
    if (productsOrder.length === products.length) {
      productsOrder.forEach((item) => (totalPrice += item.price));
    } else {
      return res.status(404).json({ message: "Product not match by all IDS" });
    }

    const order = await ordermodel.create({
      userId: user._id,
      productId: productsOrder.map((product) => product._id),
      totalPrice,
      status: "pending", // Set the order status to pending
    });

    await usermodel.findByIdAndUpdate(user._id, {
      $push: { orders: order._id },
    });

    await Promise.all(
      productsOrder.map(async (product) => {
        await productModel.findByIdAndUpdate(
          product._id,
          {
            $push: { orderItem: order._id },
          },
          { new: true }
        );
      })
    );

    const populatedOrder = await ordermodel
      .findById(order._id)
      .populate("productId");

    return res.status(200).json({ populatedOrder });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

// get single order
const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Not A Valid ID" });
  }

  try {
    const user = await getUserDetail(req);

    if (!user) {
      return res.status(404).json({ message: user });
    }

    const order = await ordermodel
      .findById(id)
      .populate("productId") // Populate product details
      .populate("userId", "userName , email"); // Populate user details

    if (order.userId._id.toString() !== user._id.toString()) {
      return res.status(404).json({
        message: "No Access to View This Order",
      });
    }

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(400).json({ error: "Server error" });
  }
};

// get all login user orders
const getAllOrderOfUser = async (req, res) => {
  try {
    const user = await getUserDetail(req);
    if (!user) {
      return res.status(404).json({ message: user });
    }
    if (!user) {
      return res.status(400).json({ message: "UnAuthorized" });
    }
    const orders = await usermodel.findById(user._id).populate("orders");
    if (!orders) {
      return res.status(404).json({ message: "No Orders Found!" });
    }
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export { placeOrder, getOrderById, getAllOrderOfUser };
