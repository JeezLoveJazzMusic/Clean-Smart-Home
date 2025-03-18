/*Fix by Joe */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import humidityIcon from "../../assets/humidity-icon.png";
import energyIcon from "../../assets/energy-icon.png";
import temperatureIcon from "../../assets/temperature-icon.png";
import lightIcon from "../../assets/light-icon.png";
import weatherIcon from "../../assets/weather-icon.png";
import "./SensorData.css";


function SensorData({houseId, userID, roomName, roomList}) {
  const navigate = useNavigate();  
  const [username, setUsername] = useState("");
  const [houseName, setHouseName] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [curTemp, setCurTemp] = useState("");
  const [curHumidity, setCurHumidity] = useState("");
  const [curLight, setCurLight] = useState("");
  const [curEnergy, setCurEnergy] = useState("");

  useEffect(() => {
    // const fetchDisplay = async () => {
    //   try {
    //     const response = await axios.get(`http://localhost:8080/getUserName/user/${userID}`);
    //     setUsername(response.data.userName);
    //   } catch (error) {
    //     console.error("Error fetching user data:", error);
    //   }
    // };

    const fetchHouseName = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getHouseName/house/${houseId}`);
        setHouseName(response.data.houseName);
      } catch (error) {
        console.error("Error fetching house data:", error);
      }
    };

    fetchHouseName();
    // fetchDisplay();
  }, [userID, houseId]);

  const getRoomId = () => {
    if (roomName && roomList && roomList[roomName] && roomList[roomName].length > 0) {
      setRoomId(roomList[roomName][0].room_id);
    } else {
      // Set default values when no room data exists
      setRoomId(null);
      setCurTemp("N/A");
      setCurHumidity("N/A");
      setCurLight("N/A");
      setCurEnergy("N/A");
    }
  }


  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/getCurrentState/house/${houseId}/room/${roomId}/deviceType/Temperature`);
      const response1 = await axios.get(`http://localhost:8080/getCurrentState/house/${houseId}/room/${roomId}/deviceType/humidity`);
      const response2 = await axios.get(`http://localhost:8080/getCurrentState/house/${houseId}/room/${roomId}/deviceType/LightLevel`);
      setCurTemp(response.data.currentState);
      setCurHumidity(response1.data.currentState);
      setCurLight(response2.data.currentState);
    } catch (error) {
      console.error("Error fetching temperature data:", error);
    }
  }

  useEffect(() => {
    getRoomId();
  }, [roomName, roomList]);

  //updates data at intervals of 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
  }, [roomName, roomList, houseId, roomId]);

/*made by Joe */
  return (
    
    <div className="sensor-data-container1">
      {/* Welcome Text */}
      {houseName&&roomName ? (
      <h2 className="welcome-text1">
        {houseName}, {roomName}
      </h2>
      ) : (
        <p>Loading user name...</p>
      )}
      <div className="sensor-data1">
        <div className="grid-container1">
          {/* Humidity */ /*Fix by Joe */}
          <button onClick={() => navigate("/Humidity", { state : {houseId, roomId, roomName} } )} className="data-box1">  
            <img src={humidityIcon} alt="Humidity" className="icon" />
            <div className="text-container">
              <p className="label">Humidity</p>
              <p className="value">{curHumidity}%</p>
            </div>
          </button>

          {/* Energy */ }
          <button onClick={() => navigate("/EnergyUsage", { state : {houseId, roomId, roomName} } )} className="data-box1">   
            <img src={energyIcon} alt="Energy" className="icon" />
            <div className="text-container">
              <p className="label">Energy</p>
              <p className="value">5500W</p>
            </div>
          </button>

          {/* Temperature */ /*Fix by Joe */}
          <button onClick={() => navigate("/Temperature", { state : {houseId, roomId, roomName} } )} className="data-box1">   
            <img src={temperatureIcon} alt="Temperature" className="icon" />
            <div className="text-container">
              <p className="label">Temperature</p>
              <p className="value">{curTemp}°C</p>
            </div>
          </button>

          {/* Light */  /*Fix by Joe */}
          <button onClick={() => navigate("/LightLevel", { state : {houseId, roomId, roomName} } )} className="data-box1">   
            <img src={lightIcon} alt="Light" className="icon" />
            <div className="text-container">
              <p className="label">Light</p>
              <p className="value">{curLight}%</p>
            </div>
          </button>
        </div>

        {/* Weather */ /*Fix by Joe */}
        <div className="weather-box1">
          <img src={weatherIcon} alt="Weather" className="weather-icon" />
        </div>
      </div>
    </div>
  );
}

export default SensorData;