const api = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
export const sendMail = async (email) => {
  const response = await fetch(`${api}/util/signup-otp`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });
  const data = await response.json();
  return { ok: response.ok, data };
};
export const sendForgetPassMail = async (email) => {
  const response = await fetch(`${api}/util/forgetpass-otp`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });
  const data = await response.json();
  return { ok: response.ok, data };
};
