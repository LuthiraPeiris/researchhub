import express from "express";

import {
  uploadPostAttachment,
  getPostAttachments,
  deletePostAttachment,
} from "../controllers/uploadController.js";

import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/**
 * Upload up to five attachments for a problem post.
 *
 * The frontend must send multipart/form-data using the field name "files".
 * Uploaded files will be available in the controller as req.files.
 */
router.post(
  "/posts/:postId/attachments",
  protect,
  upload.array("files", 5),
  uploadPostAttachment,
);

/**
 * Get all attachments belonging to a problem post.
 *
 * The controller should generate signed S3 URLs before returning
 * the attachments to the frontend.
 */
router.get(
  "/posts/:postId/attachments",
  getPostAttachments,
);

/**
 * Delete an attachment.
 *
 * The controller should:
 * 1. Verify that the logged-in user owns the post or is an admin.
 * 2. Delete the object from S3.
 * 3. Delete the attachment record from MySQL.
 */
router.delete(
  "/attachments/:attachmentId",
  protect,
  deletePostAttachment,
);

export default router;