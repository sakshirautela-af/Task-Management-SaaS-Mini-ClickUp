import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createTasks, updateTasks } from "../api/tasksApi";
import "./CreateTask.css";

export default function CreateTask() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // task could be passed if we are in edit mode
  const taskToEdit = location.state?.task;
  const isEditMode = Boolean(taskToEdit);
  
  // projectId could be passed if we came from a specific project page
  const defaultProjectId = location.state?.projectId || "";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "NORMAL",
    status: "PENDING",
    startDate: "",
    endDate: "",
    projectId: defaultProjectId,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const t = taskToEdit;
      setFormData({
        name: t.name || "",
        description: t.description || "",
        priority: t.priority || "NORMAL",
        status: t.status || "PENDING",
        startDate: t.startDate ? new Date(t.startDate).toISOString().split('T')[0] : "",
        endDate: t.endDate ? new Date(t.endDate).toISOString().split('T')[0] : "",
        projectId: t.projectId || "",
      });
    }
  }, [isEditMode, taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Task name is required.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Task description is required.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        projectId: formData.projectId ? Number(formData.projectId) : null,
      };

      if (isEditMode) {
        await updateTasks(taskToEdit.id, payload);
        setSuccess("Task updated successfully!");
      } else {
        await createTasks(payload);
        setSuccess("Task created successfully!");
        setFormData({
          name: "",
          description: "",
          priority: "NORMAL",
          status: "PENDING",
          startDate: "",
          endDate: "",
          projectId: defaultProjectId,
        });
      }
    } catch (err) {
      console.error("Failed to save task:", err);
      setError(err?.response?.data?.message || "Failed to save task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-task-page">
      <div className="create-task-container">
        
        {/* Header Actions */}
        <div className="task-form-actions-header">
          <button className="back-link" onClick={() => navigate(-1)}>
            &larr; Back
          </button>
        </div>

        <div className="form-header">
          <div>
            <h1>{isEditMode ? "Update Task" : "Create Task"}</h1>
            <p>
              {isEditMode 
                ? "Update the details of your task." 
                : "Create a new task and assign its priority and status."}
            </p>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <form className="task-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="name">
              Task Name <span className="required">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter task name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">Due Date</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">
                Priority <span className="required">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="LOW">Low</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">
                Status <span className="required">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="PENDING">Pending</option>
                <option value="INPROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="projectId">
              Project ID <span className="optional">Optional</span>
            </label>
            <input
              id="projectId"
              name="projectId"
              type="number"
              placeholder="Enter Project ID"
              value={formData.projectId}
              onChange={handleChange}
            />
          </div>

          <p className="required-note">
            <span className="required">*</span> Required fields
          </p>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? isEditMode ? "Updating..." : "Creating..."
                : isEditMode ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
