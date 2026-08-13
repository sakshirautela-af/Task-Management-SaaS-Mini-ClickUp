import prisma from "../config/prisma.js";

export const createProject = async (data) => {
  return await prisma.projects.create({
    data: {
      name: data.name,
      description: data.description || "",
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      status: "TODO",
      createdBy: Number(data.userId),
      updatedBy: Number(data.userId),
      assignId: data.assignId ? Number(data.assignId) : undefined,
    },
    include: {
      creator: true,
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

export const getProjectCreatedByUser = async (id) => {
  return await prisma.projects.groupBy({
    orderBy: {
      id: "desc",
    },
    where: {
      createdBy: Number(id),
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

export const getAllProjectCount = async (id) => {
  return await prisma.projects.findMany({
    include:{
      _count:{
        isActive:true
      }
    }
  });
};



export const updateProject = async (id, projectData) => {
  const updateData = {};
  if (projectData.name !== undefined) updateData.name = projectData.name;
  if (projectData.description !== undefined)
    updateData.description = projectData.description;
  if (projectData.startDate !== undefined)
    updateData.startDate = new Date(projectData.startDate);
  if (projectData.status !== undefined) updateData.status = projectData.status;
  if (projectData.updatedBy !== undefined)
    updateData.updatedBy = Number(projectData.updatedBy);
  if (projectData.assignId !== undefined)
    updateData.assignId = Number(projectData.assignId);
  if (projectData.isActive !== undefined) updateData.isActive = projectData.isActive;

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

export const getDashboardStats = async (userId) => {
  const uid = Number(userId);

  const totalProjects = await prisma.projects.count({
    where: { 
      OR: [
        { assignId: uid },
        { createdBy: uid }
      ]
    }
  });

  const totalTasks = await prisma.tasks.count({
    where: { 
      project: { 
        OR: [
          { assignId: uid },
          { createdBy: uid }
        ]
      } 
    }
  });

  const completedTasks = await prisma.tasks.count({
    where: { 
      status: 'COMPLETED',
      project: { 
        OR: [
          { assignId: uid },
          { createdBy: uid }
        ]
      }
    },
  });

  const pendingTasks = await prisma.tasks.count({
    where: { 
      status: 'PENDING',
      project: { 
        OR: [
          { assignId: uid },
          { createdBy: uid }
        ]
      }
    },
  });

  return {
    totalProjects,
    totalTasks,
    completedTasks,
    pendingTasks,
  };
};
