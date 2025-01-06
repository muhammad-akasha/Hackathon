import express from "express";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getAllProduct,
  singleProduct,
} from "../controllers/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/createproduct", upload.single("image"), createProduct);
router.get("/allproduct", getAllProduct);
router.post("/singleproduct/:id", singleProduct);
router.put("/product/:id", upload.single("image"), editProduct);
router.delete("/deleteproduct/:id", deleteProduct);

export default router;
