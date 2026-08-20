import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCalendarAlt,
  faUpload,
  faTrash,
  faFilePdf,
  faFileImage,
  faFileLines,
  faChevronDown,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import { createTasks, updateTasks } from "../api/tasksApi";
import { getAllProject } from "../api/projectApi";
import { getAllUsers } from "../api/userApi";
import { TaskStatus, TaskPriority } from "../../enums";
import "./CreateTask.css";
export default function CreateTask({ isModal = false, onClose, onTaskSaved }) {
  const location = useLocation();
  const navigate = useNavigate();
  const taskToEdit = location.state?.task;
  const isEditMode = Boolean(taskToEdit);
  const defaultProjectId = location.state?.projectId || "";
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: TaskPriority.HIGH,
    status: TaskStatus.INPROGRESS,
    startDate: "",
    endDate: "",
    projectId: defaultProjectId,
    assignedTo: "",
    assignedBy: "",
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let parsedUser = null;
    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
    fetchMetadata(parsedUser);
    if (isEditMode && taskToEdit) {
      setFormData({
        name: taskToEdit.name || "",
        description: taskToEdit.description || "",
        priority: taskToEdit.priority || "HIGH",
        status:
          taskToEdit.status === "IN_PROGRESS"
            ? "INPROGRESS"
            : taskToEdit.status || "INPROGRESS",
        startDate: taskToEdit.startDate
          ? new Date(taskToEdit.startDate).toISOString().split("T")[0]
          : "",
        endDate: taskToEdit.endDate
          ? new Date(taskToEdit.endDate).toISOString().split("T")[0]
          : "",
        projectId: taskToEdit.projectId || defaultProjectId || "",
        assignedTo: taskToEdit.assignedTo || "",
        assignedBy: taskToEdit.assignedBy || parsedUser?.id || "",
      });
      setFiles([]);
    } else {
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "INPROGRESS",
        priority: "HIGH",
        projectId: defaultProjectId || "",
        assignedTo: "",
        assignedBy: parsedUser?.id || "",
      });
      setFiles([]);
    }
  }, [isEditMode, taskToEdit]);
  const fetchMetadata = async (activeUser) => {
    try {
      const [projRes, userRes] = await Promise.allSettled([
        getAllProject(),
        getAllUsers(),
      ]);
      if (projRes.status === "fulfilled") {
        const pList = Array.isArray(projRes.value?.data)
          ? projRes.value.data
          : Array.isArray(projRes.value)
            ? projRes.value
            : [];
        setProjects(pList);
        if (pList.length > 0 && !defaultProjectId && !formData.projectId) {
          setFormData((prev) => ({
            ...prev,
            projectId: prev.projectId || pList[0].id,
          }));
        }
      }
      if (userRes.status === "fulfilled") {
        const uList = Array.isArray(userRes.value?.data)
          ? userRes.value.data
          : Array.isArray(userRes.value)
            ? userRes.value
            : [];
        setUsers(uList);
        if (!isEditMode && activeUser && uList.length > 0) {
          setFormData((prev) => ({
            ...prev,
            assignedTo: "",
            assignedBy: activeUser.id,
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching metadata for task:", err);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFileUpload = (e) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    const file = uploadedFiles[0];
    const newFileEntry = {
      id: Date.now(),
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      type: file.type.includes("pdf")
        ? "pdf"
        : file.type.includes("image")
          ? "image"
          : "doc",
    };
    setFiles((prev) => [...prev, newFileEntry]);
  };
  const handleRemoveFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
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
    if (!formData.startDate) {
      setError("Start date is required.");
      return;
    }
    if (!formData.projectId) {
      setError("Please select a project.");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status:
          formData.status === "INPROGRESS" ? "INPROGRESS" : formData.status,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        projectId: Number(formData.projectId),
        assignedTo: formData.assignedTo ? Number(formData.assignedTo) : null,
        assignedBy: formData.assignedBy
          ? Number(formData.assignedBy)
          : currentUser?.id || null,
      };
      let res;
      if (isEditMode && taskToEdit?.id) {
        res = await updateTasks(taskToEdit.id, payload);
        setSuccess("Task updated successfully!");
      } else {
        res = await createTasks(payload);
        setSuccess("Task created successfully!");
      }
      if (onTaskSaved) {
        onTaskSaved(res);
      }
      setTimeout(() => {
        if (onClose) {
          onClose();
        } else {
          navigate("/tasks");
        }
      }, 500);
    } catch (err) {
      console.error("Failed to save task:", err);
      setError(
        err?.response?.data?.message || err.message || "Failed to save task."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/tasks");
    }
  };
  const getFileIcon = (type) => {
    if (type === "pdf") {
      return (
        <FontAwesomeIcon icon={faFilePdf} className="file-type-svg svg-pdf" />
      );
    }
    if (type === "image") {
      return (
        <FontAwesomeIcon
          icon={faFileImage}
          className="file-type-svg svg-image"
        />
      );
    }
    return (
      <FontAwesomeIcon icon={faFileLines} className="file-type-svg svg-doc" />
    );
  };
  const assignedUser = users.find((u) => u.id === Number(formData.assignedTo));
  return (
    <div className="create-project-modal-overlay">
      <div className="create-project-modal-card">
        <div className="modal-top-header">
          <div className="header-titles">
            <h2 className="modal-main-title">
              {isEditMode ? "Update Task" : "Create Task"}
            </h2>
            <p className="modal-sub-title">Fill in the task details below</p>
          </div>
        </div>
        {error && <div className="modal-alert-box error">{error}</div>}
        {success && <div className="modal-alert-box success">{success}</div>}
        <form onSubmit={handleSubmit} className="project-modal-form">
          <div className="form-2col-row">
            <div className="form-field-box">
              <label className="field-label">
                Task Name <span className="req-star">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="form-text-input"
                placeholder="Enter task name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field-box">
              <label className="field-label">
                Status <span className="req-star">*</span>
              </label>
              <div className="select-with-chevron">
                <select
                  name="status"
                  className="form-select-input"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="INPROGRESS">IN PROGRESS</option>
                  <option value="PENDING">PENDING</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="select-arrow-icon"
                />
              </div>
            </div>
          </div>
          <div className="form-field-box full-width">
            <label className="field-label">
              Description <span className="req-star">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-text-input"
              placeholder="Enter task description..."
              required
            />
          </div>
          <div className="form-2col-row">
            <div className="form-field-box">
              <label className="field-label">
                Start Date <span className="req-star">*</span>
              </label>
              <div className="input-with-icon">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="input-inner-icon"
                />
                <input
                  type="date"
                  name="startDate"
                  className="form-text-input date-input"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-field-box">
              <label className="field-label">Due Date</label>
              <div className="input-with-icon">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="input-inner-icon"
                />
                <input
                  type="date"
                  name="endDate"
                  className="form-text-input date-input"
                  value={formData.endDate}
                  onChange={handleChange}
                />
                {formData.endDate && (
                  <button
                    type="button"
                    className="btn-clear-input"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, endDate: "" }))
                    }
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="form-2col-row">
            <div className="form-field-box">
              <label className="field-label">
                Select Project <span className="req-star">*</span>
              </label>
              <div className="user-select-field">
                <div className="user-pill-display">
                  <FontAwesomeIcon
                    icon={faFolder}
                    style={{ color: "#f97316", fontSize: "14px" }}
                  />
                  <select
                    name="projectId"
                    className="embedded-user-select"
                    value={formData.projectId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select a Project --</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="select-arrow-icon"
                  />
                </div>
              </div>
            </div>
            <div className="form-field-box">
              <label className="field-label">
                Priority <span className="req-star">*</span>
              </label>
              <div className="select-with-chevron">
                <select
                  name="priority"
                  className="form-select-input"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value={TaskPriority.HIGH}>{TaskPriority.HIGH}</option>
                  <option value={TaskPriority.NORMAL}>{TaskPriority.NORMAL}</option>
                  <option value={TaskPriority.LOW}>{TaskPriority.LOW}</option>
                </select>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="select-arrow-icon"
                />
              </div>
            </div>
          </div>
          <div className="form-field-box">
            <label className="field-label">Assignee</label>
            <div className="user-select-field">
              <div className="user-pill-display">
                {assignedUser?.image ? (
                  <img
                    src={assignedUser.image}
                    alt="Assignee"
                    className="user-pill-avatar"
                  />
                ) : (
                  <div className="user-pill-avatar-placeholder">
                    {(assignedUser?.firstName || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <select
                  name="assignedTo"
                  className="embedded-user-select"
                  value={formData.assignedTo}
                  onChange={handleChange}
                >
                  <option value="">-- Select Assignee --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.firstName} {u.lastName} ({u.email})
                    </option>
                  ))}
                </select>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="select-arrow-icon"
                />
              </div>
            </div>
          </div>
          <div className="form-field-box full-width">
            <label className="field-label">Task Files (Optional)</label>
            <div className="file-dropzone-box">
              <input
                type="file"
                id="task-file-upload-input"
                className="hidden-native-file-input"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="task-file-upload-input"
                className="dropzone-inner-label"
              >
                <div className="cloud-icon-circle">
                  <FontAwesomeIcon icon={faUpload} />
                </div>
                <span className="dropzone-sub-text">
                  PNG, JPG, PDF up to 10MB
                </span>
              </label>
            </div>
            {files.length > 0 && (
              <div className="uploaded-files-list">
                {files.map((file) => (
                  <div key={file.id} className="uploaded-file-row">
                    <div className="file-icon-and-details">
                      {getFileIcon(file.type)}
                      <div className="file-meta-col">
                        <span className="file-entry-name">{file.name}</span>
                        <span className="file-entry-sub">
                          {file.size} • Uploaded on {file.date}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-delete-file-row"
                      onClick={() => handleRemoveFile(file.id)}
                      title="Remove file"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-actions-footer">
            <button
              type="button"
              className="btn-cancel-modal"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save-project-modal"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Update Task"
                  : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
