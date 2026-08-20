import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPen,
  faTrash,
  faEnvelope,
  faPhone,
  faCalendarAlt,
  faShieldHalved,
  faUser,
  faGear,
  faUsers,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { getUserDetails, deleteUser } from "../api/userApi";
import { getAllProject } from "../api/projectApi";
import { getAllTasks } from "../api/tasksApi";
import { Role } from "../../enums";
import "./UserView.css";

export default function UserView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let activeUser = null;
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
      fetchUserData(targetUserId, passedUser);
    } else {
      setErrorMsg("No user selected or logged in.");
      setLoading(false);
    }
    fetchWorkspaceData();
  }, [location]);

  const fetchUserData = async (id, fallbackUser) => {
    try {
      setLoading(true);
      const res = await getUserDetails(id);
      const uData = res?.data || res?.user || res || fallbackUser;
      setUser(uData);
    } catch (err) {
      console.error("Failed to load user details:", err);
      if (fallbackUser) {
        setUser(fallbackUser);
      } else {
        setErrorMsg("Failed to load user information.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkspaceData = async () => {
    try {
      const [projRes, taskRes] = await Promise.allSettled([
        getAllProject(),
        getAllTasks(),
      ]);
      if (projRes.status === "fulfilled") {
        setProjects(projRes.value?.data || projRes.value || []);
      }
      if (taskRes.status === "fulfilled") {
        setTasks(taskRes.value?.data || taskRes.value || []);
      }
    } catch (err) {
      console.error("Failed to load workspace stats:", err);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    if (
      window.confirm(
        `Are you sure you want to delete the user "${user.firstName || ""} ${user.lastName || ""}"?`,
      )
    ) {
      try {
        await deleteUser(user.id);
        if (currentUser && currentUser.id === user.id) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/signin");
        } else {
          navigate("/team");
        }
      } catch (err) {
        console.error("Failed to delete user:", err);
        alert("Failed to delete user.");
      }
    }
  };

  const stats = useMemo(() => {
    if (!user) return { created: 0, assigned: 0, tasks: 0 };
    const created = projects.filter((p) => p.createdBy === user.id).length;
    const assigned = projects.filter((p) => p.assignId === user.id).length;
    const tasksAssigned = tasks.filter(
      (t) => t.assignedTo === user.id || t.assignId === user.id,
    ).length;
    return {
      created,
      assigned,
      tasks: tasksAssigned,
    };
  }, [user, projects, tasks]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="user-view-loading-screen">
        <div className="spinner"></div>
        <p>Loading user details...</p>
      </div>
    );
  }

  if (errorMsg || !user) {
    return (
      <div className="user-view-page">
        <div className="user-view-error">
          <p>{errorMsg || "User not found."}</p>
          <button className="btn-back-link" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.email ||
    "User";
  const initial = (user.firstName || user.email || "U").charAt(0).toUpperCase();
  const isSettingsRoute = location.pathname.includes("settings");

  return (
    <div className="user-view-page">
      <button
        className="btn-back-users"
        onClick={() => (isSettingsRoute ? navigate("/") : navigate(-1))}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>{isSettingsRoute ? "Dashboard" : "Back"}</span>
      </button>

      <div className="user-view-header-row">
        <h1 className="user-view-main-title">
          {isSettingsRoute ? "Settings & User Details" : "User Details"}
        </h1>
        <div className="user-view-actions-group">
          <button
            className="btn-edit-user-action"
            onClick={() => navigate("/edit-user", { state: { user } })}
          >
            <FontAwesomeIcon icon={faPen} />
            <span>Edit User</span>
          </button>
          {(currentUser?.role === Role.ADMIN ||
            currentUser?.role === Role.SUPERADMIN ||
            currentUser?.id === user.id) && (
            <button
              className="btn-delete-user-action"
              onClick={handleDeleteUser}
            >
              <FontAwesomeIcon icon={faTrash} />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      <div className="user-profile-summary-card">
        <div className="summary-left-col">
          <div className="user-avatar-online-wrap">
            {user.image ? (
              <img
                src={user.image}
                alt={fullName}
                className="user-summary-avatar-img"
              />
            ) : (
              <div className="user-summary-avatar-placeholder">{initial}</div>
            )}
            <span className="online-indicator-dot"></span>
          </div>

          <div className="user-info-text-block">
            <div className="name-role-row">
              <h2 className="user-display-name">{fullName}</h2>
              <span className="user-role-badge">{user.role || Role.USER}</span>
            </div>
            <div className="user-meta-lines">
              <div className="meta-line-item">
                <FontAwesomeIcon icon={faEnvelope} className="meta-icon" />
                <span>{user.email || "-"}</span>
              </div>
              <div className="meta-line-item">
                <FontAwesomeIcon icon={faPhone} className="meta-icon" />
                <span>{user.phone || "-"}</span>
              </div>
              <div className="meta-line-item">
                <FontAwesomeIcon icon={faCalendarAlt} className="meta-icon" />
                <span>Joined on {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-mid-col">
          <div className="prop-row">
            <span className="prop-label">Role</span>
            <span className="prop-val-bold">{user.role || Role.USER}</span>
          </div>
          <div className="prop-row">
            <span className="prop-label">Status</span>
            <span className="pill-badge pill-green">
              {user.isActive !== false ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="prop-row">
            <span className="prop-label">Email Verified</span>
            <span className="pill-badge pill-green">
              {user.isVerified ? "Verified" : "Unverified"}
            </span>
          </div>
          <div className="prop-row">
            <span className="prop-label">Phone</span>
            <span className="pill-badge pill-green">
              {user.phone ? "Provided" : "Not Provided"}
            </span>
          </div>
        </div>

        <div className="summary-right-col">
          <div className="prop-row">
            <span className="prop-label">Created At</span>
            <span className="prop-val-text">
              {formatDateTime(user.createdAt)}
            </span>
          </div>
          <div className="prop-row">
            <span className="prop-label">Last Updated</span>
            <span className="prop-val-text">
              {formatDateTime(user.updatedAt)}
            </span>
          </div>
          <div className="prop-row">
            <span className="prop-label">Last Active</span>
            <span className="prop-val-text">
              {formatDateTime(user.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="user-details-two-col-grid">
        <div className="user-section-card">
          <div className="section-card-title-row">
            <div className="title-icon-circle bg-purple-light">
              <FontAwesomeIcon icon={faUser} className="text-purple" />
            </div>
            <h3 className="section-card-title">Personal Information</h3>
          </div>
          <div className="section-card-body-rows">
            <div className="info-kv-row">
              <span className="info-key">First Name</span>
              <span className="info-val">{user.firstName || "-"}</span>
            </div>
            <div className="info-kv-row">
              <span className="info-key">Last Name</span>
              <span className="info-val">{user.lastName || "-"}</span>
            </div>
            <div className="info-kv-row">
              <span className="info-key">Phone</span>
              <span className="info-val">{user.phone || "-"}</span>
            </div>
            <div className="info-kv-row">
              <span className="info-key">Profile Image</span>
              <span className="info-val">
                {user.image ? "Uploaded Avatar" : "No image uploaded"}
              </span>
            </div>
          </div>
        </div>

        <div className="user-section-card">
          <div className="section-card-title-row">
            <div className="title-icon-circle bg-purple-light">
              <FontAwesomeIcon icon={faGear} className="text-purple" />
            </div>
            <h3 className="section-card-title">Preferences</h3>
          </div>
          <div className="section-card-body-rows">
            <div className="info-kv-row">
              <span className="info-key">Theme</span>
              <span className="info-val">
                {localStorage.getItem("theme") === "dark" ? "Dark" : "Light"}
              </span>
            </div>
            <div className="info-kv-row">
              <span className="info-key">Notifications</span>
              <span className="info-val">Email</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
