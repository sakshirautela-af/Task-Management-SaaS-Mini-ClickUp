const api = import.meta.env.VITE_API_URL
export const getUserDetails = async (userId) => {
  const response = await fetch(`${api}/users/${userId}`, {
    method: 'GET'
  })
  const user = await response.json()
  return user
}

export const createUserDetails = async (userData) => {
  const response = await fetch(`${api}/users/create`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  })
  const user = await response.json()
  return user
}