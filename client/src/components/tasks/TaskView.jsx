import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarAlt,
  faFlag,
  faClipboardList,
  faProjectDiagram,
  faClock
} from "@fortawesome/free-solid-svg-icons";
import "./TaskView.css";

export default function TaskView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    if (location.state && location.state.task) {
      setTask(location.state.task);
    } else {
      
      navigate(-1);
    }
  }, [location, navigate]);

  if (!task) {
    return <div className="task-view-loading">Loading task...</div>;
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "COMPLETED": return "status-completed";
      case "INPROGRESS": return "status-inprogress";
      case "PENDING": return "status-pending";
      default: return "status-pending";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "HIGH": return "priority-high";
      case "NORMAL": return "priority-normal";
      case "LOW": return "priority-low";
      default: return "priority-normal";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="task-view-page">
      <div className="task-view-container">
        
        {}
        <div className="task-view-actions">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </button>
          <div className="action-buttons">
            <button 
              className="edit-btn" 
              onClick={() => navigate("/create-task", { state: { task } })}
            >
              Edit Task
            </button>
          </div>
        </div>

        {}
        <div className="task-view-content">
          
          <div className="task-view-header">
            <div className="title-section">
              <h1>{task.name}</h1>
              <span className={`status-badge ${getStatusClass(task.status)}`}>
                {task.status === "INPROGRESS" ? "IN PROGRESS" : task.status}
              </span>
              <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                {task.priority} PRIORITY
              </span>
            </div>
          </div>

          <div className="task-view-body">
            
            {}
            <div className="main-details">
              <div className="detail-card description-card">
                <h2>About this Task</h2>
                <p>{task.description || "No description provided."}</p>
              </div>

              <div className="detail-card info-card">
                <h2>Task Info</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <FontAwesomeIcon icon={faCalendarAlt} className="info-icon" />
                    <div>
                      <span className="info-label">Start Date</span>
                      <span className="info-value">{formatDate(task.startDate)}</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FontAwesomeIcon icon={faFlag} className="info-icon" />
                    <div>
                      <span className="info-label">Due Date</span>
                      <span className="info-value">{formatDate(task.endDate)}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <FontAwesomeIcon icon={faProjectDiagram} className="info-icon" />
                    <div>
                      <span className="info-label">Project ID</span>
                      <span className="info-value">{task.projectId || "Unassigned"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="side-details">
              
              <div className="detail-card stats-card">
                <h2>At a Glance</h2>
                <div className="stats-list">
                  <div className="stat-item">
                    <div className="stat-icon-wrapper blue">
                      <FontAwesomeIcon icon={faClipboardList} />
                    </div>
                    <div className="stat-text">
                      <span className="stat-value">
                        {task.status === "COMPLETED" ? "100%" : (task.status === "INPROGRESS" ? "50%" : "0%")}
                      </span>
                      <span className="stat-label">Completion</span>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-icon-wrapper orange">
                      <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div className="stat-text">
                      <span className="stat-value">
                        {task.endDate ? (new Date(task.endDate) < new Date() ? "Overdue" : "On Track") : "No Due Date"}
                      </span>
                      <span className="stat-label">Timeline Status</span>
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
