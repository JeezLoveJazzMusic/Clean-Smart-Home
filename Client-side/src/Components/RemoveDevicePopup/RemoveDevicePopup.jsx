import React from "react";
import "./RemoveDevicePopup.css"; // Add styles for positioning

const RemoveDevicePopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-title-box">
          <h2 className="popup-title">Devices</h2>
        </div>

        {/* Placeholder for the device grid */}
        <div className="device-grid-placeholder">
          {/* Insert your existing grid code here */}
        </div>

        {/* Back Button */}
        <button className="back-button" onClick={onClose}>
          Back
        </button>
      </div>
    </div>
  );
};

export default RemoveDevicePopup;
