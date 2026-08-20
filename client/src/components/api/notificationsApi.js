import { getAuthHeaders } from "./authHelper";
const api = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
export const getAllNotifications = async (userId) => {
  const targetId = userId || "all";
  const response = await fetch(`${api}/notifications/user/${targetId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  return data;
};
export const filterNotificationsApi = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.isRead !== undefined) params.append("isRead", filters.isRead);
  if (filters.fromUserId) params.append("fromUserId", filters.fromUserId);
  if (filters.userId) params.append("userId", filters.userId);
  const response = await fetch(`${api}/notifications/filter?${params.toString()}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  return data;
};
export const markNotificationAsReadApi = async (id) => {
  const response = await fetch(`${api}/notifications/read/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  return data;
};
export const getNotificationsById = async (id) => {
  const response = await fetch(`${api}/notifications/get/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  return data;
};
export const deleteNotificationByID = async (id) => {
  const response = await fetch(`${api}/notifications/delete/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  return data;
};
export const deleteAllNotifications = async () => {
  const response = await fetch(`${api}/notifications/delete-all`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  return data;
};
export const createNotification = async (notification) => {
  const response = await fetch(`${api}/notifications/create`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notification),
  });
  const data = await response.json();
  return data;
};
