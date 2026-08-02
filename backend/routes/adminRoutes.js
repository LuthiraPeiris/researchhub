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
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

//----------------------users--------------------
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

//---------------------posts---------------------
router.get("/posts", getAllPosts);
router.delete("/posts/:id", deletePost);
router.put("/posts/:id/archive", archivePost);

//---------------------comments------------------
router.get("/comments", getAllComments);
router.delete("/comments/:id", deleteComment);

//---------------------solutions----------------
router.get("/solutions", getAllSolutions);
router.delete("/solutions/:id", deleteSolution);

//---------------------Fields--------------------
router.get("/fields", getAllFields);
router.delete("/fields/:id", deleteField);
router.post("/fields", createField);
router.put("/fields/:id", updateField);

//--------------------archive-------------------
router.get("/archive", getArchive);
router.put("/archive/:id/restore", restoreArchivePost);

export default router;
