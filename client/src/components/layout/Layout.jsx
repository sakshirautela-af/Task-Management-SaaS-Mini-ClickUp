import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/navbar";
import Sidebar from "../sidebar/Sidebar";
import NotificationModal from "../notifications/NotificationModal";
import UserProfileModal from "../users/UserProfileModal";
import "./Layout.css";
export default function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);
  const openUserProfile = (userObj) => {
    setSelectedProfileUser(userObj || currentUser);
  };
  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };
  return (
    <div className={`app-layout ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Navbar
        onToggleSidebar={toggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenUserProfile={openUserProfile}
      />
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenUserProfile={openUserProfile}
      />
      <main className="main-content">
        <Outlet context={{ openUserProfile }} />
      </main>
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
      <UserProfileModal
        isOpen={Boolean(selectedProfileUser)}
        onClose={() => setSelectedProfileUser(null)}
        user={selectedProfileUser}
      />
    </div>
  );
}