const api = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const createProject = async (projectData) => {
  const response = await fetch(`${api}/projects/create`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(projectData)
  });
  const project = await response.json();
  return project;
};

export const getAllProject = async () => {
  const response = await fetch(`${api}/projects/get`, {
    method: 'GET'
  });
  const projects = await response.json();
  return projects;
};

export const deleteProject = async (id) => {
  const response = await fetch(`${api}/projects/${id}`, {
    method: 'DELETE'
  });
  return await response.json();
};