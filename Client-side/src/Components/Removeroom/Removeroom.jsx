import React, { useState, useEffect } from "react";
import "./RemoveRoom.css";
import axios from "axios";

const RemoveRoom = ({ isOpen, onClose, currentHouse, rooms }) => {
  const [error, setError] = useState("");

  const handleRemoveRoom = async (room_id, room_name) => {
    try {
      if (!room_id || !currentHouse) {
        setError("Missing room ID or house ID");
        return;
      }

      // First remove all devices
      try {
        await axios.delete(`http://localhost:8080/removeAllDevicesFromRoom/houses/${currentHouse}/rooms/${room_id}`);
        console.log("All devices removed from room");
        
        // Then remove the room
        await axios.delete(`http://localhost:8080/removeRoom/houses/${currentHouse}/room/${room_id}`);
        console.log("Room removed successfully");
        
        // Clear any existing errors
        setError("");
        if (typeof onRoomRemoved === 'function') {
          onRoomRemoved(room_id); // Trigger parent component update
        }
        onClose();
        
        // Refresh the room list if needed
        window.location.reload(); // This will refresh the page to update the room list

      } catch (apiError) {
        console.error("API Error:", apiError);
        setError(apiError.response?.data?.message || "Failed to remove room. Please try again.");
      }

    } catch (error) {
      console.error("Error in handleRemoveRoom:", error);
      setError(error.message || "Failed to remove room. Please try again.");
    }
  };
  if (!isOpen) return null;

  return (
    <div className="removeroom-modal-overlay" onClick={onClose}>
      <div className="removeroom-modal" onClick={(e) => e.stopPropagation()}>
        {/* Title */}
        <div className="removeroom-title-container">
          <h2 className="removeroom-title">Remove Room</h2>
        </div>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Room List */}
        <div className="removeroom-list">
          {rooms && rooms.length > 0 ? (
            rooms.map((room) => (
              <div key={room.room_id} className="removeroom-item">
                {/* Room Name */}
                <span className="removeroom-name">{room.room_name}</span>

                {/* Remove Button */}
                <button
                  className="removeroom-delete-btn"
                  onClick={() => handleRemoveRoom(room.room_id, room.room_name)}
                >
                  -
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