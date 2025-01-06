import User from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { sendEmail } from "./sendEmail.js";
import dotenv from "dotenv";
dotenv.config();

// cloudinary config

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// get user detail using cookie refresh token
const getUserDetail = async (req) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken) return console.log("no refresh token found!");

  const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
  const user = await User.findOne({ email: decodedToken.email });
  if (!user) {
    return console.log("User Not Found!");
  }
  return user;
};

// upload image function
const uploadImageToCloudinary = async (localpath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localpath);
    return uploadResult.url;
  } catch (error) {
    fs.unlinkSync(localpath);
    return null;
  }
};

// upload image
const uploadImage = async (req, res) => {
  if (!req.file)
    return res.status(400).json({
      message: "no image file uploaded",
    });

  try {
    const uploadResult = await uploadImageToCloudinary(req.file.path);

    if (!uploadResult)
      return res
        .status(500)
        .json({ message: "error occured while uploading image" });

    res.json({
      message: "image uploaded successfully",
      url: uploadResult,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occured while uploading image" });
  }
};

// generate access token
const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: "6h",
  });
};

// generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });
};

const getAllUsers = async (req, res) => {
  // pagination
  const { limit, page } = req.query;

  const skip = (page - 1) * limit;
  const users = await User.find({}).skip(skip).limit(limit);
  res.status(200).json({
    length: users.length,
    users,
  });
};

// register user
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName) return res.status(400).json({ message: "UserName required" });
  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });

  const user = await User.findOne({ email: email });
  // check email already used or not
  if (user) return res.status(401).json({ message: "user already exist" });
  try {
    const createUser = await User.create({
      email,
      password,
      userName,
    });
    const emailSend = await sendEmail(email);

    res.json({
      message: "user registered successfully",
      data: createUser,
      emailSend,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "no user found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "incorrect password" });

    // token generate
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({
      message: "user loggedIn successfully",
      accessToken,
      refreshToken,
      data: user,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// logout user
const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "user logout successfully" });
};

// refreshtoken
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "no refresh token found!" });

  const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
  const user = await User.findOne({ email: decodedToken.email });

  if (!user) return res.status(404).json({ message: "invalid token" });

  const generateToken = generateAccessToken(user);
  res.json({ message: "access token generated", accesstoken: generateToken });
};

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getAllUsers,
  uploadImage,
  getUserDetail,
  uploadImageToCloudinary,
};
