import { useState } from "react";
import { loginUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";

export const useSignInHook = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    try {
      const res = await loginUser({ email, password });

      if (res.ok) {
        if (res.data?.data) {
          localStorage.setItem(
            "user",
            JSON.stringify(res.data.data)
          );
        }

        navigate("/");
      } else {
        setErrorMsg(
          res.data?.message || "Invalid credentials."
        );
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("An error occurred during sign in.");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errorMsg,
    setErrorMsg,
    handleSignIn,
  };
};