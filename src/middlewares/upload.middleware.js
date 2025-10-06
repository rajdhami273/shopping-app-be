const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure public/uploads directory exists
const uploadsDir = path.join(__dirname, "../../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Get file extension
    const ext = path.extname(file.originalname);
    // Get filename without extension
    const nameWithoutExt = path.parse(file.originalname).name;
    // Create timestamp
    const timestamp = Date.now();
    // Create new filename: originalname_timestamp.ext
    const newFilename = `${nameWithoutExt}_${timestamp}${ext}`;
    cb(null, newFilename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 5, // Maximum 5 files
  },
  fileFilter: fileFilter,
});

// Middleware for handling multiple file uploads
const uploadMultiple = upload.array("images", 5); // Allow up to 5 images

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File too large. Maximum size is 5MB per file.",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "Too many files. Maximum 5 files allowed.",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "Unexpected field name. Use 'images' for file uploads.",
      });
    }
    return res.status(400).json({
      message: `Upload error: ${err.message}`,
    });
  }
  if (err.message === "Only image files are allowed!") {
    return res.status(400).json({
      message: "Only image files (jpg, jpeg, png, gif, webp) are allowed.",
    });
  }
  next(err);
};

module.exports = {
  uploadMultiple,
  handleUploadError,
};
