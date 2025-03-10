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


function SensorData({houseId, roomId, userID}) {
  const navigate = useNavigate();  
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getUserName/user/${userID}`);
        console.log("Fetched username:", response.data.userName);
        setUsername(response.data.userName);
        console.log("username:", username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserName();
  }, [userID]);

/*made by Joe */
  return (
    
    <div className="sensor-data-container1">
      {/* Welcome Text */}
      {username ? (
      <h2 className="welcome-text1">
        Welcome Home, {username === "" ? "Name" : username}!
      </h2>
      ) : (
        <p>Loading user name...</p>
      )}
      <div className="sensor-data1">
        <div className="grid-container1">
          {/* Humidity */ /*Fix by Joe */}
          <button onClick={() => navigate("/Humidity", { state : {houseId, roomId} } )} className="data-box1">  
            <img src={humidityIcon} alt="Humidity" className="icon" />
            <div className="text-container">
              <p className="label">Humidity</p>
              <p className="value">65%</p>
            </div>
          </button>

          {/* Energy */ }
          <button onClick={() => navigate("/EnergyUsage", { state : {houseId, roomId} })} className="data-box1">   
            <img src={energyIcon} alt="Energy" className="icon" />
            <div className="text-container">
              <p className="label">Energy</p>
              <p className="value">5500W</p>
            </div>
          </button>

          {/* Temperature */ /*Fix by Joe */}
          <button onClick={() => navigate("/Temperature", { state : {houseId, roomId} })} className="data-box1">   
            <img src={temperatureIcon} alt="Temperature" className="icon" />
            <div className="text-container">
              <p className="label">Temperature</p>
              <p className="value">34°C</p>
            </div>
          </button>

          {/* Light */  /*Fix by Joe */}
          <button onClick={() => navigate("/LightLevel", { state : {houseId, roomId} })} className="data-box1">   
            <img src={lightIcon} alt="Light" className="icon" />
            <div className="text-container">
              <p className="label">Light</p>
              <p className="value">60%</p>
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