import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import Sidebar from "../sidebar/Sidebar";
import "./home.css";
import { getAllProject } from "../api/projectApi";
import { getAllTasks } from "../api/tasksApi";
import { Link } from "react-router-dom";

export default function Home() {
  const [active, setActive] = useState("home");
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const projectsData = await getAllProject();
        const tasksData = await getAllTasks();
        setProjects(projectsData || []);
        setTasks(tasksData || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  return (
    <div className="container">
      <Navbar />
      <div className="home-div">
        <Sidebar />
        <div className="dashboard-main">
          <header className="dashboard-header">
            <h1>Dashboard Overview</h1>
            <p>Welcome back! Here's what's happening with your projects today.</p>
          </header>

          {loading ? (
            <div className="loading-spinner">Loading dashboard data...</div>
          ) : (
            <div className="dashboard-content">
              {/* Summary Cards */}
              <section className="summary-cards">
                <div className="card stat-card primary">
                  <h3>Total Projects</h3>
                  {/* <div className="stat-value">{totalProjects}</div> */}
                </div>
                <div className="card stat-card secondary">
                  <h3>Total Tasks</h3>
                  {/* <div className="stat-value">{totalTasks}</div> */}
                </div>
                <div className="card stat-card success">
                  <h3>Completed Tasks</h3>
                  {/* <div className="stat-value">{completedTasks}</div> */}
                </div>
                <div className="card stat-card warning">
                  <h3>Pending Tasks</h3>
                  {/* <div className="stat-value">{pendingTasks}</div> */}
                </div>
              </section>

              <div className="dashboard-grid">
                {/* Recent Projects */}
                <section className="card list-section">
                  <div className="section-header">
                    <h2>Recent Projects</h2>
                    <Link to="/projects" className="view-all-link">View All</Link>
                  </div>
                  {/* {recentProjects.length > 0 ? (
                    <ul className="item-list">
                      {recentProjects.map((project, index) => (
                        <li key={index} className="list-item">
                          <div className="item-details">
                            <h4>{project.name || project.title || 'Untitled Project'}</h4>
                            <span className="item-meta">{project.description || 'No description'}</span>
                          </div>
                          <div className="item-action">
                            <span className="badge badge-primary">Active</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-state">No projects found. Create one to get started!</p>
                  )} */}
                </section>

                {/* Upcoming Tasks */}
                {/* <section className="card list-section">
                  <div className="section-header">
                    <h2>Upcoming Tasks</h2>
                    <Link to="/tasks" className="view-all-link">View All</Link>
                  </div>
                  {upcomingTasks.length > 0 ? (
                    <ul className="item-list">
                      {upcomingTasks.map((task, index) => (
                        <li key={index} className="list-item">
                          <div className="item-details">
                            <h4>{ task.name }</h4>
                            <span className="item-meta">
                              {task.priority && `Priority: ${task.priority}`}
                            </span>
                          </div>
                          <div className="item-action">
                            <span className="badge badge-warning">Pending</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-state">No pending tasks. You're all caught up!</p>
                  )}
                </section> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}