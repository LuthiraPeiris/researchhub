import db from "../config/db.js";
import { createNotificationIfAllowed } from "../utils/notificationUtils.js";

// ================= USERS =================

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT user_id, full_name, full_name AS name, email, role, created_at FROM users ORDER BY created_at DESC",
    );

    res.json({ users });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get users",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM users WHERE user_id = ? AND role != 'admin'", [
      id,
    ]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const [posts] = await db.query(`
      SELECT 
        p.post_id,
        p.title,
        p.description,
        p.status,
        p.is_archived,
        p.created_at,
        u.full_name AS author_name,
        f.field_name
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.user_id
        LEFT JOIN fields f ON p.field_id = f.field_id
        ORDER BY p.created_at DESC
      `);
    res.json({ posts });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get posts",
      error: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM posts WHERE post_id = ?", [id]);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete post",
      error: error.message,
    });
  }
};
const archivePost = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("UPDATE posts SET is_archived = 1 WHERE post_id = ?", [id]);

    res.json({ message: "Post archived successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to archive post",
      error: error.message,
    });
  }
};

const getAllComments = async (req, res) => {
  try {
    const [comments] = await db.query(`
       SELECT 
        c.comment_id,
        c.comment_text AS content,
        c.created_at,
        u.full_name AS author_name,
        p.title AS post_title
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN posts p ON c.post_id = p.post_id
      ORDER BY c.created_at DESC`);

    res.json({ comments });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get comments",
      error: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM comments WHERE comment_id = ?", [id]);

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};

const getAllSolutions = async (req, res) => {
  try {
    const [solutions] = await db.query(`
      SELECT 
       s.solution_id,
        s.solution_text AS content,
        s.created_at,
        u.full_name AS author_name,
        p.title AS post_title
      FROM solutions s 
      LEFT JOIN users u ON s.user_id = u.user_id
      LEFT JOIN posts p ON s.post_id = p.post_id
      ORDER BY s.created_at DESC
      `);

    res.json({ solutions });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get solutions",
      error: error.message,
    });
  }
};

const deleteSolution = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM solutions WHERE solution_id = ?", [id]);

    res.json({ message: "Solution deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete solution",
      error: error.message,
    });
  }
};

const getAllFields = async (req, res) => {
  try {
    const [fields] = await db.query(
      "SELECT * FROM fields ORDER BY field_name ASC",
    );

    res.json({ fields });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get fields",
      error: error.message,
    });
  }
};

const createField = async (req, res) => {
  try {
    const { name, description } = req.body;

    await db.query("INSERT INTO fields (field_name, description) VALUES (?, ?)", [
      name,
      description,
    ]);

    res.status(201).json({ message: "Field created successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create field",
      error: error.message,
    });
  }
};

const updateField = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    await db.query(
      "UPDATE fields SET field_name = ?, description = ? WHERE field_id = ?",
      [name, description, id],
    );

    res.json({ message: "Field updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update field",
      error: error.message,
    });
  }
};
const deleteField = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM fields WHERE field_id = ?", [id]);

    res.json({ message: "Field deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete field",
      error: error.message,
    });
  }
};
const getArchive = async (req, res) => {
  try {
    const [archive] = await db.query(`
      SELECT 
        p.post_id,
        p.title,
        p.description,
        p.created_at,
        u.full_name AS author_name,
        f.field_name
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.user_id
      LEFT JOIN fields f ON p.field_id = f.field_id
      WHERE p.is_archived = 1
      ORDER BY p.created_at DESC
    `);

    res.json({ archive });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get archive",
      error: error.message,
    });
  }
};
const restoreArchivePost = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("UPDATE posts SET is_archived = 0 WHERE post_id = ?", [id]);

    res.json({ message: "Post restored successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to restore post",
      error: error.message,
    });
  }
};

export {
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
};
