import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createProject, updateProject } from "../api/projectApi";
import "./CreateProject.css";

export default function CreateProject() {
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = Boolean(location.state?.project);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "TODO",
    assignId: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const p = location.state.project;
      setFormData({
        name: p.name || "",
        description: p.description || "",
        startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : "",
        endDate: p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : "",
        status: p.status || "TODO",
        assignId: p.assignId || "",
        isActive: p.isActive !== undefined ? p.isActive : true,
      });
    }
  }, [isEditMode, location.state]);  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? checked
        : value,
    }));

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation

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

    if (
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      setError(
        "End date cannot be before start date."
      );
      return;
    }


    try {

      setLoading(true);

      const payload = {
        name: formData.name.trim(),

        description:
          formData.description.trim(),

        startDate:
          formData.startDate,

        endDate:
          formData.endDate || null,

        status:
          formData.status,

        assignId:
          formData.assignId
            ? Number(formData.assignId)
            : null,

        isActive:
          formData.isActive,
      };


      let response;
      if (isEditMode) {
        response = await updateProject(location.state.project.id, payload);
        console.log("Project updated:", response);
        setSuccess("Project updated successfully!");
      } else {
        response = await createProject(payload);
        console.log("Project created:", response);
        setSuccess("Project created successfully!");
        // Reset form
        setFormData({
          name: "",
          description: "",
          startDate: "",
          endDate: "",
          status: "TODO",
          assignId: "",
          isActive: true,
        });
      }

    } catch (error) {

      console.error(
        "Failed to create project:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to create project."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="create-project-page">

      <div className="create-project-container">

        {/* Header */}

        <div className="form-header">

          <div>
            <h1>
              {isEditMode ? "Update Project" : "Create Project"}
            </h1>

            <p>
              {isEditMode 
                ? "Update the details of your project." 
                : "Create a new project and manage its tasks and team members."}
            </p>
          </div>

        </div>


        {/* Error */}

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}


        {/* Success */}

        {success && (
          <div className="form-success">
            {success}
          </div>
        )}


        {/* Form */}

        <form
          className="project-form"
          onSubmit={handleSubmit}
        >

          {/* Project Name */}

          <div className="form-group">

            <label htmlFor="name">
              Project Name
              <span className="required">*</span>
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter project name"
              value={formData.name}
              onChange={handleChange}
            />

          </div>


          {/* Description */}

          <div className="form-group">

            <label htmlFor="description">
              Description
              <span className="required">*</span>
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder="Enter project description"
              value={formData.description}
              onChange={handleChange}
            />

          </div>


          {/* Date Row */}

          <div className="form-row">

            {/* Start Date */}

            <div className="form-group">

              <label htmlFor="startDate">
                Start Date
                <span className="required">*</span>
              </label>

              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
              />

            </div>


            {/* End Date */}

            <div className="form-group">

              <label htmlFor="endDate">
                End Date
                <span className="optional">
                  Optional
                </span>
              </label>

              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* Status + Assign */}

          <div className="form-row">

            {/* Status */}

            <div className="form-group">

              <label htmlFor="status">
                Status
                <span className="required">*</span>
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="TODO">
                  To Do
                </option>

                <option value="IN_PROGRESS">
                  In Progress
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="HOLD">
                  On Hold
                </option>

              </select>

            </div>


            {/* Assign */}

            <div className="form-group">

              <label htmlFor="assignId">
                Assign To
                <span className="optional">
                  Optional
                </span>
              </label>

              <input
                id="assignId"
                name="assignId"
                type="number"
                placeholder="User ID"
                value={formData.assignId}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* Active */}

          <div className="form-checkbox">

            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
            />

            <label htmlFor="isActive">
              Project is active
            </label>

          </div>


          {/* Required information */}

          <p className="required-note">
            <span className="required">*</span>
            Required fields
          </p>


          {/* Buttons */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setFormData({
                  name: "",
                  description: "",
                  startDate: "",
                  endDate: "",
                  status: "TODO",
                  assignId: "",
                  isActive: true,
                });

                setError("");
                setSuccess("");
              }}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >

              {loading
                ? (isEditMode ? "Updating..." : "Creating...")
                : (isEditMode ? "Update Project" : "Create Project")}

            </button>

          </div>

        </form>

      </div>

    </div>

  );
}