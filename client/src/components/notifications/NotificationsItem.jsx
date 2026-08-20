import React, { useEffect, useState } from "react";
import { getAllNotifications } from "../api/notificationsApi.js";
import "./NotificationsItem.css";

const NotificationsItem = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          setError("Failed to load notifications: user is not logged in.");
          return;
        }
        const user = JSON.parse(userStr);
        const res = await getAllNotifications(user.id);
        const data = res.data || res || [];
        setNotifications(data);
      } catch (err) {
        setError(err.message || "Failed to load notifications");
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="notification-div">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {notifications && notifications.length > 0 ? (
        notifications.map((element) => (
          <div
            key={element.id || element.notification}
            className={
              element.isRead ? "notification-item" : "notification-item-bold"
            }
          >
            <p>{element.notification}</p>
          </div>
        ))
      ) : (
        !error && <p>No notifications.</p>
      )}
    </div>
  );
};

export default NotificationsItem;
