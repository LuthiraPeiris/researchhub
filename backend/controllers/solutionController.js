import db from "../config/db.js";

import {
  uploadFilesToS3,
  createSignedFileUrl,
  deleteFileFromS3,
} from "../services/s3Service.js";

import {
  addReputationEvent,
  checkPopularSolutionBadge,
} from "../utils/reputationUtils.js";

import { createNotificationIfAllowed } from "../utils/notificationUtils.js";
import { validateSolutionQuality } from "../services/solutionValidationService.js";

const runReputationTask = async (task, context) => {
  try {
    await task();
  } catch (error) {
    console.error(`${context} reputation processing failed:`, error);
  }
};

// ================= ADD SOLUTION =================

export const addSolution = async (req, res) => {
  let connection = null;
  let transactionCommitted = false;
  const uploadedS3Files = [];

  try {
    const postId = Number(req.params.postId);
    const { solution_text, content } = req.body;

    const finalSolutionText = solution_text || content;

    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    if (!finalSolutionText || finalSolutionText.trim() === "") {
      return res.status(422).json({
        code: "SOLUTION_VALIDATION_WARNING",
        message: "Please enter a relevant solution before submitting.",
      });
    }

    const [validationPosts] = await db.query(
      `
        SELECT
          p.post_id,
          p.title,
          p.description,
          p.difficulty_level,
          f.field_name
        FROM posts p
        LEFT JOIN fields f
          ON p.field_id = f.field_id
        WHERE p.post_id = ?
      `,
      [postId],
    );

    if (validationPosts.length === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const validation = await validateSolutionQuality({
      post: validationPosts[0],
      solutionText: finalSolutionText.trim(),
    });

    if (!validation.acceptable) {
      return res.status(422).json({
        code: "SOLUTION_VALIDATION_WARNING",
        message:
          "This solution does not appear to address the problem. Please revise it and try again.",
        validation: {
          reason: validation.reason,
          suggestion: validation.suggestion,
        },
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [posts] = await connection.query(
      `
        SELECT
          post_id,
          user_id,
          title
        FROM posts
        WHERE post_id = ?
      `,
      [postId],
    );

    if (posts.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        message: "Post not found",
      });
    }

    const post = posts[0];

    const [result] = await connection.query(
      `
        INSERT INTO solutions (
          post_id,
          user_id,
          solution_text,
          is_verified
        )
        VALUES (?, ?, ?, 0)
      `,
      [
        postId,
        req.user.user_id,
        finalSolutionText.trim(),
      ],
    );

    const solutionId = result.insertId;
    const uploadedAttachments = [];

    /*
     * Multer memory storage places the files in req.files.
     * Each file is uploaded to:
     *
     * solutions/{solutionId}/{unique-file-name}
     */
    if (req.files && req.files.length > 0) {
      const s3Files = await uploadFilesToS3(
        req.files,
        `solutions/${solutionId}`,
      );

      uploadedS3Files.push(...s3Files);

      for (const file of s3Files) {
        const [attachmentResult] =
          await connection.query(
            `
              INSERT INTO solution_attachments (
                solution_id,
                original_name,
                s3_key,
                mime_type,
                file_size
              )
              VALUES (?, ?, ?, ?, ?)
            `,
            [
              solutionId,
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
          attachment_id: attachmentResult.insertId,
          solution_id: solutionId,
          original_name: file.originalName,
          s3_key: file.key,
          mime_type: file.mimeType,
          file_size: file.size,
          file_url: signedUrl,
        });
      }
    }

    if (
      Number(post.user_id) !==
      Number(req.user.user_id)
    ) {
      await createNotificationIfAllowed({
  userId: post.user_id,
  actorUserId: req.user.user_id,
  message: `A new solution was submitted for your problem: ${post.title}`,
  type: "solution",
  referenceId: solutionId,
  referenceType: "solution",
  connection,
});
    }

    await connection.commit();
    transactionCommitted = true;

    /*
     * Reputation is handled after the main transaction.
     */
    await runReputationTask(
      () =>
        addReputationEvent({
          userId: req.user.user_id,
          points: 3,
          eventType: "submit_solution",
          referenceType: "solution",
          referenceId: solutionId,
          description: "Submitted a solution",
        }),
      "Submit solution",
    );

    return res.status(201).json({
      message: "Solution submitted successfully",
      solution_id: solutionId,
      attachments: uploadedAttachments,
    });
  } catch (error) {
    if (connection && !transactionCommitted) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "Solution transaction rollback failed:",
          rollbackError,
        );
      }
    }

    /*
     * Remove any S3 files uploaded before the database failed.
     */
    if (!transactionCommitted) {
      await Promise.allSettled(
        uploadedS3Files.map((file) =>
          deleteFileFromS3(file.key),
        ),
      );
    }

    console.error("Add solution error:", error);

    return res.status(500).json({
      message: "Failed to submit solution",
      error: error.message,
    });
  } finally {
    connection?.release();
  }
};

// ================= GET SOLUTIONS BY POST =================

export const getSolutionsByPost = async (req, res) => {
  try {
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const [solutions] = await db.query(
      `
        SELECT
          s.solution_id,
          s.post_id,
          s.user_id,
          s.solution_text,
          s.solution_text AS content,
          s.is_verified,
          s.selected_by_user_id,
          s.verified_at,
          s.created_at,
          u.full_name,
          u.profile_picture,
          u.email,
          COALESCE(like_counts.like_count, 0) AS like_count
        FROM solutions s
        LEFT JOIN users u
          ON s.user_id = u.user_id
        LEFT JOIN (
          SELECT
            solution_id,
            COUNT(*) AS like_count
          FROM solution_likes
          GROUP BY solution_id
        ) like_counts
          ON s.solution_id = like_counts.solution_id
        WHERE s.post_id = ?
        ORDER BY
          s.is_verified DESC,
          s.created_at DESC
      `,
      [postId],
    );

    if (solutions.length === 0) {
      return res.status(200).json({
        solutions: [],
      });
    }

    const solutionIds = solutions.map(
      (solution) => solution.solution_id,
    );

    const [attachments] = await db.query(
      `
        SELECT
          attachment_id,
          solution_id,
          original_name,
          s3_key,
          mime_type,
          file_size,
          created_at
        FROM solution_attachments
        WHERE solution_id IN (?)
        ORDER BY created_at DESC
      `,
      [solutionIds],
    );

    /*
     * Generate a fresh signed S3 URL for every attachment.
     */
    const attachmentsWithUrls = await Promise.all(
      attachments.map(async (attachment) => ({
        ...attachment,

        file_url: await createSignedFileUrl(
          attachment.s3_key,
          3600,
        ),
      })),
    );

    const solutionsWithAttachments = solutions.map(
      (solution) => ({
        ...solution,

        is_verified: Number(solution.is_verified),
        like_count: Number(solution.like_count),

        attachments: attachmentsWithUrls.filter(
          (attachment) =>
            Number(attachment.solution_id) ===
            Number(solution.solution_id),
        ),
      }),
    );

    return res.status(200).json({
      solutions: solutionsWithAttachments,
    });
  } catch (error) {
    console.error("Get solutions by post error:", error);

    return res.status(500).json({
      message: "Failed to fetch solutions",
      error: error.message,
    });
  }
};

// ================= VERIFY SOLUTION =================

export const verifySolution = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const solutionId = Number(req.params.solutionId);

    if (
      !Number.isInteger(solutionId) ||
      solutionId <= 0
    ) {
      await connection.rollback();

      return res.status(400).json({
        message: "Invalid solution ID",
      });
    }

    const [solutions] = await connection.query(
      `
        SELECT
          s.solution_id,
          s.post_id,
          s.user_id,
          s.solution_text,
          s.is_verified,
          p.user_id AS post_owner_id,
          p.title AS post_title
        FROM solutions s
        INNER JOIN posts p
          ON s.post_id = p.post_id
        WHERE s.solution_id = ?
      `,
      [solutionId],
    );

    if (solutions.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        message: "Solution not found",
      });
    }

    const solution = solutions[0];

    const isOwner =
      Number(solution.post_owner_id) ===
      Number(req.user.user_id);

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      await connection.rollback();

      return res.status(403).json({
        message:
          "Only the post owner or admin can mark this solution as solved",
      });
    }

    /*
     * Remove verification from any previously verified
     * solution belonging to the same post.
     */
    await connection.query(
      `
        UPDATE solutions
        SET
          is_verified = 0,
          selected_by_user_id = NULL,
          verified_at = NULL
        WHERE post_id = ?
      `,
      [solution.post_id],
    );

    await connection.query(
      `
        UPDATE solutions
        SET
          is_verified = 1,
          selected_by_user_id = ?,
          verified_at = NOW()
        WHERE solution_id = ?
      `,
      [req.user.user_id, solutionId],
    );

    await connection.query(
      `
        UPDATE posts
        SET status = 'solved'
        WHERE post_id = ?
      `,
      [solution.post_id],
    );

    const archiveSummary =
      solution.solution_text.length > 250
        ? `${solution.solution_text.substring(
            0,
            250,
          )}...`
        : solution.solution_text;

    await connection.query(
      `
        INSERT INTO knowledge_archive (
          post_id,
          summary,
          final_solution_id
        )
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          summary = VALUES(summary),
          final_solution_id = VALUES(final_solution_id),
          archived_at = CURRENT_TIMESTAMP
      `,
      [
        solution.post_id,
        archiveSummary,
        solutionId,
      ],
    );

    await createNotificationIfAllowed({
  userId: solution.user_id,
  actorUserId: req.user.user_id,
  message:
    "Your solution was marked as solved by the problem owner.",
  type: "verification",
  referenceId: solutionId,
  referenceType: "solution",
  connection,
});

    await connection.commit();

    await runReputationTask(
      () =>
        addReputationEvent({
          userId: solution.user_id,
          points: 10,
          eventType: "verified_solution",
          referenceType: "solution",
          referenceId: solutionId,
          description: "Solution was verified",
        }),
      "Verify solution",
    );

    return res.status(200).json({
      message:
        "Solution marked as solved successfully",
    });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error(
        "Verify solution rollback failed:",
        rollbackError,
      );
    }

    console.error("Verify solution error:", error);

    return res.status(500).json({
      message: "Failed to mark solution as solved",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// ================= DELETE SOLUTION =================

export const deleteSolution = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const solutionId = Number(req.params.solutionId);

    if (
      !Number.isInteger(solutionId) ||
      solutionId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid solution ID",
      });
    }

    const [solutions] = await connection.query(
      `
        SELECT
          solution_id,
          post_id,
          user_id,
          is_verified
        FROM solutions
        WHERE solution_id = ?
      `,
      [solutionId],
    );

    if (solutions.length === 0) {
      return res.status(404).json({
        message: "Solution not found",
      });
    }

    const solution = solutions[0];

    const isOwner =
      Number(solution.user_id) ===
      Number(req.user.user_id);

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message:
          "You are not allowed to delete this solution",
      });
    }

    /*
     * Retrieve attachment keys before deleting the solution.
     * The database may cascade-delete attachment records,
     * but S3 objects must be deleted separately.
     */
    const [attachments] = await connection.query(
      `
        SELECT
          attachment_id,
          s3_key
        FROM solution_attachments
        WHERE solution_id = ?
      `,
      [solutionId],
    );

    /*
     * Delete the S3 files first.
     *
     * If any deletion fails, the solution and database records
     * remain so the operation can be retried.
     */
    await Promise.all(
      attachments.map((attachment) =>
        deleteFileFromS3(attachment.s3_key),
      ),
    );

    await connection.beginTransaction();

    /*
     * Delete attachment rows explicitly in case the foreign key
     * does not use ON DELETE CASCADE.
     */
    await connection.query(
      `
        DELETE FROM solution_attachments
        WHERE solution_id = ?
      `,
      [solutionId],
    );

    await connection.query(
      `
        DELETE FROM solutions
        WHERE solution_id = ?
      `,
      [solutionId],
    );

    await connection.commit();

    return res.status(200).json({
      message: "Solution deleted successfully",
    });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error(
        "Delete solution rollback failed:",
        rollbackError,
      );
    }

    console.error("Delete solution error:", error);

    return res.status(500).json({
      message: "Failed to delete solution",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// ================= DELETE SOLUTION ATTACHMENT =================

export const deleteSolutionAttachment = async (
  req,
  res,
) => {
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
          sa.attachment_id,
          sa.solution_id,
          sa.original_name,
          sa.s3_key,
          sa.mime_type,
          s.user_id AS solution_owner_id
        FROM solution_attachments sa
        INNER JOIN solutions s
          ON sa.solution_id = s.solution_id
        WHERE sa.attachment_id = ?
      `,
      [attachmentId],
    );

    if (attachments.length === 0) {
      return res.status(404).json({
        message: "Solution attachment not found",
      });
    }

    const attachment = attachments[0];

    const isOwner =
      Number(attachment.solution_owner_id) ===
      Number(req.user.user_id);

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message:
          "You are not allowed to delete this solution attachment",
      });
    }

    /*
     * Delete the real object from S3 first.
     */
    await deleteFileFromS3(attachment.s3_key);

    /*
     * Then delete its metadata from MySQL.
     */
    await connection.query(
      `
        DELETE FROM solution_attachments
        WHERE attachment_id = ?
      `,
      [attachmentId],
    );

    return res.status(200).json({
      message:
        "Solution attachment deleted successfully",
      attachment_id: attachmentId,
    });
  } catch (error) {
    console.error(
      "Delete solution attachment error:",
      error,
    );

    return res.status(500).json({
      message:
        "Failed to delete solution attachment",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// ================= TOGGLE SOLUTION LIKE =================

export const toggleSolutionLike = async (
  req,
  res,
) => {
  try {
    const solutionId = Number(req.params.solutionId);
    const userId = req.user.user_id;

    if (!userId) {
      return res.status(401).json({
        message:
          "Unauthorized. Please login first.",
      });
    }

    if (
      !Number.isInteger(solutionId) ||
      solutionId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid solution ID",
      });
    }

    const [solutions] = await db.query(
      `
        SELECT solution_id
        FROM solutions
        WHERE solution_id = ?
      `,
      [solutionId],
    );

    if (solutions.length === 0) {
      return res.status(404).json({
        message: "Solution not found",
      });
    }

    const [existingLike] = await db.query(
      `
        SELECT like_id
        FROM solution_likes
        WHERE solution_id = ?
          AND user_id = ?
      `,
      [solutionId, userId],
    );

    let liked;

    if (existingLike.length > 0) {
      await db.query(
        `
          DELETE FROM solution_likes
          WHERE solution_id = ?
            AND user_id = ?
        `,
        [solutionId, userId],
      );

      liked = false;
    } else {
      await db.query(
        `
          INSERT INTO solution_likes (
            solution_id,
            user_id
          )
          VALUES (?, ?)
        `,
        [solutionId, userId],
      );

      liked = true;

      const [solutionOwnerRows] = await db.query(
        `
          SELECT user_id
          FROM solutions
          WHERE solution_id = ?
        `,
        [solutionId],
      );

      const solutionOwnerId =
        solutionOwnerRows[0]?.user_id;

      if (
        solutionOwnerId &&
        Number(solutionOwnerId) !== Number(userId)
      ) {
        await runReputationTask(async () => {
          await addReputationEvent({
            userId: solutionOwnerId,
            points: 1,
            eventType: "solution_like_received",
            referenceType: "solution_like",
            referenceId:
              Number(solutionId) * 1000000 +
              Number(userId),
            description:
              "Solution received a like",
          });

          await checkPopularSolutionBadge(solutionId);
        }, "Like solution");
      }
    }

    const [likeCountRows] = await db.query(
      `
        SELECT COUNT(*) AS like_count
        FROM solution_likes
        WHERE solution_id = ?
      `,
      [solutionId],
    );

    return res.status(200).json({
      message: liked
        ? "Solution liked"
        : "Solution unliked",
      liked,
      like_count: Number(
        likeCountRows[0].like_count,
      ),
    });
  } catch (error) {
    console.error("Toggle solution like error:", error);

    return res.status(500).json({
      message: "Failed to like solution",
      error: error.message,
    });
  }
};
