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
    setUser(null);
    navigate("/signin");
  };

  return (
    <nav className="nav">
      <div className="nav-logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
          Mini ClickUp
        </Link>
      </div>
      <div className="nav-menu">
          Projects
      </div>
      <div className="nav-profile">
        {user ? (
          <div>
            <span>Welcome, {user.firstName || user.email}</span>
            <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
          </div>
        ) : (
          <Link to="/signin">
            <button>Sign In</button>
          </Link>
        )}
      </div>
    </nav>
  );
}