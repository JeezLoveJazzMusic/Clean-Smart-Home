import React, { useState } from "react";
import "../addndeleteuser/addndeleteuser.css";

function Addndeleteuser({ users, onAddUser, onClose }) {
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("");
  const [errors, setErrors] = useState({});

  // Handle Confirm Button Click
  const handleConfirm = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = "Username is required!";
    if (!userType) newErrors.userType = "User Type is required!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    onAddUser({
      name,
      userType
    });

    onClose();
  };

  return (
    <div className="addndltuser-modal-overlay">
      <div className="addndelete-modal-box">
        <h2>Add User</h2>

        {/* Username Field */}
        <div className="input-group">
          <label>User Email:</label>
          <input
            type="text"
            placeholder="Enter the user's email"
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
            <option value="Home Owner">Home Owner</option>
            <option value="Dweller">Dweller</option>
          </select>
          {errors.userType && <p className="error-message">{errors.userType}</p>}
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
