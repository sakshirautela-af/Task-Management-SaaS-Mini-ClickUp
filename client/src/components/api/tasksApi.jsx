const api = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
import { getAuthHeaders } from "./authHelper";
export const getAllTasks = async (projectId) => {
  const url = projectId
    ? `${api}/tasks/get?projectId=${projectId}`
    : `${api}/tasks/get`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const tasks = await response.json();
  return tasks;
};
export const filterTasksByUser = async (userId, projectId, filters = {}) => {
  const { search, priority, status } = filters;
  const params = new URLSearchParams();
  if (userId) params.append("userId", userId);
  if (projectId) params.append("projectId", projectId);
  if (search) params.append("search", search);
  if (priority) params.append("priority", priority);
  if (status) params.append("status", status);
  const url = `${api}/tasks/filterByUser?${params.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const tasks = await response.json();
  return tasks;
};
export const createTasks = async (tasksData) => {
  const response = await fetch(`${api}/tasks/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(tasksData),
  });
  const task = await response.json();
  return task;
};
export const updateTasks = async (id, taskData) => {
  const response = await fetch(`${api}/tasks/update/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });
  const task = await response.json();
  return task;
};
export const deleteTasks = async (id) => {
  const response = await fetch(`${api}/tasks/delete/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const result = await response.json();
  return result;
};
export const getTasksById = async (id) => {
  const response = await fetch(`${api}/tasks/get/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const task = await response.json();
  return task;
};
export const filterTasksApi = async ({
  userId,
  tab,
  projectId,
  search,
  priority,
  status,
  page = 1,
  limit = 10,
  sortBy,
  sortOrder,
} = {}) => {
  const params = new URLSearchParams();
  if (userId) params.append("userId", userId);
  if (tab) params.append("tab", tab);
  if (projectId) params.append("projectId", projectId);
  if (search && search.trim()) params.append("search", search.trim());
  if (priority && priority !== "ALL") params.append("priority", priority);
  if (status && status !== "ALL") params.append("status", status);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);
  const url = `${api}/tasks/filter?${params.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  return data;
};
export const filterTasks = async (projectId, filters = {}) => {
  return await filterTasksApi({ projectId, ...filters });
};
export const getTasksByProject = async (projectId) => {
  const response = await fetch(`${api}/tasks/byproject/${projectId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const tasks = await response.json();
  return tasks;
};
export const getPaginationData = async (page, limit) => {
  const response = await fetch(`${api}/tasks/page/${page}/${limit}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  return data;
};
