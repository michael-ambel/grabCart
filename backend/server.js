import path from "path";
import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRoute from "./routes/uploadRutes.js";

dotenv.config();

const port = process.env.PORT;

connectDB();

const app = express();

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie parser
app.use(cookieParser());

//app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRoute);

app.get("/api/config/paypal", (req, res) =>
  res.send({ id: process.env.PAYPAL_CLIENT_ID })
);

const __dirname = path.resolve(); //set __dirname to the current directory

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.listen(port, () => console.log(`Server is running on port: ${port}`));
