import db from "../config/db.js";

export const createPost = async (req, res) => {
  try {
    const { title, description, post_type, field_id, difficulty_level } =
      req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO posts 
      (user_id, title, description, post_type, field_id, difficulty_level) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.user_id,
        title,
        description,
        post_type || "problem",
        field_id || null,
        difficulty_level || "beginner",
      ]
    );

    res.status(201).json({
      message: "Post created successfully",
      post_id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const [posts] = await db.query(
      `SELECT 
        posts.*,
        users.full_name,
        fields.field_name,

        COUNT(DISTINCT solutions.solution_id) AS solution_count,
        MAX(solutions.created_at) AS latest_solution_at

      FROM posts
      LEFT JOIN users ON posts.user_id = users.user_id
      LEFT JOIN fields ON posts.field_id = fields.field_id
      LEFT JOIN solutions ON posts.post_id = solutions.post_id

      GROUP BY 
        posts.post_id,
        posts.user_id,
        posts.title,
        posts.description,
        posts.post_type,
        posts.field_id,
        posts.difficulty_level,
        posts.status,
        posts.created_at,
        posts.updated_at,
        users.full_name,
        fields.field_name

      ORDER BY posts.created_at DESC`
    );

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const [posts] = await db.query(
      `SELECT 
        posts.*,
        users.full_name,
        users.profile_picture,
        fields.field_name
      FROM posts
      LEFT JOIN users ON posts.user_id = users.user_id
      LEFT JOIN fields ON posts.field_id = fields.field_id
      WHERE posts.post_id = ?`,
      [id]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json(posts[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch post",
      error: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, post_type, field_id, difficulty_level, status } =
      req.body;

    const [posts] = await db.query("SELECT * FROM posts WHERE post_id = ?", [
      id,
    ]);

    if (posts.length === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (posts[0].user_id !== req.user.user_id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not allowed to update this post",
      });
    }

    await db.query(
      `UPDATE posts SET 
        title = ?, 
        description = ?, 
        post_type = ?, 
        field_id = ?, 
        difficulty_level = ?, 
        status = ?
      WHERE post_id = ?`,
      [
        title ?? posts[0].title,
        description ?? posts[0].description,
        post_type ?? posts[0].post_type,
        field_id ?? posts[0].field_id,
        difficulty_level ?? posts[0].difficulty_level,
        status ?? posts[0].status,
        id,
      ]
    );

    res.status(200).json({
      message: "Post updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update post",
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const [posts] = await db.query("SELECT * FROM posts WHERE post_id = ?", [
      id,
    ]);

    if (posts.length === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (posts[0].user_id !== req.user.user_id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not allowed to delete this post",
      });
    }

    await db.query("DELETE FROM posts WHERE post_id = ?", [id]);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete post",
      error: error.message,
    });
  }
};

export const searchPosts = async (req, res) => {
  try {
    const {
      query,
      field_id,
      status,
      difficulty_level,
      post_type,
      sort,
    } = req.query;

    let sql = `
      SELECT 
        posts.*,
        users.full_name,
        fields.field_name,

        COUNT(DISTINCT solutions.solution_id) AS solution_count,
        MAX(solutions.created_at) AS latest_solution_at

      FROM posts
      LEFT JOIN users ON posts.user_id = users.user_id
      LEFT JOIN fields ON posts.field_id = fields.field_id
      LEFT JOIN solutions ON posts.post_id = solutions.post_id
      WHERE 1 = 1
    `;

    const params = [];

    if (query && query.trim() !== "") {
      const searchValue = `%${query.trim()}%`;

      sql += `
        AND (
          posts.title LIKE ?
          OR posts.description LIKE ?
          OR users.full_name LIKE ?
          OR fields.field_name LIKE ?
        )
      `;

      params.push(searchValue, searchValue, searchValue, searchValue);
    }

    if (field_id && field_id !== "all") {
      sql += ` AND posts.field_id = ?`;
      params.push(field_id);
    }

    if (status && status !== "all") {
      sql += ` AND posts.status = ?`;
      params.push(status);
    }

    if (difficulty_level && difficulty_level !== "all") {
      sql += ` AND posts.difficulty_level = ?`;
      params.push(difficulty_level);
    }

    if (post_type && post_type !== "all") {
      sql += ` AND posts.post_type = ?`;
      params.push(post_type);
    }

    sql += `
      GROUP BY 
        posts.post_id,
        posts.user_id,
        posts.title,
        posts.description,
        posts.post_type,
        posts.field_id,
        posts.difficulty_level,
        posts.status,
        posts.created_at,
        posts.updated_at,
        users.full_name,
        fields.field_name
    `;

    if (sort === "most_solved") {
      sql += `
        ORDER BY 
          CASE WHEN posts.status = 'solved' THEN 0 ELSE 1 END,
          posts.created_at DESC
      `;
    } else if (sort === "most_active") {
      sql += `
        ORDER BY 
          solution_count DESC,
          latest_solution_at DESC,
          posts.created_at DESC
      `;
    } else {
      sql += ` ORDER BY posts.created_at DESC`;
    }

    const [posts] = await db.query(sql, params);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to search posts",
      error: error.message,
    });
  }
};

export const getSimilarProblems = async (req, res) => {
  try {
    const { title = "", description = "", field_id } = req.query;

    const searchText = `${title} ${description}`.toLowerCase();

    const keywords = [
      ...new Set(
        searchText
          .replace(/[^a-zA-Z0-9\s]/g, " ")
          .split(/\s+/)
          .filter((word) => word.length >= 3)
      ),
    ].slice(0, 8);

    if (keywords.length === 0) {
      return res.status(200).json([]);
    }

    const conditions = keywords
      .map(() => "(LOWER(posts.title) LIKE ? OR LOWER(posts.description) LIKE ?)")
      .join(" OR ");

    const params = [];

    keywords.forEach((word) => {
      params.push(`%${word}%`, `%${word}%`);
    });

    let sql = `
      SELECT 
        posts.post_id,
        posts.title,
        posts.description,
        posts.status,
        posts.difficulty_level,
        posts.created_at,
        fields.field_name
      FROM posts
      LEFT JOIN fields ON posts.field_id = fields.field_id
      WHERE (${conditions})
    `;

    if (field_id) {
      sql += " AND posts.field_id = ?";
      params.push(field_id);
    }

    sql += `
      ORDER BY posts.created_at DESC
      LIMIT 5
    `;

    const [similarProblems] = await db.query(sql, params);

    res.status(200).json(similarProblems);
  } catch (error) {
    res.status(500).json({
      message: "Failed to find similar problems",
      error: error.message,
    });
  }
};

export const getRecommendedPosts = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [skills] = await db.query(
      `
      SELECT skill_name
      FROM user_skills
      WHERE user_id = ?
      `,
      [userId]
    );

    const skillNames = skills.map((skill) => skill.skill_name);

    if (skillNames.length === 0) {
      return res.status(200).json({
        skills: [],
        posts: [],
      });
    }

    const conditions = skillNames
      .map(
        () =>
          `(fields.field_name LIKE ? OR posts.title LIKE ? OR posts.description LIKE ?)`
      )
      .join(" OR ");

    const params = [];

    skillNames.forEach((skill) => {
      const searchValue = `%${skill}%`;
      params.push(searchValue, searchValue, searchValue);
    });

    params.push(userId);

    const [posts] = await db.query(
      `
      SELECT 
        posts.*,
        users.full_name,
        fields.field_name,
        COUNT(DISTINCT solutions.solution_id) AS solution_count,
        MAX(solutions.created_at) AS latest_solution_at
      FROM posts
      LEFT JOIN users ON posts.user_id = users.user_id
      LEFT JOIN fields ON posts.field_id = fields.field_id
      LEFT JOIN solutions ON posts.post_id = solutions.post_id
      WHERE (${conditions})
        AND posts.user_id != ?
      GROUP BY 
        posts.post_id,
        posts.user_id,
        posts.title,
        posts.description,
        posts.post_type,
        posts.field_id,
        posts.difficulty_level,
        posts.status,
        posts.created_at,
        posts.updated_at,
        users.full_name,
        fields.field_name
      ORDER BY
        CASE WHEN posts.status = 'open' THEN 0 ELSE 1 END,
        posts.created_at DESC
      LIMIT 6
      `,
      params
    );

    res.status(200).json({
      skills: skillNames,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recommended posts",
      error: error.message,
    });
  }
};

// ================= TOGGLE SAVE POST =================

export const toggleSavePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.user_id;

    const [posts] = await db.query(
      "SELECT post_id FROM posts WHERE post_id = ?",
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const [existingSavedPost] = await db.query(
      `
      SELECT saved_id
      FROM saved_posts
      WHERE user_id = ? AND post_id = ?
      `,
      [userId, postId]
    );

    let saved;

    if (existingSavedPost.length > 0) {
      await db.query(
        `
        DELETE FROM saved_posts
        WHERE user_id = ? AND post_id = ?
        `,
        [userId, postId]
      );

      saved = false;
    } else {
      await db.query(
        `
        INSERT INTO saved_posts (user_id, post_id)
        VALUES (?, ?)
        `,
        [userId, postId]
      );

      saved = true;
    }

    res.status(200).json({
      message: saved ? "Post saved successfully" : "Post removed from saved",
      saved,
    });
  } catch (error) {
    console.error("Toggle save post error:", error);

    res.status(500).json({
      message: "Failed to save post",
      error: error.message,
    });
  }
};

// ================= GET SAVE STATUS =================

export const getPostSaveStatus = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.user_id;

    const [savedPost] = await db.query(
      `
      SELECT saved_id
      FROM saved_posts
      WHERE user_id = ? AND post_id = ?
      `,
      [userId, postId]
    );

    res.status(200).json({
      saved: savedPost.length > 0,
    });
  } catch (error) {
    console.error("Get post save status error:", error);

    res.status(500).json({
      message: "Failed to check save status",
      error: error.message,
    });
  }
};

// ================= GET MY SAVED POSTS =================

export const getMySavedPosts = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [posts] = await db.query(
      `
      SELECT 
        p.post_id,
        p.user_id,
        p.field_id,
        p.title,
        p.description,
        p.post_type,
        p.difficulty_level,
        p.status,
        p.created_at,

        u.full_name,
        u.profile_picture,
        u.email,

        f.field_name,

        sp.saved_id,
        sp.created_at AS saved_at
      FROM saved_posts sp
      JOIN posts p ON sp.post_id = p.post_id
      LEFT JOIN users u ON p.user_id = u.user_id
      LEFT JOIN fields f ON p.field_id = f.field_id
      WHERE sp.user_id = ?
      ORDER BY sp.created_at DESC
      `,
      [userId]
    );

    res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error("Get my saved posts error:", error);

    res.status(500).json({
      message: "Failed to fetch saved posts",
      error: error.message,
    });
  }
};