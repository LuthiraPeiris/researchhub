import express from "express";

import {
  getLeaderboard,
  getUserReputation,
  recalculateUserBadges,
  recalculateAllBadges,
} from "../controllers/reputationController.js";

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
router.get("/user/:userId", getUserReputation);
router.post("/user/:userId/recalculate-badges", recalculateUserBadges);
router.post("/recalculate-badges", recalculateAllBadges);

export default router;