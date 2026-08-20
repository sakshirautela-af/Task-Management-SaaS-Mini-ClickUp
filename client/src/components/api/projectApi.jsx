const api = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
import { getAuthHeaders } from './authHelper';
export const createProject = async (projectData) => {
  const response = await fetch(`${api}/projects/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(projectData)
  });
  const project = await response.json();
  return project;
};
export const getAllProject = async () => {
  const response = await fetch(`${api}/projects/get`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  const projects = await response.json();
  return projects;
};
export const filterProjectsApi = async ({
  userId,
  tab,
  status,
  search,
  page = 1,
  limit = 10,
  sortBy,
  sortOrder,
} = {}) => {
  const params = new URLSearchParams();
  if (userId) params.append("userId", userId);
  if (tab) params.append("tab", tab);
  if (status && status !== "ALL") params.append("status", status);
  if (search && search.trim()) params.append("search", search.trim());
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);
  const response = await fetch(`${api}/projects/filter?${params.toString()}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  return data;
};
export const getDashboardStats = async (userId) => {
  const response = await fetch(`${api}/projects/stats/${userId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return await response.json();
};
export const deleteProject = async (id) => {
  const response = await fetch(`${api}/projects/delete/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return await response.json();
};
export const updateProject = async (id, projectData) => {
  const response = await fetch(`${api}/projects/update/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(projectData)
  });
  return await response.json();
};
export const findProjectByUser = async (userId) => {
  const response = await fetch(`${api}/projects/user/${userId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return await response.json();
};
export const getProjectById = async (id) => {
  const response = await fetch(`${api}/projects/get/${id}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return await response.json();
};