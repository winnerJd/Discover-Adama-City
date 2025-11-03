import multer from 'multer';
import path from 'path';
// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, 'uploads/images');
    } else if (file.mimetype.startsWith('video/')) {
      cb(null, 'uploads/videos');
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`
    );
  },
});

// File filter to allow only images and videos
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

// Limits 
const limits = {
  fileSize: 100 * 1024 * 1024, // 100MB max
};
// Multer upload handler
const upload = multer({ storage, fileFilter, limits });

export default upload;
