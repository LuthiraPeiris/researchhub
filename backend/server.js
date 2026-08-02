import "dotenv/config";

import express from "express";
import cors from "cors";
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

const app = express();

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadsDirectory = path.join(backendDirectory, "uploads");

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow Postman, mobile apps and server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error(`CORS blocked origin: ${origin}`);
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: true,

  optionsSuccessStatus: 204,
};

// Render uses a reverse proxy
app.set("trust proxy", 1);

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// S3 file redirect route
app.get(/^\/uploads\/s3\/(.+)$/, async (req, res) => {
  try {
    const objectKey = req.params[0];
    const signedUrl = await createSignedFileUrl(objectKey);

    return res.redirect(signedUrl);
  } catch (error) {
    console.error("S3 signed URL error:", error);

    return res.status(404).json({
      message: "File not found",
      error: error.message,
    });
  }
});

// Existing local uploads
app.use("/uploads", express.static(uploadsDirectory));

// API routes
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

// Root test route
app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");

    return res.status(200).json({
      message: "Backend and MySQL connected successfully",
      result: rows[0].result,
    });
  } catch (error) {
    console.error("Database connection test failed:", error);

    return res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Render health-check route
app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "healthy",
    service: "collabsolve-backend",
    timestamp: new Date().toISOString(),
  });
});

// Database health-check route
app.get("/health/database", async (req, res) => {
  try {
    await db.query("SELECT 1");

    return res.status(200).json({
      status: "healthy",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return res.status(503).json({
      status: "unhealthy",
      database: "disconnected",
      message: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  return res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error);

  if (error.message?.startsWith("CORS blocked origin")) {
    return res.status(403).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "production"
        ? undefined
        : error.message,
  });
});

const runDatabaseUpdates = async () => {
  try {
    const [columns] = await db.query(
      "SHOW COLUMNS FROM users LIKE 'google_id'",
    );

    if (columns.length === 0) {
      console.log("Adding Google authentication fields...");

      await db.query(
        "ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL",
      );

      await db.query(
        "ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE DEFAULT NULL",
      );

      console.log("Google authentication fields added successfully.");
    } else {
      console.log("Database schema is up to date.");
    }
  } catch (error) {
    console.error("Database migration check failed:", error.message);
  }
};

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await runDatabaseUpdates();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
  });
};

startServer();