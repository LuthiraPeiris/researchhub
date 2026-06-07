import db from "../config/db.js";
import { createNotificationIfAllowed } from "./notificationUtils.js";

export const getLevelFromPoints = (points) => {
  if (points >= 500) return "Expert";
  if (points >= 100) return "Contributor";
  if (points >= 50) return "Helper";
  return "Beginner";
};

export const awardBadge = async (userId, badgeName) => {
  const [badges] = await db.query(
    "SELECT badge_id FROM badges WHERE badge_name = ?",
    [badgeName]
  );

  if (badges.length === 0) return;

  const [result] = await db.query(
    `
    INSERT IGNORE INTO user_badges (user_id, badge_id)
    VALUES (?, ?)
    `,
    [userId, badges[0].badge_id]
  );

  if (result.affectedRows > 0) {
    await createNotificationIfAllowed({
      userId,
      message: `You earned a new badge: ${badgeName}`,
      type: "badge",
      referenceId: badges[0].badge_id,
      referenceType: "badge",
    });
  }
};

export const checkAndAwardBadges = async (userId) => {
  const [reputationRows] = await db.query(
    "SELECT total_points FROM reputation WHERE user_id = ?",
    [userId]
  );

  const totalPoints = reputationRows[0]?.total_points || 0;

  const [solutionRows] = await db.query(
    "SELECT COUNT(*) AS count FROM solutions WHERE user_id = ?",
    [userId]
  );

  const [verifiedRows] = await db.query(
    "SELECT COUNT(*) AS count FROM solutions WHERE user_id = ? AND is_verified = 1",
    [userId]
  );

  const [commentRows] = await db.query(
    "SELECT COUNT(*) AS count FROM comments WHERE user_id = ?",
    [userId]
  );

  if (solutionRows[0].count >= 1) {
    await awardBadge(userId, "First Solution");
  }

  if (verifiedRows[0].count >= 1) {
    await awardBadge(userId, "Problem Solver");
  }

  if (commentRows[0].count >= 10) {
    await awardBadge(userId, "Community Helper");
  }

  if (totalPoints >= 50) {
    await awardBadge(userId, "Helpful Contributor");
  }

  if (totalPoints >= 100) {
    await awardBadge(userId, "Expert Contributor");
  }
};

export const addReputationEvent = async ({
  userId,
  points,
  eventType,
  referenceType,
  referenceId,
  description,
}) => {
  if (!userId || !points || !eventType || !referenceType || !referenceId) {
    return {
      awarded: false,
      reason: "Missing reputation event data",
    };
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [eventResult] = await connection.query(
      `
      INSERT IGNORE INTO reputation_events
      (user_id, points, event_type, reference_type, reference_id, description)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [userId, points, eventType, referenceType, referenceId, description || null]
    );

    if (eventResult.affectedRows === 0) {
      await connection.rollback();

      return {
        awarded: false,
        reason: "Reputation event already exists",
      };
    }

    const [existing] = await connection.query(
      "SELECT total_points FROM reputation WHERE user_id = ?",
      [userId]
    );

    const currentPoints = existing[0]?.total_points || 0;
    const newPoints = currentPoints + points;
    const newLevel = getLevelFromPoints(newPoints);

    await connection.query(
      `
      INSERT INTO reputation (user_id, total_points, level)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        total_points = total_points + ?,
        level = ?,
        last_updated = CURRENT_TIMESTAMP
      `,
      [userId, points, newLevel, points, newLevel]
    );

    await connection.commit();

    await checkAndAwardBadges(userId);

    return {
      awarded: true,
      points,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const checkPopularSolutionBadge = async (solutionId) => {
  const [solutions] = await db.query(
    "SELECT user_id FROM solutions WHERE solution_id = ?",
    [solutionId]
  );

  if (solutions.length === 0) return;

  const solutionOwnerId = solutions[0].user_id;

  const [likes] = await db.query(
    "SELECT COUNT(*) AS like_count FROM solution_likes WHERE solution_id = ?",
    [solutionId]
  );

  if (Number(likes[0].like_count) >= 5) {
    await addReputationEvent({
      userId: solutionOwnerId,
      points: 5,
      eventType: "popular_solution",
      referenceType: "solution",
      referenceId: solutionId,
      description: "Popular Solution bonus for receiving 5 likes",
    });

    await awardBadge(solutionOwnerId, "Popular Solution");
  }
};