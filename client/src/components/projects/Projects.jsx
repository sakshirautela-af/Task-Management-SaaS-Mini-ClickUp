import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faFilter,
  faFolder,
  faPlay,
  faPause,
  faCheckCircle,
  faTimesCircle,
  faMagnifyingGlass,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { filterProjectsApi } from "../api/projectApi";
import "./Projects.css";
import { ProjectStatus } from "../../enums";

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [metrics, setMetrics] = useState({
    total: 0,
    active: 0,
    hold: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); 
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await filterProjectsApi({
        userId: currentUser?.id,
        tab: activeTab,
        status: statusFilter,
        search: searchQuery,
        page: currentPage,
        limit: rowsPerPage,
      });
      if (res?.data) {
        setProjects(res.data.projects || []);
        setTotalCount(res.data.totalCount || 0);
        setTotalPages(res.data.totalPages || 1);
        if (res.data.metrics) {
          setMetrics(res.data.metrics);
        }
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError(err?.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, activeTab, statusFilter, searchQuery, currentPage, rowsPerPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchProjects]);

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

  const combinedProjects = useMemo(() => {
    return projects.map((p, idx) => {
      const managerName = p.assignTo
        ? `${p.assignTo.firstName} ${p.assignTo.lastName || ""}`.trim()
        : p.creator
          ? `${p.creator.firstName} ${p.creator.lastName || ""}`.trim()
          : "Unassigned";

      return {
        ...p,
        category: p.description || "General Workspace",
        statusFormatted: p.status || "In Progress",
        startDateFormatted: formatDate(p.startDate),
        dueDateFormatted: formatDate(p.endDate),
        managerName,
        timeAgo: p.updatedAt
          ? formatTimeAgo(p.updatedAt)
          : `${idx + 1} day ago`,
      };
    });
  }, [projects]);

  const getStatusBadge = (st) => {
    switch (st) {
      case "IN_PROGRESS":
      case ProjectStatus.INPROGRESS:
        return <span className="project-status-pill pill-inprogress">In Progress</span>;
      case ProjectStatus.HOLD:
      case ProjectStatus.TODO:
      case "ONHOLD":
      case "PENDING":
        return <span className="project-status-pill pill-pending">On Hold</span>;
      case ProjectStatus.COMPLETED:
        return <span className="project-status-pill pill-completed">Completed</span>;
      case ProjectStatus.CANCELLED:
        return <span className="project-status-pill pill-cancelled">Cancelled</span>;
      default:
        return <span className="project-status-pill pill-inprogress">{st || "In Progress"}</span>;
    }
  };

  return (
    <div className="projects-management-page">
      <div className="projects-page-header">
        <div className="header-title-block">
          <h1 className="main-page-title">Projects</h1>
          <p className="main-page-subtitle">
            Manage, track, and collaborate on your active projects.
          </p>
        </div>
        <button
          className="btn-create-project"
          onClick={() => navigate("/create-project")}
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>New Project</span>
        </button>
      </div>

      <div className="projects-metric-cards-row">
        <div className="metric-summary-card">
          <div className="summary-icon-box bg-purple-soft">
            <FontAwesomeIcon icon={faFolder} className="color-purple" />
          </div>
          <div className="summary-info">
            <span className="summary-label">All Projects</span>
            <span className="summary-num">{metrics.total}</span>
            <span className="summary-sublabel">Total projects</span>
          </div>
        </div>

        <div className="metric-summary-card">
          <div className="summary-icon-box bg-green-soft">
            <FontAwesomeIcon icon={faPlay} className="color-green" />
          </div>
          <div className="summary-info">
            <span className="summary-label">In Progress</span>
            <span className="summary-num">{metrics.active}</span>
            <span className="summary-sublabel">Active projects</span>
          </div>
        </div>

        <div className="metric-summary-card">
          <div className="summary-icon-box bg-orange-soft">
            <FontAwesomeIcon icon={faPause} className="color-orange" />
          </div>
          <div className="summary-info">
            <span className="summary-label">On Hold</span>
            <span className="summary-num">{metrics.hold}</span>
            <span className="summary-sublabel">Pending projects</span>
          </div>
        </div>

        <div className="metric-summary-card">
          <div className="summary-icon-box bg-indigo-soft">
            <FontAwesomeIcon icon={faCheckCircle} className="color-indigo" />
          </div>
          <div className="summary-info">
            <span className="summary-label">Completed</span>
            <span className="summary-num">{metrics.completed}</span>
            <span className="summary-sublabel">Finished projects</span>
          </div>
        </div>

        <div className="metric-summary-card">
          <div className="summary-icon-box bg-red-soft">
            <FontAwesomeIcon icon={faTimesCircle} className="color-red" />
          </div>
          <div className="summary-info">
            <span className="summary-label">Cancelled</span>
            <span className="summary-num">{metrics.cancelled}</span>
            <span className="summary-sublabel">Closed projects</span>
          </div>
        </div>
      </div>

      <div className="projects-filter-bar">
        <div className="left-filter-tabs">
          <button
            className={`pill-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
          >
            All Projects
          </button>
          <button
            className={`pill-tab ${activeTab === "my" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("my");
              setCurrentPage(1);
            }}
          >
            My Projects
          </button>
        </div>

        <div className="filter-dropdown-container">
          <button
            className="btn-filter-toggle"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <FontAwesomeIcon icon={faFilter} className="filter-icon" />
            <span>
              {statusFilter === "ALL" ? "All Status" : statusFilter}
            </span>
            <FontAwesomeIcon icon={faChevronDown} className="chevron-icon" />
          </button>

          {showFilterDropdown && (
            <div className="filter-dropdown-menu">
              <button
                className={statusFilter === "ALL" ? "selected" : ""}
                onClick={() => {
                  setStatusFilter("ALL");
                  setCurrentPage(1);
                  setShowFilterDropdown(false);
                }}
              >
                All Status
              </button>
              <button
                className={statusFilter === ProjectStatus.INPROGRESS ? "selected" : ""}
                onClick={() => {
                  setStatusFilter(ProjectStatus.INPROGRESS);
                  setCurrentPage(1);
                  setShowFilterDropdown(false);
                }}
              >
                In Progress
              </button>
              <button
                className={statusFilter === ProjectStatus.TODO || statusFilter === "HOLD" ? "selected" : ""}
                onClick={() => {
                  setStatusFilter(ProjectStatus.TODO);
                  setCurrentPage(1);
                  setShowFilterDropdown(false);
                }}
              >
                On Hold
              </button>
              <button
                className={statusFilter === ProjectStatus.COMPLETED ? "selected" : ""}
                onClick={() => {
                  setStatusFilter(ProjectStatus.COMPLETED);
                  setCurrentPage(1);
                  setShowFilterDropdown(false);
                }}
              >
                Completed
              </button>
              <button
                className={statusFilter === ProjectStatus.CANCELLED ? "selected" : ""}
                onClick={() => {
                  setStatusFilter(ProjectStatus.CANCELLED);
                  setCurrentPage(1);
                  setShowFilterDropdown(false);
                }}
              >
                Cancelled
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="projects-table-main-card">
        <div className="table-top-bar">
          <h2 className="table-section-title">
            {activeTab === "my" ? "My Projects" : "All Projects"}
          </h2>
          <div className="table-search-wrapper">
            <input
              type="text"
              placeholder="Search projects..."
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
          <table className="projects-list-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Due Date</th>
                <th>Manager</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="empty-table-cell">
                    <p>Loading projects...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="empty-table-cell error-text">
                    <p>{error}</p>
                  </td>
                </tr>
              ) : combinedProjects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-table-cell">
                    <p>No projects found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                combinedProjects.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() =>
                      navigate("/view-project", { state: { project: p } })
                    }
                  >
                    <td>
                      <div className="project-details-col">
                        <span className="project-row-name">{p.name}</span>
                        {p.category && (
                          <span className="project-row-subtitle">{p.category}</span>
                        )}
                      </div>
                    </td>
                    <td>{getStatusBadge(p.statusFormatted)}</td>
                    <td className="table-date-text">{p.startDateFormatted}</td>
                    <td className="table-date-text">{p.dueDateFormatted}</td>
                    <td className="manager-text-cell">{p.managerName}</td>
                    <td className="table-date-text">{p.timeAgo}</td>
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
              Showing {combinedProjects.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * rowsPerPage, totalCount)} of {totalCount} projects
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
