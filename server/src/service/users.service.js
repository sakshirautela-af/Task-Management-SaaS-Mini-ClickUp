import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOtp } from "./other.service.js";
import { sendOtpEmail } from "../config/emailconfig.js";

export const createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await prisma.users.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
    }
  });
};
export const getUserByEmail = async (email) => {
  return await prisma.users.findFirst({
    where: {
      email: email
    }
  });
}
export const getUser = async () => {
  return await prisma.users.findMany({
    orderBy: {
      id: "desc"
    }
  });
};
export const getUserByID = async (id) => {
  return await prisma.users.findUnique({
    where: {
      id: Number(id)
    }
  });
};

export const updateUser = async (id, data) => {
  const updateData = {};
  if (data.email !== undefined) updateData.email = data.email;
  if (data.password !== undefined) updateData.password = data.password;
  if (data.firstName !== undefined) updateData.firstName = data.firstName;
  if (data.lastName !== undefined) updateData.lastName = data.lastName;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  return await prisma.users.update({
    where: {
      id: Number(id)
    },
    data: updateData
  });
};

export const deleteUserByID = async (id) => {
  return await prisma.users.delete({
    where: {
      id: Number(id)
    }
  });
};

export const saveUserOtp = async (id, otp, otpExpiry) => {
  return await prisma.users.update({
    where: { id: Number(id) },
    data: { otp, otpExpiry }
  });
};

export const clearUserOtp = async (id) => {
  return await prisma.users.update({
    where: { id: Number(id) },
    data: { otp: null, otpExpiry: null }
  });
};

export const verifyUserEmail = async (id) => {
  return await prisma.users.update({
    where: { id: Number(id) },
    data: { isVerified: true }
  });
};

export const updateUserPassword = async (id, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await prisma.users.update({
    where: { id: Number(id) },
    data: { password: hashedPassword }
  });
};

export const getProjectsByUser = async (id) => {
  return await prisma.projects.findMany({
    where: {
      assignId: Number(id)
    }
  });
};

export const initiateSignup = async (email) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email is already registered", status: 409 };
  }

  const otp = generateOtp().toString();
  const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.signupOtps.upsert({
    where: { email },
    update: { otp, otpExpiry },
    create: { email, otp, otpExpiry }
  });

  const emailSent = await sendOtpEmail(email, otp);
  if (!emailSent) {
    return { error: "Failed to send OTP email", status: 500 };
  }

  return { success: true };
};

export const registerUser = async (data, otp) => {


  const user = await createUser(data);
  delete user.password;
  return { user };
};

export const authenticateUser = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user) return { error: "User not found", status: 404 };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { error: "user is unauthorized", status: 401 };

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  delete user.password;
  return { user, token };
};

export const processForgotPassword = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) return { error: "User not found", status: 404 };

  const otp = generateOtp().toString();
  const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

  await saveUserOtp(user.id, otp, otpExpiry);
  const emailSent = await sendOtpEmail(email, otp);
  if (!emailSent) return { error: "Failed to send OTP email", status: 500 };

  return { success: true };
};

export const processResetPassword = async (email, otp, newPassword) => {
  const user = await getUserByEmail(email);
  if (!user) return { error: "User not found", status: 404 };
  if (!user.otp || user.otp !== otp) return { error: "Invalid OTP", status: 400 };
  if (new Date() > new Date(user.otpExpiry)) return { error: "OTP has expired", status: 400 };

  await updateUserPassword(user.id, newPassword);
  await clearUserOtp(user.id);
  return { success: true };
};