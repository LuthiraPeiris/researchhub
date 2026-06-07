import db from "../config/db.js";
import fs from "fs";
import path from "path";

export const uploadPostAttachment = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded",
      });
    }

    const [posts] = await db.query(
      "SELECT * FROM posts WHERE post_id = ?",
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const uploadedAttachments = [];

    for (const file of req.files) {
      const filePath = `/uploads/${file.filename}`;

      const [result] = await db.query(
        `INSERT INTO post_attachments 
        (post_id, file_name, file_type, file_size, file_path)
        VALUES (?, ?, ?, ?, ?)`,
        [
          postId,
          file.originalname,
          file.mimetype,
          file.size,
          filePath,
        ]
      );

      uploadedAttachments.push({
        attachment_id: result.insertId,
        file_name: file.originalname,
        file_type: file.mimetype,
        file_size: file.size,
        file_path: filePath,
      });
    }

    res.status(201).json({
      message: "Files uploaded successfully",
      attachments: uploadedAttachments,
    });
  } catch (error) {
    res.status(500).json({
      message: "File upload failed",
      error: error.message,
    });
  }
};

export const getPostAttachments = async (req, res) => {
  try {
    const { postId } = req.params;

    const [attachments] = await db.query(
      "SELECT * FROM post_attachments WHERE post_id = ? ORDER BY uploaded_at DESC",
      [postId]
    );

    res.status(200).json(attachments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch attachments",
      error: error.message,
    });
  }
};

export const deletePostAttachment = async (req, res) => {
  try {
    const { attachmentId } = req.params;

    const [attachments] = await db.query(
      `SELECT 
        post_attachments.*,
        posts.user_id AS post_owner_id
      FROM post_attachments
      INNER JOIN posts ON post_attachments.post_id = posts.post_id
      WHERE post_attachments.attachment_id = ?`,
      [attachmentId]
    );

    if (attachments.length === 0) {
      return res.status(404).json({
        message: "Attachment not found",
      });
    }

    const attachment = attachments[0];

    if (
      Number(attachment.post_owner_id) !== Number(req.user.user_id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You are not allowed to delete this attachment",
      });
    }

    const fileRelativePath = attachment.file_path.replace(/^\/+/, "");
    const fileFullPath = path.join(process.cwd(), fileRelativePath);

    if (fs.existsSync(fileFullPath)) {
      fs.unlinkSync(fileFullPath);
    }

    await db.query(
      "DELETE FROM post_attachments WHERE attachment_id = ?",
      [attachmentId]
    );

    res.status(200).json({
      message: "Attachment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete attachment",
      error: error.message,
    });
  }
};