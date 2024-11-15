import express from "express";
import { userProtector, adminProtector } from "../middleware/authMidlware.js";
import {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProduct);
router.post("/", userProtector, adminProtector, createProduct);
router.get("/top", getTopProduct);
router.get("/:id", getProductById);
router.put("/:id", userProtector, adminProtector, updateProduct);
router.delete("/:id", userProtector, adminProtector, deleteProduct);
router.post("/:id/reviews", userProtector, createProductReview);

export default router;
