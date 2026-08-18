import prisma from "../config/prisma.js";
import * as userService from "./users.service.js";
import crypto from "crypto";
import {
  sendSignupOtpEmail,
  sendForgetOtpEmail,
} from "../config/emailconfig.js";
export const generateOtp = () => {
  // return Math.floor(Math.random() * 1000000);
  return crypto.randomInt(100000, 1000000).toString();
};

export const initiateSignup = async (email) => {
  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    return { error: "Email is already registered", status: 409 };
  }
  const a = await prisma.signupOtp.deleteMany({
    where: {
      email: email,
    },
  });
  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

  const b = await prisma.signupOtp.create({
    data: {
      email: email,
      otp: String(otp),
      otpExpiry: otpExpiry,
    },
  });

  const emailSent = await sendSignupOtpEmail(otp, email);
  if (!emailSent) {
    return { error: "Failed to send OTP email", status: 500 };
  }

  return { success: true };
};

export const initiateForgetPassword = async (email) => {
  const existingUser = await userService.getUserByEmail(email);
  if (!existingUser) {
    return { error: "Email is not registered", status: 409 };
  }
  await prisma.forgetpassOtp.deleteMany({
    where: {
      email: email,
    },
  });
  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.forgetpassOtp.create({
    data: {
      email: email,
      otp: String(otp),
      otpExpiry: otpExpiry,
    },
  });

  const emailSent = await sendForgetOtpEmail(otp, email);
  if (!emailSent) {
    return { error: "Failed to send OTP email", status: 500 };
  }

  return { success: true };
};
