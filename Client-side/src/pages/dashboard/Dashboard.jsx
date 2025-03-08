/*( Made by Joe)*/

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import DeviceList from "../../Components/DeviceList/DeviceList";
import Users from "../../Components/UserDashboard/UserDashboard";
import SensorData from "../../Components/SensorData/SensorData";
import Graphs from "../../Components/Graphs/Graphs";
import UserProfile from "../../Components/UserProfileMenu/UserProfileMenu"; // Import the pop-up
import Sidebar from "../../Components/Sidebar/Sidebar";
import DDTlogo from "../../assets/DDT-logo-transbg.png";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [sendRoomData, setSendRoomData] = useState({});
  const location = useLocation();
  const { userID, houseList } = location.state || {};


  useEffect(() => {
    const fetchDashboardData = async () => {
      if (houseList && houseList.length > 0) {
        const houseID = houseList[0]; // Use the first entry in the houseIDList
        console.log("Fetching data for houseID:", houseID);
        try {
          const response = await axios.get(`http://localhost:8080/dashboard/house/27`);
          const { roomList, dwellersList, devicesList } = response.data;
          console.log("rooms:", roomList);
          console.log("dwellers:", dwellersList);
          console.log("devices:", devicesList);
          setDashboardData({ roomList, dwellersList, devicesList });

          let roomData = {};
          for (let i = 0; i < roomList.length; i++) {
            try {
              const response1 = await axios.get(`http://localhost:8080/getRoomDevices/houses/27/rooms/${roomList[i].room_id}`);
              const { devices } = response1.data;
              console.log("room devices:", devices);
              roomData[roomList[i].room_name] = devices;
            } catch (error) {
              console.error("Error fetching device data:", error);
            }
          }
          setSendRoomData(roomData);
          console.log("sendRoomData:", roomData);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }

        // Fetch user houses data
        const homeData = await axios.get(`http://localhost:8080/getAllUserHouseData/user/${userID}`);
        const { allUserHouseData} = homeData.data;
        console.log("this user has house data of:", allUserHouseData);
    }
    };

    fetchDashboardData();
  }, [houseList]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo1">
          <img
            src={DDTlogo}
            alt="Durian Dev Technologies"
            className="logo-image"
          />
        </div>
        {/* Profile Icon with Click Event */}
        <div className="profile-icon" onClick={() => setIsProfileOpen(true)}>
          👤
        </div>
      </header>

      {/* Sensor Data */}
      <div className="sensor-data">
        <SensorData />
      </div>

      {/* Device List */}
      <div className="device-dashboard">
        {Object.keys(sendRoomData).length > 0 && (
          <DeviceList rooms={sendRoomData} initialRoom={Object.keys(sendRoomData)[0]} />
        )}
      </div>

      {/* Graph Section */}
      <div className="graph-section">
        <Graphs />
      </div>

      {/* User Dashboard */}
      <div className="user-dashboard">
        <Users />
      </div>

      {/* Pop-up Overlay */}
      {isProfileOpen && (
        <div className="popup-overlay">
          <UserProfile onClose={() => setIsProfileOpen(false)} />
        </div>
      )}

      <div>
        <Sidebar />
      </div>
    </div>
  );
};

export default Dashboard;