import React, { useState, useEffect } from "react";
import "../addroom/Addroom.css";

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
  const handleConfirm = () => {
    if (roomName.trim() === "") {
      setError("Please enter a valid room name.");
      return;
    }

    if (roomName.length > MAX_LENGTH) {
      setError(`Room name cannot exceed ${MAX_LENGTH} characters.`);
      return;
    }
    
    setError(""); // Clear error message if input is valid

    const newRoom = { id: Date.now(), name: roomName }; // Unique ID
    const updatedRooms = [...rooms, newRoom];

    setRooms(updatedRooms); // Update local state
    localStorage.setItem("rooms", JSON.stringify(updatedRooms)); // Save to localStorage
    setRoomName(""); // Clear input
    onClose(); // Close modal
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