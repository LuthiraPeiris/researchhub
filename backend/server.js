import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import { createSignedFileUrl } from "./services/s3Service.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import solutionRoutes from "./routes/solutionRoutes.js";
import archiveRoutes from "./routes/archiveRoutes.js";
import reputationRoutes from "./routes/reputationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import fieldRoutes from "./routes/fieldRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

// Run database schema updates inline
(async () => {
  try {
    const [cols] = await db.query("SHOW COLUMNS FROM users LIKE 'google_id'");
    if (cols.length === 0) {
      console.log("google_id column missing. Modifying users table inline...");
      await db.query(
        "ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL",
      );
      await db.query(
        "ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE DEFAULT NULL",
      );
      console.log("Database schema successfully updated with google_id.");
    }
  } catch (err) {
    console.error("Database migration check failed:", err.message);
  }
})();

const app = express();
const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadsDirectory = path.join(backendDirectory, "uploads");
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow Postman, mobile applications, and server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get(/^\/uploads\/s3\/(.+)$/, async (req, res) => {
  try {
    const objectKey = req.params[0];
    const signedUrl = await createSignedFileUrl(objectKey);
    res.redirect(signedUrl);
  } catch (error) {
    res.status(404).json({
      message: "Profile image not found",
      error: error.message,
    });
  }
});

app.use("/uploads", express.static(uploadsDirectory));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", commentRoutes);
app.use("/api", solutionRoutes);
app.use("/api/archive", archiveRoutes);
app.use("/api/reputation", reputationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", uploadRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");

    res.json({
      message: "Backend and MySQL connected successfully",
      result: rows[0].result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Health-check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health/database", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.status(200).json({
      status: "healthy",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(503).json({
      status: "unhealthy",
      database: "disconnected",
      message: error.message,
    });
  }
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
