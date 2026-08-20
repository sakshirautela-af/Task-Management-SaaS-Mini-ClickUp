import * as notificationService from "../service/notifications.service.js";
export const createNotification = async (
  req,
  userId,
  fromUserId,
  notification,
) => {
  try {
    const data = await notificationService.createNotification({
      userId,
      fromUserId,
      notification,
    });
    const io = req.app.get("io");
    if (io) {
      io.to(`user:${data.userId}`).emit("notification:new", data);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteNotificationByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Notification ID is required" });
    }
    const data = await notificationService.deleteNotificationByID(id);
    res
      .status(200)
      .json({ message: "Notification deleted successfully", data });
  } catch (error) {
    next(error);
  }
};
export const deleteAllNotifications = async (req, res, next) => {
  try {
    const { userId } = req.query || req.body || {};
    const data = await notificationService.deleteAllNotifications(userId);
    res
      .status(200)
      .json({ message: "All notifications deleted successfully", data });
  } catch (error) {
    next(error);
  }
};
export const getAllNotifications = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const { search, isRead, fromUserId } = req.query || {};
    const data = await notificationService.getAllNotifications(userId, {
      search,
      isRead,
      fromUserId,
    });
    res
      .status(200)
      .json({ message: "Notifications fetched successfully", data });
  } catch (error) {
    next(error);
  }
};
export const filterNotifications = async (req, res, next) => {
  try {
    const { userId, search, isRead, fromUserId, page, limit } = req.query || {};
    const data = await notificationService.filterNotifications({
      userId,
      search,
      isRead,
      fromUserId,
      page,
      limit,
    });
    res
      .status(200)
      .json({ message: "Filtered notifications fetched successfully", data });
  } catch (error) {
    next(error);
  }
};
export const getNotificationsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Notification ID is required" });
    }
    const data = await notificationService.getNotificationsById(id);
    res
      .status(200)
      .json({ message: "Notification fetched successfully", data });
  } catch (error) {
    next(error);
  }
};
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Notification ID is required" });
    }
    const data = await notificationService.markNotificationAsRead(id);
    res
      .status(200)
      .json({ message: "Notification marked as read successfully", data });
  } catch (error) {
    next(error);
  }
};
