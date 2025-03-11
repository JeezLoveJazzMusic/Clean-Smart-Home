import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../removeroom/RemoveRoom.css";

const RemoveRoom = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  // Load rooms from localStorage when component mounts
  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem("rooms")) || [];
    setRooms(storedRooms);
  }, []);

  // Function to remove a room
  const removeRoom = (roomId) => {
    const updatedRooms = rooms.filter((room) => room.id !== roomId);
    setRooms([...updatedRooms]); 
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
  };

  return (
    <div className="removeroom-modal-overlay">
      <div className="removeroom-modal">
        <div className="removeroom-title-container">
          <h2 className="removeroom-title">Rooms</h2>
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

        <button className="removeroom-back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

export default RemoveRoom;
