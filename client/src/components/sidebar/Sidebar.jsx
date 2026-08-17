import { NavLink } from "react-router-dom";
import "./Slidebar.css";

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/projects", label: "Projects" },
  { path: "/tasks", label: "Tasks" },
  { path: "/calendar", label: "Calendar" },
  { path: "/my-tasks", label: "My Tasks" },
  { path: "/team", label: "Team" },
  { path: "/reports", label: "Reports" },
  { path: "/settings", label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {({ isActive }) => (
              <>
                <span className="nav-label">{item.label}</span>
                {isActive && (
                  <span
                    className="active-check"
                    style={{ marginLeft: "auto", fontWeight: "bold" }}
                  ></span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
