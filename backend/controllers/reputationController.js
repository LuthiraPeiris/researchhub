import db from "../config/db.js";
import { checkAndAwardBadges } from "../utils/reputationUtils.js";

export const getLeaderboard = async (req, res) => {
  try {
    const { timeframe = "all" } = req.query;

    let dateCondition = "";
    let solutionDateCondition = "";
    let verifiedDateCondition = "";
    let commentDateCondition = "";

    if (timeframe === "week") {
      dateCondition = "AND reputation_events.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
      solutionDateCondition = "AND solutions.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
      verifiedDateCondition = "AND verified_solutions.verified_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
      commentDateCondition = "AND comments.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    }

    if (timeframe === "month") {
      dateCondition = "AND reputation_events.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
      solutionDateCondition = "AND solutions.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
      verifiedDateCondition = "AND verified_solutions.verified_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
      commentDateCondition = "AND comments.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    }

    if (timeframe === "all") {
      const [leaderboard] = await db.query(
        `
        SELECT 
          users.user_id,
          users.full_name,
          users.email,
          users.profile_picture,
          users.role,
          users.university_or_organization,

          COALESCE(reputation.total_points, 0) AS total_points,
          COALESCE(reputation.level, 'Beginner') AS level,
          reputation.last_updated,

          COUNT(DISTINCT user_badges.user_badge_id) AS badge_count,
          COUNT(DISTINCT solutions.solution_id) AS solution_count,
          COUNT(DISTINCT verified_solutions.solution_id) AS verified_solution_count,
          COUNT(DISTINCT comments.comment_id) AS comment_count

        FROM users
        LEFT JOIN reputation ON users.user_id = reputation.user_id
        LEFT JOIN user_badges ON users.user_id = user_badges.user_id
        LEFT JOIN solutions ON users.user_id = solutions.user_id
        LEFT JOIN solutions AS verified_solutions 
          ON users.user_id = verified_solutions.user_id 
          AND verified_solutions.is_verified = 1
        LEFT JOIN comments ON users.user_id = comments.user_id
        WHERE users.status = 'active'
        GROUP BY 
          users.user_id,
          users.full_name,
          users.email,
          users.profile_picture,
          users.role,
          users.university_or_organization,
          reputation.total_points,
          reputation.level,
          reputation.last_updated
        ORDER BY 
          total_points DESC,
          verified_solution_count DESC,
          solution_count DESC
        LIMIT 20
        `
      );

      return res.status(200).json(leaderboard);
    }

    const [leaderboard] = await db.query(
      `
      SELECT 
        users.user_id,
        users.full_name,
        users.email,
        users.profile_picture,
        users.role,
        users.university_or_organization,

        COALESCE(period_points.total_points, 0) AS total_points,
        COALESCE(reputation.level, 'Beginner') AS level,
        reputation.last_updated,

        COUNT(DISTINCT user_badges.user_badge_id) AS badge_count,
        COUNT(DISTINCT solutions.solution_id) AS solution_count,
        COUNT(DISTINCT verified_solutions.solution_id) AS verified_solution_count,
        COUNT(DISTINCT comments.comment_id) AS comment_count

      FROM users

      LEFT JOIN (
        SELECT 
          reputation_events.user_id,
          SUM(reputation_events.points) AS total_points
        FROM reputation_events
        WHERE 1 = 1
        ${dateCondition}
        GROUP BY reputation_events.user_id
      ) AS period_points ON users.user_id = period_points.user_id

      LEFT JOIN reputation ON users.user_id = reputation.user_id
      LEFT JOIN user_badges ON users.user_id = user_badges.user_id

      LEFT JOIN solutions 
        ON users.user_id = solutions.user_id
        ${solutionDateCondition}

      LEFT JOIN solutions AS verified_solutions 
        ON users.user_id = verified_solutions.user_id 
        AND verified_solutions.is_verified = 1
        ${verifiedDateCondition}

      LEFT JOIN comments 
        ON users.user_id = comments.user_id
        ${commentDateCondition}

      WHERE users.status = 'active'

      GROUP BY 
        users.user_id,
        users.full_name,
        users.email,
        users.profile_picture,
        users.role,
        users.university_or_organization,
        period_points.total_points,
        reputation.level,
        reputation.last_updated

      ORDER BY 
        total_points DESC,
        verified_solution_count DESC,
        solution_count DESC

      LIMIT 20
      `
    );

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch leaderboard",
      error: error.message,
    });
  }
};

export const getUserReputation = async (req, res) => {
  try {
    const { userId } = req.params;

    const [reputation] = await db.query(
      `SELECT 
        users.user_id,
        users.full_name,
        users.email,
        users.profile_picture,
        users.role,
        users.university_or_organization,

        reputation.total_points,
        reputation.level,
        reputation.last_updated,

        COUNT(user_badges.user_badge_id) AS badge_count

      FROM users
      LEFT JOIN reputation ON users.user_id = reputation.user_id
      LEFT JOIN user_badges ON users.user_id = user_badges.user_id
      WHERE users.user_id = ?
      GROUP BY 
        users.user_id,
        users.full_name,
        users.email,
        users.profile_picture,
        users.role,
        users.university_or_organization,
        reputation.total_points,
        reputation.level,
        reputation.last_updated`,
      [userId]
    );

    if (reputation.length === 0) {
      return res.status(404).json({
        message: "User reputation not found",
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
      ...reputation[0],
      badges,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user reputation",
      error: error.message,
    });
  }
};

export const recalculateUserBadges = async (req, res) => {
  try {
    const { userId } = req.params;

    const [users] = await db.query(
      "SELECT user_id FROM users WHERE user_id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await checkAndAwardBadges(userId);

    const [badges] = await db.query(
      `
      SELECT 
        b.badge_id,
        b.badge_name,
        b.description,
        b.icon,
        ub.awarded_at
      FROM user_badges ub
      INNER JOIN badges b ON ub.badge_id = b.badge_id
      WHERE ub.user_id = ?
      ORDER BY ub.awarded_at DESC
      `,
      [userId]
    );

    res.status(200).json({
      message: "Badges recalculated successfully",
      badges,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to recalculate badges",
      error: error.message,
    });
  }
};

export const recalculateAllBadges = async (req, res) => {
  try {
    const results = {
      firstSolution: 0,
      problemSolver: 0,
      communityHelper: 0,
      helpfulContributor: 0,
      expertContributor: 0,
    };

    const [firstSolutionResult] = await db.query(
      `
      INSERT IGNORE INTO user_badges (user_id, badge_id)
      SELECT DISTINCT s.user_id, b.badge_id
      FROM solutions s
      INNER JOIN badges b ON b.badge_name = 'First Solution'
      WHERE s.user_id IS NOT NULL
      `
    );

    results.firstSolution = firstSolutionResult.affectedRows;

    const [problemSolverResult] = await db.query(
      `
      INSERT IGNORE INTO user_badges (user_id, badge_id)
      SELECT DISTINCT s.user_id, b.badge_id
      FROM solutions s
      INNER JOIN badges b ON b.badge_name = 'Problem Solver'
      WHERE s.is_verified = 1
      `
    );

    results.problemSolver = problemSolverResult.affectedRows;

    const [communityHelperResult] = await db.query(
      `
      INSERT IGNORE INTO user_badges (user_id, badge_id)
      SELECT c.user_id, b.badge_id
      FROM comments c
      INNER JOIN badges b ON b.badge_name = 'Community Helper'
      GROUP BY c.user_id, b.badge_id
      HAVING COUNT(c.comment_id) >= 10
      `
    );

    results.communityHelper = communityHelperResult.affectedRows;

    const [helpfulContributorResult] = await db.query(
      `
      INSERT IGNORE INTO user_badges (user_id, badge_id)
      SELECT r.user_id, b.badge_id
      FROM reputation r
      INNER JOIN badges b ON b.badge_name = 'Helpful Contributor'
      WHERE r.total_points >= 50
      `
    );

    results.helpfulContributor = helpfulContributorResult.affectedRows;

    const [expertContributorResult] = await db.query(
      `
      INSERT IGNORE INTO user_badges (user_id, badge_id)
      SELECT r.user_id, b.badge_id
      FROM reputation r
      INNER JOIN badges b ON b.badge_name = 'Expert Contributor'
      WHERE r.total_points >= 100
      `
    );

    results.expertContributor = expertContributorResult.affectedRows;

    const [allBadges] = await db.query(
      `
      SELECT 
        u.user_id,
        u.full_name,
        b.badge_name,
        ub.awarded_at
      FROM user_badges ub
      INNER JOIN users u ON ub.user_id = u.user_id
      INNER JOIN badges b ON ub.badge_id = b.badge_id
      ORDER BY ub.awarded_at DESC
      `
    );

    res.status(200).json({
      message: "All user badges recalculated successfully",
      insertedCounts: results,
      totalUserBadges: allBadges.length,
      badges: allBadges,
    });
  } catch (error) {
    console.error("Recalculate all badges error:", error);

    res.status(500).json({
      message: "Failed to recalculate badges",
      error: error.message,
    });
  }
};