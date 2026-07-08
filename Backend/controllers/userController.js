//This file contains the user controller functions for the expense tracker applications.

import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import otpStore from "../utils/otpStore.js";
import generateOtp from "../utils/generateOtp.js";
import { sendOtpEmail } from "../utils/mailer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const removeImageFile = async (imagePath) => {
  if (!imagePath || imagePath.startsWith("http")) return;

  const normalizedPath = imagePath.replace(/^\/+/, "");
  const fullPath = path.resolve(__dirname, "..", normalizedPath);

  try {
    await fs.unlink(fullPath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.warn("Could not delete old profile image:", err.message);
    }
  }
};

// ================= SEND OTP (REGISTER) =================
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = generateOtp();

    // ✅ store OTP with expiry (5 min)
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.log("🔥 OTP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// ================= VERIFY OTP (REGISTER) =================
export const verifyOtpAndRegister = async (req, res) => {
  try {
    const { email, otp, username, password } = req.body;

    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP expired" });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    otpStore.delete(email);

    res.json({
      message: "User registered successfully",
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password or email" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
     
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= PROFILE =================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= DELETE PROFILE =================
export const deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ message: "Profile deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// ================= FORGOT PASSWORD ====================

// ================= SEND OTP (FORGOT PASSWORD) =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();

    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent for password reset" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP expired" });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    otpStore.delete(email);

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//================= UPLOAD PROFILE PIC =================
export const uploadProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image file",
      });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const previousImage = user.profilePic;
    const imagePath = `/uploads/${req.file.filename}`;

    if (previousImage && previousImage !== imagePath) {
      await removeImageFile(previousImage);
    }

    user.profilePic = imagePath;
    await user.save();

    res.json({
      success: true,
      image: imagePath,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const removeProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.profilePic) {
      await removeImageFile(user.profilePic);
    }

    user.profilePic = "";
    await user.save();

    res.json({
      success: true,
      message: "Profile photo removed",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};