import express from "express";

import {
  uploadPostAttachment,
  getPostAttachments,
  deletePostAttachment,
} from "../controllers/uploadController.js";

import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/posts/:postId/attachments",
  protect,
  upload.array("files", 5),
  uploadPostAttachment
);

router.get("/posts/:postId/attachments", getPostAttachments);

router.delete(
  "/attachments/:attachmentId",
  protect,
  deletePostAttachment
);

export default router;