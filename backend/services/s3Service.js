import crypto from "node:crypto";
import path from "node:path";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import s3Client from "../config/s3Client.js";

const bucketName = process.env.AWS_S3_BUCKET_NAME;

/**
 * Remove unsafe characters from a file name.
 */
const sanitizeFileName = (fileName) => {
  const extension = path.extname(fileName);
  const baseName = path.basename(fileName, extension);

  const safeBaseName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const safeExtension = extension
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, "");

  return `${safeBaseName || "file"}${safeExtension}`;
};

/**
 * Upload one Multer file to S3.
 */
export const uploadFileToS3 = async (
  file,
  folder = "general"
) => {
  if (!file?.buffer) {
    throw new Error("A valid Multer file buffer is required");
  }

  const safeFileName = sanitizeFileName(file.originalname);
  const uniqueId = crypto.randomUUID();

  const objectKey = `${folder}/${uniqueId}-${safeFileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    Body: file.buffer,
    ContentType: file.mimetype,

    Metadata: {
      originalname: encodeURIComponent(file.originalname),
    },
  });

  await s3Client.send(command);

  return {
    key: objectKey,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
};

/**
 * Upload several Multer files.
 */
export const uploadFilesToS3 = async (
  files = [],
  folder = "general"
) => {
  return Promise.all(
    files.map((file) => uploadFileToS3(file, folder))
  );
};

/**
 * Generate a temporary URL for a private S3 object.
 */
export const createSignedFileUrl = async (
  objectKey,
  expiresInSeconds = 3600
) => {
  if (!objectKey) {
    return null;
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: expiresInSeconds,
  });
};

/**
 * Delete an object from S3.
 */
export const deleteFileFromS3 = async (objectKey) => {
  if (!objectKey) {
    return;
  }

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  await s3Client.send(command);
};