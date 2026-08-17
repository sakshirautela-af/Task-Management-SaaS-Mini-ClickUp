import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarAlt,
  faFlag,
  faUser,
  faTasks,
  faCheckCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import "./ProjectView.css";

export default function ProjectView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (location.state && location.state.project) {
      setProject(location.state.project);
    } else {
      navigate("/projects");
    }
  }, [location, navigate]);

  if (!project) {
    return <div className="project-view-loading">Loading project...</div>;
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "COMPLETED":
        return "status-completed";
      case "IN_PROGRESS":
        return "status-in-progress";
      case "HOLD":
        return "status-hold";
      default:
        return "status-todo";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="project-view-page">
      <div className="project-view-container">
        <div className="project-view-actions">
          <button className="back-btn" onClick={() => navigate("/projects")}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Projects
          </button>
          <div className="action-buttons">
            <button
              className="edit-btn"
              onClick={() =>
                navigate("/create-project", { state: { project } })
              }
            >
              Edit Project
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="project-view-content">
          <div className="project-view-header">
            <div className="title-section">
              <h1>{project.name}</h1>
              <span
                className={`status-badge ${getStatusClass(project.status)}`}
              >
                {project.status.replace("_", " ")}
              </span>
              {project.isActive && <span className="active-badge">Active</span>}
            </div>
          </div>

          <div className="project-view-body">
            {/* Left Column: Description & Details */}
            <div className="main-details">
              <div className="detail-card description-card">
                <h2>About this Project</h2>
                <p>{project.description || "No description provided."}</p>
              </div>

              <div className="detail-card info-card">
                <h2>Project Info</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="info-icon"
                    />
                    <div>
                      <span className="info-label">Start Date</span>
                      <span className="info-value">
                        {formatDate(project.startDate)}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <FontAwesomeIcon icon={faFlag} className="info-icon" />
                    <div>
                      <span className="info-label">End Date</span>
                      <span className="info-value">
                        {formatDate(project.endDate)}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <FontAwesomeIcon icon={faUser} className="info-icon" />
                    <div>
                      <span className="info-label">Assigned To</span>
                      <span className="info-value">
                        {project.assignId
                          ? `User ID: ${project.assignId}`
                          : "Unassigned"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Stats & Progress */}
            <div className="side-details">
              <div className="detail-card stats-card">
                <h2>At a Glance</h2>
                <div className="stats-list">
                  <div className="stat-item">
                    <div className="stat-icon-wrapper blue">
                      <FontAwesomeIcon icon={faTasks} />
                    </div>
                    <div className="stat-text">
                      <span className="stat-value">
                        {project.tasks?.length || 0}
                      </span>
                      <span className="stat-label">Total Tasks</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon-wrapper green">
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <div className="stat-text">
                      <span className="stat-value">
                        {project.status === "COMPLETED"
                          ? "100%"
                          : "In Progress"}
                      </span>
                      <span className="stat-label">Overall Progress</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon-wrapper orange">
                      <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div className="stat-text">
                      <span className="stat-value">
                        {project.isActive ? "Active" : "Inactive"}
                      </span>
                      <span className="stat-label">Current State</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
