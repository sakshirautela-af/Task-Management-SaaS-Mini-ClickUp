import prisma from "../config/prisma.js";

export const createProject = async (data) => {
  return await prisma.projects.create({
    data: {
      name: data.name,
      description: data.description || "",
      startDate: data.startDate,
      createdBy: Number(data.userId),
      //   creator:{
      //     connect:{id:Numbe(data.userId)}
      //   }
    },
    include: {
      creator: {
        connect: { id: Numbe(data.userId) },
      },
    },
  });
};

export const getAllProjects = async () => {
  return await prisma.projects.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      tasks: true,
    },
  });
};

export const getProjectByUser = async () => {
  return await prisma.projects.findMany({
    orderBy: {
      id: "desc",
    },
    where: {
      id: Number(id),
    },
  });
};

export const getProjectById = async (id) => {
  return await prisma.projects.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      tasks: true,
    },
  });
};

export const updateProject = async (id, projectData) => {
  const updateData = {};
  if (projectData.name !== undefined) updateData.name = projectData.name;
  if (projectData.description !== undefined)
    updateData.description = projectData.description;
  if (projectData.timeline !== undefined)
    updateData.timeline = new Date(projectData.timeline);

  return await prisma.projects.update({
    where: {
      id: Number(id),
    },
    data: updateData,
  });
};

export const deleteProject = async (id) => {
  return await prisma.projects.delete({
    where: {
      id: Number(id),
    },
  });
};
