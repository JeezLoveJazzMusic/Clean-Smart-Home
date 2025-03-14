import React from "react";
import "./RemoveDevice.css";

const RemoveDevice = ({ onClose, devices, onRemoveDevice }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-title-box">
          <h2 className="popup-title">Devices</h2>
        </div>

        <div className="device-grid">
          {devices.map((device) => (
            <div key={device.id} className="device-card">
              <img
                src={device.icon}
                alt={device.device_name}
                className="device-icon"
              />
              <span className="device-name">{device.device_name}</span>
              <button
                className="remove-button"
                onClick={() => onRemoveDevice(device.device_id)}
              >
                −
              </button>
            </div>
          ))}
        </div>

        <button className="back-button" onClick={onClose}>
          Back
        </button>
      </div>
    </div>
  );
};

export default RemoveDevice;
