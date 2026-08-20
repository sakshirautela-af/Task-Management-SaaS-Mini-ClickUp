import { useEffect, useState } from "react";
import { getUserDetails, updateUser } from "../api/userApi";
import { Role } from "../../enums";
import "./Users.css";

export default function UsersUpdate() {
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(Role.USER);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserId(parsedUser.id);
          const res = await getUserDetails(parsedUser.id);
          const userData = res?.data || res;
          if (userData) {
            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
            setPhone(userData.phone || "");
            setRole(userData.role || "USER");
          }
        } else {
          setErrorMsg("No logged in user found.");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg("First Name and Last Name are required.");
      return;
    }

    try {
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        role,
      };

      const res = await updateUser(userId, userData);
      if (res.ok || res.data) {
        setSuccessMsg("Profile updated successfully!");
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const updatedUser = {
            ...parsedUser,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            role,
            phone: phone.trim(),
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } else {
        setErrorMsg(res.data?.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred while updating.");
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Update Profile</h2>
        {errorMsg && <p className="error-message">{errorMsg}</p>}
        {successMsg && <p className="success-message">{successMsg}</p>}

        <form className="profile-form" onSubmit={handleUpdate}>
          <div className="form-group">
            <label>First Name</label>
            <input
              className="profile-input"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              className="profile-input"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              className="profile-input"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number (Optional)"
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              className="profile-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value={Role.USER}>{Role.USER}</option>
              <option value={Role.ADMIN}>{Role.ADMIN}</option>
              <option value={Role.SUPERADMIN}>{Role.SUPERADMIN}</option>
            </select>
          </div>

          <button className="profile-btn" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
