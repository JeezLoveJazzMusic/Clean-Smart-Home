import React, { useState, useEffect } from "react";
import "./DeviceList.css";
import { FiMoreVertical } from "react-icons/fi";
import AddDevice from "../AddnDltDevice/AddDevice/AddDevice.jsx";
import RemoveDevice from "../AddnDltDevice/RemoveDevice/RemoveDevice.jsx";
import axios from "axios";
import AddRoom from "../addroom/Addroom.jsx";
import RemoveRoom from "../Removeroom/RemoveRoom";

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

const DeviceList = ({ rooms, initialRoom , onRoomChange, currentHouse, TheUserID, dashboardData }) => {
  const [currentUserType, setCurrentUserType] = useState(null);
  useEffect(() => {
    const fetchUserType = async () => {
      if (!TheUserID) {
        console.error("UserID is undefined - cannot fetch user type");
        setCurrentUserType("dweller"); // Set default
        return;
      }
  
      try {
        const userTypeResponse = await axios.get(`http://localhost:8080/getUserType/user/${TheUserID}`);
        console.log("User type response:", userTypeResponse.data);
        const { userType } = userTypeResponse.data;
        setCurrentUserType(userType?.toLowerCase() );
      } catch (error) {
        console.error("Error fetching user type:", error);
        setCurrentUserType("dweller");
      }
    };
  
    fetchUserType();
  }, [TheUserID]); // Remove dwellersList dependency

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
  const handleAddDevice = (newDevice) => {
    console.log("Selected Room:", selectedRoom);
    console.log("Full rooms data:", rooms);
  
    // Get room ID from dashboard data
    const dashboardRoomData = dashboardData?.roomList?.find(room => room.room_name === selectedRoom);
    let room_id = dashboardRoomData?.room_id;
  
    // If not found in dashboard data, try getting from devices array
    if (!room_id) {
      const selectedRoomData = rooms[selectedRoom];
      if (Array.isArray(selectedRoomData) && selectedRoomData.length > 0) {
        room_id = selectedRoomData[0].room_id;
      }
    }
  
    if (!room_id) {
      console.error("Room ID not found for room:", selectedRoom);
      console.log("Full rooms object:", rooms);
      alert("Error: Room ID not found. Please refresh the page and try again.");
      return;
    }
    
  
    // Make the API call with the found room_id
    axios.post("http://localhost:8080/addDeviceTemp", {
      house_id: currentHouse,
      room_id: room_id,
      device_name: newDevice.device_name,
      device_type: newDevice.device_type,
      device_num: newDevice.device_no
    })
    .then(response => {
      console.log("Device added successfully:", response.data);
      if (response.data && response.data.device_id) {
        const processedDevice = {
          ...response.data,
          device_power: response.data.device_power === "true"
        };
        setDeviceStates(prevDevices => [...prevDevices, processedDevice]);
        
        // Initialize the room array if it doesn't exist
        if (!rooms[selectedRoom]) {
          rooms[selectedRoom] = [];
        }
        rooms[selectedRoom] = [...rooms[selectedRoom], processedDevice];
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
    let room_id = selectedRoomData[0].room_id;
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
  
  const isOwner = (userType) => userType && userType.toLowerCase() === 'owner';

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
          {currentUserType === "owner" && (
      <>
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
              Remove Room
            </div>
            <div className="menu-option" onClick={() => setRemoveDevice(true)}>
              Remove Device
            </div>
          </div>
        )}
      </>
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
        currentHouse={currentHouse}
      />

      {/* Remove Room Popup */}
      <RemoveRoom
        onClose={() => setRemoveRoom(false)}
        isOpen={removeRoom}
        currentHouse={currentHouse}
        rooms={dashboardData?.roomList || []}
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