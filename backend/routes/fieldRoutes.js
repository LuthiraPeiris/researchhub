import express from "express";

import {
  createField,
  getAllFields,
  getFieldById,
  updateField,
  deleteField,
} from "../controllers/fieldController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllFields);
router.get("/:fieldId", getFieldById);

router.post("/", protect, createField);
router.put("/:fieldId", protect, updateField);
router.delete("/:fieldId", protect, deleteField);

export default router;