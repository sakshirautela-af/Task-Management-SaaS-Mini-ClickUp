import { useEffect, useState } from "react";
import "./home.css";
import { getDashboardStats } from "../api/projectApi";

export default function Home() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getDashboardStats(2);

        console.log("Dashboard response:", response);

        setStats(response.data);

      } catch (error) {
        console.error(
          "Failed to fetch dashboard stats:",
          error
        );

        setError(
          error?.response?.data?.message ||
          "Failed to load dashboard statistics."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-page">

      <div className="page-header">
        <div>
          <h1>Dashboard Overview</h1>

          <p>
            Welcome back! Here's what's happening
            with your projects today.
          </p>
        </div>
      </div>


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {loading ? (

        <div className="loading">
          Loading dashboard...
        </div>

      ) : (

        <>


          <div className="summary-cards">


            <div className="stat-card">

              <div className="stat-card-top">

                <div className="stat-icon project-icon">
                  📁
                </div>

                <span className="stat-label">
                  Projects
                </span>

              </div>

              <h2>
                {stats.totalProjects}
              </h2>

              <p>
                Total projects
              </p>

            </div>


            {/* Total Tasks */}

            <div className="stat-card">

              <div className="stat-card-top">

                <div className="stat-icon task-icon">
                  ✓
                </div>

                <span className="stat-label">
                  Tasks
                </span>

              </div>

              <h2>
                {stats.totalTasks}
              </h2>

              <p>
                Total tasks
              </p>

            </div>


            {/* Completed Tasks */}

            <div className="stat-card">

              <div className="stat-card-top">

                <div className="stat-icon completed-icon">
                  ✓
                </div>

                <span className="stat-label">
                  Completed
                </span>

              </div>

              <h2>
                {stats.completedTasks}
              </h2>

              <p>
                Tasks completed
              </p>

            </div>


            {/* Pending Tasks */}

            <div className="stat-card">

              <div className="stat-card-top">

                <div className="stat-icon pending-icon">
                  !
                </div>

                <span className="stat-label">
                  Pending
                </span>

              </div>

              <h2>
                {stats.pendingTasks}
              </h2>

              <p>
                Tasks remaining
              </p>

            </div>

          </div>




        </>

      )}

    </div>
  );
}