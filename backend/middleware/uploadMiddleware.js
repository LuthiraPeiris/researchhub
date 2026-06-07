import multer from "multer";
import path from "path";
import fs from "fs";

const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads";

    if (req.baseUrl.includes("solutions") || req.originalUrl.includes("solutions")) {
      folder = "uploads/solutions";
    }

    ensureFolderExists(folder);
    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const safeOriginalName = file.originalname.replace(/\s+/g, "-");
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(safeOriginalName);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/zip",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only images, PDF, DOC, DOCX, TXT, and ZIP files are allowed"),
      false
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 5,
  },
});