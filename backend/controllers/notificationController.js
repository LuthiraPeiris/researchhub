import db from "../config/db.js";

export const getNotifications = async (req, res) => {
  try {
    const limitValue = Number(req.query.limit) || 20;
    const safeLimit = Math.min(Math.max(limitValue, 1), 100);

    // Remove read notifications older than 30 days before fetching
    await db.query(
      `
      DELETE FROM notifications
      WHERE user_id = ?
        AND is_read = TRUE
        AND created_at < NOW() - INTERVAL 30 DAY
      `,
      [req.user.user_id]
    );

    const [notifications] = await db.query(
      `
      SELECT
        n.notification_id,
        n.user_id,
        n.actor_user_id,
        n.message,
        n.type,
        n.is_read,
        n.reference_id,
        n.reference_type,
        n.created_at,

        actor.full_name AS actor_name,
        actor.email AS actor_email,
        actor.profile_picture AS actor_profile_picture,

        CASE
          WHEN n.reference_type = 'post' THEN n.reference_id
          WHEN n.reference_type = 'solution' THEN s.post_id
          WHEN n.reference_type = 'comment' THEN c.post_id
          ELSE NULL
        END AS target_post_id

      FROM notifications n

      LEFT JOIN users actor
        ON n.actor_user_id = actor.user_id

      LEFT JOIN solutions s
        ON n.reference_type = 'solution'
        AND n.reference_id = s.solution_id

      LEFT JOIN comments c
        ON n.reference_type = 'comment'
        AND n.reference_id = c.comment_id

      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
      LIMIT ?
      `,
      [req.user.user_id, safeLimit]
    );

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const [notifications] = await db.query(
      `
      SELECT notification_id
      FROM notifications
      WHERE notification_id = ?
        AND user_id = ?
      `,
      [notificationId, req.user.user_id]
    );

    if (notifications.length === 0) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    await db.query(
      `
      UPDATE notifications
      SET is_read = TRUE
      WHERE notification_id = ?
        AND user_id = ?
      `,
      [notificationId, req.user.user_id]
    );

    res.status(200).json({
      message: "Notification marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update notification",
      error: error.message,
    });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await db.query(
      `
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = ?
      `,
      [req.user.user_id]
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update notifications",
      error: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const [notifications] = await db.query(
      `
      SELECT notification_id
      FROM notifications
      WHERE notification_id = ?
        AND user_id = ?
      `,
      [notificationId, req.user.user_id]
    );

    if (notifications.length === 0) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    await db.query(
      `
      DELETE FROM notifications
      WHERE notification_id = ?
        AND user_id = ?
      `,
      [notificationId, req.user.user_id]
    );

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};