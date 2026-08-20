import express from "express";
import {
  createNotification,
  deleteNotificationByID,
  deleteAllNotifications,
  getAllNotifications,
  filterNotifications,
  getNotificationsById,
  markNotificationAsRead,
} from "../controllers/notifications.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();
router.use(authMiddleware);
router.post("/create", createNotification);
router.get("/filter", filterNotifications);
router.get("/user/:userId", getAllNotifications);
router.get("/get/:id", getNotificationsById);
router.patch("/read/:id", markNotificationAsRead);
router.delete("/delete/:id", deleteNotificationByID);
router.delete("/delete-all", deleteAllNotifications);
export default router;
