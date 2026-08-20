import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { getAllProject } from "../api/projectApi";
import { getAllUsers } from "../api/userApi";
import "./Team.css";
export default function Team() {
  const navigate = useNavigate();
  const outletCtx = useOutletContext();
  const openUserProfile = outletCtx?.openUserProfile;
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user", e);
      }
    }
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, usersRes] = await Promise.allSettled([
        getAllProject(),
        getAllUsers(),
      ]);
      if (projRes.status === "fulfilled") {
        const pData = projRes.value?.data || projRes.value || [];
        setProjects(Array.isArray(pData) ? pData : []);
      }
      if (usersRes.status === "fulfilled") {
        const uData = usersRes.value?.data || usersRes.value || [];
        setUsers(Array.isArray(uData) ? uData : []);
      }
    } catch (err) {
      console.error("Failed to load team data", err);
    } finally {
      setLoading(false);
    }
  };
  const projectThemes = [
    {
      bg: "#eef2ff",
      color: "#6366f1",
      badgeBg: "#e0e7ff",
      badgeColor: "#4338ca",
    },
    {
      bg: "#fef3c7",
      color: "#d97706",
      badgeBg: "#fde68a",
      badgeColor: "#b45309",
    },
    {
      bg: "#ede9fe",
      color: "#8b5cf6",
      badgeBg: "#ddd6fe",
      badgeColor: "#6d28d9",
    },
    {
      bg: "#dcfce7",
      color: "#16a34a",
      badgeBg: "#bbf7d0",
      badgeColor: "#15803d",
    },
    {
      bg: "#ffedd5",
      color: "#ea580c",
      badgeBg: "#fed7aa",
      badgeColor: "#c2410c",
    },
  ];
  const projectTeams = useMemo(() => {
    return projects.map((p, idx) => {
      const theme = projectThemes[idx % projectThemes.length];
      const memberMap = new Map();
      if (p.creator) {
        memberMap.set(p.creator.id, {
          id: p.creator.id,
          name: `${p.creator.firstName} ${p.creator.lastName || ""}`.trim(),
          image: p.creator.image || null,
          initial: (p.creator.firstName || "C").charAt(0).toUpperCase(),
        });
      }
      if (p.assignTo) {
        memberMap.set(p.assignTo.id, {
          id: p.assignTo.id,
          name: `${p.assignTo.firstName} ${p.assignTo.lastName || ""}`.trim(),
          image: p.assignTo.image || null,
          initial: (p.assignTo.firstName || "A").charAt(0).toUpperCase(),
        });
      }
      if (Array.isArray(p.tasks)) {
        p.tasks.forEach((t) => {
          if (t.assignee) {
            memberMap.set(t.assignee.id, {
              id: t.assignee.id,
              name: `${t.assignee.firstName} ${t.assignee.lastName || ""}`.trim(),
              image: t.assignee.image || null,
              initial: (t.assignee.firstName || "M").charAt(0).toUpperCase(),
            });
          }
        });
      }
      const members = Array.from(memberMap.values());
      if (members.length === 0 && users.length > 0) {
        users.slice(0, 3).forEach((u) => {
          members.push({
            id: u.id,
            name: `${u.firstName} ${u.lastName || ""}`.trim(),
            image: u.image || null,
            initial: (u.firstName || "U").charAt(0).toUpperCase(),
          });
        });
      }
      return {
        ...p,
        theme,
        members,
        memberCount: members.length,
      };
    });
  }, [projects, users]);
  const filteredProjectTeams = useMemo(() => {
    if (!searchQuery.trim()) return projectTeams;
    const q = searchQuery.toLowerCase();
    return projectTeams.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [projectTeams, searchQuery]);
  return (
    <div className="teams-management-page">
      <div className="teams-page-header">
        <div className="header-title-block">
          <h1 className="main-page-title">Teams</h1>
          <p className="main-page-subtitle">
            Manage your team members grouped by projects.
          </p>
        </div>
      </div>
      <div className="teams-search-bar-row">
        <div className="teams-search-wrapper">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="search-glass-left-icon"
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="teams-search-input"
          />
        </div>
      </div>
      <div className="teams-projects-grid">
        {filteredProjectTeams.length === 0 ? (
          <div className="empty-teams-state">
            <p>No project teams found.</p>
          </div>
        ) : (
          filteredProjectTeams.map((proj) => {
            const displayedMembers = proj.members.slice(0, 4);
            const remainingCount = Math.max(0, proj.memberCount - 4);
            return (
              <div
                key={proj.id}
                className="project-team-card"
                onClick={() =>
                  navigate("/view-project", { state: { project: proj } })
                }
              >
                <h3 className="team-project-name">{proj.name}</h3>
                <div className="team-avatars-row">
                  {displayedMembers.map((m, mIdx) => (
                    <div
                      key={m.id || mIdx}
                      className="team-avatar-circle"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (openUserProfile) openUserProfile(m);
                      }}
                      title={`View ${m.name}'s profile`}
                    >
                      {typeof m.image === "string" && m.image ? (
                        <img
                          src={m.image}
                          alt={m.name}
                          className="team-avatar-img"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="team-avatar-placeholder">
                          {m.initial}
                        </div>
                      )}
                    </div>
                  ))}
                  {proj.memberCount > 0 && (
                    <div
                      className="team-extra-count-badge"
                      style={{
                        backgroundColor: proj.theme.badgeBg,
                        color: proj.theme.badgeColor,
                      }}
                    >
                      +{remainingCount}
                    </div>
                  )}
                </div>
                <span className="team-members-count-label">
                  {proj.memberCount}{" "}
                  {proj.memberCount === 1 ? "Member" : "Members"}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
