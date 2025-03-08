import React, { useState } from "react";
import "./addndeleteuser.css";

function Addndeleteuser({ onAddUser, onClose }) {
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("");
  const [permission, setPermission] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [errors, setErrors] = useState({});

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  // Handle Confirm Button Click
  const handleConfirm = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = "Username is required!";
    if (!userType) newErrors.userType = "User Type is required!";
    if (!permission) newErrors.permission = "Permission is required!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onAddUser({
      name,
      userType,
      permission,
      profilePic: profilePic || "/images/DDTDefaultimage.jpg", 
    });
    onClose();
  };

  return (
    <div className="modal2-overlay">
      <div className="modal2-box">
        <h2>Add User</h2>

        {/* Profile Picture Upload */}
        <div className="profile-upload">
          <label>Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden id="fileUpload" />
          <label htmlFor="fileUpload">
            <img src={profilePic || "/images/DDTDefaultimage.jpg"} alt="Profile" className="clickable-avatar" />
          </label>
          <p className="upload-text">Upload New Photo</p>
        </div>

        {/* Username Field */}
        <div className="input-group">
          <label>User Name:</label>
          <input
            type="text"
            placeholder="Enter username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        {/* User Type Field */}
        <div className="input-group">
          <label>User Type:</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className={errors.userType ? "input-error" : ""}
          >
            <option value="">Select User Type</option>
            <option value="Dweller">Dweller</option>
            <option value="Admin">Admin</option>
            <option value="Viewer">Viewer</option>
          </select>
          {errors.userType && <p className="error-message">{errors.userType}</p>}
        </div>

        {/* Permission Field */}
        <div className="input-group">
          <label>Permission:</label>
          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            className={errors.permission ? "input-error" : ""}
          >
            <option value="">Select Permission</option>
            <option value="Full Access">Full Access</option>
            <option value="Restricted Access">Restricted Access</option>
          </select>
          {errors.permission && <p className="error-message">{errors.permission}</p>}
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button className="confirm-btn" onClick={handleConfirm}>Confirm</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Addndeleteuser;