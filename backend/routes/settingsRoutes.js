import express from "express";

import {
  changePassword,
  getNotificationPreferences,
  updateNotificationPreferences,
  getUserSettings,
  updateUserSettings,
  deleteAccount,
} from "../controllers/settingsController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/change-password", protect, changePassword);

router.get("/notification-preferences", protect, getNotificationPreferences);
router.put("/notification-preferences", protect, updateNotificationPreferences);

router.get("/preferences", protect, getUserSettings);
router.put("/preferences", protect, updateUserSettings);

router.delete("/delete-account", protect, deleteAccount);

export default router;