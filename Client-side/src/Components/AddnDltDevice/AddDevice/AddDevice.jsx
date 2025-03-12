import React, { useState } from "react";
import "./AddDevice.css";

// Icon imports
import lightIcon from "../../../assets/devices-light.png";
import fanIcon from "../../../assets/devices-fan.png";
import acIcon from "../../../assets/devices-aircond.png";
import tvIcon from "../../../assets/devices-television.png";
import wifiIcon from "../../../assets/devices-wifi.png";
import cctvIcon from "../../../assets/devices-cctv.png";
import compIcon from "../../../assets/devices-computer.png";
import sensorIcon from "../../../assets/devices-sensor.png";

// Mapping device type to icon
const deviceIconMapping = {
  light: lightIcon,
  fan: fanIcon,
  aircond: acIcon,
  tv: tvIcon,
  wifi: wifiIcon,
  cctv: cctvIcon,
  computer: compIcon,
  sensor: sensorIcon,
};

// Main Function
const AddDevice = ({ isOpen, onAddDevice, onClose }) => {
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [deviceNo, setDeviceNo] = useState("");

  if (!isOpen) return null; // Hide if not open

  // Function to handle numeric input for device number
  const handleDeviceNoChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      // Only allow numbers
      setDeviceNo(value);
    }
  };

  // Function to handle text input
  const handleConfirm = () => {
    if (!deviceName || !deviceType) {
      alert("Please enter both Device Name and Device Type.");
      return;
    }

    // Create a new device object
    const newDevice = {
      id: Date.now(), // Unique ID based on timestamp
      device_name: deviceName,
      icon: deviceIconMapping[deviceType] || "", // Use mapping to select icon
      device_type: deviceType,
      device_no: deviceNo,
      state: false,
    };

    // Pass the new device to the parent component
    onAddDevice(newDevice);

    // Clear inputs and close the popup
    setDeviceName("");
    setDeviceType("");
    setDeviceNo("");
    onClose();
  };

  //if (!isOpen) return null; // Hide if not open

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Add Device</h2>

        {/* Device Name Input */}
        <div className="device-input">
          <label>Device Name:</label>
          <input
            type="text"
            placeholder="Enter device name"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
          />
        </div>

        {/* Device Type Selection */}
        <div className="device-input">
          <label>Device Type:</label>
          <select
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)} // Fixing selection
          >
            <option value="">Select Type</option>
            <option value="light">Light</option>
            <option value="fan">Fan</option>
            <option value="aircond">Air Conditioner</option>
            <option value="tv">TV</option>
            <option value="wifi">WiFi</option>
            <option value="computer">Computer</option>
            <option value="cctv">CCTV</option>
            <option value="sensor">Sensor</option>
          </select>
        </div>

        {/* Device No. Input */}
        <div className="device-input">
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
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDevice;
