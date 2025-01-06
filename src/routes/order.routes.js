import express from "express";
import {
  getAllOrderOfUser,
  getOrderById,
  placeOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/placeorder", placeOrder);
router.get("/order/:id", getOrderById);
router.get("/getuserorder", getAllOrderOfUser);

export default router;
