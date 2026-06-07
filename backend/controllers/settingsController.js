import bcrypt from "bcrypt";
import db from "../config/db.js";

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const [users] = await db.query(
      "SELECT user_id, password_hash FROM users WHERE user_id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      users[0].password_hash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password_hash = ? WHERE user_id = ?",
      [hashedPassword, userId]
    );

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to change password",
      error: error.message,
    });
  }
};

export const getNotificationPreferences = async (req, res) => {
  try {
    const userId = req.user.user_id;

    await db.query(
      `
      INSERT INTO notification_preferences (user_id)
      VALUES (?)
      ON DUPLICATE KEY UPDATE user_id = user_id
      `,
      [userId]
    );

    const [preferences] = await db.query(
      "SELECT * FROM notification_preferences WHERE user_id = ?",
      [userId]
    );

    res.status(200).json(preferences[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notification preferences",
      error: error.message,
    });
  }
};

export const updateNotificationPreferences = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const {
      comment_notifications,
      solution_notifications,
      badge_notifications,
      verification_notifications,
      system_notifications,
    } = req.body;

    await db.query(
      `
      INSERT INTO notification_preferences 
      (
        user_id,
        comment_notifications,
        solution_notifications,
        badge_notifications,
        verification_notifications,
        system_notifications
      )
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        comment_notifications = VALUES(comment_notifications),
        solution_notifications = VALUES(solution_notifications),
        badge_notifications = VALUES(badge_notifications),
        verification_notifications = VALUES(verification_notifications),
        system_notifications = VALUES(system_notifications)
      `,
      [
        userId,
        Boolean(comment_notifications),
        Boolean(solution_notifications),
        Boolean(badge_notifications),
        Boolean(verification_notifications),
        Boolean(system_notifications),
      ]
    );

    res.status(200).json({
      message: "Notification preferences updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update notification preferences",
      error: error.message,
    });
  }
};

export const getUserSettings = async (req, res) => {
  try {
    const userId = req.user.user_id;

    await db.query(
      `
      INSERT INTO user_settings (user_id, theme)
      VALUES (?, 'light')
      ON DUPLICATE KEY UPDATE user_id = user_id
      `,
      [userId]
    );

    const [settings] = await db.query(
      "SELECT * FROM user_settings WHERE user_id = ?",
      [userId]
    );

    res.status(200).json(settings[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user settings",
      error: error.message,
    });
  }
};

export const updateUserSettings = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { theme } = req.body;

    const allowedThemes = ["light", "dark", "system"];

    if (!allowedThemes.includes(theme)) {
      return res.status(400).json({
        message: "Invalid theme option",
      });
    }

    await db.query(
      `
      INSERT INTO user_settings (user_id, theme)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE theme = VALUES(theme)
      `,
      [userId, theme]
    );

    res.status(200).json({
      message: "Theme preference updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user settings",
      error: error.message,
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required to delete account",
      });
    }

    const [users] = await db.query(
      "SELECT user_id, password_hash FROM users WHERE user_id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      users[0].password_hash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Password is incorrect",
      });
    }

    await db.query("DELETE FROM users WHERE user_id = ?", [userId]);

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete account",
      error: error.message,
    });
  }
};