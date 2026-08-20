import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faLayerGroup,
  faListCheck,
  faCalendarAlt,
  faUsers,
  faGear,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
import "./Slidebar.css";
export default function Sidebar({ isCollapsed = false }) {
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: faHouse },
    { path: "/projects", label: "Projects", icon: faLayerGroup },
    { path: "/tasks", label: "Tasks", icon: faListCheck },
    { path: "/calendar", label: "Calendar", icon: faCalendarAlt },
    { path: "/team", label: "Teams", icon: faUsers },
    { path: "/settings", label: "Settings", icon: faGear },
  ];
  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-logo-header">
        {!isCollapsed && (
          <span className="sidebar-brand-text">MiniClickUp</span>
        )}
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "active" : "")}
            title={isCollapsed ? item.label : undefined}
          >
            <FontAwesomeIcon icon={item.icon} className="sidebar-nav-icon" />
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
