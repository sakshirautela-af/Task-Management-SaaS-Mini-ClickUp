import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBars,
  faChevronDown,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { getAllNotifications } from "../api/notificationsApi";
import "./navbar.css";
export default function Navbar({
  onToggleSidebar,
  isSidebarCollapsed,
  onOpenNotifications,
  onOpenUserProfile,
}) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed?.id) {
          getAllNotifications(parsed.id)
            .then((res) => {
              const list = Array.isArray(res?.data)
                ? res.data
                : Array.isArray(res)
                  ? res
                  : [];
              const unread = list.filter((n) => !n.isRead).length;
              setUnreadCount(unread);
            })
            .catch((err) => console.error("Error fetching notifs count", err));
        }
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("theme", savedTheme);
    document.body.setAttribute("theme", savedTheme);
  }, []);
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("theme", nextTheme);
    document.body.setAttribute("theme", nextTheme);
  };
  const initial = (user?.firstName || "U").charAt(0).toUpperCase();
  return (
    <header className="topnav">
      <div className="topnav-left">
        <button
          className="btn-sidebar-hamburger"
          onClick={onToggleSidebar}
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <div className="topnav-right">
        <button
          className="navbar-theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          <FontAwesomeIcon
            icon={theme === "light" ? faMoon : faSun}
            className="theme-icon-svg"
          />
        </button>
        <button
          className="navbar-bell-btn"
          onClick={onOpenNotifications}
          aria-label="Open notifications"
          title="Notifications"
        >
          <FontAwesomeIcon icon={faBell} className="navbar-bell-icon" />
          {unreadCount > 0 && (
            <span className="navbar-notif-badge">{unreadCount}</span>
          )}
        </button>
        {user ? (
          <div
            className="navbar-user-pill"
            onClick={() => onOpenUserProfile && onOpenUserProfile(user)}
            title="View Profile"
          >
            {user.image ? (
              <img
                src={user.image}
                alt={user.firstName}
                className="navbar-user-avatar-img"
              />
            ) : (
              <div className="navbar-user-avatar-placeholder">{initial}</div>
            )}
            <FontAwesomeIcon
              icon={faChevronDown}
              className="navbar-chevron-icon"
            />
          </div>
        ) : (
          <Link to="/signin" className="navbar-signin-link">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
