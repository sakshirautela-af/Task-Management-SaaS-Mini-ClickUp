import React, { useState, useEffect } from "react";
import { deleteTasks, filterTasksByUser } from "../api/tasksApi";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faPen,
  faTrash,
  faEye,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "./task.css";

export default function MyTasks({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id;
      const response = await filterTasksByUser(userId, projectId, {
        search: searchQuery,
        priority: filterPriority,
        status: filterStatus,
      });
      setTasks(response.data || []);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError(err?.response?.data?.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId, searchQuery, filterPriority, filterStatus]);

  const handleCreateTask = () => {
    navigate("/create-task", { state: { projectId } });
  };

  const handleOperations = (task) => {
    if (selectedTask?.id === task.id) {
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
    }
  };

  const handleUpdate = (task) => {
    navigate("/create-task", { state: { task } });
    setSelectedTask(null);
  };

  const handleView = (task) => {
    navigate("/view-task", { state: { task } });
    setSelectedTask(null);
  };

  const handleDelete = async (task) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${task.name}"?`
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await deleteTasks(task.id);
      setTasks((prevTasks) => prevTasks.filter((item) => item.id !== task.id));
      setSelectedTask(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError(err?.response?.data?.message || "Failed to delete task.");
    }
  };

  return (
    <div className="tasks-management-page">
      <div className="tasks-page-header">
        <div className="header-title-block">
          <h1 className="main-page-title">
            {projectId ? "Project Tasks" : "My Tasks"}
          </h1>
          <p className="main-page-subtitle">
            View and manage tasks assigned to you.
          </p>
        </div>
        <button className="btn-new-task" onClick={handleCreateTask}>
          <FontAwesomeIcon icon={faPlus} />
          <span>New Task</span>
        </button>
      </div>

      <div className="tasks-table-main-card">
        <div className="table-top-bar">
          <h2 className="table-section-title">Tasks List</h2>
          <div className="table-search-wrapper">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="table-search-input"
            />
          </div>
        </div>

        {error && <div className="modal-alert-box error">{error}</div>}

        <div className="table-responsive-box">
          <table className="tasks-list-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="empty-table-cell">
                    <p>Loading tasks...</p>
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-table-cell">
                    <p>No tasks found.</p>
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <div className="task-details-col">
                        <span className="task-row-name">{task.name}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`task-priority-tag tag-${(
                          task.priority || "NORMAL"
                        ).toLowerCase()}`}
                      >
                        {task.priority || "Normal"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`task-status-pill pill-${(
                          task.status || "INPROGRESS"
                        ).toLowerCase()}`}
                      >
                        {task.status || "In Progress"}
                      </span>
                    </td>
                    <td className="date-text-cell">
                      {task.endDate
                        ? new Date(task.endDate).toLocaleDateString()
                        : "No due date"}
                    </td>
                    <td className="updated-text-cell">
                      {task.description
                        ? task.description.length > 35
                          ? task.description.substring(0, 35) + "..."
                          : task.description
                        : "No description"}
                    </td>
                    <td className="action-cell">
                      <div className="actions-dropdown-wrapper">
                        <button
                          className="btn-kebab-menu"
                          onClick={() => handleOperations(task)}
                          aria-label="Actions"
                        >
                          <FontAwesomeIcon icon={faEllipsisVertical} />
                        </button>
                        {selectedTask?.id === task.id && (
                          <div className="kebab-popup-menu">
                            <button onClick={() => handleView(task)}>
                              <FontAwesomeIcon icon={faEye} /> View Details
                            </button>
                            <button onClick={() => handleUpdate(task)}>
                              <FontAwesomeIcon icon={faPen} /> Edit Task
                            </button>
                            <button
                              className="delete-item-btn"
                              onClick={() => handleDelete(task)}
                            >
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
