import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./EnergyUsage.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import ShareSensorData from "../ShareSensorData/ShareSensorData";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const EnergyUsage = () => {
  const navigate = useNavigate(); // Navigate function
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const data = {
    labels: ["High", "Average", "Low"],
    datasets: [
      {
        label: "Previous Month",
        data: [5000, 4500, 4000],
        backgroundColor: "#34D399",
      },
      {
        label: "Current Month",
        data: [6500, 5500, 4500],
        backgroundColor: "#60A5FA",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  // Open the ShareSensorData modal
  const openShareSensorData = () => {
    setIsModalOpen(true);
  };

  // Close the ShareSensorData modal
  const closeShareSensorData = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="card">
      {/* Back Button at Top Right */}
      <button
        onClick={() => navigate(-1)} // Navigate back when clicked
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 15px",
          fontSize: "14px",
          backgroundColor: "#f87171",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ⬅ Back
      </button>

      <div className="card-header">
        <h2>Energy Usage</h2>
        <button className="share-button" onClick={openShareSensorData}>
          Share Data
        </button>
      </div>

      <div className="EnergyUsage-info">
        <h3>Energy Usage Comparison</h3>
        <div className="comparison-data">
          <p>Previous Month: High: 5000W | Avg: 4500W | Low: 4000W</p>
          <p>Current Month: High: 6500W | Avg: 5500W | Low: 4500W</p>
        </div>
      </div>

      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>

      <div className="info-section">
        <div className="tips">
          <h3>Tips:</h3>
          <p>(Energy Usage Tips)</p>
          <ul>
            <li>High Energy Usage (Above 6000W): Turn off lights/appliances, use fans over AC</li>
            <li>Moderate Energy Usage (4500W-6000W): Use LED lights, set AC to moderate, use fans</li>
            <li>Low Energy Usage (Below 4500W): Use energy-saving lights and AC/heating settings</li>
          </ul>
        </div>

        <div className="energy-alert">
          <h3>Energy Usage Alert:</h3>
          <p>Your energy usage went up from last month.</p>
        </div>

        <div className="recommendations">
          <h3>Recommendations:</h3>
          <p>
            Dear User, your current energy usage level is below 4500W. We would recommend you to use energy-saving
            lights and AC settings.
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && <ShareSensorData closeModal={closeShareSensorData} />}
    </div>
  );
};

export default EnergyUsage;
