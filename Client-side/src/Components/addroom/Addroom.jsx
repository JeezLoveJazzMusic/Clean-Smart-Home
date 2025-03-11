import React, { useState, useEffect } from "react";
import "../addroom/Addroom.css";

const AddRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);

  // Load existing rooms from localStorage on page load
  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem("rooms")) || [];
    setRooms(storedRooms);
  }, []);

  // Function to add a new room
  const handleConfirm = () => {
    if (roomName.trim() === "") {
      alert("Please enter a valid room name.");
      return;
    }

    const newRoom = { id: Date.now(), name: roomName }; // Unique ID
    const updatedRooms = [...rooms, newRoom];

    setRooms(updatedRooms); // Update local state
    localStorage.setItem("rooms", JSON.stringify(updatedRooms)); // Save to localStorage
    setRoomName(""); // Clear input
  };

  return (
    <div className="addroom-modal-overlay">
      <div className="addroom-modal">
        <h2 className="addroom-title">Add Room</h2>
        <div className="addroom-input-group">
          <label className="addroom-label">Room Name:</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
          />
        </div>

        <div className="addroom-button-group">
          <button className="addroom-confirm-btn" onClick={handleConfirm}>
            Confirm
          </button>
        </div>

        {/* Empty Back Button at Bottom Right */}
        <button className="addroom-back-btn">
          Back
        </button>
      </div>
    </div>
  );
};

export default AddRoom;
