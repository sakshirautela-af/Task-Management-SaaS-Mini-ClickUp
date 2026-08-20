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
} from "@fortawesome/free-solid-svg-icons";
import { createProject, updateProject } from "../api/projectApi";
import { getAllUsers } from "../api/userApi";
import { getFilesByProject, uploadFile, deleteFile } from "../api/fileApi";
import "./CreateProject.css";
import { ProjectStatus } from "../../enums";
export default function CreateProject() {
  const location = useLocation();
  const navigate = useNavigate();
  const projectToEdit = location.state?.project;
  const isEditMode = Boolean(projectToEdit);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: ProjectStatus.TODO,
    assignId: "",
    createdBy: "",
    updatedBy: "",
  });
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
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
    fetchUsers(parsedUser);
    if (isEditMode && projectToEdit) {
      setFormData({
        name: projectToEdit.name || "",
        description: projectToEdit.description || "",
        startDate: projectToEdit.startDate
          ? new Date(projectToEdit.startDate).toISOString().split("T")[0]
          : "",
        endDate: projectToEdit.endDate
          ? new Date(projectToEdit.endDate).toISOString().split("T")[0]
          : "",
        status: projectToEdit.status,
        assignId: projectToEdit.assignId || "",
        createdBy: projectToEdit.createdBy || parsedUser?.id || "",
        updatedBy: projectToEdit.updatedBy || parsedUser?.id || "",
        isActive:
          projectToEdit.isActive !== undefined ? projectToEdit.isActive : true,
      });
      fetchProjectFiles(projectToEdit.id);
    } else {
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "INPROGRESS",
        assignId: "",
        createdBy: parsedUser?.id || "",
        updatedBy: parsedUser?.id || "",
        isActive: true,
      });
      setFiles([]);
    }
  }, [isEditMode, projectToEdit]);
  const fetchUsers = async (parsedUser) => {
    try {
      const res = await getAllUsers();
      const userList = res?.data;
      setUsers(userList);
      if (!isEditMode && userList.length > 0) {
        setFormData((prev) => ({
          ...prev,
          assignId: "",
          createdBy: parsedUser?.id,
          updatedBy: parsedUser?.id,
        }));
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };
  const fetchProjectFiles = async (projectId) => {
    try {
      const res = await getFilesByProject(projectId);
      const fileData = res?.body || res?.data || res || [];
      if (Array.isArray(fileData) && fileData.length > 0) {
        setFiles(
          fileData.map((f) => ({
            id: f.id,
            name: f.location ? f.location.split("/").pop() : "Attached File",
            size: "1.2 MB",
            date: new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            type:
              f.location?.endsWith(".png") || f.location?.endsWith(".jpg")
                ? "image"
                : f.location?.endsWith(".pdf")
                  ? "pdf"
                  : "doc",
            downloadUrl: f.downloadUrl,
          })),
        );
      } else {
        setFiles([]);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      setFiles([]);
    }
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleFileUpload = async (e) => {
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
      type: file.type.includes("image")
        ? "image"
        : file.type.includes("pdf")
          ? "pdf"
          : "doc",
      fileObj: file,
    };
    setFiles((prev) => [...prev, newFileEntry]);
    if (isEditMode && projectToEdit?.id) {
      try {
        setUploading(true);
        await uploadFile(projectToEdit.id, file);
      } catch (err) {
        console.error("Failed to upload file to backend:", err);
      } finally {
        setUploading(false);
      }
    }
  };
  const handleRemoveFile = async (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (typeof fileId === "number" && isEditMode) {
      try {
        await deleteFile(fileId);
      } catch (err) {
        console.error("Failed to delete file from backend:", err);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!formData.name.trim()) {
      setError("Project name is required.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Project description is required.");
      return;
    }
    if (!formData.startDate) {
      setError("Start date is required.");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        status:
          formData.status === status.INPROGRESS
            ? status.INPROGRESS
            : formData.status,
        assignId: formData.assignId ? Number(formData.assignId) : null,
        createdBy: formData.createdBy
          ? Number(formData.createdBy)
          : currentUser?.id,
        updatedBy: currentUser?.id || Number(formData.updatedBy) || null,
        isActive: formData.isActive,
      };
      let res;
      if (isEditMode && projectToEdit?.id) {
        res = await updateProject(projectToEdit.id, payload);
        setSuccess("Project updated successfully!");
      } else {
        res = await createProject(payload);
        setSuccess("Project created successfully!");
      }
      setTimeout(() => {
        navigate(-1);
      }, 500);
    } catch (err) {
      console.error("Failed to save project:", err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to save project.",
      );
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    navigate("/projects");
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
  const assignedUser = users.find((u) => u.id === Number(formData.assignId));
  return (
    <div className="create-project-modal-overlay">
      <div className="create-project-modal-card">
        <div className="modal-top-header">
          <div className="header-titles">
            <h2 className="modal-main-title">
              {isEditMode ? "Update Project" : "Create Project"}
            </h2>
            <p className="modal-sub-title">Fill in the project details below</p>
          </div>
        </div>
        {error && <div className="modal-alert-box error">{error}</div>}
        {success && <div className="modal-alert-box success">{success}</div>}
        <form onSubmit={handleSubmit} className="project-modal-form">
          <div className="form-2col-row">
            <div className="form-field-box">
              <label className="field-label">
                Project Name <span className="req-star">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="form-text-input"
                placeholder="Enter project name"
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
                  {Object.values(status).map((st) => (
                    <option key={st} value={st}>
                      {st}
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
            <label className="field-label">
              Description <span className="req-star">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-text-input"
              placeholder="Enter project description..."
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
              <label className="field-label">End Date</label>
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
          <div className="form-field-box">
            <label className="field-label">Manager</label>
            <div className="user-select-field">
              <div className="user-pill-display">
                {assignedUser?.email && <p>{assignedUser.email}</p>}
                <select
                  name="assignId"
                  className="embedded-user-select"
                  value={formData.assignId}
                  onChange={handleChange}
                >
                  <option value="">Select a manager...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.firstName} {u.lastName}
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
            <label className="field-label">Project Files (Optional)</label>
            <div className="file-dropzone-box">
              <input
                type="file"
                id="file-upload-input"
                className="hidden-native-file-input"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="file-upload-input"
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
              disabled={loading || uploading}
            >
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Update Project"
                  : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
