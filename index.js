import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "./src/db/index.js";
import userRoutes from "./src/routes/user.routes.js";
import productRoute from "./src/routes/product.route.js";
import orderRoutes from "./src/routes/order.routes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // This should match the frontend URL
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true, // Allow cookies to be sent
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", productRoute);
app.use("/api/v1", orderRoutes);

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });
