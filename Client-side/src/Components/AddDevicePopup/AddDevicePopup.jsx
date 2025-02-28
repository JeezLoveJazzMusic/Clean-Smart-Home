import React, { useState } from "react";
import "./AddDevicePopup.css";

const AddDevicePopup = ({ isOpen, onClose }) => {
  // if (!isOpen) return null; // Hide if not open

  const [deviceNo, setDeviceNo] = useState("");

  // Function to handle numeric input
  const handleDeviceNoChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      // Only allow numbers
      setDeviceNo(value);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Add Device</h2>

        {/* Device Name Input */}
        <div className="input-group">
          <label>Device Name:</label>
          <input type="text" placeholder="Enter device name" />
        </div>

        {/* Device Type Selection */}
        <div className="input-group">
          <label>Device Type:</label>
          <select>
            <option value="">Select Type</option>
            <option value="light">Light</option>
            <option value="fan">Fan</option>
            <option value="aircond">Air Conditioner</option>
            <option value="tv">TV</option>
          </select>
        </div>

        {/* Device No. Input */}
        <div className="input-group">
          <label>Device No.:</label>
          <input
            type="number"
            placeholder="Enter device number"
            value={deviceNo}
            onChange={handleDeviceNoChange}
            min="0" // Ensures non-negative numbers
          />
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button className="confirm-btn">Confirm</button>
          <button className="cancel-btn" onClick={onClose}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDevicePopup;
