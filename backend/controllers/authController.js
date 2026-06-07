import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const registerUser = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      university_or_organization,
      role,
    } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required",
      });
    }

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users 
      (full_name, email, password_hash, university_or_organization, role) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        full_name,
        email,
        hashedPassword,
        university_or_organization || null,
        role || "student",
      ]
    );

    await db.query(
      `INSERT INTO reputation (user_id, total_points, level) 
       VALUES (?, ?, ?)`,
      [result.insertId, 0, "Beginner"]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        user_id: result.insertId,
        full_name,
        email,
        role: role || "student",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "Your account is not active",
      });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        profile_picture: user.profile_picture,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};