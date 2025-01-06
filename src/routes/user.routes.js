import express from "express";
import {
  getAllUsers,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  uploadImage,
} from "../controllers/user.controller.js";
import { sendEmail } from "../controllers/sendEmail.js";
import { upload } from "../middleware/multer.middleware.js";
import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/users", getAllUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refreshtoken", refreshToken);
router.post("/sendemail", sendEmail);
router.post("/uploadimg", upload.single("image"), uploadImage);
router.get("/auth", authenticateUser);

export default router;
