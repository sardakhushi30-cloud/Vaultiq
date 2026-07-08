//This file contains the upload middleware for the expense tracker application.

import fs from "fs";
import multer from "multer";
import path from "path";

const uploadDir = path.resolve("uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ================= STORAGE CONFIG =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

// ================= FILE FILTER =================
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const isValid =
    allowedTypes.test(ext) && mime.startsWith("image/");

  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// ================= FINAL UPLOAD EXPORT =================
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10* 1024 * 1024, // 10MB limit
  },
});