//This file contains the user routes for API calling for the expense tracker application.

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

import {
  loginUser,
  getProfile,
  updateProfile,
  deleteProfile,
  sendOtp,
  verifyOtpAndRegister,
  forgotPassword,
  resetPassword,
  uploadProfile,
  removeProfilePicture,
} from "../controllers/userController.js";

const router = express.Router();


// ================= OTP REGISTER =================
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndRegister);


// ================= LOGIN =================
router.post("/login", loginUser);


// ================= FORGOT PASSWORD =================
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


// ================= PROFILE =================
router.get("/profile", protect, getProfile);
router.put("/update", protect, updateProfile);
router.delete("/delete", protect, deleteProfile);

// ================= UPLOAD PROFILE PIC =================
router.put(
    "/upload-profile",
    protect,
    upload.single("profilePic"),
    uploadProfile
);

router.delete("/remove-profile-picture", protect, removeProfilePicture);

export default router;