import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  searchPosts,
  getSimilarProblems,
  toggleSavePost,
  getPostSaveStatus,
  getMySavedPosts,
  getRecommendedPosts,
  getPublicRecentPosts,
  getPublicSolvedProblems,
  getPublicActiveProblems,
} from "../controllers/postController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/public/recent", getPublicRecentPosts);
router.get("/public/solved", getPublicSolvedProblems);
router.get("/public/active", getPublicActiveProblems);

router.get("/search", protect, searchPosts);
router.get("/similar", getSimilarProblems);
router.get("/saved/me", protect, getMySavedPosts);
router.get("/recommended", protect, getRecommendedPosts);

router.get("/:postId/save-status", protect, getPostSaveStatus);
router.post("/:postId/save", protect, toggleSavePost);

router.get("/", protect, getAllPosts);
router.get("/:id", getPostById);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;