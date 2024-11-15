import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUser,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import { userProtector, adminProtector } from "../middleware/authMidlware.js";

const router = express.Router();

router
  .route("/")
  .post(registerUser)
  .get(userProtector, adminProtector, getUser);
router.post("/logout", logoutUser);
router.post("/login", loginUser);
router
  .route("/profile")
  .get(userProtector, getUserProfile)
  .put(userProtector, updateUserProfile);
router
  .route("/:id")
  .delete(userProtector, adminProtector, deleteUser)
  .get(userProtector, adminProtector, getUserById)
  .put(userProtector, adminProtector, updateUser);

export default router;
