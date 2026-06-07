import express from "express";

import {
  addComment,
  getCommentsByPost,
  deleteComment,
  toggleCommentLike,
} from "../controllers/commentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/posts/:postId/comments", protect, addComment);
router.get("/posts/:postId/comments", getCommentsByPost);
router.delete("/comments/:commentId", protect, deleteComment);
router.post("/comments/:commentId/like", protect, toggleCommentLike);

export default router;