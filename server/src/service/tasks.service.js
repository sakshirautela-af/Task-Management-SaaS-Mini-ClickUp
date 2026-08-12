import prisma from "../config/prisma.js";

export const createTask = async (data) => {
  const dueDate = data.dueDate ? new Date(data.dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return await prisma.tasks.create({
    data: {
      name: data.name,
      description: data.description || "",
      dueDate: dueDate,
      priority: data.priority || "NORMAL",
      status: data.status || "PENDING",
      projectId: Number(data.projectId)
    }
  });
};

export const getAllTasks = async (projectId) => {
  const where = projectId ? { projectId: Number(projectId) } : {};
  return await prisma.tasks.findMany({
    where,
    orderBy: {
      id: "desc"
    }
  });
};

export const getTaskById = async (id) => {
  return await prisma.tasks.findUnique({
    where: {
      id: Number(id)
    }
  });
};

export const getTaskByUser = async (id) => {
  return await prisma.tasks.findMany({
    where: {
      assignedTo: Number(id)
    }
  });
};

export const updateTask = async (id, data) => {
  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.projectId !== undefined) updateData.projectId = Number(data.projectId);

  return await prisma.tasks.update({
    where: {
      id: Number(id)
    },
    data: updateData
  });
};

export const deleteTask = async (id) => {
  return await prisma.tasks.delete({
    where: {
      id: Number(id)
    }
  });
};
