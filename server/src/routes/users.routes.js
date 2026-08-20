import express from "express";
import {
  createUser,
  registerUser,
  loginUser,
  findUserByEmail,
  resetPassword,
  getUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMeController,
} from "../controllers/users.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
const router = express.Router();
router.post("/create", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);
router.get("/me", authMiddleware, getMeController);
router.get("/auth", authMiddleware, getMeController);
router.get("/get", authMiddleware, getUser);
router.get("/byEmail/:email", authMiddleware, findUserByEmail);
router.get("/:id", authMiddleware, getUserById);
router.patch("/update/:id", authMiddleware, updateUser);
router.delete(
  "/delete/:id",
  authMiddleware,
  authorizeRoles("USER", "ADMIN", "SUPERADMIN"),
  deleteUser
);
export default router;
