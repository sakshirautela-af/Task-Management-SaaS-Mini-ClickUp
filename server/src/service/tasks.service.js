import prisma from "../config/prisma.js";

export const createTask = async (data) => {
  const startDate = data.startDate ? new Date(data.startDate) : new Date();
  const endDate = data.endDate
    ? new Date(data.endDate)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return await prisma.tasks.create({
    data: {
      name: data.name,
      description: data.description || "",
      startDate: startDate,
      endDate: endDate,
      priority: data.priority,
      status: data.status,
      projectId: Number(data.projectId),
      assignedBy: data.assignedBy ? Number(data.assignedBy) : undefined,
      assignedTo: data.assignedTo ? Number(data.assignedTo) : undefined,
    },
    include: {
      project: true,
    },
  });
};
export const getAllTaskCount = async (id) => {
  return await prisma.tasks.findMany({
    include: {
      _count: {
        isActive: true,
      },
    },
  });
};

export const getAllTasks = async (filters = {}) => {
  const { projectId, search, priority, status } = filters;
  const where = {};

  if (projectId) where.projectId = Number(projectId);
  if (search) where.name = { contains: search };
  if (priority) where.priority = priority;
  if (status) where.status = status;

  return await prisma.tasks.findMany({
    where,
    orderBy: {
      id: "desc",
    },
  });
};

export const filterTasks = async (projectId, search, priority, status) => {
  const where = {};
  if (projectId) where.projectId = Number(projectId);
  if (search) where.name = { contains: search };
  if (priority) where.priority = priority;
  if (status) where.status = status;

  return await prisma.tasks.findMany({
    where,
    orderBy: {
      id: "desc",
    },
  });
};

export const filterTasksByUser = async (
  userId,
  projectId,
  search,
  priority,
  status,
) => {
  const where = {};
  if (userId) where.assignedTo = Number(userId);
  if (projectId) where.projectId = Number(projectId);
  if (search) where.name = { contains: search };
  if (priority) where.priority = priority;
  if (status) where.status = status;

  return await prisma.tasks.findMany({
    where,
    orderBy: {
      id: "desc",
    },
  });
};
export const getAllTaskbyProjectId = async (projectId) => {
  const r = await prisma.tasks.findMany({
    where: {
      projectId: Number(projectId),
    },
  });
  return r;
};

export const getPaginationData = async (page, limit) => {
  const offset = (page - 1) * limit;
  const res = await prisma.tasks.findMany({
    skip: offset,
    take: Number(limit),
  });
  return res;
};

export const getTaskById = async (id) => {
  return await prisma.tasks.findUnique({
    where: {
      id: Number(id),
    },
  });
};

export const getTaskByUser = async (id, filters = {}) => {
  const { search, priority, status } = filters;
  const where = { assignedTo: Number(id) };

  if (search) where.name = { contains: search };
  if (priority) where.priority = priority;
  if (status) where.status = status;

  return await prisma.tasks.findMany({
    where,
    orderBy: {
      id: "desc",
    },
  });
};

export const updateTask = async (id, data) => {
  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.startDate !== undefined)
    updateData.startDate = new Date(data.startDate);
  if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.projectId !== undefined)
    updateData.projectId = Number(data.projectId);
  if (data.assignedBy !== undefined)
    updateData.assignedBy = Number(data.assignedBy);
  if (data.assignedTo !== undefined)
    updateData.assignedTo = Number(data.assignedTo);

  return await prisma.tasks.update({
    where: {
      id: Number(id),
    },
    data: updateData,
  });
};

export const deleteTask = async (id) => {
  return await prisma.tasks.delete({
    where: {
      id: Number(id),
    },
  });
};
