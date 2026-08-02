import multer from "multer";

const allowedMimeTypes = new Set([
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",

  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",

  // Archive files
  "application/zip",
  "application/x-zip-compressed",
]);

const fileFilter = (req, file, callback) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return callback(
      new Error(
        "Only JPG, PNG, WEBP, PDF, DOC, DOCX, TXT, and ZIP files are allowed",
      ),
      false,
    );
  }

  callback(null, true);
};

export const upload = multer({
  /*
   * Store the uploaded file temporarily in memory.
   * The file will be available as req.file.buffer
   * or req.files[index].buffer.
   *
   * It will no longer be written to the local uploads folder.
   */
  storage: multer.memoryStorage(),

  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, // Maximum 10 MB per file
    files: 5, // Maximum 5 files per request
  },
});

// Profile pictures are uploaded to S3, which requires an in-memory buffer.
// Keep this separate so existing attachment upload behavior is unchanged.
export const profilePictureUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP profile images are allowed"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
});
