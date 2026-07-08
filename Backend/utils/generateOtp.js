//This file contains the utility function to generate a random OTP for the expense tracker application.

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default generateOtp;