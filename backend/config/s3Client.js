import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";

const requiredEnvironmentVariables = [
  "AWS_REGION",
  "AWS_S3_BUCKET_NAME",
];

for (const variableName of requiredEnvironmentVariables) {
  if (!process.env[variableName]) {
    throw new Error(
      `Missing required environment variable: ${variableName}`
    );
  }
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

export default s3Client;
