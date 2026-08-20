import { prisma } from "../config/prisma.js";
export const createNotification = async (data) => {
  return await prisma.notifications.create({
    data: {
      userId: Number(data.userId),
      from: Number(data.fromUserId),
      notification: data.notification,
      isRead: false,
    },
  });
};
export const deleteNotificationByID = async (id) => {
  return await prisma.notifications.delete({
    where: {
      id: Number(id),
    },
  });
};
export const deleteAllNotifications = async (userId) => {
  const where = userId ? { userId: Number(userId) } : {};
  return await prisma.notifications.deleteMany({ where });
};
export const getAllNotifications = async (userId, filters = {}) => {
  const where = {
    userId: Number(userId),
  };
  if (filters.isRead !== undefined && filters.isRead !== null && filters.isRead !== "") {
    where.isRead = filters.isRead === "true" || filters.isRead === true;
  }
  if (filters.search && filters.search.trim()) {
    where.notification = {
      contains: filters.search.trim(),
    };
  }
  if (filters.fromUserId) {
    where.from = Number(filters.fromUserId);
  }
  return await prisma.notifications.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });
};
export const filterNotifications = async ({
  userId,
  search,
  isRead,
  fromUserId,
  page,
  limit,
}) => {
  const where = {};
  if (userId) {
    where.userId = Number(userId);
  }
  if (fromUserId) {
    where.from = Number(fromUserId);
  }
  if (isRead !== undefined && isRead !== null && isRead !== "") {
    where.isRead = isRead === "true" || isRead === true;
  }
  if (search && search.trim()) {
    where.notification = {
      contains: search.trim(),
    };
  }
  const take = limit ? Number(limit) : undefined;
  const skip = page && limit ? (Number(page) - 1) * Number(limit) : undefined;
  const [notifications, total] = await Promise.all([
    prisma.notifications.findMany({
      where,
      take,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.notifications.count({ where }),
  ]);
  return {
    notifications,
    total,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : total,
  };
};
export const getNotificationsById = async (id) => {
  return await prisma.notifications.findUnique({
    where: {
      id: Number(id),
    },
  });
};
export const markNotificationAsRead = async (id) => {
  return await prisma.notifications.update({
    where: {
      id: Number(id),
    },
    data: {
      isRead: true,
    },
  });
};
