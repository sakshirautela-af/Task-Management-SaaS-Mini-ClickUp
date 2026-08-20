import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faCheckDouble,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { loginUser } from "../api/userApi";
import "./SignIn.css";
export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim() || !password) {
      setErrorMsg("Please enter both your email address and password.");
      return;
    }
    try {
      setLoading(true);
      const res = await loginUser({ email: email.trim(), password });
      if (res.ok) {
        if (res.data?.data) {
          localStorage.setItem("user", JSON.stringify(res.data.data));
        }
        if (res.data?.token) {
          localStorage.setItem("token", res.data.token);
        }
        navigate("/dashboard");
      } else {
        setErrorMsg(
          res.data?.message || "Invalid credentials. Please try again.",
        );
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setErrorMsg("An error occurred during sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-header">
          <span className="auth-brand-name">MiniClickUp</span>
        </div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Enter your credentials .</p>
        {errorMsg && <div className="auth-alert error">{errorMsg}</div>}
        <form className="auth-form" onSubmit={handleSignIn}>
          <div className="auth-input-group">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrapper">
              <FontAwesomeIcon icon={faEnvelope} className="auth-field-icon" />
              <input
                className="auth-input"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="auth-input-group">
            <div className="auth-label-row">
              <label className="auth-label">Password</label>
              <Link to="/forgetpass" className="auth-forgot-link">
                Forgot password?
              </Link>
            </div>
            <div className="auth-input-wrapper">
              <FontAwesomeIcon icon={faLock} className="auth-field-icon" />
              <input
                className="auth-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-toggle-pwd-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>
            <span>{loading ? "Signing in..." : "Sign In"}</span>
            {!loading && <FontAwesomeIcon icon={faArrowRight} />}
          </button>
        </form>
        <div className="auth-footer-links">
          <p className="auth-switch-text">
            Don't have an account?{" "}
            <Link to="/signup" className="auth-highlight-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
