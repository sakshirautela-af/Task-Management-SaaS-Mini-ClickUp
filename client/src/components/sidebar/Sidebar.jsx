import { Link } from 'react-router-dom';
import "./Slidebar.css"
export default function Sidebar() {
    return (
        <div className="sidebar" >
            <div className="dashboard" >
                <Link to="/">Dashboard</Link>
            </div>
            <div className="projects" >
                <Link to="/projects" >Projects</Link>
            </div>
            <div className="tasks" >
                <Link to="/tasks" >Task</Link>
            </div>
        </div>
    );
}