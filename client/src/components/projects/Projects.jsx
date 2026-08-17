import React, { useState, useEffect } from "react";

import { getAllProject, deleteProject } from "../api/projectApi";

import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faEllipsisVertical,
  faPen,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

import "./Projects.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [selectedProject, setSelectedProject] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        setError(null);

        const response = await getAllProject();

        console.log("Projects response:", response);

        setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);

        setError(error?.response?.data?.message || "Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    navigate("/create-project");
  };

  const handleOperations = (project) => {
    if (selectedProject?.id === project.id) {
      setSelectedProject(null);
    } else {
      setSelectedProject(project);
    }
  };

  const handleUpdate = (project) => {
    navigate("/create-project", { state: { project } });
    setSelectedProject(null);
  };
  const handleView = (project) => {
    navigate("/view-project", { state: { project } });
    setSelectedProject(null);
  };
  const handleDelete = async (project) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${project.name}"?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteProject(project.id);

      setProjects((prevProjects) =>
        prevProjects.filter((item) => item.id !== project.id),
      );

      setSelectedProject(null);
    } catch (error) {
      console.error("Failed to delete project:", error);

      setError(error?.response?.data?.message || "Failed to delete project.");
    }
  };

  return (
    <div className="content-split">
      <div className="workspace">
        <div className="left-pannel">
          <div>
            <button
              className="create-project-btn"
              onClick={handleCreateProject}
            >
              Create New Project
            </button>
          </div>

          <div className="project-div">
            <h2>Projects</h2>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading && <div className="loading">Loading projects...</div>}

        {!loading && !error && (
          <>
            <div className="status-div">
              <div className="total-project">
                <h3>Total Projects</h3>

                <strong>{projects.length}</strong>
              </div>

              <div className="active-project">
                <h3>Active Projects</h3>

                <strong>
                  {
                    projects.filter((project) => project.isActive === true)
                      .length
                  }
                </strong>
              </div>

              <div className="completed-project">
                <h3>Completed</h3>

                <strong>
                  {
                    projects.filter((project) => project.status === "COMPLETED")
                      .length
                  }
                </strong>
              </div>

              <div className="hold-project">
                <h3>On Hold</h3>

                <strong>
                  {
                    projects.filter((project) => project.status === "HOLD")
                      .length
                  }
                </strong>
              </div>
            </div>

            <div className="projectdive">
              <div className="active-tab">All Projects</div>

              <div>My Projects</div>
            </div>

            <div className="projects-list">
              {projects.length === 0 ? (
                <p>No projects found.</p>
              ) : (
                <table className="projects-table">
                  <thead>
                    <tr>
                      <th>Project</th>

                      <th>Status</th>

                      <th>Tasks</th>

                      <th>Start Date</th>

                      <th>Description</th>

                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td>
                          <div className="project-name">
                            <strong>{project.name}</strong>
                          </div>
                        </td>

                        <td>
                          <span className="project-status">
                            {project.status}
                          </span>
                        </td>

                        <td>📋 {project.tasks?.length ?? 0}</td>

                        <td>
                          {project.startDate
                            ? new Date(project.startDate).toLocaleDateString()
                            : "No start date"}
                        </td>

                        <td>{project.description || "No description"}</td>

                        <td className="action-cell">
                          <div className="menu-container">
                            <button
                              className="menu-trigger"
                              onClick={() => handleOperations(project)}
                            >
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>

                            {selectedProject?.id === project.id && (
                              <div className="action-menu">
                                <button onClick={() => handleView(project)}>
                                  <FontAwesomeIcon icon={faEye} />
                                  <span>view</span>
                                </button>
                                <button onClick={() => handleUpdate(project)}>
                                  <FontAwesomeIcon icon={faPen} />
                                  <span>Update</span>
                                </button>
                                <button
                                  className="delete-menu-item"
                                  onClick={() => handleDelete(project)}
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
