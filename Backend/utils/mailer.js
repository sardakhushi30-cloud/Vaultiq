//This file contains the utility function to send OTP email for the expense tracker application

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Function to send OTP email

export const sendOtpEmail=async(email,otp)=>{
    const transporter=nodemailer.createTransport({
      service:"gmail",
      auth: {
        user: process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD,
      },
    });
     

await transporter.verify({
  from: process.env.EMAIL,
  to:email,
  subject:"OTP Verification for EXpense Tracker",
  text:`Your OTP is ${otp}`,
});
};