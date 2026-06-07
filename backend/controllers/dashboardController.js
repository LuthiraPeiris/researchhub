import db from "../config/db.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [[totalProblemsRow]] = await db.query(
      `
      SELECT COUNT(*) AS totalProblems
      FROM posts
      `
    );

    const [[openProblemsRow]] = await db.query(
      `
      SELECT COUNT(*) AS openProblems
      FROM posts
      WHERE status = 'open'
      `
    );

    const [[solvedProblemsRow]] = await db.query(
      `
      SELECT COUNT(*) AS solvedProblems
      FROM posts
      WHERE status = 'solved'
      `
    );

    const [[myProblemsRow]] = await db.query(
      `
      SELECT COUNT(*) AS myProblems
      FROM posts
      WHERE user_id = ?
      `,
      [userId]
    );

    const [[mySolutionsRow]] = await db.query(
      `
      SELECT COUNT(*) AS mySolutions
      FROM solutions
      WHERE user_id = ?
      `,
      [userId]
    );

    const [[pendingReceivedSolutionsRow]] = await db.query(
      `
      SELECT COUNT(*) AS pendingReceivedSolutions
      FROM solutions s
      INNER JOIN posts p ON s.post_id = p.post_id
      WHERE p.user_id = ?
      AND s.user_id != ?
      AND s.is_verified = 0
      AND p.status = 'open'
      `,
      [userId, userId]
    );

    const [recentProblems] = await db.query(
      `
      SELECT 
        p.post_id,
        p.title,
        p.description,
        p.post_type,
        p.difficulty_level,
        p.status,
        p.created_at,
        u.full_name,
        f.field_name,
        COUNT(DISTINCT s.solution_id) AS solution_count
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.user_id
      LEFT JOIN fields f ON p.field_id = f.field_id
      LEFT JOIN solutions s ON p.post_id = s.post_id
      GROUP BY 
        p.post_id,
        p.title,
        p.description,
        p.post_type,
        p.difficulty_level,
        p.status,
        p.created_at,
        u.full_name,
        f.field_name
      ORDER BY p.created_at DESC
      LIMIT 5
      `
    );

    const [myRecentActivity] = await db.query(
  `
  (
    SELECT 
      'post' AS activity_type,
      p.post_id AS reference_id,
      p.post_id AS post_id,
      p.title AS title,
      'You posted a problem' AS message,
      p.created_at AS created_at
    FROM posts p
    WHERE p.user_id = ?
  )

  UNION ALL

  (
    SELECT 
      'solution' AS activity_type,
      s.solution_id AS reference_id,
      s.post_id AS post_id,
      p.title AS title,
      'You submitted a solution' AS message,
      s.created_at AS created_at
    FROM solutions s
    INNER JOIN posts p ON s.post_id = p.post_id
    WHERE s.user_id = ?
  )

  UNION ALL

  (
    SELECT 
      'comment' AS activity_type,
      c.comment_id AS reference_id,
      c.post_id AS post_id,
      p.title AS title,
      'You commented on a post' AS message,
      c.created_at AS created_at
    FROM comments c
    INNER JOIN posts p ON c.post_id = p.post_id
    WHERE c.user_id = ?
  )

  ORDER BY created_at DESC
  LIMIT 5
  `,
  [userId, userId, userId]
);

    res.status(200).json({
      totalProblems: Number(totalProblemsRow.totalProblems),
      openProblems: Number(openProblemsRow.openProblems),
      solvedProblems: Number(solvedProblemsRow.solvedProblems),
      myProblems: Number(myProblemsRow.myProblems),
      mySolutions: Number(mySolutionsRow.mySolutions),
      pendingReceivedSolutions: Number(
        pendingReceivedSolutionsRow.pendingReceivedSolutions
      ),
      recentProblems,
      myRecentActivity,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
};