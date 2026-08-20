import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faCheckDouble,
  faKey,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { resetUserPassword } from "../api/userApi";
import { sendForgetPassMail } from "../api/othersApi";
import "./Forgetpass.css";
export default function Forgetpass() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState(false);
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }
    try {
      setLoading(true);
      const res = await sendForgetPassMail(email.trim());
      if (res.ok) {
        setSentOtp(true);
        setSuccessMsg("Verification OTP has been sent to your email.");
      } else {
        setErrorMsg(res.data?.message || "Invalid or unregistered email.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("An error occurred while sending reset OTP.");
    } finally {
      setLoading(false);
    }
  };
  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!otp.trim() || !password || !repassword) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    if (password !== repassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      const res = await resetUserPassword({
        email: email.trim(),
        otp: otp.trim(),
        password,
      });
      if (res.ok) {
        setSuccessMsg("Password reset successfully! Redirecting to sign in...");
        setTimeout(() => {
          navigate("/signin");
        }, 1200);
      } else {
        setErrorMsg(res.data?.message || "Failed to reset password. Please check your OTP.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-header">
          <div className="auth-brand-icon">
            <FontAwesomeIcon icon={faCheckDouble} />
          </div>
          <span className="auth-brand-name">MiniClickUp</span>
        </div>
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">
          {!sentOtp
            ? "Enter your email address and we'll send you an OTP to reset your password."
            : "Enter the OTP sent to your email along with your new password."}
        </p>
        {errorMsg && <div className="auth-alert error">{errorMsg}</div>}
        {successMsg && <div className="auth-alert success">{successMsg}</div>}
        {!sentOtp ? (
          <form className="auth-form" onSubmit={handleSendOtp}>
            <div className="auth-input-group">
              <label className="auth-label">Registered Email</label>
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
            <button className="auth-btn" type="submit" disabled={loading}>
              <span>{loading ? "Sending OTP..." : "Send Reset Code"}</span>
              {!loading && <FontAwesomeIcon icon={faArrowRight} />}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSetNewPassword}>
            <div className="auth-input-group">
              <div className="auth-label-row">
                <label className="auth-label">Verification OTP</label>
                <button
                  type="button"
                  className="auth-forgot-link"
                  onClick={handleSendOtp}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  Resend OTP
                </button>
              </div>
              <div className="auth-input-wrapper">
                <FontAwesomeIcon icon={faKey} className="auth-field-icon" />
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Enter 6-digit OTP code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="auth-input-group">
              <label className="auth-label">New Password</label>
              <div className="auth-input-wrapper">
                <FontAwesomeIcon icon={faLock} className="auth-field-icon" />
                <input
                  className="auth-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
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
            <div className="auth-input-group">
              <label className="auth-label">Confirm New Password</label>
              <div className="auth-input-wrapper">
                <FontAwesomeIcon icon={faLock} className="auth-field-icon" />
                <input
                  className="auth-input"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={repassword}
                  onChange={(e) => setRepassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-toggle-pwd-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>
              <span>{loading ? "Updating Password..." : "Set New Password"}</span>
              {!loading && <FontAwesomeIcon icon={faArrowRight} />}
            </button>
          </form>
        )}
        <div className="auth-footer-links">
          <p className="auth-switch-text">
            Remember your password?{" "}
            <Link to="/signin" className="auth-highlight-link">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}