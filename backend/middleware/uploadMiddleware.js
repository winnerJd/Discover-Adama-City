import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Custom storage that routes to image or video storage based on file type
class DynamicCloudinaryStorage {
  constructor() {
    this.imageStorage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "discover-adama-city/images",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        resource_type: "image",
      },
    });

    this.videoStorage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "discover-adama-city/videos",
        allowed_formats: ["mp4", "mov", "avi", "mkv"],
        resource_type: "video",
      },
    });
  }

  _handleFile(req, file, cb) {
    if (file.mimetype.startsWith("video/")) {
      return this.videoStorage._handleFile(req, file, cb);
    } else {
      return this.imageStorage._handleFile(req, file, cb);
    }
  }

  _removeFile(req, file, cb) {
    if (file.mimetype && file.mimetype.startsWith("video/")) {
      return this.videoStorage._removeFile(req, file, cb);
    } else {
      return this.imageStorage._removeFile(req, file, cb);
    }
  }
}

const upload = multer({
  storage: new DynamicCloudinaryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept images and videos
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"), false);
    }
  },
});

// Error handling middleware for multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Maximum size is 50MB." });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Too many files. Maximum 5 images and 3 videos." });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  if (err) {
    console.error("Upload error:", err);
    return res.status(400).json({ message: err.message || "File upload failed" });
  }
  next();
};

export default upload;
