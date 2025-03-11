import React, { useState, useEffect } from "react";
import "./DeviceList.css";
import { FiMoreVertical } from "react-icons/fi";
import axios from "axios";

// Import device icons
import lightIcon from "../../assets/devices-light.png";
import fanIcon from "../../assets/devices-fan.png";
import acIcon from "../../assets/devices-aircond.png";
import tvIcon from "../../assets/devices-television.png";
import wifiIcon from "../../assets/devices-wifi.png";
import cctvIcon from "../../assets/devices-cctv.png";
import compIcon from "../../assets/devices-computer.png";
import sensorIcon from "../../assets/devices-sensor.png";

// Function to map device type to icon
const getDeviceIcon = (deviceType) => {
  switch (deviceType) {
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
      return sensorIcon; // Use appropriate icon for speaker
    case 'lock':
      return sensorIcon; // Use appropriate icon for lock
    default:
      return sensorIcon; // Default icon
  }
};

const DeviceList = ({ rooms, initialRoom , onRoomChange}) => {
  useEffect(() => {
    onRoomChange(initialRoom);
  }, []);

  // Convert string "true"/"false" to actual boolean values when initializing state
  const processDevices = (devices) => {
    return devices.map(device => ({
      ...device,
      // Convert string "true"/"false" to boolean
      device_power: device.device_power === "true"
    }));
  };
  const [selectedRoom, setSelectedRoom] = useState(initialRoom);
  const [deviceStates, setDeviceStates] = useState(() => {
    // Process the initial devices to convert device_power to boolean
    return processDevices(rooms[initialRoom]);
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle room change and update device list
  const handleRoomChange = (room) => {
    setSelectedRoom(room);
    // Process devices for the new room
    setDeviceStates(processDevices(rooms[room]));
    onRoomChange(room);
    setDropdownOpen(false);
  };

  // Toggle the device state
  const toggleDevice = async (index) => {
    setDeviceStates((prevDevices) => {
      const updatedDevices = prevDevices.map((device, i) => {
        if (i === index) {
          const newPowerState = !device.device_power;
          
          // Call the API to toggle the device (moved outside the state update for clarity)
          axios.put("http://localhost:8080/toggleDevice", {
            device_id: device.device_id,
            device_power: newPowerState.toString() // Convert boolean back to string "true"/"false"
          })
          .then(response => {
            console.log("Device toggled successfully:", response.data);
          })
          .catch(error => {
            console.error("Error toggling device:", error);
          });
          
          // Toggle the device_power boolean
          return { ...device, device_power: newPowerState };
        }
        return device;
      });
      
      return updatedDevices;
    });
  };

  return (
    <div className="smart-home-container">
      <div className="header">
        <div className="dropdown">
          <button className="room-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {selectedRoom} ▽
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              {Object.keys(rooms).map((room) => (
                <div key={room} className="dropdown-option" onClick={() => handleRoomChange(room)}>
                  {room}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu button with dropdown */}
        <div className="menu-container">
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
            <FiMoreVertical />
          </button>
          {menuOpen && (
            <div className="menu-dropdown">
              <div className="menu-option">Add Room</div>
              <div className="menu-option">Add Device</div>
              <div className="menu-option">Remove Room</div>
              <div className="menu-option">Remove Device</div>
            </div>
          )}
        </div>
      </div>

      <div className="device-grid">
        {deviceStates.map((device, index) => (
          <div key={device.device_id} className="device-card">
            <img 
              src={getDeviceIcon(device.device_type)} 
              alt={device.device_name} 
              className="device-icon" 
            />
            <div className="device-info">
              <span className="device-name">{device.device_name}</span>
              <div
                className={`toggleSwitch ${device.device_power ? "on" : "off"}`}
                onClick={() => toggleDevice(index)}
              >
                <div className="toggleKnob">{device.device_power ? "ON" : "OFF"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceList;