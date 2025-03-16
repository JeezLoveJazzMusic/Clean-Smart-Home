import React, { useState, useEffect } from "react";
import "./DeviceList.css";
import { FiMoreVertical } from "react-icons/fi";
import AddDevice from "../AddnDltDevice/AddDevice/AddDevice.jsx";
import RemoveDevice from "../AddnDltDevice/RemoveDevice/RemoveDevice.jsx";
import axios from "axios";
import AddRoom from "../AddRoom/AddRoom.jsx";
import RemoveRoom from "../RemoveRoom/RemoveRoom.jsx";

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

const DeviceList = ({ rooms, initialRoom , onRoomChange, currentHouse}) => {
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
  // States for popups
  const [addDevice, setAddDevice] = useState(false);
  const [removeDevice, setRemoveDevice] = useState(false);

  // States for popups
  const [addRoom, setAddRoom] = useState(false);
  const [removeRoom, setRemoveRoom] = useState(false);

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

  // Function to add a device
  // Function to add a device
  const handleAddDevice = (newDevice) => {
    // Get the room object for the selected room
    const selectedRoomData = rooms[selectedRoom];
    
    // Make sure we have the room_id
    if (!selectedRoomData || !selectedRoomData[0]?.room_id) {
      console.error("Room ID not found for room:", selectedRoom);
      alert("Error: Room ID not found. Cannot add device.");
      return;
    }
    
    // Get the room_id from the first device in the room (assuming all devices in a room have the same room_id)
    const room_id = selectedRoomData[0].room_id;
    console.log("Adding device to room:", room_id);
    console.log("house_id:", currentHouse);
    console.log("device_name:", newDevice.device_name);
    console.log("device_type:", newDevice.device_type);
    console.log("device_no:", newDevice.device_no);
    // Create API request to add device
    axios.post("http://localhost:8080/addDeviceTemp", {
      house_id: currentHouse,
      room_id: room_id, // Use the room_id from the first device in the room
      device_name: newDevice.device_name,
      device_type: newDevice.device_type,
      device_num: newDevice.device_no
    })
    .then(response => {
      console.log("Device added successfully:", response.data);
      if (response.data && response.data.device_id) {
        const processedDevice = {
          ...response.data,
          device_power: response.data.device_power === "true" // Ensure consistent boolean conversion
        };
        setDeviceStates(prevDevices => [...prevDevices, processedDevice]);
        rooms[selectedRoom] = [...(rooms[selectedRoom] || []), processedDevice];
      }
    })
    .catch(error => {
      console.error("Error adding device:", error);
      alert("Failed to add device. Please try again.");
    });
    
    setAddDevice(false);
  };

  // Function to remove a device
  const handleRemoveDevice = (deviceId) => {
    const selectedRoomData = rooms[selectedRoom];
    const room_id = selectedRoomData[0].room_id;
    console.log("Removing device from room:", room_id);
    console.log("removing device house_id:", currentHouse);
    console.log("removing device device_id:", deviceId);
    axios.delete(`http://localhost:8080/remove_device/houses/${currentHouse}/room/${room_id}/device/${deviceId}`)
    .then(response => {
      console.log("Device removed successfully:", response.data);
      setDeviceStates((prevDevices) =>
        prevDevices.filter((device) => device.device_id !== deviceId)
      );
    })
    .catch(error => {
      console.error("Error removing device:", error);
      alert("Failed to remove device. Please try again.");
    });
  };
  
  return (
    <div className="smart-home-container">
      <div className="header">
        <div className="dropdown">
          <button
            className="room-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedRoom} ▽
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              {Object.keys(rooms).map((room) => (
                <div
                  key={room}
                  className="dropdown-option"
                  onClick={() => handleRoomChange(room)}
                >
                  {room}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu button with dropdown */}
        <div className="menu-container">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FiMoreVertical />
          </button>
          {menuOpen && (
            <div className="menu-dropdown">

              <div className="menu-option" onClick={() => setAddRoom(true)}>
                Add Room
              </div>
              <div className="menu-option" onClick={() => setAddDevice(true)}>

                Add Device
              </div>
              <div className="menu-option" onClick={() => setRemoveRoom(true)}>
                Remove Room</div>
              <div
                className="menu-option"
                onClick={() => setRemoveDevice(true)} >
                Remove Device
              </div>
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
      {/* Add Device Popup */}
      <AddDevice
        onAddDevice={handleAddDevice}
        onClose={() => setAddDevice(false)}
        isOpen={addDevice}
        selectedRoom={selectedRoom}  // This is just the room name string
        currentHouse={currentHouse}
        roomData={rooms[selectedRoom]}  // Pass the actual room data for the selected room
      />
      {/* Add Room Popup */}
      <AddRoom
        onClose={() => setAddRoom(false)}
        isOpen={addRoom}
      />

      {/* Remove Room Popup */}
      <RemoveRoom
        onClose={() => setRemoveRoom(false)}
        isOpen={removeRoom}
      />

      {/* Remove Device Popup */}
      {removeDevice && (
        <RemoveDevice
        onClose={() => setRemoveDevice(false)}
        devices={deviceStates.map(device => ({
          ...device,
          icon: getDeviceIcon(device.device_type) // Attach the icon
        }))}
        onRemoveDevice={handleRemoveDevice}
      />
      )}
    </div>
  );
};

export default DeviceList;