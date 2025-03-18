import React from "react";
import "./RemoveDevice.css";

// Icon imports
import lightIcon from "../../../assets/devices-light.png";
import fanIcon from "../../../assets/devices-fan.png";
import acIcon from "../../../assets/devices-aircond.png";
import tvIcon from "../../../assets/devices-television.png";
import wifiIcon from "../../../assets/devices-wifi.png";
import cctvIcon from "../../../assets/devices-cctv.png";
import compIcon from "../../../assets/devices-computer.png";
import sensorIcon from "../../../assets/devices-sensor.png";

const getDeviceIcon = (deviceType) => {
  switch (deviceType) {
    case "light":
      return lightIcon;
    case "fan":
      return fanIcon;
    case "aircond":
    case "thermostat":
      return acIcon;
    case "television":
    case "tv":
      return tvIcon;
    case "wifi":
      return wifiIcon;
    case "cctv":
      return cctvIcon;
    case "computer":
      return compIcon;
    case "sensor":
    case "doorsensor":
    case "temperaturesensor":
      return sensorIcon;
    case "speaker":
      return sensorIcon; // Use appropriate icon for speaker
    case "lock":
      return sensorIcon; // Use appropriate icon for lock
    default:
      return sensorIcon; // Default icon
  }
};

const RemoveDevice = ({ onClose, devices, onRemoveDevice }) => {
  return (
    <div className="RemoveDevice-popup-overlay">
      <div className="RemoveDevice-popup-container">
        <div className="RemoveDevice-popup-title-box">
          <h2 className="RemoveDevice-popup-title">Devices</h2>
        </div>

        <div className="RemoveDevice-device-grid">
          {devices.map((device) => (
            <div key={device.id} className="RemoveDevice-device-card">
              <img
                src={getDeviceIcon(device.device_type)}
                alt={device.device_name}
                className="device-icon"
              />
              <span className="RemoveDevice-device-name">{device.device_name}</span>
              <button3
                className="RemoveDevice-remove-button"
                onClick={() => onRemoveDevice(device.device_id)}
              >
                −
              </button3>
            </div>
          ))}
        </div>

        <div className="RemoveDevice-back-button-container">
          <button4 className="RemoveDevice-back-button" onClick={onClose}>
            Back
          </button4>
        </div>
      </div>
    </div>
  );
};

export default RemoveDevice;
