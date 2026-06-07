import db from "../config/db.js";

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const [users] = await db.query(
      `SELECT 
        users.user_id,
        users.full_name,
        users.email,
        users.profile_picture,
        users.bio,
        users.university_or_organization,
        users.role,
        users.status,
        users.created_at,

        reputation.total_points,
        reputation.level

      FROM users
      LEFT JOIN reputation ON users.user_id = reputation.user_id
      WHERE users.user_id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const [badges] = await db.query(
      `SELECT 
        badges.badge_id,
        badges.badge_name,
        badges.description,
        badges.icon,
        user_badges.awarded_at
      FROM user_badges
      INNER JOIN badges ON user_badges.badge_id = badges.badge_id
      WHERE user_badges.user_id = ?
      ORDER BY user_badges.awarded_at DESC`,
      [userId]
    );

    res.status(200).json({
      ...users[0],
      badges,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (Number(userId) !== req.user.user_id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not allowed to update this profile",
      });
    }

    const {
      full_name,
      bio,
      university_or_organization,
      profile_picture,
      role,
    } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE user_id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await db.query(
      `UPDATE users SET
        full_name = ?,
        bio = ?,
        university_or_organization = ?,
        profile_picture = ?,
        role = ?
      WHERE user_id = ?`,
      [
        full_name || users[0].full_name,
        bio || users[0].bio,
        university_or_organization || users[0].university_or_organization,
        profile_picture || users[0].profile_picture,
        role || users[0].role,
        userId,
      ]
    );

    res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const [posts] = await db.query(
      `SELECT 
        posts.*,
        fields.field_name
      FROM posts
      LEFT JOIN fields ON posts.field_id = fields.field_id
      WHERE posts.user_id = ?
      ORDER BY posts.created_at DESC`,
      [userId]
    );

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user posts",
      error: error.message,
    });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const { userId } = req.params;

    if (Number(userId) !== req.user.user_id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not allowed to update this profile picture",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    await db.query(
      "UPDATE users SET profile_picture = ? WHERE user_id = ?",
      [imagePath, userId]
    );

    res.status(200).json({
      message: "Profile picture updated successfully",
      profile_picture: imagePath,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile picture",
      error: error.message,
    });
  }
};

export const getReceivedSolutions = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [solutions] = await db.query(
      `
      SELECT
        s.solution_id,
        s.post_id,
        s.user_id AS solution_user_id,
        s.solution_text,
        s.is_verified,
        s.created_at,
        p.title AS post_title,
        p.status AS post_status,
        u.full_name AS solution_author_name,
        u.email AS solution_author_email,
        u.profile_picture AS solution_author_profile_picture,
        COALESCE(like_counts.like_count, 0) AS like_count
      FROM solutions s
      INNER JOIN posts p ON s.post_id = p.post_id
      LEFT JOIN users u ON s.user_id = u.user_id
      LEFT JOIN (
        SELECT 
          solution_id,
          COUNT(*) AS like_count
        FROM solution_likes
        GROUP BY solution_id
      ) like_counts ON s.solution_id = like_counts.solution_id
      WHERE p.user_id = ?
      ORDER BY s.is_verified ASC, s.created_at DESC
      `,
      [userId]
    );

    res.status(200).json({
      solutions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch received solutions",
      error: error.message,
    });
  }
};

export const getMySolutions = async (req, res) => {
  try {
    const userId = req.user.user_id;

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

        p.title AS post_title,
        p.description AS post_description,
        p.status AS post_status,
        p.post_type,
        p.difficulty_level,

        u.full_name AS solution_author,

        COALESCE(like_counts.like_count, 0) AS like_count
      FROM solutions s
      LEFT JOIN posts p ON s.post_id = p.post_id
      LEFT JOIN users u ON s.user_id = u.user_id
      LEFT JOIN (
        SELECT 
          solution_id,
          COUNT(*) AS like_count
        FROM solution_likes
        GROUP BY solution_id
      ) like_counts ON s.solution_id = like_counts.solution_id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
      `,
      [userId]
    );

    const formattedSolutions = solutions.map((solution) => ({
      ...solution,
      is_verified: Number(solution.is_verified),
      like_count: Number(solution.like_count),
    }));

    res.status(200).json({
      solutions: formattedSolutions,
    });
  } catch (error) {
    console.error("Get my solutions error:", error);

    res.status(500).json({
      message: "Failed to fetch your solutions",
      error: error.message,
    });
  }
};

export const getUserSolutions = async (req, res) => {
  try {
    const { userId } = req.params;

    const [solutions] = await db.query(
      `
      SELECT 
        s.solution_id,
        s.post_id,
        s.user_id,
        s.solution_text,
        s.is_verified,
        s.selected_by_user_id,
        s.verified_at,
        s.created_at,

        p.title AS post_title,
        p.description AS post_description,
        p.status AS post_status,
        p.post_type,
        p.difficulty_level,

        f.field_name,

        COALESCE(like_counts.like_count, 0) AS like_count
      FROM solutions s
      LEFT JOIN posts p ON s.post_id = p.post_id
      LEFT JOIN fields f ON p.field_id = f.field_id
      LEFT JOIN (
        SELECT 
          solution_id,
          COUNT(*) AS like_count
        FROM solution_likes
        GROUP BY solution_id
      ) like_counts ON s.solution_id = like_counts.solution_id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
      `,
      [userId]
    );

    const formattedSolutions = solutions.map((solution) => ({
      ...solution,
      is_verified: Number(solution.is_verified),
      like_count: Number(solution.like_count),
    }));

    res.status(200).json({
      solutions: formattedSolutions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user solutions",
      error: error.message,
    });
  }
};

export const getUserFields = async (req, res) => {
  try {
    const { userId } = req.params;

    const [fields] = await db.query(
      `
      SELECT 
        field_name,
        COUNT(*) AS activity_count
      FROM (
        SELECT f.field_name
        FROM posts p
        LEFT JOIN fields f ON p.field_id = f.field_id
        WHERE p.user_id = ? AND f.field_name IS NOT NULL

        UNION ALL

        SELECT f.field_name
        FROM solutions s
        LEFT JOIN posts p ON s.post_id = p.post_id
        LEFT JOIN fields f ON p.field_id = f.field_id
        WHERE s.user_id = ? AND f.field_name IS NOT NULL
      ) user_fields
      GROUP BY field_name
      ORDER BY activity_count DESC
      `,
      [userId, userId]
    );

    res.status(200).json({
      fields,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user fields",
      error: error.message,
    });
  }
};