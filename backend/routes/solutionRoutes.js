import express from "express";

import {
  addSolution,
  getSolutionsByPost,
  verifySolution,
  deleteSolution,
  deleteSolutionAttachment,
  toggleSolutionLike,
} from "../controllers/solutionController.js";

import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Get solutions for a specific post
router.get("/posts/:postId/solutions", getSolutionsByPost);

// Submit solution with optional multiple file upload
router.post(
  "/posts/:postId/solutions",
  protect,
  upload.array("solution_files", 5),
  addSolution
);

// Like or unlike solution
router.post("/solutions/:solutionId/like", protect, toggleSolutionLike);

// Mark solution as solved/verified
router.put("/solutions/:solutionId/verify", protect, verifySolution);

// Delete individual solution attachment
router.delete(
  "/solution-attachments/:attachmentId",
  protect,
  deleteSolutionAttachment
);

// Delete solution
router.delete("/solutions/:solutionId", protect, deleteSolution);

export default router;