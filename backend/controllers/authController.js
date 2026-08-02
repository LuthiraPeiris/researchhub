import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const registerUser = async (req, res) => {
  try {
    const { full_name, email, password, university_or_organization, role } =
      req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required",
      });
    }

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
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
      ],
    );

    await db.query(
      `INSERT INTO reputation (user_id, total_points, level) 
       VALUES (?, ?, ?)`,
      [result.insertId, 0, "Beginner"],
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

// Exchange code for Google User Profile and Sign JWT
export const googleAuth = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res
        .status(400)
        .json({ message: "Authorization code is required" });
    }
    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      return res.status(400).json({
        message: "Failed to exchange Google code",
        error: tokenData,
      });
    }
    // 2. Fetch Google User Profile
    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );
    const googleUser = await profileResponse.json();
    if (!profileResponse.ok) {
      return res
        .status(400)
        .json({ message: "Failed to fetch Google profile" });
    }
    const { id: googleId, email, name, picture } = googleUser;
    // 3. Look up user in Database
    let [users] = await db.query(
      "SELECT * FROM users WHERE google_id = ? OR email = ?",
      [googleId, email],
    );
    let user;
    if (users.length > 0) {
      user = users[0];
      // If user signed up via password previously, link their Google ID
      if (!user.google_id) {
        await db.query("UPDATE users SET google_id = ? WHERE user_id = ?", [
          googleId,
          user.user_id,
        ]);
        user.google_id = googleId;
      }
    } else {
      // 4. Create new user if not registered
      const [result] = await db.query(
        `INSERT INTO users 
        (full_name, email, google_id, profile_picture, role, status) 
        VALUES (?, ?, ?, ?, ?, 'active')`,
        [name, email, googleId, picture || null, "student"],
      );
      // Create initial reputation record (matching registration)
      await db.query(
        `INSERT INTO reputation (user_id, total_points, level) VALUES (?, 0, 'Beginner')`,
        [result.insertId],
      );
      user = {
        user_id: result.insertId,
        full_name: name,
        email,
        role: "student",
        profile_picture: picture || null,
      };
    }
    // 5. Generate and return JWT
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.status(200).json({
      message: "Google login successful",
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
    res
      .status(500)
      .json({ message: "Google authentication failed", error: error.message });
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

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password_hash,
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
      },
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
