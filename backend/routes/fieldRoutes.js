import express from "express";

import {
  createField,
  getAllFields,
  getFieldById,
  updateField,
  deleteField,
} from "../controllers/fieldController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllFields);
router.get("/:fieldId", getFieldById);

router.post("/", protect, adminOnly, createField);
router.put("/:fieldId", protect, adminOnly, updateField);
router.delete("/:fieldId", protect, adminOnly, deleteField);

export default router;
