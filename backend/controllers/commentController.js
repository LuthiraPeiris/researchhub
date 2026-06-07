import db from "../config/db.js";
import { addReputationEvent } from "../utils/reputationUtils.js";
import { createNotificationIfAllowed } from "../utils/notificationUtils.js";

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment_text, parent_comment_id } = req.body;

    if (!comment_text || comment_text.trim() === "") {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    const [posts] = await db.query(
  `
  SELECT post_id, user_id, title
  FROM posts
  WHERE post_id = ?
  `,
  [postId]
);

    if (posts.length === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (parent_comment_id) {
  const [parentComments] = await db.query(
    `
    SELECT comment_id
    FROM comments
    WHERE comment_id = ? AND post_id = ?
    `,
    [parent_comment_id, postId]
  );

  if (parentComments.length === 0) {
    return res.status(400).json({
      message: "Invalid parent comment",
    });
  }
}

    const [result] = await db.query(
      `
      INSERT INTO comments 
      (post_id, user_id, parent_comment_id, comment_text) 
      VALUES (?, ?, ?, ?)
      `,
      [
        postId,
        req.user.user_id,
        parent_comment_id || null,
        comment_text.trim(),
      ]
    );

    const post = posts[0];

if (Number(post.user_id) !== Number(req.user.user_id)) {
  await createNotificationIfAllowed({
    userId: post.user_id,
    message: `A new comment was added to your post: ${post.title}`,
    type: "comment",
    referenceId: result.insertId,
    referenceType: "comment",
  });
}

    await addReputationEvent({
  userId: req.user.user_id,
  points: 1,
  eventType: "post_comment",
  referenceType: "comment",
  referenceId: result.insertId,
  description: "Posted a comment",
});

    res.status(201).json({
      message: "Comment added successfully",
      comment_id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const [comments] = await db.query(
      `
      SELECT 
        c.comment_id,
        c.post_id,
        c.user_id,
        c.parent_comment_id,
        c.comment_text,
        c.created_at,
        u.full_name,
        u.profile_picture,
        COALESCE(like_counts.like_count, 0) AS like_count
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN (
        SELECT 
          comment_id, 
          COUNT(*) AS like_count
        FROM comment_likes
        GROUP BY comment_id
      ) like_counts ON c.comment_id = like_counts.comment_id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
      `,
      [postId]
    );

    res.status(200).json({
      comments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const [comments] = await db.query(
      "SELECT * FROM comments WHERE comment_id = ?",
      [commentId]
    );

    if (comments.length === 0) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (
      comments[0].user_id !== req.user.user_id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You are not allowed to delete this comment",
      });
    }

    await db.query("DELETE FROM comments WHERE comment_id = ?", [commentId]);

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};

export const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.user_id;

    const [comments] = await db.query(
      "SELECT comment_id FROM comments WHERE comment_id = ?",
      [commentId]
    );

    if (comments.length === 0) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const [existingLike] = await db.query(
      `
      SELECT like_id 
      FROM comment_likes 
      WHERE comment_id = ? AND user_id = ?
      `,
      [commentId, userId]
    );

    let liked = false;

    if (existingLike.length > 0) {
  await db.query(
    `
    DELETE FROM comment_likes 
    WHERE comment_id = ? AND user_id = ?
    `,
    [commentId, userId]
  );

  liked = false;
} else {
  await db.query(
    `
    INSERT INTO comment_likes 
    (comment_id, user_id) 
    VALUES (?, ?)
    `,
    [commentId, userId]
  );

  liked = true;

  const [commentOwnerRows] = await db.query(
    "SELECT user_id FROM comments WHERE comment_id = ?",
    [commentId]
  );

  const commentOwnerId = commentOwnerRows[0]?.user_id;

  if (commentOwnerId && Number(commentOwnerId) !== Number(userId)) {
    await addReputationEvent({
  userId: commentOwnerId,
  points: 2,
  eventType: "comment_like_received",
  referenceType: "comment_like",
  referenceId: Number(commentId) * 1000000 + Number(userId),
  description: "Comment received a like",
});
  }
}

    const [likeCountRows] = await db.query(
      `
      SELECT COUNT(*) AS like_count 
      FROM comment_likes 
      WHERE comment_id = ?
      `,
      [commentId]
    );

    res.status(200).json({
      message: liked ? "Comment liked" : "Comment unliked",
      liked,
      like_count: likeCountRows[0].like_count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to like comment",
      error: error.message,
    });
  }
};