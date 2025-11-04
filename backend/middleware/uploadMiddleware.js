import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// For images
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "discover-adama-city/images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    resource_type: "image",
  },
});

// For videos
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "discover-adama-city/videos",
    allowed_formats: ["mp4", "mov", "avi", "mkv"],
    resource_type: "video",
  },
});

const upload = multer({
  storage: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, videoStorage);
    } else {
      cb(null, imageStorage);
    }
  },
});

export default upload;
