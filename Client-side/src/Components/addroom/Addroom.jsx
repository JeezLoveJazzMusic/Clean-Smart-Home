import React, { useState, useEffect } from "react";
import "../addroom/Addroom.css";
import axios from "axios";

const AddRoom = ({ isOpen, onClose, currentHouse }) => {
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const MAX_LENGTH = 20; // Maximum character limit

  // Load existing rooms from localStorage on page load
  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem("rooms")) || [];
    setRooms(storedRooms);
  }, []);

  // Function to handle input change with character limit
  const handleInputChange = (e) => {
    const input = e.target.value;
    if (input.length <= MAX_LENGTH) {
      setRoomName(input);
      setError(""); // Clear error when user starts typing
    }
  };

  // Function to add a new room

const handleConfirm = async () => {
  // ... existing validation code ...

  try {
    const response = await axios.post("http://localhost:8080/addRoom", {
      house_id: currentHouse,
      room_name: roomName
    });

    console.log("Room creation response:", response.data); // Debug log

    

    // Initialize the new room with the room_id from the response
    const newRoom = {
      room_id: response.data.room_id,
      room_name: roomName,
      devices: [] // Initialize empty devices array
    };

    // Notify parent component of the new room
    if (typeof onRoomAdded === 'function') {
      onRoomAdded(newRoom);
    }

    setRoomName("");
    onClose();
    window.location.reload();
  } catch (error) {
    console.error("Error adding room:", error);
    setError("Failed to add room. Please try again.");
  }
};

  if (!isOpen) return null; // Hide modal if not open

  return (
    <div className="addroom-modal-overlay" onClick={onClose}>
      <div className="addroom-modal" onClick={(e) => e.stopPropagation()}>
       
        <h2 className="addroom-title">Add Room</h2>

        {/* Error Message */}
        {error && <p className="addroom-error-message">{error}</p>}

        <div className="addroom-input-group">
          <label className="addroom-label">Room Name:</label>
          <input
            type="text"
            value={roomName}
            onChange={handleInputChange}
            placeholder="Enter room name (max 20 characters)"
            maxLength={MAX_LENGTH}
            required
          />
        </div>

        <div className="addroom-button-group">
          <button className="addroom-confirm-btn" onClick={handleConfirm}>
            Confirm
          </button>
          <button className="addroom-back-btn" onClick={onClose}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;