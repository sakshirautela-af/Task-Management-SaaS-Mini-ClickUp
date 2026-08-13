const api = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
import { getAuthHeaders } from './authHelper';

export const getAllTasks = async (projectId) => {
  const url = projectId ? `${api}/tasks/get?projectId=${projectId}` : `${api}/tasks/get`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  const tasks = await response.json();
  return tasks;
};

export const createTasks = async (tasksData) => {
  const response = await fetch(`${api}/tasks/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(tasksData)
  });
  const task = await response.json();
  return task;
};

export const updateTasks = async (id, taskData) => {
  const response = await fetch(`${api}/tasks/update/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData)
  });
  const task = await response.json();
  return task;
};

export const deleteTasks = async (id) => {
  const response = await fetch(`${api}/tasks/delete/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const result = await response.json();
  return result;
};

export const getTasksById = async (id) => {
  const response = await fetch(`${api}/tasks/get/${id}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  const task = await response.json();
  return task;
};
export const filterTasks = async (projectId, filters = {}) => {
  const { search, priority, status } = filters;
  const params = new URLSearchParams();
  
  if (projectId) params.append('projectId', projectId);
  if (search) params.append('search', search);
  if (priority) params.append('priority', priority);
  if (status) params.append('status', status);

  const url = `${api}/tasks/filter?${params.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  const tasks = await response.json();
  return tasks;
};
