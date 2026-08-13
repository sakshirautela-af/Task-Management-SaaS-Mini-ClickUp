import { useState, useEffect } from "react"
import { loginUser } from '../api/userApi'
import { useNavigate } from "react-router-dom"
import "./SignIn.css"
export default function SignIn() {
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
                if (res.data?.token) {
                    localStorage.setItem("token", res.data.token);
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
    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                {errorMsg && <p className="error-message">{errorMsg}</p>}
                <form className="auth-form" onSubmit={handleSignIn}>
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Email Address"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="auth-btn" type="submit">Sign In</button>
                </form>
                <a href="/signup" className="auth-link">Don't have an account? <span>Sign Up</span></a>
            </div>
        </div>
    );
}