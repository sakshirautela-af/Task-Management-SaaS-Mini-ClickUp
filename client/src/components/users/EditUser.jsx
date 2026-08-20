import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCamera,
  faLock,
  faEye,
  faEyeSlash,
  faChevronDown,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { getUserDetails, updateUser } from "../api/userApi";
import { Role } from "../../enums";
import "./EditUser.css";
export default function EditUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: Role.USER,
    password: "",
    confirmPassword: "",
    emailVerified: "Verified",
    theme: "Light",
    notifications: "Email",
    image: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let activeUser;
    if (storedUser) {
      try {
        activeUser = JSON.parse(storedUser);
        setCurrentUser(activeUser);
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
    const passedUser = location.state?.user;
    const targetUserId =
      passedUser?.id || location.state?.userId || activeUser?.id;
    if (targetUserId) {
      setUserId(targetUserId);
      fetchUserData(targetUserId, passedUser);
    } else {
      setLoading(false);
    }
  }, [location]);
  const fetchUserData = async (id, fallbackUser) => {
    try {
      setLoading(true);
      const res = await getUserDetails(id);
      const uData = res?.data || res?.user || res || fallbackUser;
      if (uData) {
        setFormData({
          firstName: uData.firstName || "",
          lastName: uData.lastName || "",
          email: uData.email || "",
          phone: uData.phone || "",
          role: uData.role || Role.USER,
          password: "",
          confirmPassword: "",
          emailVerified: uData.isVerified ? "Verified" : "Unverified",
          theme: localStorage.getItem("theme") === "dark" ? "Dark" : "Light",
          notifications: "Email",
          image: uData.image || null,
        });
      }
    } catch (err) {
      console.error("Failed to load user for edit:", err);
      if (fallbackUser) {
        setFormData((prev) => ({
          ...prev,
          firstName: fallbackUser.firstName || "",
          lastName: fallbackUser.lastName || "",
          email: fallbackUser.email || "",
          phone: fallbackUser.phone || "",
          role: fallbackUser.role || Role.USER,
          image: fallbackUser.image || null,
        }));
      }
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMsg("First Name and Last Name are required.");
      return;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        image: formData.image,
      };
      if (formData.password) {
        payload.password = formData.password;
      }
      const res = await updateUser(userId, payload);
      if (res.ok || res.data) {
        setSuccessMsg("User updated successfully!");
        if (currentUser && currentUser.id === userId) {
          const updated = {
            ...currentUser,
            ...payload,
            image: res.data?.data?.image || res.data?.image || payload.image,
          };
          localStorage.setItem("user", JSON.stringify(updated));
        }
        if (formData.theme) {
          const themeMode = formData.theme.toLowerCase();
          localStorage.setItem("theme", themeMode);
          document.documentElement.setAttribute("theme", themeMode);
        }
        setTimeout(() => {
          navigate(-1);
        }, 600);
      } else {
        setErrorMsg(res.data?.message || "Failed to update user.");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setErrorMsg(err.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };
  const initial = (formData.firstName || "U").charAt(0).toUpperCase();
  return (
    <div className="edit-user-page">
      <button className="btn-back-users" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>Back to Settings</span>
      </button>
      <div className="edit-user-header-row">
        <h1 className="edit-user-main-title">Edit User & Settings</h1>
      </div>
      {errorMsg && <div className="edit-user-alert error">{errorMsg}</div>}
      {successMsg && (
        <div className="edit-user-alert success">{successMsg}</div>
      )}
      <form onSubmit={handleSave} className="edit-user-form">
        <div className="edit-user-main-card">
          <div className="edit-avatar-col">
            <span className="avatar-section-label">Profile Image</span>
            <div className="avatar-upload-circle-box">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Profile"
                  className="avatar-upload-preview-img"
                />
              ) : (
                <div className="avatar-upload-preview-placeholder">
                  {initial}
                </div>
              )}
              <label
                htmlFor="user-image-file-input"
                className="btn-avatar-camera-overlay"
                title="Change Avatar"
              >
                <FontAwesomeIcon icon={faCamera} />
                <input
                  type="file"
                  id="user-image-file-input"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <span className="avatar-upload-hint">JPG, PNG up to 2MB</span>
          </div>
          <div className="edit-inputs-grid-col">
            <div className="form-input-box">
              <label className="input-field-label">
                First Name <span className="req-red">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="form-control-input"
                required
              />
            </div>
            <div className="form-input-box">
              <label className="input-field-label">
                Last Name <span className="req-red">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="form-control-input"
                required
              />
            </div>
            <div className="form-input-box">
              <label className="input-field-label">
                Email <span className="req-red">*</span>
              </label>
              <div className="input-with-right-icon">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="form-control-input"
                  readOnly
                />
                <FontAwesomeIcon icon={faLock} className="inner-lock-icon" />
              </div>
            </div>
            <div className="form-input-box">
              <label className="input-field-label">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="form-control-input"
              />
            </div>
            {/* <div className="form-input-box">
              <label className="input-field-label">
                Role <span className="req-red">*</span>
              </label>
              <div className="select-with-arrow">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-control-select"
                >
                  <option value={Role.ADMIN}>{Role.ADMIN}</option>
                  <option value={Role.USER}>{Role.USER}</option>
                  <option value={Role.SUPERADMIN}>{Role.SUPERADMIN}</option>
                </select>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="select-chevron-icon"
                />
              </div>
            </div> */}
            <div className="form-input-box">
              <label className="input-field-label">Password</label>
              <div className="input-with-right-icon">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  className="form-control-input"
                />
                <button
                  type="button"
                  className="btn-toggle-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <div className="form-input-box">
              <label className="input-field-label">Confirm Password</label>
              <div className="input-with-right-icon">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  className="form-control-input"
                />
                <button
                  type="button"
                  className="btn-toggle-eye"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                  />
                </button>
              </div>
            </div>
            {/* <div className="form-input-box">
              <label className="input-field-label">Email Verified</label>
              <div className="select-with-arrow">
                <select
                  name="emailVerified"
                  value={formData.emailVerified}
                  onChange={handleChange}
                  className="form-control-select"
                >
                  <option value="Verified">Verified</option>
                  <option value="Unverified">Unverified</option>
                </select>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="select-chevron-icon"
                />
              </div>
            </div> */}
          </div>
        </div>
        <div className="edit-preferences-card">
          <div className="pref-title-row">
            <div className="title-icon-circle bg-purple-light">
              <FontAwesomeIcon icon={faUsers} className="text-purple" />
            </div>
            <h3 className="pref-card-title">User Preferences</h3>
          </div>
          <div className="pref-inputs-row">
            <div className="form-input-box">
              <label className="input-field-label">Theme</label>
              <div className="select-with-arrow">
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="form-control-select"
                >
                  <option value="Light">Light</option>
                  <option value="Dark">Dark</option>
                </select>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="select-chevron-icon"
                />
              </div>
            </div>
            {/* <div className="form-input-box">
              <label className="input-field-label">Notifications</label>
              <div className="select-with-arrow">
                <select
                  name="notifications"
                  value={formData.notifications}
                  onChange={handleChange}
                  className="form-control-select"
                >
                  <option value="Email">Email</option>
                  <option value="In-App">In-App</option>
                  <option value="Disabled">Disabled</option>
                </select>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="select-chevron-icon"
                />
              </div>
            </div> */}
          </div>
        </div>
        <div className="edit-user-bottom-actions-row">
          <button
            type="button"
            className="btn-cancel-action"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button type="submit" className="btn-save-action" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
