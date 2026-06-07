import db from "../config/db.js";
import fs from "fs";
import path from "path";

import {
  addReputationEvent,
  checkPopularSolutionBadge,
} from "../utils/reputationUtils.js";

import { createNotificationIfAllowed } from "../utils/notificationUtils.js";

// ================= ADD SOLUTION =================

export const addSolution = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { postId } = req.params;
    const { solution_text, content } = req.body;

    const finalSolutionText = solution_text || content;

    if (!finalSolutionText || finalSolutionText.trim() === "") {
      await connection.rollback();
      return res.status(400).json({
        message: "Solution text is required",
      });
    }

    const [posts] = await connection.query(
      `
      SELECT 
        post_id, 
        user_id, 
        title 
      FROM posts 
      WHERE post_id = ?
      `,
      [postId]
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
      INSERT INTO solutions 
      (post_id, user_id, solution_text, is_verified) 
      VALUES (?, ?, ?, 0)
      `,
      [postId, req.user.user_id, finalSolutionText.trim()]
    );

    const solutionId = result.insertId;

    if (req.files && req.files.length > 0) {
  for (const file of req.files) {
    await connection.query(
      `
      INSERT INTO solution_attachments
      (solution_id, file_name, file_path, file_type, file_size)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        solutionId,
        file.originalname,
        `/uploads/solutions/${file.filename}`,
        file.mimetype,
        file.size,
      ]
    );
  }
}

    if (Number(post.user_id) !== Number(req.user.user_id)) {
  await createNotificationIfAllowed({
    userId: post.user_id,
    message: `A new solution was submitted for your problem: ${post.title}`,
    type: "solution",
    referenceId: solutionId,
    referenceType: "solution",
    connection,
  });
}

    await connection.commit();

    await addReputationEvent({
      userId: req.user.user_id,
      points: 3,
      eventType: "submit_solution",
      referenceType: "solution",
      referenceId: solutionId,
      description: "Submitted a solution",
    });

    res.status(201).json({
      message: "Solution submitted successfully",
      solution_id: solutionId,
    });
  } catch (error) {
    await connection.rollback();

    res.status(500).json({
      message: "Failed to submit solution",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// ================= GET SOLUTIONS BY POST =================

export const getSolutionsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

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
      LEFT JOIN users u ON s.user_id = u.user_id
      LEFT JOIN (
        SELECT 
          solution_id,
          COUNT(*) AS like_count
        FROM solution_likes
        GROUP BY solution_id
      ) like_counts ON s.solution_id = like_counts.solution_id
      WHERE s.post_id = ?
      ORDER BY s.is_verified DESC, s.created_at DESC
      `,
      [postId]
    );

    if (solutions.length === 0) {
      return res.status(200).json({
        solutions: [],
      });
    }

    const solutionIds = solutions.map((solution) => solution.solution_id);

    const [attachments] = await db.query(
      `
      SELECT 
        attachment_id,
        solution_id,
        file_name,
        file_path,
        file_type,
        file_size,
        created_at
      FROM solution_attachments
      WHERE solution_id IN (?)
      ORDER BY created_at DESC
      `,
      [solutionIds]
    );

    const solutionsWithAttachments = solutions.map((solution) => ({
      ...solution,
      is_verified: Number(solution.is_verified),
      like_count: Number(solution.like_count),
      attachments: attachments.filter(
        (attachment) => attachment.solution_id === solution.solution_id
      ),
    }));

    res.status(200).json({
      solutions: solutionsWithAttachments,
    });
  } catch (error) {
    res.status(500).json({
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

    const { solutionId } = req.params;

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
      INNER JOIN posts p ON s.post_id = p.post_id
      WHERE s.solution_id = ?
      `,
      [solutionId]
    );

    if (solutions.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        message: "Solution not found",
      });
    }

    const solution = solutions[0];

    const isOwner = Number(solution.post_owner_id) === Number(req.user.user_id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      await connection.rollback();
      return res.status(403).json({
        message: "Only the post owner or admin can mark this solution as solved",
      });
    }

    await connection.query(
      `
      UPDATE solutions 
      SET 
        is_verified = 0, 
        selected_by_user_id = NULL, 
        verified_at = NULL 
      WHERE post_id = ?
      `,
      [solution.post_id]
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
      [req.user.user_id, solutionId]
    );

    await connection.query(
      `
      UPDATE posts 
      SET status = 'solved' 
      WHERE post_id = ?
      `,
      [solution.post_id]
    );

    const archiveSummary =
  solution.solution_text.length > 250
    ? `${solution.solution_text.substring(0, 250)}...`
    : solution.solution_text;

await connection.query(
  `
  INSERT INTO knowledge_archive 
  (post_id, summary, final_solution_id)
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
  ]
);

    // Reputation is added after transaction commit

    await createNotificationIfAllowed({
      userId: solution.user_id,
      message: "Your solution was marked as solved by the problem owner.",
      type: "verification",
      referenceId: solutionId,
      referenceType: "solution",
      connection,
    });

    await connection.commit();

    await addReputationEvent({
      userId: solution.user_id,
      points: 10,
      eventType: "verified_solution",
      referenceType: "solution",
      referenceId: solutionId,
      description: "Solution was verified",
    });

    res.status(200).json({
      message: "Solution marked as solved successfully",
    });
  } catch (error) {
    await connection.rollback();

    res.status(500).json({
      message: "Failed to mark solution as solved",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// ================= DELETE SOLUTION =================

export const deleteSolution = async (req, res) => {
  try {
    const { solutionId } = req.params;

    const [solutions] = await db.query(
      `
      SELECT 
        solution_id,
        post_id,
        user_id,
        is_verified
      FROM solutions 
      WHERE solution_id = ?
      `,
      [solutionId]
    );

    if (solutions.length === 0) {
      return res.status(404).json({
        message: "Solution not found",
      });
    }

    const solution = solutions[0];

    const isOwner = Number(solution.user_id) === Number(req.user.user_id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to delete this solution",
      });
    }

    await db.query(
      `
      DELETE FROM solutions 
      WHERE solution_id = ?
      `,
      [solutionId]
    );

    res.status(200).json({
      message: "Solution deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete solution",
      error: error.message,
    });
  }
};

// ================= DELETE SOLUTION ATTACHMENT =================

export const deleteSolutionAttachment = async (req, res) => {
  try {
    const { attachmentId } = req.params;

    const [attachments] = await db.query(
      `
      SELECT 
        sa.attachment_id,
        sa.solution_id,
        sa.file_name,
        sa.file_path,
        sa.file_type,
        s.user_id AS solution_owner_id
      FROM solution_attachments sa
      INNER JOIN solutions s ON sa.solution_id = s.solution_id
      WHERE sa.attachment_id = ?
      `,
      [attachmentId]
    );

    if (attachments.length === 0) {
      return res.status(404).json({
        message: "Solution attachment not found",
      });
    }

    const attachment = attachments[0];

    const isOwner =
      Number(attachment.solution_owner_id) === Number(req.user.user_id);

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to delete this solution attachment",
      });
    }

    const fileRelativePath = attachment.file_path.replace(/^\/+/, "");
    const fileFullPath = path.join(process.cwd(), fileRelativePath);

    if (fs.existsSync(fileFullPath)) {
      fs.unlinkSync(fileFullPath);
    }

    await db.query(
      `
      DELETE FROM solution_attachments 
      WHERE attachment_id = ?
      `,
      [attachmentId]
    );

    res.status(200).json({
      message: "Solution attachment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete solution attachment",
      error: error.message,
    });
  }
};

// ================= TOGGLE SOLUTION LIKE =================

export const toggleSolutionLike = async (req, res) => {
  try {
    const { solutionId } = req.params;
    const userId = req.user.user_id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Please login first.",
      });
    }

    const [solutions] = await db.query(
      `
      SELECT solution_id 
      FROM solutions 
      WHERE solution_id = ?
      `,
      [solutionId]
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
      WHERE solution_id = ? AND user_id = ?
      `,
      [solutionId, userId]
    );

    let liked;

    if (existingLike.length > 0) {
  await db.query(
    `
    DELETE FROM solution_likes 
    WHERE solution_id = ? AND user_id = ?
    `,
    [solutionId, userId]
  );

  liked = false;
} else {
  await db.query(
    `
    INSERT INTO solution_likes 
    (solution_id, user_id) 
    VALUES (?, ?)
    `,
    [solutionId, userId]
  );

  liked = true;

  const [solutionOwnerRows] = await db.query(
    "SELECT user_id FROM solutions WHERE solution_id = ?",
    [solutionId]
  );

  const solutionOwnerId = solutionOwnerRows[0]?.user_id;

  if (solutionOwnerId && Number(solutionOwnerId) !== Number(userId)) {
    await addReputationEvent({
  userId: solutionOwnerId,
  points: 1,
  eventType: "solution_like_received",
  referenceType: "solution_like",
  referenceId: Number(solutionId) * 1000000 + Number(userId),
  description: "Solution received a like",
});

await checkPopularSolutionBadge(solutionId);
  }
}

    const [likeCountRows] = await db.query(
      `
      SELECT COUNT(*) AS like_count 
      FROM solution_likes 
      WHERE solution_id = ?
      `,
      [solutionId]
    );

    res.status(200).json({
      message: liked ? "Solution liked" : "Solution unliked",
      liked,
      like_count: Number(likeCountRows[0].like_count),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to like solution",
      error: error.message,
    });
  }
};