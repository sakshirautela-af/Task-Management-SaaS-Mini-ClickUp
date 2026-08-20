import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faCheckDouble,
  faKey,
  faArrowRight,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { createUserDetails } from "../api/userApi";
import { sendMail } from "../api/othersApi";
import "./SignUp.css";
export default function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const sendEmail = async () => {
    if (!email.trim()) {
      setErrorMsg("Please enter an email address first.");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    try {
      setSendingOtp(true);
      const email_res = await sendMail(email.trim());
      if (!email_res.ok) {
        setErrorMsg(email_res.data?.message || "Failed to send OTP.");
        return;
      }
      setOtpSent(true);
      setSuccessMsg(
        "Verification OTP has been sent to your email. (please check spam folder also incase not found)",
      );
    } catch (error) {
      console.error(error);
      setErrorMsg("An error occurred while sending OTP.");
    } finally {
      setSendingOtp(false);
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    if (password !== repassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (!otpSent) {
      setErrorMsg("Please click 'Verify' to verify your email first.");
      return;
    }
    if (!otp.trim()) {
      setErrorMsg("Please enter the verification OTP sent to your email.");
      return;
    }
    const newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
      otp: otp.trim(),
    };
    try {
      setLoading(true);
      const res = await createUserDetails(newUser);
      if (!res.ok) {
        setErrorMsg(res.data?.message || "Failed to create account.");
        return;
      }
      setSuccessMsg("Account created successfully! Redirecting to sign in...");
      setTimeout(() => {
        navigate("/signin");
      }, 1200);
    } catch (error) {
      console.error(error);
      setErrorMsg("An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-card signup-card">
        <div className="auth-logo-header">
          <div className="auth-brand-icon">
            <FontAwesomeIcon icon={faCheckDouble} />
          </div>
          <span className="auth-brand-name">MiniClickUp</span>
        </div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">
          Join your workspace and start managing projects today.
        </p>
        {errorMsg && <div className="auth-alert error">{errorMsg}</div>}
        {successMsg && <div className="auth-alert success">{successMsg}</div>}
        <form className="auth-form" onSubmit={handleSignUp}>
          <div className="auth-name-row">
            <div className="auth-input-group">
              <label className="auth-label">First Name</label>
              <div className="auth-input-wrapper">
                <FontAwesomeIcon icon={faUser} className="auth-field-icon" />
                <input
                  className="auth-input"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="auth-input-group">
              <label className="auth-label">Last Name</label>
              <div className="auth-input-wrapper">
                <FontAwesomeIcon icon={faUser} className="auth-field-icon" />
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-label">Work Email</label>
            <div className="auth-verify-row">
              <div className="auth-input-wrapper">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="auth-field-icon"
                />
                <input
                  className="auth-input"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="button"
                className="btn-verify-action"
                onClick={sendEmail}
                disabled={sendingOtp || !email.trim()}
              >
                {sendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Verify"}
              </button>
            </div>
          </div>
          {otpSent && (
            <div className="auth-input-group">
              <label className="auth-label">Verification OTP</label>
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
          )}
          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <FontAwesomeIcon icon={faLock} className="auth-field-icon" />
              <input
                className="auth-input"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
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
            <label className="auth-label">Confirm Password</label>
            <div className="auth-input-wrapper">
              <FontAwesomeIcon icon={faLock} className="auth-field-icon" />
              <input
                className="auth-input"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
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
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            {!loading && <FontAwesomeIcon icon={faArrowRight} />}
          </button>
        </form>
        <div className="auth-footer-links">
          <p className="auth-switch-text">
            Already have an account?{" "}
            <Link to="/signin" className="auth-highlight-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
