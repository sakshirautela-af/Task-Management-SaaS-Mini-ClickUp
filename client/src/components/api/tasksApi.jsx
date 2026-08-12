const api = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const getAllTasks = async (projectId) => {
  const url = projectId ? `${api}/tasks/get?projectId=${projectId}` : `${api}/tasks/get`;
  const response = await fetch(url, {
    method: 'GET'
  });
  const tasks = await response.json();
  return tasks;
};

export const createTasks = async (tasksData) => {
  const response = await fetch(`${api}/tasks/create`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(tasksData)
  });
  const task = await response.json();
  return task;
};

export const updateTasks = async (id, taskData) => {
  const response = await fetch(`${api}/tasks/update/${id}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(taskData)
  });
  const task = await response.json();
  return task;
};

export const deleteTasks = async (id) => {
  const response = await fetch(`${api}/tasks/delete/${id}`, {
    method: 'DELETE'
  });
  const result = await response.json();
  return result;
};

export const getTasksById = async (id) => {
  const response = await fetch(`${api}/tasks/get/${id}`, {
    method: 'GET'
  });
  const task = await response.json();
  return task;
};