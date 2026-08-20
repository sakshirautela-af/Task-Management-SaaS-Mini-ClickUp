import { getAuthHeaders } from "./authHelper";
const api = import.meta.env.VITE_API_URL;
export const uploadFile = async (projectId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(`${api}/files/file-upload/${projectId}`, {
    method: "POST",
    headers,
    body: formData,
  });
  return await response.json();
};
export const getFilesByProject = async (projectId) => {
  const response = await fetch(`${api}/files/file-getByProject/${projectId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return await response.json();
};
export const deleteFile = async (fileId) => {
  const response = await fetch(`${api}/files/file-delete/${fileId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return await response.json();
};
