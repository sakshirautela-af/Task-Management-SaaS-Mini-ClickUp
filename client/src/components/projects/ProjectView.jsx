import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link, useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faTasks,
  faCheckCircle,
  faCompass,
  faClock,
  faFile,
  faTrash,
  faUpload,
  faPen,
  faEllipsis,
  faPlus,
  faFolder,
  faGear,
  faClipboardList,
  faFlag,
  faChevronRight,
  faTimes,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { getProjectById, updateProject, deleteProject } from "../api/projectApi";
import { uploadFile, deleteFile, getFilesByProject } from "../api/fileApi";
import { getAllUsers } from "../api/userApi";
import "./ProjectView.css";
export default function ProjectView() {
  const location = useLocation();
  const navigate = useNavigate();
  const outletCtx = useOutletContext();
  const openUserProfile = outletCtx?.openUserProfile;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [projectFiles, setProjectFiles] = useState([]);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user", e);
      }
    }
    const projectId = location.state?.project?.id;
    if (projectId) {
      fetchProjectDetails(projectId);
      fetchFiles(projectId);
    } else if (location.state?.project) {
      setProject(location.state.project);
      setLoading(false);
    } else {
      navigate("/projects");
    }
    fetchUsers();
  }, [location, navigate]);
  const fetchProjectDetails = async (id) => {
    try {
      setLoading(true);
      const res = await getProjectById(id);
      const projData = res.data || res.project || res || location.state?.project;
      setProject(projData);
    } catch (err) {
      console.error("Failed to load project details:", err);
      if (location.state?.project) {
        setProject(location.state.project);
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchFiles = async (projectId) => {
    try {
      const res = await getFilesByProject(projectId);
      const data = res.body || res.data || res || [];
      if (Array.isArray(data)) {
        setProjectFiles(data);
      }
    } catch (err) {
      console.error("Failed to load files:", err);
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setAllUsers(res.data || res || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };
  const handleDeleteProject = async () => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      try {
        await deleteProject(project.id);
        navigate("/projects");
      } catch (err) {
        console.error("Error deleting project:", err);
      }
    }
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !project) return;
    try {
      setUploading(true);
      await uploadFile(project.id, file);
      fetchFiles(project.id);
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setUploading(false);
    }
  };
  const handleDeleteFile = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await deleteFile(fileId);
        setProjectFiles((prev) => prev.filter((f) => f.id !== fileId));
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }
  };
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedMemberId) return;
    try {
      await updateProject(project.id, { assignId: Number(selectedMemberId) });
      await fetchProjectDetails(project.id);
      setShowAddMemberModal(false);
      setSelectedMemberId("");
    } catch (err) {
      console.error("Error assigning member:", err);
    }
  };
  if (loading && !project) {
    return (
      <div className="project-view-loading-screen">
        <div className="spinner"></div>
        <p>Loading project details...</p>
      </div>
    );
  }
  if (!project) return null;
  const tasks = project.tasks || [];
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const inProgressTasksCount = tasks.filter(
    (t) => t.status === "INPROGRESS" || t.status === "IN_PROGRESS"
  ).length;
  const pendingTasksCount = tasks.filter(
    (t) => t.status === "PENDING" || t.status === "TODO" || t.status === "HOLD"
  ).length;
  const completionPercentage =
    totalTasksCount > 0
      ? ((completedTasksCount / totalTasksCount) * 100).toFixed(1)
      : "0.0";
  const formatStatus = (st) => {
    if (!st) return "In Progress";
    if (st === "INPROGRESS" || st === "IN_PROGRESS") return "In Progress";
    if (st === "TODO") return "To Do";
    if (st === "COMPLETED") return "Completed";
    if (st === "HOLD") return "On Hold";
    if (st === "CANCELLED") return "Cancelled";
    return st;
  };
  const getStatusPillClass = (st) => {
    switch (st) {
      case "COMPLETED":
        return "status-pill-completed";
      case "HOLD":
        return "status-pill-hold";
      case "TODO":
        return "status-pill-todo";
      case "CANCELLED":
        return "status-pill-cancelled";
      default:
        return "status-pill-inprogress";
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
  const devMap = new Map();
  if (project.creator) {
    devMap.set(project.creator.id, {
      id: project.creator.id,
      name: `${project.creator.firstName} ${project.creator.lastName || ""}`.trim(),
      image: project.creator.image || null,
      initial: (project.creator.firstName || "C").charAt(0).toUpperCase(),
      isCurrent: currentUser && project.creator.id === currentUser.id,
    });
  }
  if (project.assignTo) {
    devMap.set(project.assignTo.id, {
      id: project.assignTo.id,
      name: `${project.assignTo.firstName} ${project.assignTo.lastName || ""}`.trim(),
      image: project.assignTo.image || null,
      initial: (project.assignTo.firstName || "A").charAt(0).toUpperCase(),
      isCurrent: currentUser && project.assignTo.id === currentUser.id,
    });
  }
  if (Array.isArray(project.tasks)) {
    project.tasks.forEach((t) => {
      if (t.assignee && !devMap.has(t.assignee.id)) {
        devMap.set(t.assignee.id, {
          id: t.assignee.id,
          name: `${t.assignee.firstName} ${t.assignee.lastName || ""}`.trim(),
          image: t.assignee.image || null,
          initial: (t.assignee.firstName || "D").charAt(0).toUpperCase(),
          isCurrent: currentUser && t.assignee.id === currentUser.id,
        });
      }
    });
  }
  const developers = Array.from(devMap.values());

  return (
    <div className="project-details-view">
      <nav className="project-breadcrumb">
        <Link to="/projects" className="breadcrumb-link">
          Projects
        </Link>
        <span className="breadcrumb-separator">
          <FontAwesomeIcon icon={faChevronRight} />
        </span>
        <span className="breadcrumb-item">{project.name}</span>
        <span className="breadcrumb-separator">
          <FontAwesomeIcon icon={faChevronRight} />
        </span>
        <span className="breadcrumb-current">Details</span>
      </nav>
      <div className="project-header-card">
        <div className="header-card-left">
          <div className="project-avatar-box">
            <FontAwesomeIcon icon={faFolder} />
          </div>
          <div className="project-title-meta">
            <div className="title-row">
              <h1 className="project-name">{project.name}</h1>
              <span className={`status-pill ${getStatusPillClass(project.status)}`}>
                {formatStatus(project.status)}
              </span>
            </div>
            <p className="project-tagline">
              {project.description || "Project Workspace"}
            </p>
            <div className="meta-stats-row">
              <div className="meta-item">
                <FontAwesomeIcon icon={faCalendarAlt} className="meta-icon" />
                <div className="meta-info">
                  <span className="meta-label">Start Date</span>
                  <span className="meta-val">{formatDate(project.startDate)}</span>
                </div>
              </div>
              <div className="meta-item">
                <FontAwesomeIcon icon={faCalendarAlt} className="meta-icon" />
                <div className="meta-info">
                  <span className="meta-label">End Date</span>
                  <span className="meta-val">{formatDate(project.endDate)}</span>
                </div>
              </div>
              <div className="meta-item">
                <div className="meta-info">
                  <span className="meta-label">Status</span>
                  <span className="meta-val with-dot">
                    <span
                      className={`indicator-dot ${project.status === "COMPLETED" ? "dot-green" : "dot-blue"
                        }`}
                    ></span>
                    {formatStatus(project.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-card-right">
          <button
            className="btn-edit-project"
            onClick={() =>
              navigate("/create-project", { state: { project } })
            }
          >
            <FontAwesomeIcon icon={faPen} />
            <span>Edit Project</span>
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
                    navigate("/create-project", { state: { project } });
                  }}
                >
                  <FontAwesomeIcon icon={faPen} /> Edit Details
                </button>
                <button
                  className="delete-option"
                  onClick={() => {
                    setShowOptionsDropdown(false);
                    handleDeleteProject();
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="developers-card">
        <h2 className="developers-title">
          Developers ({developers.length})
        </h2>
        <div className="developers-list">
          {developers.map((dev) => (
            <div
              key={dev.id}
              className="developer-avatar-item"
              onClick={() => openUserProfile && openUserProfile(dev)}
              style={{ cursor: "pointer" }}
              title={`View ${dev.name}'s profile`}
            >
              <div className="dev-avatar-wrapper">
                {typeof dev.image === "string" && dev.image ? (
                  <img
                    src={dev.image}
                    alt={dev.name}
                    className="dev-avatar-img"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="dev-avatar-placeholder">{dev.initial}</div>
                )}
              </div>
              <span className={`dev-name ${dev.isCurrent ? "is-you" : ""}`}>
                {dev.name}
              </span>
            </div>
          ))}
          <button
            className="btn-add-member"
            onClick={() => setShowAddMemberModal(true)}
          >
            <div className="add-member-circle">
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <span className="add-member-label">Add Member</span>
          </button>
        </div>
      </div>
      <div className="project-main-grid">
        <div className="main-left-col">
          <div className="project-tabs-card">
            <div className="project-tabs-nav">
              <button
                className={`tab-nav-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <FontAwesomeIcon icon={faCompass} />
                <span>Overview</span>
              </button>
              <button
                className={`tab-nav-btn ${activeTab === "tasks" ? "active" : ""}`}
                onClick={() => setActiveTab("tasks")}
              >
                <FontAwesomeIcon icon={faTasks} />
                <span>Tasks ({totalTasksCount})</span>
              </button>
              <button
                className={`tab-nav-btn ${activeTab === "files" ? "active" : ""}`}
                onClick={() => setActiveTab("files")}
              >
                <FontAwesomeIcon icon={faFile} />
                <span>Files ({projectFiles.length})</span>
              </button>
              <button
                className={`tab-nav-btn ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <FontAwesomeIcon icon={faGear} />
                <span>Settings</span>
              </button>
            </div>
            <div className="project-tab-body">
              {activeTab === "overview" && (
                <div className="tab-pane-overview">
                  <div className="overview-section">
                    <h3 className="section-heading">Project Description</h3>
                    <p className="description-text">
                      {project.description || "No description provided."}
                    </p>
                  </div>
                  <div className="overview-details-grid">
                    <div className="detail-col-item">
                      <span className="detail-label">Created By</span>
                      <div className="user-profile-row">
                        {project.creator?.image ? (
                          <img
                            src={project.creator.image}
                            alt="Creator"
                            className="profile-thumb"
                          />
                        ) : (
                          <div className="profile-thumb-placeholder">
                            {(project.creator?.firstName || currentUser?.firstName || "C").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="profile-text">
                          <span className="profile-name">
                            {project.creator
                              ? `${project.creator.firstName} ${project.creator.lastName}`
                              : currentUser
                                ? `${currentUser.firstName} ${currentUser.lastName}`
                                : "Workspace Creator"}
                          </span>
                          <span className="profile-date">
                            {formatDate(project.createdAt || project.startDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="detail-col-item">
                      <span className="detail-label">Assigned To</span>
                      <div className="user-profile-row">
                        {project.assignTo?.image ? (
                          <img
                            src={project.assignTo.image}
                            alt="Assignee"
                            className="profile-thumb"
                          />
                        ) : (
                          <div className="profile-thumb-placeholder">
                            {(project.assignTo?.firstName || "A").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="profile-text">
                          <span className="profile-name">
                            {project.assignTo
                              ? `${project.assignTo.firstName} ${project.assignTo.lastName}`
                              : "Unassigned"}
                          </span>
                          <span className="profile-date">Primary Lead</span>
                        </div>
                      </div>
                    </div>
                    <div className="detail-col-item">
                      <span className="detail-label">Last Updated By</span>
                      <div className="user-profile-row">
                        {project.updater?.image ? (
                          <img
                            src={project.updater.image}
                            alt="Updater"
                            className="profile-thumb"
                          />
                        ) : (
                          <div className="profile-thumb-placeholder">
                            {(project.updater?.firstName || "U").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="profile-text">
                          <span className="profile-name">
                            {project.updater
                              ? `${project.updater.firstName} ${project.updater.lastName}`
                              : "Workspace Member"}
                          </span>
                          <span className="profile-date">
                            {formatDate(project.updatedAt || project.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="detail-col-item">
                      <span className="detail-label">Total Tasks</span>
                      <span className="detail-value">{totalTasksCount}</span>
                    </div>
                    <div className="detail-col-item">
                      <span className="detail-label">Completion Rate</span>
                      <span className="detail-value">{completionPercentage}%</span>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "tasks" && (
                <div className="tab-pane-tasks">
                  <div className="tasks-tab-header">
                    <h3>Project Tasks ({tasks.length})</h3>
                    <button
                      className="btn-create-task-inline"
                      onClick={() =>
                        navigate("/create-task", {
                          state: { projectId: project.id },
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faPlus} /> Add Task
                    </button>
                  </div>
                  {tasks.length === 0 ? (
                    <p className="empty-tab-text">No tasks created yet for this project.</p>
                  ) : (
                    <div className="tasks-tab-list">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="task-row-item"
                          onClick={() => navigate("/view-task", { state: { task } })}
                        >
                          <div className="task-row-left">
                            <span
                              className={`task-status-dot ${task.status === "COMPLETED" ? "green" : "blue"
                                }`}
                            ></span>
                            <div className="task-name-desc">
                              <span className="task-row-title">{task.name}</span>
                              <span className="task-row-sub">
                                Due: {formatDate(task.endDate)}
                              </span>
                            </div>
                          </div>
                          <span className={`task-badge ${task.priority?.toLowerCase() || "normal"}`}>
                            {task.priority || "Normal"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {activeTab === "files" && (
                <div className="tab-pane-files">
                  <div className="files-tab-header">
                    <h3>Project Files</h3>
                    <label className="btn-upload-file-inline">
                      <FontAwesomeIcon icon={faUpload} />{" "}
                      {uploading ? "Uploading..." : "Upload File"}
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  {projectFiles.length === 0 ? (
                    <p className="empty-tab-text">No files uploaded yet for this project.</p>
                  ) : (
                    <div className="files-tab-list">
                      {projectFiles.map((file) => (
                        <div key={file.id} className="file-row-item">
                          <div className="file-row-left">
                            <FontAwesomeIcon icon={faFile} className="file-icon" />
                            <span className="file-name">
                              {file.location ? file.location.split("/").pop() : "Attached File"}
                            </span>
                          </div>
                          <button
                            className="btn-delete-file"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="tab-pane-settings">
                  <div className="settings-section">
                    <h3>Project Settings</h3>
                    <p>Manage project lifecycle and configuration.</p>
                    <div className="settings-actions-list">
                      <button
                        className="btn-setting-item"
                        onClick={() =>
                          navigate("/create-project", { state: { project } })
                        }
                      >
                        <FontAwesomeIcon icon={faPen} /> Edit Project Information
                      </button>
                      <button
                        className="btn-setting-item delete"
                        onClick={handleDeleteProject}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete Project Permanently
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
            <h3 className="widget-card-title">Project Stats</h3>
            <div className="stats-2x2-grid">
              <div className="stat-box">
                <div className="stat-icon-badge badge-blue">
                  <FontAwesomeIcon icon={faClipboardList} />
                </div>
                <div className="stat-number-label">
                  <span className="stat-big-num">{totalTasksCount}</span>
                  <span className="stat-sub-label">Total Tasks</span>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon-badge badge-green">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div className="stat-number-label">
                  <span className="stat-big-num">{completedTasksCount}</span>
                  <span className="stat-sub-label">Completed</span>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon-badge badge-orange">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div className="stat-number-label">
                  <span className="stat-big-num">{inProgressTasksCount}</span>
                  <span className="stat-sub-label">In Progress</span>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon-badge badge-purple">
                  <FontAwesomeIcon icon={faFlag} />
                </div>
                <div className="stat-number-label">
                  <span className="stat-big-num">{pendingTasksCount}</span>
                  <span className="stat-sub-label">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAddMemberModal && (
        <div className="modal-backdrop" onClick={() => setShowAddMemberModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <FontAwesomeIcon icon={faUserPlus} /> Assign Member to Project
              </h3>
              <button
                className="btn-close-modal"
                onClick={() => setShowAddMemberModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="modal-body">
              <label className="modal-label">Select Workspace Member</label>
              <select
                className="modal-select"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                required
              >
                <option value="">-- Choose a member --</option>
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
                  onClick={() => setShowAddMemberModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Assign to Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
