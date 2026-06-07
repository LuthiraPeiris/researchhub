import express from "express";

import {
  getUserProfile,
  updateUserProfile,
  getUserPosts,
  updateProfilePicture,
  getReceivedSolutions,
  getMySolutions,
  getUserSolutions,
  getUserFields,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// IMPORTANT: /me routes must come before /:userId routes
router.get("/me/received-solutions", protect, getReceivedSolutions);
router.get("/me/solutions", protect, getMySolutions);

// User-specific routes
router.get("/:userId/posts", getUserPosts);
router.get("/:userId/solutions", getUserSolutions);
router.get("/:userId/fields", getUserFields);
router.get("/:userId", getUserProfile);

router.put("/:userId", protect, updateUserProfile);

router.put(
  "/:userId/profile-picture",
  protect,
  upload.single("profile_picture"),
  updateProfilePicture
);

export default router;