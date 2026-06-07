import express from "express";

import {
  getAllArchiveItems,
  getArchiveItemById,
} from "../controllers/archiveController.js";

const router = express.Router();

router.get("/", getAllArchiveItems);
router.get("/:id", getArchiveItemById);

export default router;