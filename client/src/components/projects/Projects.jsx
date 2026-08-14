import React, { useState, useEffect } from "react";
import { getAllProject, createProject, deleteProject, updateProject } from "../api/projectApi";
import Navbar from "../navbar/navbar";
import Sidebar from "../sidebar/Sidebar";
import RightSidebar from "../sidebar/RightSidebar";
import Tasks from "../tasks/tasks";
import "./Projects.css";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [userId, setUserId] = useState("");
    const [editingProjectId, setEditingProjectId] = useState(null);

    // Determine current user role for UI permissions
    const storedUserStr = localStorage.getItem("user");
    let componentUserRole = null;
    if (storedUserStr) {
        try {
            const userObj = JSON.parse(storedUserStr);
            componentUserRole = userObj.role;
        } catch (e) { }
    }

    // Expand tasks
    const [expandedProjectId, setExpandedProjectId] = useState(null);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await getAllProject();
            if (res.data) setProjects(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    const openModal = (p = null) => {
        const storedUserStr = localStorage.getItem("user");
        let currentUserRole = null;
        if (storedUserStr) {
            try {
                const userObj = JSON.parse(storedUserStr);
                currentUserRole = userObj.role;
            } catch (e) { }
        }

        // if (currentUserRole === 'USER') {
        //     alert("Access Denied: You do not have permission to perform this action.");
        //     return;
        // }

        if (p) {
            setEditingProjectId(p.id);
            setName(p.name);
            setDescription(p.description);
            setStartDate(p.startDate ? p.startDate.split('T')[0] : "");
        } else {
            setEditingProjectId(null);
            setName("");
            setDescription("");
            setStartDate("");
        }
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        const storedUserStr = localStorage.getItem("user");
        let currentUserId = null;
        let currentUserRole = null;
        if (storedUserStr) {
            try {
                const userObj = JSON.parse(storedUserStr);
                if (userObj && userObj.id) {
                    currentUserId = userObj.id;
                    currentUserRole = userObj.role;
                }
            } catch (e) { }
        }

        if (!currentUserId) {
            alert("Access Denied: You must be logged in to create or update a project.");
            return;
        }

        // if (currentUserRole === 'USER') {
        //     alert("Access Denied: You do not have permission to create or update projects.");
        //     return;
        // }

        const payload = {
            name, description,
            startDate: startDate || new Date().toISOString().split('T')[0],
            userId: currentUserId
        };
        try {
            if (editingProjectId) await updateProject(editingProjectId, payload);
            else await createProject(payload);
            setShowModal(false);
            fetchProjects();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        await deleteProject(id);
        fetchProjects();
    };

    // Calculate dynamic stats
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'INPROGRESS' || p.status === 'TODO').length;
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const cancelledProjects = projects.filter(p => p.status === 'CANCELLED').length;

    return (
        <div className="app-layout">
            <Sidebar />

            <div className="right-panel">
                <Navbar />

                <div className="content-split">
                    <div className="workspace">
                        <div className="workspace-header">
                            <div className="title-area">
                                <div className="title-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                </div>
                                <div>
                                    <h2>Projects</h2>
                                    <p>Manage and track all your projects in one place.</p>
                                </div>
                            </div>
                            {/* {componentUserRole !== 'USER' && ( */}
                                <button className="new-btn" onClick={() => openModal()}>
                                    + New Project
                                </button>
                            {/* )} */}
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon purple">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                </div>
                                <div className="stat-info">
                                    <span>Total Projects</span>
                                    <strong>{totalProjects}</strong>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon green">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                </div>
                                <div className="stat-info">
                                    <span>Active Projects</span>
                                    <strong>{activeProjects}</strong>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon blue">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                </div>
                                <div className="stat-info">
                                    <span>Completed</span>
                                    <strong>{completedProjects}</strong>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon red">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                </div>
                                <div className="stat-info">
                                    <span>On Hold</span>
                                    <strong>{cancelledProjects}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="tabs-container">
                            <div className="tabs">
                                <button className="tab active">All Projects</button>
                                <button className="tab">My Projects</button>
                                <button className="tab">Owned by Me</button>
                            </div>
                            <div className="table-search">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input type="text" placeholder="Search projects..." />
                                <button className="filter-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg></button>
                            </div>
                        </div>

                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Project</th>
                                        <th>Status</th>
                                        <th>Due Date</th>
                                        <th>Owner</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map(p => (
                                        <React.Fragment key={p.id}>
                                            <tr className={expandedProjectId === p.id ? 'expanded-row' : ''}>
                                                <td onClick={() => setExpandedProjectId(expandedProjectId === p.id ? null : p.id)} style={{ cursor: 'pointer' }}>
                                                    <div className="project-cell">
                                                        <div className="project-icon" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                                        </div>
                                                        <div className="project-name-desc">
                                                            <strong>{p.name}</strong>
                                                            <span>{p.description}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`status-pill ${p.status === 'COMPLETED' ? 'success' : 'active'}`}>
                                                        <span className="dot"></span> {p.status}
                                                    </span>
                                                </td>
                                                <td><span className="date-text">{p.startDate ? p.startDate.split('T')[0] : 'No Date'}</span></td>
                                                <td>
                                                    <div className="owner-cell">
                                                        <div className="avatar xs">U</div>
                                                        <span>{p.createdBy}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="actions-menu">
                                                        <button className="action-btn" onClick={() => openModal(p)}>✎</button>
                                                        <button className="action-btn delete" onClick={() => handleDelete(p.id)}>✖</button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedProjectId === p.id && (
                                                <tr className="tasks-row">
                                                    <td colSpan="6">
                                                        <div className="tasks-dropdown-area">
                                                            <Tasks projectId={p.id} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <RightSidebar projects={projects} />
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{editingProjectId ? 'Update Project' : 'Create New Project'}</h3>
                        <form onSubmit={handleSave}>
                            <input className="premium-input w-full mb-3" placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} />
                            <input className="premium-input w-full mb-3" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                            <input className="premium-input w-full mb-3" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            <div className="modal-actions">
                                <button type="button" className="premium-btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="premium-btn">{editingProjectId ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}