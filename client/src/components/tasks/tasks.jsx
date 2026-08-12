import { useState } from "react";
import { createTasks } from "../api/tasksApi";
import "./task.css";

export default function Tasks({ projectId, onTaskCreated }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("NORMAL");
    const [status, setStatus] = useState("PENDING");
    const [dueDate, setDueDate] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e?.preventDefault();
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
                dueDate: dueDate || undefined,
                projectId: projectId || 1
            };
            const res = await createTasks(newTask);
            if (res.data) {
                alert("Task created successfully!");
                setName("");
                setDescription("");
                setDueDate("");
                if (onTaskCreated) onTaskCreated(res.data);
            } else {
                setErrorMsg(res.message || "Failed to create task.");
            }
        } catch (error) {
            console.error(error);
            setErrorMsg("An error occurred during task creation.");
        }
    };

    return (
        <div className="task-page">
            <div className="task-container">
                <div>
                    <h3>Create Task</h3>
                </div>
                {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                <h4>Basic Details</h4>
                <div className="basic-tasks">
                    <div>
                        <p>Task Name</p>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <p>Task Description</p>
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
                <div className="setting-tasks">
                    <h4>Task Settings</h4>
                    <p>Priority</p>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="LOW">Low</option>
                        <option value="NORMAL">Normal</option>
                        <option value="HIGH">High</option>
                    </select>
                    <p>Status</p>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="PENDING">Pending</option>
                        <option value="INPROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="FAILED">Failed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
                <div>
                    <p>Due Date</p>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
                <button onClick={handleSubmit} style={{ marginTop: '1rem' }}>Create Task</button>
            </div>
        </div>
    );
}