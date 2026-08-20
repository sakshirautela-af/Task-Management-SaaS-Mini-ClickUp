import prisma from "../config/prisma.js";
import { TaskStatus, TaskPriority } from "../enum/index.js";
import { formatTaskWithImages } from "../utils/imageHelper.js";

const mapTaskStatus = (status) => {
  if (!status || status === "ALL") return undefined;
  const s = String(status).toUpperCase();
  if (s === "INPROGRESS" || s === "IN_PROGRESS") return TaskStatus.INPROGRESS;
  if (s === "PENDING" || s === "TODO" || s === "HOLD" || s === "ONHOLD") return TaskStatus.PENDING;
  if (s === "COMPLETED") return TaskStatus.COMPLETED;
  if (s === "CANCELLED") return TaskStatus.CANCELLED;
  if (s === "FAILED") return TaskStatus.FAILED;
  return undefined;
};

const mapTaskPriority = (priority) => {
  if (!priority || priority === "ALL") return undefined;
  const p = String(priority).toUpperCase();
  if (p === "HIGH") return TaskPriority.HIGH;
  if (p === "LOW") return TaskPriority.LOW;
  if (p === "NORMAL") return TaskPriority.NORMAL;
  return undefined;
};

export const createTask = async (data) => {
  const startDate = data.startDate ? new Date(data.startDate) : new Date();
  const endDate = data.endDate
    ? new Date(data.endDate)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const task = await prisma.tasks.create({
    data: {
      name: data.name,
      description: data.description || "",
      startDate: startDate,
      endDate: endDate,
      priority: data.priority ? mapTaskPriority(data.priority) || TaskPriority.NORMAL : TaskPriority.NORMAL,
      status: data.status ? mapTaskStatus(data.status) || TaskStatus.PENDING : TaskStatus.PENDING,
      projectId: Number(data.projectId),
      assignedBy: data.assignedBy ? Number(data.assignedBy) : undefined,
      assignedTo: data.assignedTo ? Number(data.assignedTo) : undefined,
    },
    include: {
      project: true,
      assignee: true,
      assigner: true,
    },
  });
  return formatTaskWithImages(task);
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
  const mappedPriority = mapTaskPriority(priority);
  if (mappedPriority) where.priority = mappedPriority;
  const mappedStatus = mapTaskStatus(status);
  if (mappedStatus) where.status = mappedStatus;

  const tasks = await prisma.tasks.findMany({
    where,
    orderBy: {
      id: "desc",
    },
    include: {
      project: true,
      assignee: true,
      assigner: true,
    },
  });
  return tasks.map(formatTaskWithImages);
};

export const filterTasks = async (projectId, search, priority, status) => {
  const where = {};
  if (projectId) where.projectId = Number(projectId);
  if (search) where.name = { contains: search };
  const mappedPriority = mapTaskPriority(priority);
  if (mappedPriority) where.priority = mappedPriority;
  const mappedStatus = mapTaskStatus(status);
  if (mappedStatus) where.status = mappedStatus;

  const tasks = await prisma.tasks.findMany({
    where,
    orderBy: {
      id: "desc",
    },
    include: {
      project: true,
      assignee: true,
      assigner: true,
    },
  });
  return tasks.map(formatTaskWithImages);
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
  const mappedPriority = mapTaskPriority(priority);
  if (mappedPriority) where.priority = mappedPriority;
  const mappedStatus = mapTaskStatus(status);
  if (mappedStatus) where.status = mappedStatus;

  const tasks = await prisma.tasks.findMany({
    where,
    orderBy: {
      id: "desc",
    },
    include: {
      project: true,
      assignee: true,
      assigner: true,
    },
  });
  return tasks.map(formatTaskWithImages);
};

export const filterTasksPaginated = async ({
  userId,
  tab = "all",
  projectId,
  search,
  priority,
  status,
  page = 1,
  limit = 10,
  sortBy = "date",
  sortOrder = "desc",
} = {}) => {
  const where = {};
  if (projectId) {
    where.projectId = Number(projectId);
  }
  if (tab === "my" && userId) {
    const uid = Number(userId);
    where.OR = [
      { assignedTo: uid },
      { assignedBy: uid },
    ];
  }
  const mappedPriority = mapTaskPriority(priority);
  if (mappedPriority) {
    where.priority = mappedPriority;
  }
  const mappedStatus = mapTaskStatus(status);
  if (mappedStatus) {
    where.status = mappedStatus;
  }
  if (search && search.trim()) {
    const searchConditions = [
      { name: { contains: search.trim() } },
      { description: { contains: search.trim() } },
    ];
    if (where.OR) {
      where.AND = [{ OR: where.OR }, { OR: searchConditions }];
      delete where.OR;
    } else {
      where.OR = searchConditions;
    }
  }

  // Determine orderBy (support date, name, priority, status, etc.)
  let orderBy = { id: "desc" };
  const direction = String(sortOrder).toLowerCase() === "asc" ? "asc" : "desc";
  const sortKey = String(sortBy).toLowerCase();

  if (sortKey === "name" || sortKey === "title") {
    orderBy = { name: direction };
  } else if (sortKey === "startdate" || sortKey === "start_date") {
    orderBy = { startDate: direction };
  } else if (sortKey === "enddate" || sortKey === "end_date" || sortKey === "duedate") {
    orderBy = { endDate: direction };
  } else if (sortKey === "updatedat" || sortKey === "updated_at") {
    orderBy = { updatedAt: direction };
  } else if (sortKey === "date" || sortKey === "createdat" || sortKey === "created_at" || sortKey === "id") {
    orderBy = { createdAt: direction };
  } else if (sortKey === "priority") {
    orderBy = { priority: direction };
  } else if (sortKey === "status") {
    orderBy = { status: direction };
  }

  const take = limit ? Number(limit) : 10;
  const skip = page ? (Number(page) - 1) * take : 0;
  const [tasks, totalCount, allTasksForMetrics] = await Promise.all([
    prisma.tasks.findMany({
      where,
      take,
      skip,
      orderBy,
      include: {
        project: {
          select: { id: true, name: true },
        },
        assignee: {
          select: { id: true, firstName: true, lastName: true, email: true, image: true },
        },
        assigner: {
          select: { id: true, firstName: true, lastName: true, email: true, image: true },
        },
      },
    }),
    prisma.tasks.count({ where }),
    prisma.tasks.findMany({
      where: projectId ? { projectId: Number(projectId) } : {},
      select: { id: true, status: true, priority: true, assignedTo: true, assignedBy: true },
    }),
  ]);
  const metrics = {
    total: allTasksForMetrics.length,
    inProgress: allTasksForMetrics.filter(
      (t) => t.status === TaskStatus.INPROGRESS
    ).length,
    pending: allTasksForMetrics.filter(
      (t) => t.status === TaskStatus.PENDING
    ).length,
    completed: allTasksForMetrics.filter((t) => t.status === TaskStatus.COMPLETED).length,
    highPriority: allTasksForMetrics.filter((t) => t.priority === TaskPriority.HIGH).length,
  };
  return {
    tasks: tasks.map(formatTaskWithImages),
    totalCount,
    totalPages: Math.ceil(totalCount / take) || 1,
    currentPage: Number(page),
    limit: take,
    metrics,
  };
};

export const updateTask = async (id, data) => {
  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.startDate !== undefined)
    updateData.startDate = new Date(data.startDate);
  if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
  if (data.priority !== undefined) {
    const mappedPri = mapTaskPriority(data.priority);
    if (mappedPri) updateData.priority = mappedPri;
  }
  if (data.status !== undefined) {
    const mappedSt = mapTaskStatus(data.status);
    if (mappedSt) updateData.status = mappedSt;
  }
  if (data.projectId !== undefined)
    updateData.projectId = Number(data.projectId);
  if (data.assignedTo !== undefined)
    updateData.assignedTo = data.assignedTo
      ? Number(data.assignedTo)
      : null;
  if (data.assignedBy !== undefined)
    updateData.assignedBy = data.assignedBy
      ? Number(data.assignedBy)
      : null;

  const task = await prisma.tasks.update({
    where: { id: Number(id) },
    data: updateData,
    include: {
      project: true,
      assignee: true,
      assigner: true,
    },
  });
  return formatTaskWithImages(task);
};

export const deleteTask = async (id) => {
  return await prisma.tasks.delete({
    where: { id: Number(id) },
  });
};

export const getTaskById = async (id) => {
  const task = await prisma.tasks.findUnique({
    where: { id: Number(id) },
    include: {
      project: true,
      assignee: true,
      assigner: true,
    },
  });
  return formatTaskWithImages(task);
};
