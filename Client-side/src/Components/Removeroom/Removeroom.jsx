import React, { useState, useEffect } from "react";
import "../removeroom/RemoveRoom.css";

const RemoveRoom = ({ isOpen, onClose }) => {
  const [rooms, setRooms] = useState([]);

  // Load rooms from localStorage when component mounts
  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem("rooms")) || [];
    setRooms(storedRooms);
  }, []);

  // Function to remove a room
  const removeRoom = (roomId) => {
    const updatedRooms = rooms.filter((room) => room.id !== roomId);
    setRooms(updatedRooms);
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
  };

  if (!isOpen) return null; // Hide modal when not open

  return (
    <div className="removeroom-modal-overlay" onClick={onClose}>
      <div className="removeroom-modal" onClick={(e) => e.stopPropagation()}>
        
        
        <div className="removeroom-title-container">
          <h2 className="removeroom-title">Remove Room</h2>
        </div>

        <div className="removeroom-list">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div key={room.id} className="removeroom-item">
                <span>{room.name}</span>
                <button
                  className="removeroom-delete-btn"
                  onClick={() => removeRoom(room.id)}
                >
                  ⦻
                </button>
              </div>
            ))
          ) : (
            <p>No Rooms Available</p>
          )}
        </div>

        {/* Back Button */}
        <button className="removeroom-back-btn" onClick={onClose}>
          Back
        </button>
      </div>
    </div>
  );
};

export default RemoveRoom;
