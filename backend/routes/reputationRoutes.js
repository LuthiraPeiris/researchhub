import express from "express";

import {
  getLeaderboard,
  getUserReputation,
  recalculateUserBadges,
  recalculateAllBadges,
} from "../controllers/reputationController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
router.get("/user/:userId", getUserReputation);
router.post("/user/:userId/recalculate-badges", protect, adminOnly, recalculateUserBadges);
router.post("/recalculate-badges", protect, adminOnly, recalculateAllBadges);

export default router;
