import { prisma } from "../config/prisma.js";

export const createUser = async (data) => {
  return await prisma.users.create({
    data: {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone
    }
  });
};
export const getUserByEmail=async(email,pass) => {
  return await prisma.users.findUnique({
    where:{
      email:email
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

