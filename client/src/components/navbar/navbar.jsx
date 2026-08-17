import { useState, useEffect } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      setTheme(localTheme);
      document.documentElement.setAttribute("theme", localTheme);
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/signin");
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
    document.documentElement.setAttribute("theme", nextTheme);
  };
  return (
    <header className="topnav">
      <div className="app-logo">MiniClickUp</div>
      <div className="search-bar-wrapper">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search projects, tasks..."
          className="search-input"
        />
      </div>

      <div className="topnav-right">
        <button onClick={toggleTheme} className="icon-btn theme-toggle">
          {theme === "light" ? "Dark" : "Light"}
        </button>

        {user ? (
          <div className="user-profile-menu">
            <div className="avatar">
              {user.firstName ? user.firstName.charAt(0) : "U"}
            </div>
            <div className="user-info">
              <span className="user-name">{user.firstName || user.email}</span>
            </div>
            <button
              className="logout-btn"
              onClick={handleLogout}
              style={{
                marginLeft: "10px",
                background: "transparent",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/signin">Sign In</Link>
        )}
      </div>
    </header>
  );
}
