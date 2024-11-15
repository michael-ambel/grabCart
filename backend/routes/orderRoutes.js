import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from "../controllers/orderController.js";
import { userProtector, adminProtector } from "../middleware/authMidlware.js";

const router = express.Router();

router.post("/", userProtector, addOrderItems);
router.get("/mine", userProtector, getMyOrders);
router.get("/:id", userProtector, getOrderById);
router.put("/:id/pay", userProtector, updateOrderToPaid);
router.put(
  "/:id/deliver",
  userProtector,
  adminProtector,
  updateOrderToDelivered
);
router.get("/", userProtector, adminProtector, getOrders);

export default router;
