import { useEffect, useState } from "react";
import { getUserDetails, updateUser } from "../api/userApi";
import "./Users.css";

export default function UsersUpdate() {
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("USER");
  const [isActive, setIsActive] = useState(true);

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
          if (res?.data) {
            setFirstName(res.data.firstName || "");
            setLastName(res.data.lastName || "");
            setPhone(res.data.phone || "");
            setRole(res.data.role || "USER");
            setIsActive(res.data.isActive !== false);
          } else if (res) {
            
            setFirstName(res.firstName || "");
            setLastName(res.lastName || "");
            setPhone(res.phone || "");
            setRole(res.role || "USER");
            setIsActive(res.isActive !== false);
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

    if (!firstName || !lastName) {
      setErrorMsg("First Name and Last Name are required.");
      return;
    }

    try {
      const userData = {
        firstName,
        lastName,
        phone,
        role,
        isActive,
      };

      const res = await updateUser(userId, userData);
      if (res.ok) {
        setSuccessMsg("Profile updated successfully!");

        // Update local storage if needed
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const updatedUser = {
            ...parsedUser,
            firstName,
            lastName,
            role,
            phone,
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
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <label className="profile-checkbox">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Account is Active
          </label>

          <button className="profile-btn" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
