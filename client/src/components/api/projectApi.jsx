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

export const getDashboardStats = async (userId) => {
  const response = await fetch(`${api}/projects/stats/${userId}`, {
    method: 'GET',
    
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