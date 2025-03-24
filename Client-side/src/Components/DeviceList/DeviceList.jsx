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

const DeviceList = ({ rooms, initialRoom , onRoomChange, currentHouse, TheUserID, dashboardData, setRoomID, fetchDashboardData }) => {
  const [currentUserType, setCurrentUserType] = useState(null);

  useEffect(() => {
    onRoomChange(initialRoom);
  }, []);
  

  useEffect(() => {
    const fetchUserType = async () => {
      if (!TheUserID || !currentHouse) {
        console.log("Missing required data - UserID:", TheUserID, "HouseID:", currentHouse);
        return;
      }
  
      try {
        const userTypeResponse = await axios.get(`http://localhost:8080/getUserType/user/${TheUserID}/house/${currentHouse}`);
    
        console.log("User type response:", userTypeResponse.data);
        const { userType } = userTypeResponse.data;
        setCurrentUserType(userType?.toLowerCase() );
      } catch (error) {
        console.error("Error fetching user type:", error);
        setCurrentUserType("dweller");
      }
    };
  
    fetchUserType();
  }, [TheUserID, currentHouse]); // Remove dwellersList dependency

  useEffect(() => {
    // If rooms is not empty (has actual rooms), update selected room
    if (Object.keys(rooms).length > 0 && rooms["Empty House"] === undefined) {
      const firstRoom = Object.keys(rooms)[0];
      setSelectedRoom(firstRoom);
      setDeviceStates(processDevices(rooms[firstRoom] || []));
      onRoomChange(firstRoom);
      
      // Update room ID if needed
      const roomInfo = dashboardData?.roomList?.find((r) => r.room_name === firstRoom);
      if (roomInfo) {
        setRoomID(roomInfo.room_id);
      }
    }
  }, [rooms, dashboardData]);


  // Convert string "true"/"false" to actual boolean values when initializing state
  const processDevices = (devices) => {
    return (devices || []).map(device => ({
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
    console.log("Room changed to:", room);

     // Look up the room info in dashboardData.roomList based on room name
  const roomInfo = dashboardData?.roomList?.find((r) => r.room_name === room);
  if (roomInfo) {
    console.log("Current room id:", roomInfo.room_id);
    setRoomID(roomInfo.room_id);
  } else {
    console.error("Room ID not found for:", room);
  }
  };

  // Toggle the device state
  const toggleDevice = async (index) => {
    const device = deviceStates[index];
    if (!isOwner(currentUserType)) {
    try {
      const permissionResponse = await axios.get(
        `http://localhost:8080/hasPermission/user/${TheUserID}/device/${device.device_id}`
      );
      console.log("Permission response:", permissionResponse.data);
      
      // If permission is not granted, log and exit
      if (permissionResponse.data?.hasPermission !== true) {
        console.log("User does not have permission to toggle this device.");
        return;
      }
    } catch (error) {
      console.error("Error checking permission:", error);
      return;
    }
  }

    setDeviceStates((prevDevices) => {
      const updatedDevices = prevDevices.map((device, i) => {
        console.log("Device object:", device);
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

          // If this is a light, send the command to Home.IO to physically toggle it
        if (device.device_type.toLowerCase() === "light") {
          console.log("Toggling light:", device.device_number + " in room " + selectedRoom);
          // Determine action based on the new state
          const action = newPowerState ? "turn_on" : "turn_off";
          const homeIOControlUrl = `http://localhost:9797/swl/${action}/${device.device_number}/${selectedRoom}`;
          
          axios.get(homeIOControlUrl)
            .then(() => {
              console.log(`Light command sent: ${homeIOControlUrl}`);
            })
            .catch(err => {
              console.error("Error sending light command:", err);
            });
        }
        
          else if (  
            device.device_type.toLowerCase() === "air conditioner" ||
            device.device_type.toLowerCase() === "aircond") 
            {
            console.log("Toggling heater (mapped from air conditioner):", device.device_number + " in room " + selectedRoom);
            const action = newPowerState ? "turn_on" : "turn_off";
            const heaterControlUrl = `http://localhost:9797/swh/${action}/${selectedRoom}`;
            axios.get(heaterControlUrl)
              .then(() => {
                console.log(`Heater command sent: ${heaterControlUrl}`);
              })
              .catch(err => {
                console.error("Error sending heater command:", err);
              });
          }
          
          else if (device.device_type.toLowerCase() === "garage door") {
            console.log("Toggling garage door:", device.device_number + " in room " + selectedRoom);
            // For garage door, use "open" if turning on, "close" if turning off.
            const action = newPowerState ? "open" : "close";
            const garageDoorUrl = `http://localhost:9797/cgate/${action}/garage_door`;
            axios.get(garageDoorUrl)
              .then(() => {
                console.log(`Garage door command sent: ${garageDoorUrl}`);
              })
              .catch(err => {
                console.error("Error sending garage door command:", err);
              });
          }
          else if (device.device_type.toLowerCase() === "alarm") {
            console.log("Toggling alarm:", device.device_number + " in room " + selectedRoom);
            // For alarm, use "on" to activate and "off" to deactivate.
            const action = newPowerState ? "on" : "off";
            const alarmUrl = `http://localhost:9797/sal/${action}`;
            axios.get(alarmUrl)
              .then(() => {
                console.log(`Alarm command sent: ${alarmUrl}`);
              })
              .catch(err => {
                console.error("Error sending alarm command:", err);
              });
          }

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
        setDeviceStates(prevDevices => {
          const updated = [...prevDevices, processedDevice];
          console.log("Updated deviceStates:", updated);
          return updated;
        });
        
        // Initialize the room array if it doesn't exist
        if (!rooms[selectedRoom]) {
          rooms[selectedRoom] = [];
        }
        rooms[selectedRoom] = [...rooms[selectedRoom], processedDevice];
        handleRoomChange(selectedRoom);
      }
    })
    .catch(error => {
      console.error("Error adding device:", error);
      alert("Failed to add device. Please try again.");
    });
    fetchDashboardData(currentHouse);
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
  
  useEffect(() => {
    if (rooms && rooms[selectedRoom]) {
      const newDevices = processDevices(rooms[selectedRoom]);
      console.log("Refreshing deviceStates with new rooms data:", newDevices);
      setDeviceStates(newDevices);
    }
  }, [rooms, selectedRoom]);

  const isOwner = (userType) => userType && userType.toLowerCase() === 'owner';

  return (
    <div className="smart-home-container">
      <div className="DeviceList-header">
        <div className="dropdown">
          <button
            className="room-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedRoom} ▽
          </button>
          {dropdownOpen && (
            <div
              className="dropdown-menu"
              style={
                Object.keys(rooms).length > 10
                  ? { maxHeight: "250px", overflowY: "auto" } // scrollbar 
                  : {}
              }
            >
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
          devices={deviceStates.map((device) => ({
            ...device,
            icon: getDeviceIcon(device.device_type), // Attach the icon
          }))}
          onRemoveDevice={handleRemoveDevice}
        />
      )}
    </div>
  );
};

export default DeviceList;