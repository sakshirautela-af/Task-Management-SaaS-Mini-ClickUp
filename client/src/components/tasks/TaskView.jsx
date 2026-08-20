import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link, useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faFlag,
  faCheckCircle,
  faCompass,
  faClock,
  faTrash,
  faPen,
  faEllipsis,
  faPlus,
  faListCheck,
  faGear,
  faClipboardList,
  faChevronRight,
  faTimes,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { getTasksById, updateTasks, deleteTasks } from "../api/tasksApi";
import { getAllUsers } from "../api/userApi";
import { getAllProject } from "../api/projectApi";
import "./TaskView.css";
export default function TaskView() {
  const location = useLocation();
  const navigate = useNavigate();
  const outletCtx = useOutletContext();
  const openUserProfile = outletCtx?.openUserProfile;
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [allUsers, setAllUsers] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user", e);
      }
    }
    const taskId = location.state?.task?.id;
    if (taskId) {
      fetchTaskDetails(taskId);
    } else if (location.state?.task) {
      setTask(location.state.task);
      setLoading(false);
    } else {
      navigate("/tasks");
    }
    fetchMetadata();
  }, [location, navigate]);
  const fetchTaskDetails = async (id) => {
    try {
      setLoading(true);
      const res = await getTasksById(id);
      const taskData = res.data || res.task || res || location.state?.task;
      setTask(taskData);
    } catch (err) {
      console.error("Failed to load task details:", err);
      if (location.state?.task) {
        setTask(location.state.task);
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchMetadata = async () => {
    try {
      const [usersRes, projRes] = await Promise.allSettled([
        getAllUsers(),
        getAllProject(),
      ]);
      if (usersRes.status === "fulfilled") {
        setAllUsers(usersRes.value?.data || usersRes.value || []);
      }
      if (projRes.status === "fulfilled") {
        setAllProjects(projRes.value?.data || projRes.value || []);
      }
    } catch (err) {
      console.error("Failed to load task metadata:", err);
    }
  };
  const handleDeleteTask = async () => {
    if (window.confirm(`Are you sure you want to delete "${task.name}"?`)) {
      try {
        await deleteTasks(task.id);
        navigate("/tasks");
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };
  const handleAssignUser = async (e) => {
    e.preventDefault();
    if (!selectedAssigneeId) return;
    try {
      await updateTasks(task.id, { assignedTo: Number(selectedAssigneeId) });
      fetchTaskDetails(task.id);
      setShowAssignModal(false);
      setSelectedAssigneeId("");
    } catch (err) {
      console.error("Error updating assignee:", err);
    }
  };
  if (loading && !task) {
    return (
      <div className="task-view-loading-screen">
        <div className="spinner"></div>
        <p>Loading task details...</p>
      </div>
    );
  }
  if (!task) return null;
  const formatStatus = (st) => {
    if (!st) return "In Progress";
    if (st === "INPROGRESS" || st === "IN_PROGRESS") return "In Progress";
    if (st === "PENDING" || st === "TODO") return "Pending";
    if (st === "COMPLETED") return "Completed";
    if (st === "CANCELLED") return "Cancelled";
    return st;
  };
  const getStatusPillClass = (st) => {
    switch (st) {
      case "COMPLETED":
        return "status-pill-completed";
      case "INPROGRESS":
      case "IN_PROGRESS":
        return "status-pill-inprogress";
      case "CANCELLED":
        return "status-pill-cancelled";
      default:
        return "status-pill-pending";
    }
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };
  const parentProject =
    allProjects.find((p) => p.id === task.projectId) ||
    task.project;
  const assigneeUser =
    task.assignee ||
    allUsers.find((u) => u.id === task.assignedTo);
  const assignerUser =
    task.assigner ||
    allUsers.find((u) => u.id === task.assignedBy);
  const teamCollaborators = [];
  if (assigneeUser) {
    teamCollaborators.push({
      id: assigneeUser.id,
      name: `${assigneeUser.firstName} (Assignee)`,
      image: assigneeUser.image || null,
      initial: (assigneeUser.firstName || "A").charAt(0).toUpperCase(),
      isCurrent: currentUser && assigneeUser.id === currentUser.id,
    });
  }
  if (assignerUser && assignerUser.id !== assigneeUser?.id) {
    teamCollaborators.push({
      id: assignerUser.id,
      name: `${assignerUser.firstName} (Assigner)`,
      image: assignerUser.image || null,
      initial: (assignerUser.firstName || "A").charAt(0).toUpperCase(),
      isCurrent: currentUser && assignerUser.id === currentUser.id,
    });
  }

  return (
    <div className="task-details-view">
      <nav className="task-breadcrumb">
        <Link to="/tasks" className="breadcrumb-link">
          Tasks
        </Link>
        <span className="breadcrumb-separator">
          <FontAwesomeIcon icon={faChevronRight} />
        </span>
        <span className="breadcrumb-item">{task.name}</span>
        <span className="breadcrumb-separator">
          <FontAwesomeIcon icon={faChevronRight} />
        </span>
        <span className="breadcrumb-current">Details</span>
      </nav>
      <div className="task-header-card">
        <div className="header-card-left">
          <div className="task-avatar-box">
            <FontAwesomeIcon icon={faListCheck} />
          </div>
          <div className="task-title-meta">
            <div className="title-row">
              <h1 className="task-name">{task.name}</h1>
              <span className={`status-pill ${getStatusPillClass(task.status)}`}>
                {formatStatus(task.status)}
              </span>
              <span className={`priority-pill priority-${task.priority?.toLowerCase() || "high"}`}>
                {task.priority || "HIGH"} PRIORITY
              </span>
            </div>
            <p className="task-tagline">
              {task.description || "Task Workspace"}
            </p>
            <div className="meta-stats-row">
              <div className="meta-item">
                <FontAwesomeIcon icon={faCalendarAlt} className="meta-icon" />
                <div className="meta-info">
                  <span className="meta-label">Start Date</span>
                  <span className="meta-val">{formatDate(task.startDate)}</span>
                </div>
              </div>
              <div className="meta-item">
                <FontAwesomeIcon icon={faCalendarAlt} className="meta-icon" />
                <div className="meta-info">
                  <span className="meta-label">Due Date</span>
                  <span className="meta-val">{formatDate(task.endDate)}</span>
                </div>
              </div>
              <div className="meta-item">
                <div className="meta-info">
                  <span className="meta-label">Status</span>
                  <span className="meta-val with-dot">
                    <span
                      className={`indicator-dot ${task.status === "COMPLETED" ? "dot-green" : "dot-blue"
                        }`}
                    ></span>
                    {formatStatus(task.status)}
                  </span>
                </div>
              </div>
              <div className="meta-item">
                <div className="meta-info">
                  <span className="meta-label">Priority</span>
                  <span className="meta-val with-dot">
                    <span className="indicator-dot dot-orange"></span>
                    {task.priority || "Normal"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-card-right">
          <button
            className="btn-edit-task"
            onClick={() => navigate("/create-task", { state: { task } })}
          >
            <FontAwesomeIcon icon={faPen} />
            <span>Edit Task</span>
          </button>
          <div className="options-wrapper">
            <button
              className="btn-more-options"
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
              aria-label="More options"
            >
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
            {showOptionsDropdown && (
              <div className="options-dropdown-menu">
                <button
                  onClick={() => {
                    setShowOptionsDropdown(false);
                    navigate("/create-task", { state: { task } });
                  }}
                >
                  <FontAwesomeIcon icon={faPen} /> Edit Details
                </button>
                <button
                  onClick={async () => {
                    setShowOptionsDropdown(false);
                    await updateTasks(task.id, { status: "COMPLETED" });
                    fetchTaskDetails(task.id);
                  }}
                >
                  <FontAwesomeIcon icon={faCheckCircle} /> Mark Complete
                </button>
                <button
                  className="delete-option"
                  onClick={() => {
                    setShowOptionsDropdown(false);
                    handleDeleteTask();
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete Task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="collaborators-card">
        <h2 className="collaborators-title">
          Assignees & Collaborators ({teamCollaborators.length})
        </h2>
        <div className="collaborators-list">
          {teamCollaborators.map((member) => (
            <div
              key={member.id}
              className="collaborator-avatar-item"
              onClick={() => openUserProfile && openUserProfile(member)}
              style={{ cursor: "pointer" }}
              title={`View ${member.name}'s profile`}
            >
              <div className="collab-avatar-wrapper">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="collab-avatar-img" />
                ) : (
                  <div className="collab-avatar-placeholder">{member.initial}</div>
                )}
              </div>
              <span className={`collab-name ${member.isCurrent ? "is-you" : ""}`}>
                {member.name}
              </span>
            </div>
          ))}
          <button
            className="btn-add-collaborator"
            onClick={() => setShowAssignModal(true)}
          >
            <div className="add-collab-circle">
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <span className="add-collab-label">Assign User</span>
          </button>
        </div>
      </div>
      <div className="task-main-grid">
        <div className="main-left-col">
          <div className="task-tabs-card">
            <div className="task-tabs-nav">
              <button
                className={`tab-nav-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <FontAwesomeIcon icon={faCompass} />
                <span>Overview</span>
              </button>
              <button
                className={`tab-nav-btn ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <FontAwesomeIcon icon={faGear} />
                <span>Settings</span>
              </button>
            </div>
            <div className="task-tab-body">
              {activeTab === "overview" && (
                <div className="tab-pane-overview">
                  <div className="overview-section">
                    <h3 className="section-heading">Task Description</h3>
                    <p className="description-text">
                      {task.description || "No description provided."}
                    </p>
                  </div>
                  <div className="overview-details-grid">
                    <div className="detail-col-item">
                      <span className="detail-label">Assigned To</span>
                      <div className="user-profile-row">
                        {assigneeUser?.image ? (
                          <img
                            src={assigneeUser.image}
                            alt="Assignee"
                            className="profile-thumb"
                          />
                        ) : (
                          <div className="profile-thumb-placeholder">
                            {(assigneeUser?.firstName || "A").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="profile-text">
                          <span className="profile-name">
                            {assigneeUser
                              ? `${assigneeUser.firstName} ${assigneeUser.lastName}`
                              : "Unassigned"}
                          </span>
                          <span className="profile-date">Active Assignee</span>
                        </div>
                      </div>
                    </div>
                    <div className="detail-col-item">
                      <span className="detail-label">Parent Project</span>
                      <span className="detail-value link-style">
                        {parentProject ? (
                          <Link to="/view-project" state={{ project: parentProject }}>
                            {parentProject.name}
                          </Link>
                        ) : (
                          "General Workspace"
                        )}
                      </span>
                    </div>
                    <div className="detail-col-item">
                      <span className="detail-label">Assigned By</span>
                      <div className="user-profile-row">
                        {assignerUser?.image ? (
                          <img
                            src={assignerUser.image}
                            alt="Assigner"
                            className="profile-thumb"
                          />
                        ) : (
                          <div className="profile-thumb-placeholder">
                            {(assignerUser?.firstName || "A").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="profile-text">
                          <span className="profile-name">
                            {assignerUser
                              ? `${assignerUser.firstName} ${assignerUser.lastName}`
                              : "Workspace Member"}
                          </span>
                          <span className="profile-date">{formatDate(task.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="detail-col-item">
                      <span className="detail-label">Last Updated</span>
                      <span className="detail-value">{formatDate(task.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="tab-pane-settings">
                  <div className="settings-section">
                    <h3>Task Settings</h3>
                    <p>Manage task details and life-cycle.</p>
                    <div className="settings-actions-list">
                      <button
                        className="btn-setting-item"
                        onClick={() => navigate("/create-task", { state: { task } })}
                      >
                        <FontAwesomeIcon icon={faPen} /> Edit Task Information
                      </button>
                      <button
                        className="btn-setting-item delete"
                        onClick={handleDeleteTask}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete Task Permanently
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="main-right-col">
          <div className="side-card stats-widget-card">
            <h3 className="widget-card-title">Task Stats</h3>
            <div className="stats-2x2-grid">
              <div className="stat-box">
                <div className="stat-icon-badge badge-blue">
                  <FontAwesomeIcon icon={faClipboardList} />
                </div>
                <div className="stat-number-label">
                  <span className="stat-big-num">
                    {task.status === "COMPLETED" ? "100%" : task.status === "INPROGRESS" || task.status === "IN_PROGRESS" ? "65%" : "0%"}
                  </span>
                  <span className="stat-sub-label">Completion</span>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon-badge badge-green">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div className="stat-number-label">
                  <span className="stat-big-num">{formatStatus(task.status)}</span>
                  <span className="stat-sub-label">Status</span>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon-badge badge-orange">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div className="stat-number-label">
                  <span className="stat-big-num">{task.endDate ? formatDate(task.endDate) : "No Due Date"}</span>
                  <span className="stat-sub-label">Due Date</span>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon-badge badge-purple">
                  <FontAwesomeIcon icon={faFlag} />
                </div>
                <div className="stat-number-label">
                  <span className="stat-big-num">{task.priority || "Normal"}</span>
                  <span className="stat-sub-label">Priority</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAssignModal && (
        <div className="modal-backdrop" onClick={() => setShowAssignModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <FontAwesomeIcon icon={faUserPlus} /> Assign User to Task
              </h3>
              <button
                className="btn-close-modal"
                onClick={() => setShowAssignModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleAssignUser} className="modal-body">
              <label className="modal-label">Select Assignee</label>
              <select
                className="modal-select"
                value={selectedAssigneeId}
                onChange={(e) => setSelectedAssigneeId(e.target.value)}
                required
              >
                <option value="">-- Choose a user --</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.email})
                  </option>
                ))}
              </select>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Assign to Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
