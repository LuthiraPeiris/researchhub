import db from "../config/db.js";

const preferenceColumnByType = {
  comment: "comment_notifications",
  solution: "solution_notifications",
  badge: "badge_notifications",
  verification: "verification_notifications",
  system: "system_notifications",
};

export const createNotificationIfAllowed = async ({
  userId,
  actorUserId = null,
  message,
  type = "system",
  referenceId = null,
  referenceType = null,
  connection = db,
}) => {
  if (!userId || !message) {
    return {
      created: false,
      reason: "Missing userId or message",
    };
  }

  const preferenceColumn = preferenceColumnByType[type];

  if (preferenceColumn) {
    await connection.query(
      `
      INSERT INTO notification_preferences (user_id)
      VALUES (?)
      ON DUPLICATE KEY UPDATE user_id = user_id
      `,
      [userId]
    );

    const [preferences] = await connection.query(
      `
      SELECT ${preferenceColumn} AS allowed
      FROM notification_preferences
      WHERE user_id = ?
      `,
      [userId]
    );

    const allowed = preferences[0]?.allowed;

    if (Number(allowed) === 0) {
      return {
        created: false,
        reason: "Notification disabled by user preference",
      };
    }
  }

  // Do not create a notification when users trigger an action
  // on their own content, except for system notifications.
  if (
    actorUserId &&
    Number(actorUserId) === Number(userId) &&
    type !== "system"
  ) {
    return {
      created: false,
      reason: "Actor and recipient are the same user",
    };
  }

  const [result] = await connection.query(
    `
    INSERT INTO notifications
    (
      user_id,
      actor_user_id,
      message,
      type,
      is_read,
      reference_id,
      reference_type
    )
    VALUES (?, ?, ?, ?, 0, ?, ?)
    `,
    [
      userId,
      actorUserId || null,
      message,
      type,
      referenceId,
      referenceType,
    ]
  );

  return {
    created: true,
    notificationId: result.insertId,
  };
};