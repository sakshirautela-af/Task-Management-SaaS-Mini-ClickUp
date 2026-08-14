import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOtp } from "./other.service.js";

export const createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user= await prisma.users.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      isVerified:true
    }
  });
  delete user.password;
  return user;
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
  if (data.password !== undefined) updateData.password = await bcrypt.hash(data.password);
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



export const getProjectsByUser = async (id) => {
  return await prisma.projects.findMany({
    where: {
      assignId: Number(id)
    }
  });
};

export const getForgetPassOtp=async(email)=>{
  const a= await prisma.forgetpassOtp.findFirst({
    where:{
      email:email
    }
  })
  return a;
}
export const getSignupOtp=async(email)=>{
  const a= await prisma.signupOtp.findFirst({
    where:{
      email:email
    }
  })
  return a;
}
export const  processResetPassword=async(email,newPassword)=>{
    const a=await prisma.users.update({
      where:{
        email:email
      },
      data:{
        password:await bcrypt.hash(newPassword,10)
      }
    })
    delete a.password
    return a;
}


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
