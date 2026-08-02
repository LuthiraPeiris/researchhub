import db from "../config/db.js";

import {
  uploadFilesToS3,
  createSignedFileUrl,
  deleteFileFromS3,
} from "../services/s3Service.js";

/**
 * Upload attachments to a post.
 */
export const uploadPostAttachment = async (req, res) => {
  const connection = await db.getConnection();
  const uploadedS3Files = [];

  try {
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded",
      });
    }

    const [posts] = await connection.query(
      `
        SELECT
          post_id,
          user_id
        FROM posts
        WHERE post_id = ?
      `,
      [postId],
    );

    if (posts.length === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const post = posts[0];

    const isPostOwner =
      Number(post.user_id) === Number(req.user.user_id);

    const isAdmin = req.user.role === "admin";

    if (!isPostOwner && !isAdmin) {
      return res.status(403).json({
        message:
          "You are not allowed to upload attachments to this post",
      });
    }

    await connection.beginTransaction();

    const s3Files = await uploadFilesToS3(
      req.files,
      `posts/${postId}`,
    );

    uploadedS3Files.push(...s3Files);

    const uploadedAttachments = [];

    for (const file of s3Files) {
      const [result] = await connection.query(
        `
          INSERT INTO post_attachments (
            post_id,
            original_name,
            s3_key,
            mime_type,
            file_size
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        [
          postId,
          file.originalName,
          file.key,
          file.mimeType,
          file.size,
        ],
      );

      const signedUrl = await createSignedFileUrl(
        file.key,
        3600,
      );

      uploadedAttachments.push({
        attachment_id: result.insertId,
        post_id: postId,
        original_name: file.originalName,
        s3_key: file.key,
        mime_type: file.mimeType,
        file_size: file.size,
        created_at: new Date(),
        file_url: signedUrl,
      });
    }

    await connection.commit();

    return res.status(201).json({
      message: "Files uploaded successfully",
      attachments: uploadedAttachments,
    });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error(
        "Attachment rollback failed:",
        rollbackError,
      );
    }

    await Promise.allSettled(
      uploadedS3Files.map((file) =>
        deleteFileFromS3(file.key),
      ),
    );

    console.error("Upload post attachment error:", error);

    return res.status(500).json({
      message: "File upload failed",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

/**
 * Get all attachments belonging to a post.
 */
export const getPostAttachments = async (req, res) => {
  try {
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const [posts] = await db.query(
      `
        SELECT post_id
        FROM posts
        WHERE post_id = ?
      `,
      [postId],
    );

    if (posts.length === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const [attachments] = await db.query(
      `
        SELECT
          attachment_id,
          post_id,
          original_name,
          s3_key,
          mime_type,
          file_size,
          created_at
        FROM post_attachments
        WHERE post_id = ?
        ORDER BY created_at DESC
      `,
      [postId],
    );

    const attachmentsWithUrls = await Promise.all(
      attachments.map(async (attachment) => {
        const signedUrl = await createSignedFileUrl(
          attachment.s3_key,
          3600,
        );

        return {
          ...attachment,
          file_url: signedUrl,
        };
      }),
    );

    return res.status(200).json(attachmentsWithUrls);
  } catch (error) {
    console.error("Get post attachments error:", error);

    return res.status(500).json({
      message: "Failed to fetch attachments",
      error: error.message,
    });
  }
};

/**
 * Delete an attachment from S3 and MySQL.
 */
export const deletePostAttachment = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const attachmentId = Number(
      req.params.attachmentId,
    );

    if (
      !Number.isInteger(attachmentId) ||
      attachmentId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid attachment ID",
      });
    }

    const [attachments] = await connection.query(
      `
        SELECT
          pa.attachment_id,
          pa.post_id,
          pa.original_name,
          pa.s3_key,
          p.user_id AS post_owner_id
        FROM post_attachments pa
        INNER JOIN posts p
          ON pa.post_id = p.post_id
        WHERE pa.attachment_id = ?
      `,
      [attachmentId],
    );

    if (attachments.length === 0) {
      return res.status(404).json({
        message: "Attachment not found",
      });
    }

    const attachment = attachments[0];

    const isPostOwner =
      Number(attachment.post_owner_id) ===
      Number(req.user.user_id);

    const isAdmin = req.user.role === "admin";

    if (!isPostOwner && !isAdmin) {
      return res.status(403).json({
        message:
          "You are not allowed to delete this attachment",
      });
    }

    await deleteFileFromS3(attachment.s3_key);

    await connection.query(
      `
        DELETE FROM post_attachments
        WHERE attachment_id = ?
      `,
      [attachmentId],
    );

    return res.status(200).json({
      message: "Attachment deleted successfully",
      attachment_id: attachmentId,
    });
  } catch (error) {
    console.error("Delete post attachment error:", error);

    return res.status(500).json({
      message: "Failed to delete attachment",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};