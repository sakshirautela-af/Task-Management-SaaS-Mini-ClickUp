import prisma from "../config/prisma.js";
export const uploadFile = async (projectId, location) => {
  const res = await prisma.files.create({
    data: {
      projectsId: Number(projectId),
      location: location,
    },
  });
  return res;
};
export const getAllFiles = async () => {
  const res = await prisma.files.findMany({
    where: {},
    orderBy: {
      id: "desc",
    },
  });
  return res;
};
export const getAllFileByProjectId = async (projectId) => {
  const res = await prisma.files.findMany({
    where: {
      projectsId: Number(projectId),
    },
    orderBy: {
      id: "desc",
    },
  });
  return res;
};
export const getFileByFileId = async (id) => {
  const res = await prisma.files.findFirst({
    where: {
      id: Number(id),
    },
  });
  return res;
};

export const updateFile = async (projectId, location) => {
  const res = await prisma.files.update({
    data: {
      projectsId: Number(projectId),
      location: location,
    },
  });
  return res;
};

export const deletFile = async (fileId) => {
  const res = await prisma.files.delete({
    where: {
      id: Number(fileId),
    },
  });
  return res;
};
