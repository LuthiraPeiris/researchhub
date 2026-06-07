import express from "express";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

import {
  getAllUsers,
  deleteUser,

  getAllPosts,
  deletePost,
  archivePost,

  getAllComments,
  deleteComment,

  getAllSolutions,
  deleteSolution,

  getAllFields,
  createField,
  updateField,
  deleteField,

  getArchive,
  restoreArchivePost,

  getNotifications,
  createNotification,
  deleteNotification,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes are protected
router.use(protect);
router.use(adminOnly);

// Users
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Posts
router.get("/posts", getAllPosts);
router.delete("/posts/:id", deletePost);
router.put("/posts/:id/archive", archivePost);

// Comments
router.get("/comments", getAllComments);
router.delete("/comments/:id", deleteComment);

// Solutions
router.get("/solutions", getAllSolutions);
router.delete("/solutions/:id", deleteSolution);

// Fields
router.get("/fields", getAllFields);
router.post("/fields", createField);
router.put("/fields/:id", updateField);
router.delete("/fields/:id", deleteField);

// Archive
router.get("/archive", getArchive);
router.put("/archive/:id/restore", restoreArchivePost);

// Notifications
router.get("/notifications", getNotifications);
router.post("/notifications", createNotification);
router.delete("/notifications/:id", deleteNotification);

export default router;