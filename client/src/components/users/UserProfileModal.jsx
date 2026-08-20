import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faEnvelope,
  faPhone,
  faShieldHalved,
  faGear,
  faRightFromBracket,
  faCircleCheck,
  faUser,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./UserProfileModal.css";
export default function UserProfileModal({
  isOpen,
  onClose,
  user,
  onEditProfile,
}) {
  const navigate = useNavigate();
  if (!isOpen || !user) return null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    onClose();
    navigate("/signin");
  };
  const handleGoToSettings = () => {
    onClose();
    navigate("/settings");
  };
  const fullName = user.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user.name || user.email || "Workspace User";
  const initial = (user.firstName || user.name || "U").charAt(0).toUpperCase();
  return (
    <div className="user-profile-modal-overlay" onClick={onClose}>
      <div
        className="user-profile-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-cover-banner"></div>
        <div className="profile-avatar-center-block">
          <div className="profile-large-avatar-box">
            {user.image ? (
              <img
                src={user.image}
                alt={fullName}
                className="profile-large-avatar-img"
              />
            ) : (
              <div className="profile-large-avatar-placeholder">{initial}</div>
            )}
          </div>
          <h3 className="profile-modal-full-name">{fullName}</h3>
          <span className="profile-modal-role-pill">
            <FontAwesomeIcon icon={faShieldHalved} className="shield-icon" />
            {user.role || "MEMBER"}
          </span>
        </div>
        <div className="profile-details-list">
          <div className="profile-detail-item">
            <div className="detail-icon-circle bg-blue">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <div className="detail-text-col">
              <span className="detail-field-name">Email Address</span>
              <span className="detail-field-val">
                {user.email || "No email available"}
              </span>
            </div>
          </div>
          {user.phone && (
            <div className="profile-detail-item">
              <div className="detail-icon-circle bg-green">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div className="detail-text-col">
                <span className="detail-field-name">Phone Number</span>
                <span className="detail-field-val">{user.phone}</span>
              </div>
            </div>
          )}
          <div className="profile-detail-item">
            <div className="detail-icon-circle bg-purple">
              <FontAwesomeIcon icon={faCircleCheck} />
            </div>
            <div className="detail-text-col">
              <span className="detail-field-name">Account Status</span>
              <span className="detail-field-val status-active">
                <span className="live-status-dot"></span> Active Member
              </span>
            </div>
          </div>
        </div>
        <div className="profile-modal-actions-footer">
          <button className="btn-profile-close-full" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
