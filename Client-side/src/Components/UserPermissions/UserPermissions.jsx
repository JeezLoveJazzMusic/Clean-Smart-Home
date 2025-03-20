import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserPermissions.css";

const UserPermissions = ({ user, onClose, currentRoom, houseId }) => {
  const [devices, setDevices] = useState([]);
  const [permissions, setPermissions] = useState({});
  // Save a copy of the initial permissions so we can compare later.
  const [initialPermissions, setInitialPermissions] = useState({});
  const [roomName, setRoomName] = useState("");
  
  //function to get the room name from the roomID
  useEffect(() => {
    if (currentRoom) {
      const fetchRoomName = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/getRoomName/room/${currentRoom}`);
          // Assuming the endpoint returns { roomName: "Living Room" }
          setRoomName(response.data.roomName);
        } catch (error) {
          console.error("Error fetching room name:", error);
        }
      };
      fetchRoomName();
    }
  }, [currentRoom]);

  // Fetch user permissions
  useEffect(() => {
    const fetchUserPermissions = async () => {
      console.log("UserPermissions: currentRoom:", currentRoom, "HouseId:", houseId, "User:", user.id);
      try {
        const response = await axios.get(
          `http://localhost:8080/getUserPermissionForRoom/house/${houseId}/user/${user.id}/room/${currentRoom}`
        );
        const { userPermission } = response.data;
        // Convert the returned array into a mapping, e.g. [95] becomes { 95: true }
        const permissionMap = {};
        if (Array.isArray(userPermission)) {
          userPermission.forEach((deviceId) => {
            permissionMap[deviceId] = true;
          });
        }
        console.log("Fetched permissions for user (mapped):", permissionMap);
        setPermissions(permissionMap);
        // Keep an immutable copy for later comparisons.
        setInitialPermissions(permissionMap);
      } catch (error) {
        console.error("Error fetching user permissions:", error);
      }
    };
    if (currentRoom && houseId && user) {
      fetchUserPermissions();
    }
  }, [currentRoom, houseId, user]);

  // Fetch devices
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

  // Toggle checkbox just updates local state.
  const togglePermission = (deviceId) => {
    setPermissions((prev) => ({
      ...prev,
      [deviceId]: !prev[deviceId],
    }));
  };

  // On submit, compare the current permission state to the initial state,
  // then call API endpoints appropriately.
  const handleSubmit = async () => {
    console.log("Initial Permissions:", initialPermissions);
    console.log("Final Permissions:", permissions);
    const addPermissionIds = [];
    const removePermissionIds = [];
  
    for (const [deviceId, allowed] of Object.entries(permissions)) {
      if (allowed && !initialPermissions[deviceId]) {
        addPermissionIds.push(deviceId);
      }
      if (!allowed && initialPermissions[deviceId]) {
        removePermissionIds.push(deviceId);
      }
    }
  
    try {
      // Process add permissions one by one.
      if (addPermissionIds.length > 0) {
        await Promise.all(
          addPermissionIds.map((deviceId) =>
            axios.post("http://localhost:8080/add_permission", {
              user_id: user.id,
              device_id: deviceId,
            })
          )
        );
        console.log("Added permissions for:", addPermissionIds);
      }
  
      // Process remove permissions.
      if (removePermissionIds.length > 0) {
        await Promise.all(
          removePermissionIds.map((deviceId) =>
            axios.delete(`http://localhost:8080/remove_permission/user/${user.id}/device/${deviceId}`)
          )
        );
        console.log("Removed permissions for:", removePermissionIds);
      }
      onClose();
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  return (
    <div className="user-permissions-overlay">
      <div className="user-permissions-popup">
        <div className="user-permissions-top">
          <h2>User Permissions for {user.name} in {roomName}</h2>
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