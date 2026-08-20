import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  getAllNotifications,
  markNotificationAsReadApi,
  deleteNotificationByID,
} from "../api/notificationsApi";
import "./NotificationModal.css";
import { io } from "socket.io-client";

export default function NotificationModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const socketRef = useRef();
  const [activeTab, setActiveTab] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const socket = io("http://localhost:5002");
    socketRef.current = socket;

    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setCurrentUser(u);
        socketRef.current.emit("join", storedUser.id);
      } catch (e) {
        console.error("Error parsing user", e);
      }
    }
    socketRef.current.on("notification:new", (notification) => {
      setNotifications((prev) => [data.notification, ...prev]);
    });
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);
      const res = await getAllNotifications(currentUser.id);
      const data = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];
      setNotifications(data);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);
  useEffect(() => {
    if (isOpen && currentUser?.id) {
      fetchNotifications();
    }
  }, [isOpen, currentUser?.id, fetchNotifications]);
  function formatTimeAgo(dateStr) {
    if (!dateStr) return "Just now";
    try {
      const now = new Date();
      const past = new Date(dateStr);
      const diffMins = Math.floor((now - past) / (1000 * 60));
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays}d ago`;
    } catch {
      return "Recently";
    }
  }
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, activeTab]);
  const handleMarkAllAsRead = async () => {
    try {
      const unreadList = notifications.filter((n) => !n.isRead);
      await Promise.allSettled(
        unreadList.map((n) => markNotificationAsReadApi(n.id)),
      );
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true })),
      );
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };
  const handleItemClick = async (item) => {
    if (!item.isRead) {
      try {
        await markNotificationAsReadApi(item.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
        );
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };
  const handleDeleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNotificationByID(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="notification-modal-overlay" onClick={onClose}>
      <div
        className="notification-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="notif-modal-header">
          <h2 className="notif-modal-title">Notifications</h2>
          <button
            className="btn-close-notif"
            onClick={onClose}
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="notif-nav-bar">
          <div className="notif-tabs-group">
            <button
              className={`notif-tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <span>All</span>
              <span className="notif-tab-badge badge-purple">{totalCount}</span>
            </button>
            <button
              className={`notif-tab-btn ${
                activeTab === "unread" ? "active" : ""
              }`}
              onClick={() => setActiveTab("unread")}
            >
              <span>Unread</span>
              <span className="notif-tab-badge badge-grey">{unreadCount}</span>
            </button>
          </div>
          {unreadCount > 0 && (
            <button className="btn-mark-all-read" onClick={handleMarkAllAsRead}>
              <FontAwesomeIcon icon={faCheck} className="check-icon" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>
        <div className="notif-items-container">
          {loading ? (
            <div className="notif-empty-state">
              <p>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="notif-empty-state">
              <p>No notifications found.</p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                className={`notif-item-row ${!item.isRead ? "unread" : ""}`}
                onClick={() => handleItemClick(item)}
              >
                <div className="notif-content-col">
                  <p className="notif-title-text">{item.notification}</p>
                  <span className="notif-timestamp-text">
                    {formatTimeAgo(item.createdAt)}
                  </span>
                </div>
                <div className="notif-status-dot-wrapper">
                  {!item.isRead && <span className="notif-status-dot unread" />}
                  <button
                    className="btn-delete-notif"
                    onClick={(e) => handleDeleteNotification(e, item.id)}
                    title="Delete notification"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
