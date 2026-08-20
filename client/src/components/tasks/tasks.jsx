import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faFilter,
  faClipboardList,
  faPlay,
  faClock,
  faCheckCircle,
  faFlag,
  faMagnifyingGlass,
  faEllipsisVertical,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faEye,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { filterTasksApi, deleteTasks } from "../api/tasksApi";
import { getAllProject } from "../api/projectApi";
import { TaskStatus, TaskPriority } from "../../enums";
import "./task.css";

export default function Tasks({ projectId }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [metrics, setMetrics] = useState({
    total: 0,
    inProgress: 0,
    pending: 0,
    completed: 0,
    highPriority: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); 
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user", e);
      }
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksRes, projRes] = await Promise.allSettled([
        filterTasksApi({
          userId: currentUser?.id,
          tab: activeTab,
          projectId,
          search: searchQuery,
          priority: priorityFilter,
          status: statusFilter,
          page: currentPage,
          limit: rowsPerPage,
        }),
        getAllProject(),
      ]);

      if (tasksRes.status === "fulfilled") {
        const tData = tasksRes.value?.data || tasksRes.value || {};
        setTasks(tData.tasks || []);
        setTotalCount(tData.totalCount || 0);
        setTotalPages(tData.totalPages || 1);
        if (tData.metrics) {
          setMetrics(tData.metrics);
        }
      }
      if (projRes.status === "fulfilled") {
        const pData = projRes.value?.data || projRes.value || [];
        setProjects(Array.isArray(pData) ? pData : []);
      }
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError(err?.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [
    currentUser?.id,
    activeTab,
    projectId,
    statusFilter,
    priorityFilter,
    searchQuery,
    currentPage,
    rowsPerPage,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  function formatTimeAgo(dateStr) {
    if (!dateStr) return "Just now";
    try {
      const now = new Date();
      const past = new Date(dateStr);
      const diffHrs = Math.floor((now - past) / (1000 * 60 * 60));
      if (diffHrs < 1) return "Just now";
      if (diffHrs < 24) return `${diffHrs} hours ago`;
      const diffDays = Math.floor(diffHrs / 24);
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
    } catch {
      return "Recently";
    }
  }

  function formatDate(dateStr) {
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
  }

  const combinedTasks = useMemo(() => {
    return tasks.map((t, idx) => {
      const parentProject =
        t.project || projects.find((p) => p.id === t.projectId) || null;

      const projectName = parentProject
        ? parentProject.name
        : `Project #${t.projectId || "General"}`;

      const assigneeName = t.assignee
        ? `${t.assignee.firstName} ${t.assignee.lastName || ""}`.trim()
        : "Unassigned";

      return {
        ...t,
        projectName,
        assigneeName,
        timeAgo: t.updatedAt
          ? formatTimeAgo(t.updatedAt)
          : `${idx + 1} day ago`,
        statusFormatted: t.status || "INPROGRESS",
        priorityFormatted: t.priority || "NORMAL",
        startDateFormatted: formatDate(t.startDate),
        dueDateFormatted: formatDate(t.endDate),
      };
    });
  }, [tasks, projects]);

  const getStatusBadge = (st) => {
    switch (st) {
      case "IN_PROGRESS":
      case TaskStatus.INPROGRESS:
        return <span className="task-status-pill pill-inprogress">In Progress</span>;
      case TaskStatus.PENDING:
      case "TODO":
        return <span className="task-status-pill pill-pending">Pending</span>;
      case TaskStatus.COMPLETED:
        return <span className="task-status-pill pill-completed">Completed</span>;
      case TaskStatus.CANCELLED:
      case TaskStatus.FAILED:
        return <span className="task-status-pill pill-cancelled">Cancelled</span>;
      default:
        return <span className="task-status-pill pill-inprogress">{st || "In Progress"}</span>;
    }
  };

  const getPriorityBadge = (pri) => {
    switch (pri) {
      case "HIGH":
      case TaskPriority.HIGH:
        return <span className="task-priority-tag tag-high">High</span>;
      case "LOW":
      case TaskPriority.LOW:
        return <span className="task-priority-tag tag-low">Low</span>;
      case "NORMAL":
      case TaskPriority.NORMAL:
      default:
        return <span className="task-priority-tag tag-normal">Normal</span>;
    }
  };

  const handleDelete = async (id, name, e) => {
    e.stopPropagation();
    setActiveMenuId(null);
    if (window.confirm(`Are you sure you want to delete task "${name}"?`)) {
      try {
        await deleteTasks(id);
        fetchTasks();
      } catch (err) {
        console.error("Failed to delete task:", err);
        alert("Error deleting task");
      }
    }
  };

  return (
    <div className="tasks-management-page">
      <div className="tasks-page-header">
        <div className="header-title-block">
          <h1 className="main-page-title">Tasks</h1>
          <p className="main-page-subtitle">
            Manage, track, and collaborate on your team's tasks.
          </p>
        </div>
        <button
          className="btn-create-task"
          onClick={() => navigate("/create-task")}
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>New Task</span>
        </button>
      </div>

      <div className="tasks-metric-cards-row">
        <div className="metric-summary-card">
          <div className="summary-icon-box bg-purple-soft">
            <FontAwesomeIcon icon={faClipboardList} className="color-purple" />
          </div>
          <div className="summary-info">
            <span className="summary-label">All Tasks</span>
            <span className="summary-num">{metrics.total}</span>
            <span className="summary-sublabel">Total tasks</span>
          </div>
        </div>

        <div className="metric-summary-card">
          <div className="summary-icon-box bg-green-soft">
            <FontAwesomeIcon icon={faPlay} className="color-green" />
          </div>
          <div className="summary-info">
            <span className="summary-label">In Progress</span>
            <span className="summary-num">{metrics.inProgress}</span>
            <span className="summary-sublabel">Active tasks</span>
          </div>
        </div>

        <div className="metric-summary-card">
          <div className="summary-icon-box bg-orange-soft">
            <FontAwesomeIcon icon={faClock} className="color-orange" />
          </div>
          <div className="summary-info">
            <span className="summary-label">Pending</span>
            <span className="summary-num">{metrics.pending}</span>
            <span className="summary-sublabel">Waiting tasks</span>
          </div>
        </div>

        <div className="metric-summary-card">
          <div className="summary-icon-box bg-indigo-soft">
            <FontAwesomeIcon icon={faCheckCircle} className="color-indigo" />
          </div>
          <div className="summary-info">
            <span className="summary-label">Completed</span>
            <span className="summary-num">{metrics.completed}</span>
            <span className="summary-sublabel">Finished tasks</span>
          </div>
        </div>

        <div className="metric-summary-card">
          <div className="summary-icon-box bg-red-soft">
            <FontAwesomeIcon icon={faFlag} className="color-red" />
          </div>
          <div className="summary-info">
            <span className="summary-label">High Priority</span>
            <span className="summary-num">{metrics.highPriority}</span>
            <span className="summary-sublabel">Urgent tasks</span>
          </div>
        </div>
      </div>

      <div className="tasks-filter-bar">
        <div className="left-filter-tabs">
          <button
            className={`pill-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
          >
            All Tasks
          </button>
          <button
            className={`pill-tab ${activeTab === "my" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("my");
              setCurrentPage(1);
            }}
          >
            My Tasks
          </button>
        </div>

        <div className="filter-dropdown-container">
          <button
            className="btn-filter-toggle"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <FontAwesomeIcon icon={faFilter} className="filter-icon" />
            <span>
              {statusFilter === "ALL" && priorityFilter === "ALL"
                ? "Filter"
                : statusFilter !== "ALL"
                ? statusFilter
                : `${priorityFilter} Priority`}
            </span>
            <FontAwesomeIcon icon={faChevronDown} className="chevron-icon" />
          </button>

          {showFilterDropdown && (
            <div className="filter-dropdown-menu">
              <button
                className={statusFilter === "ALL" && priorityFilter === "ALL" ? "selected" : ""}
                onClick={() => {
                  setStatusFilter("ALL");
                  setPriorityFilter("ALL");
                  setCurrentPage(1);
                  setShowFilterDropdown(false);
                }}
              >
                All Tasks
              </button>
              <button
                className={statusFilter === TaskStatus.INPROGRESS ? "selected" : ""}
                onClick={() => {
                  setStatusFilter(TaskStatus.INPROGRESS);
                  setCurrentPage(1);
                  setShowFilterDropdown(false);
                }}
              >
                In Progress
              </button>
              <button
                className={statusFilter === TaskStatus.PENDING ? "selected" : ""}
                onClick={() => {
                  setStatusFilter(TaskStatus.PENDING);
                  setCurrentPage(1);
                  setShowFilterDropdown(false);
                }}
              >
                Pending
              </button>
              <button
                className={statusFilter === TaskStatus.COMPLETED ? "selected" : ""}
                onClick={() => {
                  setStatusFilter(TaskStatus.COMPLETED);
                  setCurrentPage(1);
                  setShowFilterDropdown(false);
                }}
              >
                Completed
              </button>
              <button
                className={priorityFilter === TaskPriority.HIGH ? "selected" : ""}
                onClick={() => {
                  setPriorityFilter(TaskPriority.HIGH);
                  setCurrentPage(1);
                  setShowFilterDropdown(false);
                }}
              >
                High Priority
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="tasks-table-main-card">
        <div className="table-top-bar">
          <h2 className="table-section-title">
            {activeTab === "my" ? "My Tasks" : "All Tasks"}
          </h2>
          <div className="table-search-wrapper">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="table-search-input"
            />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-glass-icon" />
          </div>
        </div>

        <div className="table-responsive-box">
          <table className="tasks-list-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Start Date</th>
                <th>Due Date</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="empty-table-cell">
                    <p>Loading tasks from backend...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="empty-table-cell error-text">
                    <p>{error}</p>
                  </td>
                </tr>
              ) : combinedTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-table-cell">
                    <p>No tasks found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                combinedTasks.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() =>
                      navigate("/view-task", { state: { task: t } })
                    }
                  >
                    <td>
                      <div className="task-details-col">
                        <span className="task-row-name">{t.name}</span>
                        <span className="task-row-subtitle">
                          {t.projectName}
                        </span>
                      </div>
                    </td>
                    <td>{getStatusBadge(t.statusFormatted)}</td>
                    <td>{getPriorityBadge(t.priorityFormatted)}</td>
                    <td className="date-cell-text">{t.startDateFormatted}</td>
                    <td className="date-cell-text">{t.dueDateFormatted}</td>
                    <td className="date-cell-text">{t.timeAgo}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="actions-menu-container">
                        <button
                          className="btn-action-trigger"
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === t.id ? null : t.id
                            )
                          }
                          aria-label="Actions"
                        >
                          <FontAwesomeIcon icon={faEllipsisVertical} />
                        </button>
                        {activeMenuId === t.id && (
                          <div className="action-dropdown-menu">
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                navigate("/view-task", { state: { task: t } });
                              }}
                            >
                              <FontAwesomeIcon icon={faEye} /> View
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                navigate("/create-task", {
                                  state: { task: t },
                                });
                              }}
                            >
                              <FontAwesomeIcon icon={faPen} /> Edit
                            </button>
                            <button
                              className="delete-action"
                              onClick={(e) => handleDelete(t.id, t.name, e)}
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

        {/* Pagination Bar */}
        <div className="table-pagination-footer">
          <div className="pagination-left-info">
            <span>
              Showing {combinedTasks.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * rowsPerPage, totalCount)} of {totalCount} tasks
            </span>
          </div>

          <div className="pagination-right-controls">
            <div className="page-nav-btns">
              <button
                className="btn-page-nav"
                disabled={currentPage <= 1 || loading}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                aria-label="Previous Page"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <span className="page-indicator-text">
                {currentPage} / {totalPages}
              </span>
              <button
                className="btn-page-nav"
                disabled={currentPage >= totalPages || loading}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                aria-label="Next Page"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}