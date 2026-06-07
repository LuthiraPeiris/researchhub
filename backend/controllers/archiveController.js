import db from "../config/db.js";

export const getAllArchiveItems = async (req, res) => {
  try {
    const [archiveItems] = await db.query(
      `
      SELECT 
        ka.archive_id,
        ka.summary,
        ka.archived_at,

        p.post_id,
        p.title,
        p.description,
        p.post_type,
        p.difficulty_level,
        p.status,
        p.created_at AS post_created_at,

        f.field_name,

        post_user.full_name AS post_author,
        post_user.profile_picture AS post_author_picture,

        s.solution_id,
        s.solution_text,
        s.verified_at,

        solution_user.full_name AS solution_author,
        solution_user.profile_picture AS solution_author_picture,

        COALESCE(like_counts.like_count, 0) AS solution_like_count

      FROM knowledge_archive ka
      INNER JOIN posts p ON ka.post_id = p.post_id
      LEFT JOIN fields f ON p.field_id = f.field_id
      LEFT JOIN users post_user ON p.user_id = post_user.user_id
      LEFT JOIN solutions s ON ka.final_solution_id = s.solution_id
      LEFT JOIN users solution_user ON s.user_id = solution_user.user_id
      LEFT JOIN (
        SELECT 
          solution_id,
          COUNT(*) AS like_count
        FROM solution_likes
        GROUP BY solution_id
      ) like_counts ON s.solution_id = like_counts.solution_id
      ORDER BY ka.archived_at DESC
      `
    );

    if (archiveItems.length === 0) {
      return res.status(200).json([]);
    }

    const postIds = archiveItems.map((item) => item.post_id);
    const solutionIds = archiveItems
      .filter((item) => item.solution_id)
      .map((item) => item.solution_id);

    const [postAttachments] = await db.query(
  `
  SELECT 
    attachment_id,
    post_id,
    file_name,
    file_path,
    file_type,
    uploaded_at
  FROM post_attachments
  WHERE post_id IN (?)
  ORDER BY uploaded_at DESC
  `,
  [postIds]
);

    let solutionAttachments = [];

    if (solutionIds.length > 0) {
      const [attachments] = await db.query(
        `
        SELECT 
          attachment_id,
          solution_id,
          file_name,
          file_path,
          file_type,
          created_at
        FROM solution_attachments
        WHERE solution_id IN (?)
        ORDER BY created_at DESC
        `,
        [solutionIds]
      );

      solutionAttachments = attachments;
    }

    const finalArchiveItems = archiveItems.map((item) => ({
      ...item,
      solution_like_count: Number(item.solution_like_count || 0),
      post_attachments: postAttachments.filter(
        (attachment) => attachment.post_id === item.post_id
      ),
      solution_attachments: solutionAttachments.filter(
        (attachment) => attachment.solution_id === item.solution_id
      ),
    }));

    res.status(200).json(finalArchiveItems);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch knowledge archive",
      error: error.message,
    });
  }
};

export const getArchiveItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const [archiveItems] = await db.query(
      `
      SELECT 
        ka.archive_id,
        ka.summary,
        ka.archived_at,

        p.post_id,
        p.title,
        p.description,
        p.post_type,
        p.difficulty_level,
        p.status,
        p.created_at AS post_created_at,

        f.field_name,

        post_user.full_name AS post_author,
        post_user.profile_picture AS post_author_picture,

        s.solution_id,
        s.solution_text,
        s.verified_at,

        solution_user.full_name AS solution_author,
        solution_user.profile_picture AS solution_author_picture,

        COALESCE(like_counts.like_count, 0) AS solution_like_count

      FROM knowledge_archive ka
      INNER JOIN posts p ON ka.post_id = p.post_id
      LEFT JOIN fields f ON p.field_id = f.field_id
      LEFT JOIN users post_user ON p.user_id = post_user.user_id
      LEFT JOIN solutions s ON ka.final_solution_id = s.solution_id
      LEFT JOIN users solution_user ON s.user_id = solution_user.user_id
      LEFT JOIN (
        SELECT 
          solution_id,
          COUNT(*) AS like_count
        FROM solution_likes
        GROUP BY solution_id
      ) like_counts ON s.solution_id = like_counts.solution_id
      WHERE ka.archive_id = ?
      `,
      [id]
    );

    if (archiveItems.length === 0) {
      return res.status(404).json({
        message: "Archive item not found",
      });
    }

    const archiveItem = archiveItems[0];

    const [postAttachments] = await db.query(
  `
  SELECT 
    attachment_id,
    post_id,
    file_name,
    file_path,
    file_type,
    uploaded_at
  FROM post_attachments
  WHERE post_id = ?
  ORDER BY uploaded_at DESC
  `,
  [archiveItem.post_id]
);

    let solutionAttachments = [];

    if (archiveItem.solution_id) {
      const [attachments] = await db.query(
        `
        SELECT 
          attachment_id,
          solution_id,
          file_name,
          file_path,
          file_type,
          created_at
        FROM solution_attachments
        WHERE solution_id = ?
        ORDER BY created_at DESC
        `,
        [archiveItem.solution_id]
      );

      solutionAttachments = attachments;
    }

    res.status(200).json({
      ...archiveItem,
      solution_like_count: Number(archiveItem.solution_like_count || 0),
      post_attachments: postAttachments,
      solution_attachments: solutionAttachments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch archive item",
      error: error.message,
    });
  }
};