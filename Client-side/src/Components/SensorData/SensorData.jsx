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
  const [recc, setRecc] = useState("");

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

  useEffect(() => {
    if (roomId) {
      getReccomendation();
    }
  }, [roomId]);

  const getReccomendation = async () => {
  try{
    const response = await axios.get(`http://localhost:8080/getRoomRecommendation/room/${roomId}`);
    console.log("reccomendation room id:", roomId);
    const recommendationObj = response.data.recommendation;
    console.log("Recommendation object:", recommendationObj);
    setRecc(recommendationObj);
  } catch (error) {
    console.error("Error fetching recommendation:", error);
  }
};



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
      const response3 = await axios.get(`http://localhost:8080/getCurrentState/house/${houseId}/room/${roomId}/deviceType/EnergyUsage`);
      setCurTemp(response.data.currentState);
      setCurHumidity(response1.data.currentState);
      setCurLight(response2.data.currentState);
      setCurEnergy(response3.data.currentState);
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
        <p></p>
      )}
      <div className="sensor-data1">
        <div className="sensor-data-grid-container">
          {/* Humidity */ /*Fix by Joe */}
          <button onClick={() => navigate("/Humidity", { state : {houseId, roomId, roomName, recc} } )} className="sensor-data-data-box
">  
            <img src={humidityIcon} alt="Humidity" className="icon" />
            <div className="text-container">
              <p className="label">Humidity</p>
              <p className="value">{curHumidity}%</p>
            </div>
          </button>

          {/* Energy */ }
          <button onClick={() => navigate("/EnergyUsage", { state : {houseId, roomId, roomName, recc} } )} className="sensor-data-data-box
">   
            <img src={energyIcon} alt="Energy" className="icon" />
            <div className="text-container">
              <p className="label">Energy</p>
              <p className="value">{curEnergy}kWh</p>
            </div>
          </button>

          {/* Temperature */ /*Fix by Joe */}
          <button onClick={() => navigate("/Temperature", { state : {houseId, roomId, roomName, recc} } )} className="sensor-data-data-box
">   
            <img src={temperatureIcon} alt="Temperature" className="icon" />
            <div className="text-container">
              <p className="label">Temperature</p>
              <p className="value">{curTemp}°C</p>
            </div>
          </button>

          {/* Light */  /*Fix by Joe */}
          <button onClick={() => navigate("/LightLevel", { state : {houseId, roomId, roomName, recc} } )} className="sensor-data-data-box
">   
            <img src={lightIcon} alt="Light" className="icon" />
            <div className="text-container">
              <p className="label">Light</p>
              <p className="value">{curLight}%</p>
            </div>
          </button>
        </div>

        {/* Weather */ /*Fix by Joe */}
        <button onClick={() => navigate("/weather")}className="sensor-data-weather-box">
          <img src={weatherIcon} alt="Weather" className="sensor-data-weather-icon" />
          <div className="text-container">
        </div>
        </button>
      </div>
      </div>
  );
}

export default SensorData;