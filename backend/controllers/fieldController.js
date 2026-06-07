import db from "../config/db.js";

export const createField = async (req, res) => {
  try {
    const { field_name, description } = req.body;

    if (!field_name) {
      return res.status(400).json({
        message: "Field name is required",
      });
    }

    const [existingField] = await db.query(
      "SELECT * FROM fields WHERE field_name = ?",
      [field_name]
    );

    if (existingField.length > 0) {
      return res.status(409).json({
        message: "Field already exists",
      });
    }

    const [result] = await db.query(
      "INSERT INTO fields (field_name, description) VALUES (?, ?)",
      [field_name, description || null]
    );

    res.status(201).json({
      message: "Field created successfully",
      field: {
        field_id: result.insertId,
        field_name,
        description,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create field",
      error: error.message,
    });
  }
};

export const getAllFields = async (req, res) => {
  try {
    const [fields] = await db.query(
      "SELECT * FROM fields ORDER BY field_name ASC"
    );

    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch fields",
      error: error.message,
    });
  }
};

export const getFieldById = async (req, res) => {
  try {
    const { fieldId } = req.params;

    const [fields] = await db.query(
      "SELECT * FROM fields WHERE field_id = ?",
      [fieldId]
    );

    if (fields.length === 0) {
      return res.status(404).json({
        message: "Field not found",
      });
    }

    res.status(200).json(fields[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch field",
      error: error.message,
    });
  }
};

export const updateField = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const { field_name, description } = req.body;

    const [fields] = await db.query(
      "SELECT * FROM fields WHERE field_id = ?",
      [fieldId]
    );

    if (fields.length === 0) {
      return res.status(404).json({
        message: "Field not found",
      });
    }

    await db.query(
      `UPDATE fields 
       SET field_name = ?, description = ?
       WHERE field_id = ?`,
      [
        field_name || fields[0].field_name,
        description || fields[0].description,
        fieldId,
      ]
    );

    res.status(200).json({
      message: "Field updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update field",
      error: error.message,
    });
  }
};

export const deleteField = async (req, res) => {
  try {
    const { fieldId } = req.params;

    const [fields] = await db.query(
      "SELECT * FROM fields WHERE field_id = ?",
      [fieldId]
    );

    if (fields.length === 0) {
      return res.status(404).json({
        message: "Field not found",
      });
    }

    await db.query("DELETE FROM fields WHERE field_id = ?", [fieldId]);

    res.status(200).json({
      message: "Field deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete field",
      error: error.message,
    });
  }
};