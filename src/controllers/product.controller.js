import { getUserDetail, uploadImageToCloudinary } from "./user.controller.js";
import product from "../models/product.model.js";
import mongoose from "mongoose";

// create product
const createProduct = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Image Must be Required",
    });
  }
  const { name, description, price } = req.body;
  if (!name || !description || !price) {
    return res.status(400).json({
      message: "all the field required",
    });
  }

  try {
    const imageUrl = await uploadImageToCloudinary(req.file.path);
    // Get user details
    const user = await getUserDetail(req);

    // Create and save the ad
    const newAd = await product.create({
      name,
      description,
      price,
      image: imageUrl,
    });

    // Update user's published ads
    await product.findByIdAndUpdate(
      newAd._id,
      { $push: { createdBy: user._id } },
      { new: true }
    );

    // Send success response
    res.status(201).json({
      message: "Ad created successfully",
      ad: newAd,
    });
  } catch (error) {
    console.error("Error creating ad:", error);
    res.status(500).json({
      message: "Failed to create ad",
      error: error.message,
    });
  }
};

// get single product
const singleProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: "Not a Valid ID",
    });
  }
  const getSingleProduct = await product
    .findById(id)
    .populate("createdBy", "userName , email _id");

  if (!getSingleProduct) {
    return res.status(404).json({ message: "NO PRODUCT FOUND!" });
  }
  res.status(200).json({ getSingleProduct });
};

// edit product
const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: "Not a Valid ID",
    });
  }
  const imageUrl = await uploadImageToCloudinary(req.file.path);
  let updateObj = {};

  // Ensure the required fields are present

  if (name) {
    updateObj.name = name;
  }
  if (description) {
    updateObj.description = description;
  }
  if (price) {
    updateObj.price = price;
  }
  if (imageUrl) {
    updateObj.image = imageUrl;
  }

  const ad = await product.findByIdAndUpdate(id, updateObj, { new: true });
  res.status(200).json({ ad });
};

// delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: "Not a Valid ID",
    });
  }

  const user = await getUserDetail(req);
  if (user) {
    const ad = await OlxAd.findByIdAndDelete(id);
    return res.status(200).json({ ad });
  } else {
    return res.status(404).json({ message: "Un-Authorized" });
  }
};

// get all product
const getAllProduct = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const skip = (page - 1) * limit;

  const ads = await product
    .find({})
    .skip(skip)
    .limit(limit)
    .populate("createdBy");

  if (!ads) {
    return res.status(404).json({ message: "NO ADS FOUND!" });
  }
  res.status(200).json({ ads });
};

export {
  createProduct,
  deleteProduct,
  editProduct,
  getAllProduct,
  singleProduct,
};
