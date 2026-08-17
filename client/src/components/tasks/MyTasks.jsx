import React, { useState, useEffect } from "react";
import {
  getAllTasks,
  deleteTasks,
  filterTasks,
  filterTasksByUser,
} from "../api/tasksApi";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faPen,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import "./task.css";

export default function Tasks({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Filters
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
      `Are you sure you want to delete "${task.name}"?`,
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
    <div className="content-split">
      <div className="workspace">
        <div className="left-pannel">
          <div>
            <button className="create-project-btn" onClick={handleCreateTask}>
              Create New Task
            </button>
          </div>
          <div className="project-div">
            <h2>{projectId ? "Project Tasks" : "All Tasks"}</h2>
          </div>
        </div>

        {/* Filters Section */}
        <div className="task-filters-section">
          <input
            className="premium-input small-input filter-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="premium-select small-input filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
          </select>
          <select
            className="premium-select small-input filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="INPROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading && <div className="loading">Loading tasks...</div>}

        {!loading && !error && (
          <>
            <div className="status-div">
              <div className="total-project">
                <h3>Total Tasks</h3>
                <strong>{tasks.length}</strong>
              </div>
              <div className="active-project">
                <h3>In Progress</h3>
                <strong>
                  {tasks.filter((t) => t.status === "INPROGRESS").length}
                </strong>
              </div>
              <div className="completed-project">
                <h3>Completed</h3>
                <strong>
                  {tasks.filter((t) => t.status === "COMPLETED").length}
                </strong>
              </div>
              <div className="hold-project">
                <h3>Pending</h3>
                <strong>
                  {tasks.filter((t) => t.status === "PENDING").length}
                </strong>
              </div>
            </div>

            <div className="projectdive">
              <div className="active-tab">Tasks List</div>
            </div>

            <div className="projects-list">
              {tasks.length === 0 ? (
                <p>No tasks found.</p>
              ) : (
                <table className="projects-table">
                  <thead>
                    <tr>
                      <th>Task Name</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Due Date</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td>
                          <div className="project-name">
                            <strong>{task.name}</strong>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`task-priority priority-${task.priority.toLowerCase()}`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`task-status status-${task.status.toLowerCase()}`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td>
                          {task.endDate
                            ? new Date(task.endDate).toLocaleDateString()
                            : "No due date"}
                        </td>
                        <td>
                          {task.description
                            ? task.description.length > 30
                              ? task.description.substring(0, 30) + "..."
                              : task.description
                            : "No description"}
                        </td>
                        <td className="action-cell">
                          <div className="menu-container">
                            <button
                              className="menu-trigger"
                              onClick={() => handleOperations(task)}
                            >
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>

                            {selectedTask?.id === task.id && (
                              <div className="action-menu">
                                <button onClick={() => handleView(task)}>
                                  <FontAwesomeIcon icon={faEye} />
                                  <span>View</span>
                                </button>
                                <button onClick={() => handleUpdate(task)}>
                                  <FontAwesomeIcon icon={faPen} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  className="delete-menu-item"
                                  onClick={() => handleDelete(task)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
