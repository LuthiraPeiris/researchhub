import express from "express";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/read-all", protect, markAllNotificationsAsRead);
router.put("/:notificationId/read", protect, markNotificationAsRead);
router.delete("/:notificationId", protect, deleteNotification);

export default router;