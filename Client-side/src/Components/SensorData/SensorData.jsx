/*Fix by Joe */
import React from "react";
import humidityIcon from "../../assets/humidity-icon.png";
import energyIcon from "../../assets/energy-icon.png";
import temperatureIcon from "../../assets/temperature-icon.png";
import lightIcon from "../../assets/light-icon.png";
import weatherIcon from "../../assets/weather-icon.png";
import "./SensorData.css";
import { useNavigate } from "react-router-dom";  
const name = "";

function SensorData() {
  const navigate = useNavigate();  
/*made by Joe */
  return (
    <div className="sensor-data-container">
      {/* Welcome Text */}
      <h2 className="welcome-text">
        Welcome Home, {name === "" ? "Name" : name}!
      </h2>

      <div className="sensor-data">
        <div className="grid-container">
          {/* Humidity */ /*Fix by Joe */}
          <button onClick={() => navigate("/Humidity")} className="data-box">  
            <img src={humidityIcon} alt="Humidity" className="icon" />
            <div className="text-container">
              <p className="label">Humidity</p>
              <p className="value">65%</p>
            </div>
          </button>

          {/* Energy */ }
          <button onClick={() => navigate("/EnergyUsage")} className="data-box">   
            <img src={energyIcon} alt="Energy" className="icon" />
            <div className="text-container">
              <p className="label">Energy</p>
              <p className="value">5500W</p>
            </div>
          </button>

          {/* Temperature */ /*Fix by Joe */}
          <button onClick={() => navigate("/Temperature")} className="data-box">   
            <img src={temperatureIcon} alt="Temperature" className="icon" />
            <div className="text-container">
              <p className="label">Temperature</p>
              <p className="value">34°C</p>
            </div>
          </button>

          {/* Light */  /*Fix by Joe */}
          <button onClick={() => navigate("/LightLevel")} className="data-box">   
            <img src={lightIcon} alt="Light" className="icon" />
            <div className="text-container">
              <p className="label">Light</p>
              <p className="value">60%</p>
            </div>
          </button>
        </div>

        {/* Weather */ /*Fix by Joe */}
        <div className="weather-box">
          <img src={weatherIcon} alt="Weather" className="weather-icon" />
        </div>
      </div>
    </div>
  );
}

export default SensorData;