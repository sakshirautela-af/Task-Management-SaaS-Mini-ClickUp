import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFolderOpen,
  faBriefcase,
  faListCheck,
  faCheckCircle,
  faClock,
  faEllipsisVertical,
  faEye,
  faPen,
  faArrowRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { getAllProject, getDashboardStats } from "../api/projectApi";
import { getAllTasks } from "../api/tasksApi";
import { ProjectStatus, TaskStatus } from "../../enums";
import "./home.css";

export default function Home() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [projectsList, setProjectsList] = useState([]);
  const [tasksList, setTasksList] = useState([]);
  const [backendStats, setBackendStats] = useState(null);
  const [activeProjectMenu, setActiveProjectMenu] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const userObj = JSON.parse(storedUser);
        setCurrentUser(userObj);
      } catch (e) {
        console.error("Error parsing user", e);
      }
    } else {
      navigate("/signin");
      return;
    }

    const userObj = storedUser ? JSON.parse(storedUser) : null;

    const fetchData = async () => {
      try {
        const promises = [
          getAllProject(),
          getAllTasks(),
        ];

        if (userObj?.id) {
          promises.push(getDashboardStats(userObj.id));
        }

        const [projRes, tasksRes, statsRes] = await Promise.allSettled(promises);

        if (projRes.status === "fulfilled" && projRes.value?.data) {
          setProjectsList(projRes.value.data);
        }
        if (tasksRes.status === "fulfilled") {
          setTasksList(tasksRes.value?.data || tasksRes.value || []);
        }
        if (statsRes && statsRes.status === "fulfilled" && statsRes.value?.data) {
          setBackendStats(statsRes.value.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };

    fetchData();
  }, [navigate]);

  const myProjectsCount = useMemo(() => {
    if (!currentUser) return 0;
    return projectsList.filter(
      (p) => p.createdBy === currentUser.id || p.assignId === currentUser.id
    ).length;
  }, [projectsList, currentUser]);

  const stats = useMemo(() => {
    const totalProjects = backendStats?.totalProjects ?? projectsList.length;
    const workingProjects = myProjectsCount;
    const totalTasks = backendStats?.totalTasks ?? tasksList.length;
    const completedTasks =
      backendStats?.completedTasks ??
      tasksList.filter((t) => t.status === TaskStatus.COMPLETED).length;
    const pendingTasks =
      backendStats?.pendingTasks ??
      tasksList.filter(
        (t) =>
          t.status === TaskStatus.PENDING ||
          t.status === "TODO" ||
          t.status === TaskStatus.INPROGRESS ||
          t.status === "IN_PROGRESS"
      ).length;

    return {
      allProjects: totalProjects,
      myProjects: myProjectsCount,
      workingProjects: workingProjects,
      totalTasks: totalTasks,
      completedTasks: completedTasks,
      pendingTasks: pendingTasks,
    };
  }, [backendStats, projectsList, tasksList, myProjectsCount]);

  const upcomingDeadlines = useMemo(() => {
    const validTasks = tasksList
      .filter((t) => t.endDate)
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
      .slice(0, 5);

    return validTasks.map((t) => {
      const parentProj = projectsList.find((p) => p.id === t.projectId);
      return {
        id: t.id,
        title: `${parentProj ? parentProj.name + " - " : ""}${t.name}`,
        date: formatDate(t.endDate),
        priority: t.priority
          ? t.priority.charAt(0) + t.priority.slice(1).toLowerCase()
          : "Normal",
        priorityClass: (t.priority || "NORMAL").toLowerCase(),
        rawTask: t,
      };
    });
  }, [tasksList, projectsList]);

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

  const getStatusPill = (status) => {
    if (status === "IN_PROGRESS" || status === ProjectStatus.INPROGRESS) {
      return <span className="dash-pill in-progress">In Progress</span>;
    }
    if (status === ProjectStatus.COMPLETED) {
      return <span className="dash-pill completed">Completed</span>;
    }
    if (status === ProjectStatus.HOLD || status === "HOLD") {
      return <span className="dash-pill hold">On Hold</span>;
    }
    if (status === ProjectStatus.CANCELLED) {
      return <span className="dash-pill cancelled">Cancelled</span>;
    }
    return <span className="dash-pill todo">To Do</span>;
  };

  const workingProjectsList = useMemo(() => {
    const list = currentUser
      ? projectsList.filter(
        (p) => p.createdBy === currentUser.id || p.assignId === currentUser.id
      )
      : projectsList;

    return list.slice(0, 6).map((p) => ({
      ...p,
      category: p.description || "Project Workspace",
    }));
  }, [projectsList, currentUser]);

  return (
    <div className="dashboard-container">
      {/* Header Row */}
      <div className="dashboard-header-row">
        <div className="greeting-block">
          <h1 className="greeting-title">
            Welcome back, {currentUser?.firstName || "User"}! 👋
          </h1>
          <p className="greeting-subtitle">
            Here's what's happening with your workspace today.
          </p>
        </div>
        <div className="dashboard-header-actions">
          <button
            className="btn-dash-primary"
            onClick={() => navigate("/create-project")}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>New Project</span>
          </button>
          <button
            className="btn-dash-secondary"
            onClick={() => navigate("/create-task")}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="metrics-cards-grid">
        <div className="metric-card">
          <div className="metric-icon-box bg-purple-light">
            <FontAwesomeIcon icon={faFolder} className="text-purple" />
          </div>
          <div className="metric-card-bottom">
            <span className="metric-number">{stats.allProjects}</span>
            <span className="metric-title">Total Projects</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box bg-blue-light">
            <FontAwesomeIcon icon={faFolderOpen} className="text-blue" />
          </div>
          <div className="metric-card-bottom">
            <span className="metric-number">{stats.myProjects}</span>
            <span className="metric-title">My Projects</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box bg-green-light">
            <FontAwesomeIcon icon={faBriefcase} className="text-green" />
          </div>
          <div className="metric-card-bottom">
            <span className="metric-number">{stats.workingProjects}</span>
            <span className="metric-title">Working On</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box bg-orange-light">
            <FontAwesomeIcon icon={faListCheck} className="text-orange" />
          </div>
          <div className="metric-card-bottom">
            <span className="metric-number">{stats.totalTasks}</span>
            <span className="metric-title">Total Tasks</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box bg-indigo-light">
            <FontAwesomeIcon icon={faCheckCircle} className="text-indigo" />
          </div>
          <div className="metric-card-bottom">
            <span className="metric-number">{stats.completedTasks}</span>
            <span className="metric-title">Completed Tasks</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box bg-red-light">
            <FontAwesomeIcon icon={faClock} className="text-red" />
          </div>
          <div className="metric-card-bottom">
            <span className="metric-number">{stats.pendingTasks}</span>
            <span className="metric-title">Pending Tasks</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="dashboard-main-grid">
        <div className="dash-left-column">
          {/* Table Card */}
          <div className="dash-card table-card">
            <div className="dash-card-header">
              <h2 className="dash-card-title">Projects I'm Working On</h2>
              <Link to="/projects" className="dash-link-more">
                View all projects <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
            <div className="table-responsive-wrapper">
              <table className="dash-projects-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workingProjectsList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-table-cell">
                        No active projects currently.
                      </td>
                    </tr>
                  ) : (
                    workingProjectsList.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() =>
                          navigate("/view-project", { state: { project: p } })
                        }
                      >
                        <td>
                          <div className="project-title-col">
                            <span className="project-row-name">{p.name}</span>
                            <span className="project-row-cat">{p.category}</span>
                          </div>
                        </td>
                        <td>{getStatusPill(p.status)}</td>
                        <td className="date-cell">{formatDate(p.startDate)}</td>
                        <td className="date-cell">{formatDate(p.endDate)}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="row-action-menu-wrapper">
                            <button
                              className="btn-row-action"
                              onClick={() =>
                                setActiveProjectMenu(
                                  activeProjectMenu === p.id ? null : p.id
                                )
                              }
                              aria-label="Actions"
                            >
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                            {activeProjectMenu === p.id && (
                              <div className="action-dropdown-pop">
                                <button
                                  onClick={() => {
                                    setActiveProjectMenu(null);
                                    navigate("/view-project", {
                                      state: { project: p },
                                    });
                                  }}
                                >
                                  <FontAwesomeIcon icon={faEye} /> View Details
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveProjectMenu(null);
                                    navigate("/create-project", {
                                      state: { project: p },
                                    });
                                  }}
                                >
                                  <FontAwesomeIcon icon={faPen} /> Edit Project
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

        {/* Right Column (Side Widgets) */}
        <div className="dash-right-column">
          {/* Upcoming Deadlines */}
          <div className="dash-card side-widget-card">
            <div className="dash-card-header">
              <h2 className="dash-card-title">Upcoming Deadlines</h2>
              <Link to="/tasks" className="dash-link-more">
                View all <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
            <div className="deadlines-list">
              {upcomingDeadlines.length === 0 ? (
                <p className="empty-widget-text">No upcoming deadlines.</p>
              ) : (
                upcomingDeadlines.map((item) => (
                  <div
                    key={item.id}
                    className="deadline-item"
                    onClick={() =>
                      navigate("/view-task", { state: { task: item.rawTask } })
                    }
                  >
                    <div className="deadline-details">
                      <span className="deadline-title">{item.title}</span>
                      <span className="deadline-date">{item.date}</span>
                    </div>
                    <span className={`priority-tag ${item.priorityClass}`}>
                      {item.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}