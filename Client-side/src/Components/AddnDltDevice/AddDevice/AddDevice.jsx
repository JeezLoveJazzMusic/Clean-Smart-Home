import React, { useState } from "react";
import "./AddDevice.css";

export const getDeviceIcon = (deviceType) => {
  switch (deviceType.toLowerCase()) {
    case 'light':
      return lightIcon;
    case 'fan':
      return fanIcon;
    case 'aircond':
    case 'thermostat':
      return acIcon;
    case 'television':
    case 'tv':
      return tvIcon;
    case 'wifi':
      return wifiIcon;
    case 'cctv':
      return cctvIcon;
    case 'computer':
      return compIcon;
    case 'sensor':
    case 'doorsensor':
    case 'temperaturesensor':
      return sensorIcon;
    case 'speaker':
      return sensorIcon;
    case 'lock':
      return sensorIcon;
    default:
      return sensorIcon;
  }
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

  // Function to handle text input with max length 20
  const handleDeviceNameChange = (event) => {
    const value = event.target.value.slice(0, 20);
    setDeviceName(value);
  };

  const handleConfirm = () => {
    if (!deviceName || !deviceType) {
      alert("Please enter both Device Name and Device Type.");
      return;
      
    }

    // Create a new device object
    const newDevice = {
      id: Date.now(), // Unique ID based on timestamp
      device_name: deviceName,
      icon: getDeviceIcon[deviceType] || "", // Use mapping to select icon
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

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Add Device</h2>

        {/* Device Name Input */}
        <div className="device-input">
          <label>Device Name:</label>
          <input
            type="text"
            placeholder="Enter device name (max 20 characters)"
            value={deviceName}
            onChange={handleDeviceNameChange}
            maxLength="20"
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
