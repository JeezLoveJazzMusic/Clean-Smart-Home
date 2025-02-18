import React, { useState } from "react";
import "./ShareSensorData.css";
import humidityIcon from "../../assets/humidity-icon.png";
import energyIcon from "../../assets/energy-icon.png";
import temperatureIcon from "../../assets/temperature-icon.png";
import lightIcon from "../../assets/light-icon.png";

const ShareSensorData = ({ closeModal }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedSensors, setSelectedSensors] = useState([]);

  const handleSelect = (sensor) => {
    setSelectedSensors((prevSelectedSensors) =>
      prevSelectedSensors.includes(sensor)
        ? prevSelectedSensors.filter((s) => s !== sensor)
        : [...prevSelectedSensors, sensor]
    );
  };

  const handleConfirm = () => {
    if (selectedSensors.length > 0) {
      alert(`Sensor data for ${selectedSensors.join(", ")} confirmed for sharing!`);
      setIsModalOpen(false);
      closeModal(); // Close the modal passed from EnergyUsage
    } else {
      alert("Please select at least one sensor to share.");
    }
  };

  return (
    <div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeModal}>
              &times;
            </span>
            <h3>Which sensor data would you like to share?</h3>

            <div className="sensor-options">
              <button className={`sensor-btn ${selectedSensors.includes("Light Sensor") ? "selected" : ""}`} onClick={() => handleSelect("Light Sensor")}>
                <img src={lightIcon} alt="Light Sensor" className="sensor-icon" />
                Light Sensor
              </button>
              <button className={`sensor-btn ${selectedSensors.includes("Humidity Sensor") ? "selected" : ""}`} onClick={() => handleSelect("Humidity Sensor")}>
                <img src={humidityIcon} alt="Humidity Sensor" className="sensor-icon" />
                Humidity Sensor
              </button>
              <button className={`sensor-btn ${selectedSensors.includes("Temperature Sensor") ? "selected" : ""}`} onClick={() => handleSelect("Temperature Sensor")}>
                <img src={temperatureIcon} alt="Temperature Sensor" className="sensor-icon" />
                Temperature Sensor
              </button>
              <button className={`sensor-btn ${selectedSensors.includes("Energy Sensor") ? "selected" : ""}`} onClick={() => handleSelect("Energy Sensor")}>
                <img src={energyIcon} alt="Energy Sensor" className="sensor-icon" />
                Energy Sensor
              </button>
            </div>

            <div className="modal-actions">
              <button className="action-btn" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareSensorData;