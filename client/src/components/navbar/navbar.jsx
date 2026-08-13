import { useState, useEffect } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
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

  return (
    <header className="topnav">
      <div className="search-bar-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" placeholder="Search projects, tasks..." className="search-input" />
        <span className="shortcut-key">⌘K</span>
      </div>
      
      <div className="topnav-right">
        <button className="icon-btn notification-btn">
          <span className="badge">3</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </button>
        <button className="icon-btn theme-toggle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </button>
        
        {user ? (
          <div className="user-profile-menu">
            <div className="avatar">{user.firstName ? user.firstName.charAt(0) : 'U'}</div>
            <div className="user-info">
              <span className="user-name">{user.firstName || user.email}</span>
              <span className="user-role">Admin ⌄</span>
            </div>
            <button className="logout-btn" onClick={handleLogout} style={{marginLeft: '10px', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer'}}>Logout</button>
          </div>
        ) : (
          <Link to="/signin"><button className="nav-btn primary">Sign In</button></Link>
        )}
      </div>
    </header>
  );
}