import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const formatUser = (user) => {
  if (!user) return user;
  let imageStr = null;
  if (user.image) {
    if (user.image instanceof Uint8Array || Buffer.isBuffer(user.image)) {
      imageStr = Buffer.from(user.image).toString("utf-8");
    } else if (typeof user.image === "string") {
      imageStr = user.image;
    }
  }
  return {
    ...user,
    image: imageStr,
  };
};

export const createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.users.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || "USER",
      image: data.image ? Buffer.from(data.image, "utf-8") : null,
      isVerified: true,
    },
  });
  delete user.password;
  return formatUser(user);
};

export const getUserByEmail = async (email) => {
  return await prisma.users.findFirst({
    where: {
      email: email,
    },
  });
};

export const getUser = async () => {
  const users = await prisma.users.findMany({
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      isActive: true,
      isVerified: true,
      preference: true,
    },
  });
  return users.map(formatUser);
};

export const getUserByID = async (id) => {
  if (!id || isNaN(Number(id))) return null;
  const user = await prisma.users.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      isActive: true,
      isVerified: true,
      preference: true,
    },
  });
  return formatUser(user);
};

export const getMe = async (userId) => {
  if (!userId || isNaN(Number(userId))) return null;
  const user = await prisma.users.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      isActive: true,
      isVerified: true,
      preference: true,
      _count: {
        select: {
          assignedProjects: true,
          createdProjects: true,
          assignedTasks: true,
          createdTasks: true,
          notifications: true,
        },
      },
    },
  });
  return formatUser(user);
};

export const updateUser = async (id, data) => {
  const updateData = {};
  if (data.email !== undefined) updateData.email = data.email;
  if (data.password !== undefined)
    updateData.password = await bcrypt.hash(data.password, 10);
  if (data.firstName !== undefined) updateData.firstName = data.firstName;
  if (data.lastName !== undefined) updateData.lastName = data.lastName;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.image !== undefined) {
    if (data.image === null || data.image === "") {
      updateData.image = null;
    } else if (typeof data.image === "string") {
      updateData.image = Buffer.from(data.image, "utf-8");
    } else if (
      Buffer.isBuffer(data.image) ||
      data.image instanceof Uint8Array
    ) {
      updateData.image = data.image;
    }
  }
  const user = await prisma.users.update({
    where: {
      id: Number(id),
    },
    data: updateData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      isActive: true,
      isVerified: true,
    },
  });
  return formatUser(user);
};

export const deleteUserByID = async (id) => {
  return await prisma.users.delete({
    where: {
      id: Number(id),
    },
  });
};

export const getProjectsByUser = async (id) => {
  return await prisma.projects.findMany({
    where: {
      assignId: Number(id),
    },
  });
};

export const getForgetPassOtp = async (email) => {
  const a = await prisma.forgetpassOtp.findFirst({
    where: {
      email: email,
    },
  });
  return a;
};

export const getSignupOtp = async (email) => {
  const a = await prisma.signupOtp.findFirst({
    where: {
      email: email,
    },
  });
  return a;
};

export const deleteSignupOtp = async (email) => {
  const a = await prisma.signupOtp.delete({
    where: {
      email: email,
    },
  });
  return a;
};

export const deleteForgetPassOtp = async (email) => {
  const a = await prisma.forgetpassOtp.delete({
    where: {
      email: email,
    },
  });
  return a;
};

export const processResetPassword = async (email, newPassword) => {
  const a = await prisma.users.update({
    where: {
      email: email,
    },
    data: {
      password: await bcrypt.hash(newPassword, 10),
    },
  });
  delete a.password;
  return a;
};

export const authenticateUser = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user) return { error: "User not found", status: 404 };
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { error: "user is unauthorized", status: 401 };
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "default_secret_key",
    { expiresIn: "7d" },
  );
  delete user.password;
  return { user: formatUser(user), token };
};
