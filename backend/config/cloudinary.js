import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Only load .env file in development (Render uses environment variables from dashboard)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Verify Cloudinary credentials are available
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("⚠️  Cloudinary credentials missing!");
  console.error("   Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
  console.error("   Please set these in Render dashboard under Environment Variables");
} else {
  console.log("✅ Cloudinary credentials found");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;
