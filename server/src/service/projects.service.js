import prisma from "../config/prisma.js";
import { ProjectStatus } from "../enum/index.js";
import { formatProjectWithImages } from "../utils/imageHelper.js";

const mapProjectStatus = (status) => {
  if (!status || status === "ALL") return undefined;
  const s = String(status).toUpperCase();
  if (s === "INPROGRESS" || s === "IN_PROGRESS") return ProjectStatus.INPROGRESS;
  if (s === "TODO" || s === "HOLD" || s === "ONHOLD" || s === "PENDING") return ProjectStatus.TODO;
  if (s === "COMPLETED") return ProjectStatus.COMPLETED;
  if (s === "CANCELLED") return ProjectStatus.CANCELLED;
  return undefined;
};

export const createProject = async (data) => {
  const project = await prisma.projects.create({
    data: {
      name: data.name,
      description: data.description || "",
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      endDate: data.endDate ? new Date(data.endDate) : null,
      status: data.status ? mapProjectStatus(data.status) || ProjectStatus.TODO : ProjectStatus.TODO,
      createdBy: Number(data.userId),
      updatedBy: Number(data.userId),
      assignId: data.assignId ? Number(data.assignId) : undefined,
    },
    include: {
      creator: true,
    },
  });
  return formatProjectWithImages(project);
};

export const getAllProjects = async () => {
  const projects = await prisma.projects.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      creator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
        },
      },
      assignTo: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
        },
      },
      tasks: {
        include: {
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });
  return projects.map(formatProjectWithImages);
};

export const filterProjects = async ({
  userId,
  tab = "all",
  status,
  search,
  page = 1,
  limit = 10,
  sortBy = "date",
  sortOrder = "desc",
}) => {
  const where = {};
  if (tab === "my" && userId) {
    const uid = Number(userId);
    where.OR = [{ createdBy: uid }, { assignId: uid }];
  }
  const mappedStatus = mapProjectStatus(status);
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
  } else if (sortKey === "status") {
    orderBy = { status: direction };
  }

  const take = limit ? Number(limit) : 10;
  const skip = page ? (Number(page) - 1) * take : 0;
  const [projects, totalCount, allProjectsForMetrics] = await Promise.all([
    prisma.projects.findMany({
      where,
      take,
      skip,
      orderBy,
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true, image: true },
        },
        assignTo: {
          select: { id: true, firstName: true, lastName: true, email: true, image: true },
        },
        tasks: {
          select: { id: true, status: true },
        },
      },
    }),
    prisma.projects.count({ where }),
    prisma.projects.findMany({
      select: { id: true, status: true, createdBy: true, assignId: true },
    }),
  ]);
  const metrics = {
    total: allProjectsForMetrics.length,
    inProgress: allProjectsForMetrics.filter(
      (p) => p.status === ProjectStatus.INPROGRESS
    ).length,
    todo: allProjectsForMetrics.filter((p) => p.status === ProjectStatus.TODO).length,
    completed: allProjectsForMetrics.filter((p) => p.status === ProjectStatus.COMPLETED).length,
    cancelled: allProjectsForMetrics.filter((p) => p.status === ProjectStatus.CANCELLED).length,
  };
  return {
    projects: projects.map(formatProjectWithImages),
    totalCount,
    totalPages: Math.ceil(totalCount / take) || 1,
    currentPage: Number(page),
    limit: take,
    metrics,
  };
};

export const filterProjectByUser = async (userId) => {
  const projects = await prisma.projects.findMany({
    where: {
      createdBy: Number(userId),
    },
    orderBy: {
      id: "desc",
    },
    include: {
      creator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
        },
      },
      assignTo: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
        },
      },
      tasks: {
        include: {
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });
  return projects.map(formatProjectWithImages);
};

export const getProjectByName = async (name) => {
  return await prisma.projects.findFirst({
    where: {
      name: name,
    },
  });
};

export const getProjectById = async (id) => {
  const project = await prisma.projects.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      creator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
        },
      },
      updater: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
        },
      },
      assignTo: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
        },
      },
      tasks: {
        include: {
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              image: true,
            },
          },
        },
      },
      files: true,
    },
  });
  return formatProjectWithImages(project);
};

export const getAllProjectCount = async (id) => {
  return await prisma.projects.findMany({
    include: {
      _count: {
        isActive: true,
      },
    },
  });
};

export const updateProject = async (id, projectData) => {
  const updateData = {};
  if (projectData.name !== undefined) updateData.name = projectData.name;
  if (projectData.description !== undefined)
    updateData.description = projectData.description;
  if (projectData.startDate !== undefined)
    updateData.startDate = new Date(projectData.startDate);
  if (projectData.endDate !== undefined)
    updateData.endDate = projectData.endDate
      ? new Date(projectData.endDate)
      : null;
  if (projectData.status !== undefined) {
    const mappedSt = mapProjectStatus(projectData.status);
    if (mappedSt) updateData.status = mappedSt;
  }
  if (projectData.updatedBy !== undefined)
    updateData.updatedBy = Number(projectData.updatedBy);
  if (projectData.assignId !== undefined)
    updateData.assignId = projectData.assignId
      ? Number(projectData.assignId)
      : null;
  if (projectData.isActive !== undefined)
    updateData.isActive = projectData.isActive;
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
      OR: [{ assignId: uid }, { createdBy: uid }],
    },
  });
  const totalTasks = await prisma.tasks.count({
    where: {
      project: {
        OR: [{ assignId: uid }, { createdBy: uid }],
      },
    },
  });
  const completedTasks = await prisma.tasks.count({
    where: {
      status: "COMPLETED",
      project: {
        OR: [{ assignId: uid }, { createdBy: uid }],
      },
    },
  });
  const pendingTasks = await prisma.tasks.count({
    where: {
      status: "PENDING",
      project: {
        OR: [{ assignId: uid }, { createdBy: uid }],
      },
    },
  });
  return {
    totalProjects,
    totalTasks,
    completedTasks,
    pendingTasks,
  };
};
