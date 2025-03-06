import React, { useState } from "react";
import "./DeviceList.css";
import { FiMoreVertical } from "react-icons/fi";

import lightIcon from "../../assets/devices-light.png";
import fanIcon from "../../assets/devices-fan.png";
import acIcon from "../../assets/devices-aircond.png";
import tvIcon from "../../assets/devices-television.png";
import wifiIcon from "../../assets/devices-wifi.png";
import cctvIcon from "../../assets/devices-cctv.png";
import compIcon from "../../assets/devices-computer.png";
import sensorIcon from "../../assets/devices-sensor.png"
import axios from "axios";


// Room data with respective devices
// const roomsExample = {
//   "Living Room": [
//     { id: 1, name: "Lights", icon: lightIcon, state: true },
//     { id: 2, name: "Fan", icon: fanIcon, state: false },
//     { id: 3, name: "AirCond", icon: acIcon, state: true },
//     { id: 4, name: "CCTV", icon: cctvIcon, state: false },
//     { id: 5, name: "WIFI", icon: wifiIcon, state: true },
//     { id: 6, name: "Television", icon: tvIcon, state: true },
//   ],
//   "Dining Room": [
//     { id: 7, name: "Lights", icon: lightIcon, state: true },
//     { id: 8, name: "Fan", icon: fanIcon, state: false },
//     { id: 9, name: "AirCond", icon: acIcon, state: true },
//     { id: 10, name: "CCTV", icon: cctvIcon, state: false },
//     { id: 11, name: "WIFI", icon: wifiIcon, state: true },
//   ],
//   "Kitchen": [
//     { id: 12, name: "Lights", icon: lightIcon, state: true },
//     { id: 13, name: "Fan", icon: fanIcon, state: false },
//     { id: 14, name: "CCTV", icon: cctvIcon, state: false },
//   ],
//   "Front Yard": [
//     { id: 15, name: "Lights", icon: lightIcon, state: true },
//     { id: 16, name: "Fan", icon: fanIcon, state: false },
//     { id: 17, name: "CCTV", icon: cctvIcon, state: false },
//     { id: 18, name: "TempSensor", icon: sensorIcon, state: true },
//   ],
//   "Bedroom 1": [
//     { id: 19, name: "Lights", icon: lightIcon, state: true },
//     { id: 20, name: "Fan", icon: fanIcon, state: false },
//     { id: 21, name: "AirCond", icon: acIcon, state: true },
//     { id: 22, name: "WIFI", icon: wifiIcon, state: true },
//     { id: 23, name: "Television", icon: tvIcon, state: true },
//     { id: 24, name: "EnergySensor", icon: sensorIcon, state: false },
//   ], 
//   "Bedroom 2": [
//     { id: 19, name: "Lights", icon: lightIcon, state: true },
//     { id: 20, name: "Fan", icon: fanIcon, state: false },
//     { id: 21, name: "AirCond", icon: acIcon, state: true },
//     { id: 22, name: "WIFI", icon: wifiIcon, state: true },
//     { id: 23, name: "Computer", icon: compIcon, state: true },
//   ],
//   "Overview": [
//     { id: 24, name: "Lights", icon: lightIcon, state: true },
//     { id: 25, name: "Fan", icon: fanIcon, state: false },
//     { id: 26, name: "AirCond", icon: acIcon, state: true },
//     { id: 27, name: "Television", icon: tvIcon, state: true },
//     { id: 28, name: "WIFI", icon: wifiIcon, state: true },
//     { id: 29, name: "CCTV", icon: cctvIcon, state: false },
//     { id: 30, name: "Computer", icon: compIcon, state: true },
//     { id: 31, name: "EnergySensor", icon: sensorIcon, state: false },
//     { id: 32, name: "TempSensor", icon: sensorIcon, state: true },
//   ],
// };

const DeviceList = ({rooms, initialRoom}) => {
  const [selectedRoom, setSelectedRoom] = useState(initialRoom);
  const [deviceStates, setDeviceStates] = useState(rooms[initialRoom]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle room change and update device list
  const handleRoomChange = (room) => {
    setSelectedRoom(room);
    setDeviceStates(rooms[room]);
    setDropdownOpen(false);
  };

  // Toggle the device state
  const toggleDevice = (id) => {
    setDeviceStates((prevDevices) =>
      prevDevices.map((device) =>
        device.id === id ? { ...device, state: !device.state } : device
      )
    );
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
        {deviceStates.map((device) => (
          <div key={device.id} className="device-card">
            <img src={device.icon} alt={device.name} className="device-icon" />
            <div className="device-info">
              <span className="device-name">{device.device_name}</span>
              <div
                className={`toggleSwitch ${device.state ? "on" : "off"}`}
                onClick={() => toggleDevice(device.id)}
              >
                <div className="toggleKnob">{device.state ? "ON" : "OFF"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceList;
