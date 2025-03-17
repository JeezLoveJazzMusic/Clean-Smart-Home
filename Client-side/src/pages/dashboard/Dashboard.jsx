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
  const [HouseDataTest, setAllUserHouseData] = useState([]); //newest changes
  const [userDetails, setUserData] = useState(null);
  const [currentRoom, setCurrentRoom] = useState("");
  const location = useLocation();
  const { userID, houseList } = location.state || {};

  const [currentHouseId, setCurrentHouseId] = useState(null);

  useEffect(() => {
    if (houseList && houseList.length > 0) {
      const savedHouseId = localStorage.getItem('currentHouseId');
      const parsedId = savedHouseId ? parseInt(savedHouseId) : null;
      const validHouseId = parsedId && houseList.includes(parsedId) ? parsedId : houseList[0];
      setCurrentHouseId(validHouseId);
      localStorage.setItem('currentHouseId', validHouseId.toString());
    }
  }, [houseList]);

  const handleHouseSelect = async (houseId) => {
    setCurrentHouseId(houseId);
    localStorage.setItem('currentHouseId', houseId.toString());
    await fetchDashboardData(houseId);
  };

  const fetchDashboardData = async (houseId) => {
    if (!houseId) return;
    console.log("Fetching data for houseID:", houseId);
    try {
      const response = await axios.get(`http://localhost:8080/dashboard/house/${houseId}`);
      const { roomList, dwellersList, devicesList } = response.data;
      console.log("rooms:", roomList);
      console.log("dwellers:", dwellersList);
      console.log("devices:", devicesList);
      setDashboardData({ roomList, dwellersList, devicesList });

      let roomData = {};
      for (let i = 0; i < roomList.length; i++) {
        try {
          const response1 = await axios.get(
            `http://localhost:8080/getRoomDevices/houses/${houseId}/rooms/${roomList[i].room_id}`
          );
          const { devices } = response1.data;
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

    try {
      const homeData = await axios.get(`http://localhost:8080/getAllUserHouseData/user/${userID}`);
      const { allUserHouseData } = homeData.data;
      console.log("this user has house data of:", allUserHouseData);
      setAllUserHouseData(allUserHouseData);
    } catch (error) {
      console.error("Error fetching home data:", error);
    }

    try {
      const response3 = await axios.get(`http://localhost:8080/getUserData/house/${houseId}/user/${userID}`);
      const { userData } = response3.data;
      setUserData(userData);
      console.log("userData:", userData);
    } catch (error) {
      console.error("Error fetching user dashboard data:", error);
    }
  };

  useEffect(() => {
    if (currentHouseId) {
      fetchDashboardData(currentHouseId);
    }
  }, [currentHouseId]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo1">
          <img 
          src={DDTlogo} 
          alt="Durian Dev Technologies" 
          className="logo1-image" 
          />
        </div>
        {/* Profile Icon with Click Event */}
        <div className="profile-icon" onClick={() => setIsProfileOpen(true)}>
          👤
        </div>
      </header>

      {/* Sensor Data */}
      <div className="sensor-data">
      {Object.keys(sendRoomData).length > 0 &&(
        <SensorData houseId={27} userID = {userID} roomName={currentRoom} roomList={sendRoomData}/>
        )}
      </div>

      {/* Device List */}
      <div className="device-dashboard">
        {Object.keys(sendRoomData).length > 0 && (
          <DeviceList rooms={sendRoomData} initialRoom={Object.keys(sendRoomData)[0]} onRoomChange={setCurrentRoom} 
          currentHouse={currentHouseId} TheUserID={userID} dashboardData={dashboardData}/>
        )}
      </div>

      {/* Graph Section */}
      <div className="graph-section">
        <Graphs />
      </div>

      {/* User Dashboard */}
      <div className="user-dashboard">
        {dashboardData && dashboardData.dwellersList && (
        <Users dwellersList={dashboardData.dwellersList} currentHouse = {currentHouseId} UserID = {userID}/>
        )}
      </div>

      {/* Pop-up Overlay */}
      {isProfileOpen && (
        <div className="popup-overlay">
          <UserProfile onClose={() => setIsProfileOpen(false)} thisUserID={userID} thisHouse={currentHouseId} userData={userDetails}/>
        </div>
      )}

      

      <div>
        <Sidebar allHouses={HouseDataTest} currentUserID={userID} setCurrentHouseId={handleHouseSelect} />
      </div>
    </div>
  );
};

export default Dashboard;