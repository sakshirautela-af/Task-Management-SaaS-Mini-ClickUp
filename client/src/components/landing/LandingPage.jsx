import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckDouble,
  faFolderOpen,
  faListCheck,
  faUsers,
  faChartColumn,
  faArrowRight,
  faCheck,
  faChartLine,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user || token) {
      setIsLoggedIn(true);
    }
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("theme", savedTheme);
    document.body.setAttribute("theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("theme", next);
    document.body.setAttribute("theme", next);
  };

  const scrollToFeatures = () => {
    const featEl = document.getElementById("features");
    if (featEl) {
      featEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-page-container">
      <header className="landing-navbar">
        <div className="landing-nav-inner">
          <div className="landing-brand" onClick={() => navigate("/")}>
            <span className="landing-brand-name">MiniClickUp</span>
          </div>

          <nav className="landing-nav-links">
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                scrollToFeatures();
              }}
            >
              Features
            </a>
          </nav>

          <div className="landing-nav-actions">
            <button
              type="button"
              className="landing-theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
            </button>
            <button
              className="btn-landing-login"
              onClick={() => navigate("/signin")}
            >
              Log In
            </button>
            <button
              className="btn-landing-signup"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <section id="features" className="landing-features-section">
        <div className="features-section-header">
          <h2 className="features-main-heading">
            Everything you need to manage your projects
          </h2>
          <p className="features-main-subheading">
            MiniClickUp comes with all the tools your team needs to stay
            organized and productive.
          </p>
        </div>

        <div className="features-cards-grid">
          <div className="feature-card">
            <div className="feature-icon-container blue-violet-icon">
              <FontAwesomeIcon icon={faFolderOpen} />
            </div>
            <h3 className="feature-card-title">Project Management</h3>
            <p className="feature-card-desc">
              Create, organize, and manage projects from start to finish.
            </p>
            <div
              className="feature-card-link"
              onClick={() => navigate(isLoggedIn ? "/projects" : "/signup")}
            >
              <span>Learn more</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container green-icon">
              <FontAwesomeIcon icon={faListCheck} />
            </div>
            <h3 className="feature-card-title">Task Tracking</h3>
            <p className="feature-card-desc">
              Assign tasks, set due dates, and track progress in real-time.
            </p>
            <div
              className="feature-card-link"
              onClick={() => navigate(isLoggedIn ? "/tasks" : "/signup")}
            >
              <span>Learn more</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container amber-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <h3 className="feature-card-title">Team Collaboration</h3>
            <p className="feature-card-desc">
              Communicate, share files, and work together seamlessly.
            </p>
            <div
              className="feature-card-link"
              onClick={() => navigate(isLoggedIn ? "/team" : "/signup")}
            >
              <span>Learn more</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container sky-icon">
              <FontAwesomeIcon icon={faChartColumn} />
            </div>
            <h3 className="feature-card-title">Reports & Insights</h3>
            <p className="feature-card-desc">
              Get detailed reports and insights to make better decisions.
            </p>
            <div
              className="feature-card-link"
              onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signup")}
            >
              <span>Learn more</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
          </div>
        </div>
      </section>
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-brand-side">
            <div className="landing-brand">
              <span className="landing-brand-name">MiniClickUp</span>
            </div>
            <p className="footer-copyright">
              © {new Date().getFullYear()} MiniClickUp Inc. All rights reserved.
            </p>
          </div>

          <div className="footer-links-side">
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                scrollToFeatures();
              }}
            >
              Features
            </a>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
