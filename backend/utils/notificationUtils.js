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

  await connection.query(
    `
    INSERT INTO notifications
    (user_id, message, type, is_read, reference_id, reference_type)
    VALUES (?, ?, ?, 0, ?, ?)
    `,
    [userId, message, type, referenceId, referenceType]
  );

  return {
    created: true,
  };
};