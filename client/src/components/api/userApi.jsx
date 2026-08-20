const api = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
import { getAuthHeaders } from "./authHelper";
export const getMeApi = async () => {
  const response = await fetch(`${api}/users/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};
export const getUserDetails = async (userId) => {
  const response = await fetch(`${api}/users/${userId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const user = await response.json();
  return user;
};
export const createUserDetails = async (userDetails) => {
  const response = await fetch(`${api}/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDetails),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};
export const getUserByEmail = async (email) => {
  const response = await fetch(`${api}/users/byEmail/${email}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const user = await response.json();
  return user;
};
export const resetUserPassword = async (userDetails) => {
  const response = await fetch(`${api}/users/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDetails),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};
export const getAllUsers = async () => {
  const response = await fetch(`${api}/users/get`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const users = await response.json();
  return users;
};
export const updateUser = async (id, userData) => {
  const response = await fetch(`${api}/users/update/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};
export const deleteUser = async (id) => {
  const response = await fetch(`${api}/users/delete/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};
export const verifyAuth = async () => {
  const response = await fetch(`${api}/users/auth`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};
export const loginUser = async (credentials) => {
  const response = await fetch(`${api}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};
