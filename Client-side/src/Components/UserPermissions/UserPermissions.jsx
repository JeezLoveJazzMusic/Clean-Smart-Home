import React, { useState, useEffect } from "react";
import "./UserPermissions.css";
import axios from "axios";

const UserPermissions = ({ user, onClose, currentRoom, houseId }) => {
  const[devices, setDevices] = useState([]);
  const [permissions, setPermissions] = useState({});
  // const devices = [
  //   { id: "1", device_name: "Fan", device_type: "Fan", device_no: "1" },
  //   { id: "2", device_name: "Light", device_type: "Light", device_no: "2" },
  //   {
  //     id: "3",
  //     device_name: "Air Conditioner",
  //     device_type: "Aircond",
  //     device_no: "3",
  //   },
  //   { id: "4", device_name: "TV", device_type: "TV", device_no: "4" },
  //   { id: "5", device_name: "CCTV", device_type: "CCTV", device_no: "5" },
  //   { id: "6", device_name: "Sensor", device_type: "Sensor", device_no: "6" },
  //   {
  //     id: "7",
  //     device_name: "Computer",
  //     device_type: "Computer",
  //     device_no: "7",
  //   },
  //   { id: "8", device_name: "WiFi", device_type: "WiFi", device_no: "8" },
  // ];


  useEffect(() => {
    const fetchUserPermissions = async () => {
      console.log("UserPermissions: currentRoom:", currentRoom, "HouseId:", houseId, "User:", user.id);
      try {
        const response = await axios.get(
          `http://localhost:8080/getUserPermissionForRoom/house/${houseId}/user/${user.id}/room/${currentRoom}`
        );
        const { userPermission } = response.data;
        // Convert the returned permissions array into an object mapping
        // e.g, [95] becomes { 95: true }
        const permissionMap = {};
        if (Array.isArray(userPermission)) {
          userPermission.forEach((deviceId) => {
            permissionMap[deviceId] = true;
          });
        }
        console.log("Fetched permissions for user (mapped):", permissionMap);
        setPermissions(permissionMap);
      } catch (error) {
        console.error("Error fetching user permissions:", error);
      }
    };
    if (currentRoom && houseId && user) {
      fetchUserPermissions();
    }
  }, [currentRoom, houseId, user]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/getRoomDevices/houses/${houseId}/rooms/${currentRoom}`
        );
        const { devices } = response.data;
        console.log("Fetched devices for permissions:", devices);
        setDevices(devices);
      } catch (error) {
        console.error("Error fetching devices for current room:", error);
      }
    };

    if (currentRoom && houseId) {
      fetchDevices();
    }
  }, [currentRoom, houseId]);

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
        <div className="user-permissions-top">
          <h2>User Permissions for {user.name} in Room {currentRoom}</h2>
          <div className="userpermissions-list">
            {devices.map((device) => (
              <div key={device.device_id} className="userpermissions-item">
                <span className="userpermissions-name">{device.device_name}</span>
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={permissions[device.device_id] || false}
                    onChange={() => togglePermission(device.device_id)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="user-permissions-buttons">
          <button className="user-permissions-submit-btn" onClick={handleSubmit}>
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