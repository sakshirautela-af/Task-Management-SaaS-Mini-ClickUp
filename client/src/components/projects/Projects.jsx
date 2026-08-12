import { useState, useEffect } from "react";
import { getAllProject, createProject } from "../api/projectApi";
import Navbar from "../navbar/navbar";
import Sidebar from "../sidebar/Sidebar";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await getAllProject();
            if (res.data) {
                setProjects(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch projects:", err);
            setError("Failed to load projects.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            const res = await createProject({ name, description });
            if (res.data) {
                setName("");
                setDescription("");
                fetchProjects();
            }
        } catch (err) {
            console.error("Failed to create project:", err);
            setError("Failed to create project.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="project-container">
                <Sidebar />
                <div className="subproject-container">
                    <h2>Projects</h2>
                    {error && <p >{error}</p>}
                    
                    <form onSubmit={handleCreate} >
                        <div className="input-div">
                            <input
                                placeholder="Project Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ padding: '8px', width: '250px' }}
                            />
                            <input
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ padding: '8px', width: '300px' }}
                            />
                            <button type="submit" style={{ padding: '8px 16px' }}>Add Project</button>
                        </div>
                    </form>

                    {loading ? (
                        <p>Loading projects...</p>
                    ) : (
                        <div className="project-list">
                            {projects.length === 0 ? (
                                <p>No projects found. Create one above!</p>
                            ) : (
                                projects.map((p) => (
                                    <div key={p.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
                                        <h3>{p.name}</h3>
                                        <p>{p.description}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}