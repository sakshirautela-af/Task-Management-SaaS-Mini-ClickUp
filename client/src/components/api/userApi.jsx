const api = import.meta.env.VITE_API_URL
import { getAuthHeaders } from './authHelper';

export const getUserDetails = async (userId) => {
  const response = await fetch(`${api}/users/${userId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  const user = await response.json()
  return user
}

export const createUserDetails = async (userDetails) => {
  const response = await fetch(`${api}/users/create`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userDetails)
  })
  const data = await response.json()
  return { ok: response.ok, data }
}
export const sendMail = async (email) => {
  const response = await fetch(`${api}/util/signup-otp`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  })
  const data = await response.json()
  return { ok: response.ok, data }
}

export const resetUserPassword = async (userDetails) => {
  const response = await fetch(`${api}/users/reset-password`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userDetails)
  })
  const data = await response.json()
  return { ok: response.ok, data }
}
export const sendForgetPassMail = async (email) => {
  const response = await fetch(`${api}/util/forgetpass-otp`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  })
  const data = await response.json()
  return { ok: response.ok, data }
}
export const loginUser = async (credentials) => {
  const response = await fetch(`${api}/users/login`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  })
  const data = await response.json()
  return { ok: response.ok, data }
}