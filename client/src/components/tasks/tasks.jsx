import { useState, useEffect } from "react";
import { createTasks, getAllTasks, filterTasks, deleteTasks, updateTasks } from "../api/tasksApi";
import "./task.css";

export default function Tasks({ projectId }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("NORMAL");
    const [status, setStatus] = useState("PENDING");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await filterTasks(projectId, {
                search: searchQuery,
                priority: filterPriority,
                status: filterStatus
            });
            if (res.data) {
                setTasks(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchTasks();
        }
    }, [projectId, searchQuery, filterPriority, filterStatus]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setErrorMsg("Task name is required.");
            return;
        }

        try {
            const newTask = {
                name,
                description,
                priority,
                status,
                startDate: startDate || new Date().toISOString().split('T')[0],
                endDate: endDate || new Date().toISOString().split('T')[0],
                projectId: projectId
            };
            const res = await createTasks(newTask);
            if (res.data) {
                setName("");
                setDescription("");
                setStartDate("");
                setEndDate("");
                setErrorMsg("");
                fetchTasks();
            } else {
                setErrorMsg(res.message || "Failed to create task.");
            }
        } catch (error) {
            console.error(error);
            setErrorMsg("An error occurred during task creation.");
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await deleteTasks(taskId);
            fetchTasks();
        } catch (err) {
            console.error("Failed to delete task", err);
        }
    };

    const handleStatusChange = async (taskId, currentTask, newStatus) => {
        try {
            await updateTasks(taskId, { ...currentTask, status: newStatus });
            fetchTasks();
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    return (
        <div className="inline-tasks-container">
            <h4 className="tasks-header">Project Tasks</h4>

            {errorMsg && <p className="error-msg">{errorMsg}</p>}

            <form className="inline-task-form" onSubmit={handleCreateTask}>
                <input
                    className="premium-input small-input"
                    placeholder="Task Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="premium-input small-input"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select className="premium-select small-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="PENDING">Pending</option>
                    <option value="INPROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                </select>
                <input
                    className="premium-input small-input"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button type="submit" className="premium-btn small-btn">Add Task</button>
            </form>

            <div className="task-filters inline-task-form">
                <input 
                    className="premium-input small-input" 
                    placeholder="Search tasks..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <select 
                    className="premium-select small-input" 
                    value={filterPriority} 
                    onChange={(e) => setFilterPriority(e.target.value)}
                >
                    <option value="">All Priorities</option>
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                </select>
                <select 
                    className="premium-select small-input" 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="INPROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                </select>
            </div>

            <div className="tasks-list">
                {loading ? <p>Loading tasks...</p> : tasks.length === 0 ? (
                    <p className="no-tasks">No tasks yet.</p>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} className="inline-task-item">
                            <div className="task-info">
                                <strong>{task.name}</strong>
                                <span>{task.description}</span>
                            </div>
                            <div className="task-actions">
                                <select
                                    className="premium-select tiny-select"
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, task, e.target.value)}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="INPROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                                <button className="delete-btn" onClick={() => handleDelete(task.id)}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}