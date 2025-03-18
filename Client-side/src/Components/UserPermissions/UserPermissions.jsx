import React, { useState } from "react";
import "./UserPermissions.css";

const UserPermissions = ({ user, onClose }) => {
  const devices = [
    { id: "1", device_name: "Fan", device_type: "Fan", device_no: "1" },
    { id: "2", device_name: "Light", device_type: "Light", device_no: "2" },
    {
      id: "3",
      device_name: "Air Conditioner",
      device_type: "Aircond",
      device_no: "3",
    },
    { id: "4", device_name: "TV", device_type: "TV", device_no: "4" },
    { id: "5", device_name: "CCTV", device_type: "CCTV", device_no: "5" },
    { id: "6", device_name: "Sensor", device_type: "Sensor", device_no: "6" },
    {
      id: "7",
      device_name: "Computer",
      device_type: "Computer",
      device_no: "7",
    },
    { id: "8", device_name: "WiFi", device_type: "WiFi", device_no: "8" },
  ];

  const [permissions, setPermissions] = useState(
    devices.reduce((acc, device) => ({ ...acc, [device.id]: false }), {})
  );

  /* UPDATE THIS TO SAVE DEVICE PERMISSIONS */
  const handleSubmit = () => {
    console.log("User Permissions:", permissions);
  };

  const togglePermission = (device) => {
    setPermissions((prev) => ({
      ...prev,
      [device]: !prev[device],
    }));
  };

  return (
    <div className="user-permissions-overlay">
      <div className="user-permissions-popup">
        {/* Group header and list together */}
        <div className="user-permissions-top">
          <h2>User Permissions for {user.name}</h2>
          <div className="userpermissions-list">
            {devices.map((device) => (
              <div key={device.id} className="userpermissions-item">
                {/* Device Name */}
                <span className="userpermissions-name">
                  {device.device_name}
                </span>

                {/* Checkbox */}
                <label className="checkbox-container">
                  <input type="checkbox" />
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="user-permissions-buttons">
          <button
            className="user-permissions-submit-btn"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button className="user-permissions-cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPermissions;
