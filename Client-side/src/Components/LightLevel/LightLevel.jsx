/*Made by Joe */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./LightLevel.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import ShareSensorData from "../ShareSensorData/ShareSensorData";
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const LightLevel = () => {
  const navigate = useNavigate(); // Create a navigate function
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  

  const data = {
    labels: ["High", "Average", "Low"],
    datasets: [
      {
        label: "Previous Month",
        data: [95, 65, 30],
        backgroundColor: "#34D399",
      },
      {
        label: "Current Month",
        data: [85, 60, 40],
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
    <div className="card2">
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
        <h2>Light Level</h2>
        <button className="share-button" onClick={openShareSensorData}>
          Share Data
        </button>
      </div>

      <div className="LightLevel-info">
        <h3>Light Level Comparison</h3>
        <div className="comparison-data">
        <p>Previous Month: High: 95% | Avg: 65% | Low: 30%</p>
        <p>Current Month: High: 85% | Avg: 60% | Low: 40%</p>
        </div>
      </div>

      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>

      <div className="info-section">
        <div className="tips">
          <h3>Light Level Tips:</h3>
          <ul>
          <li>Above 80%: Use natural light, turn off artificial lights</li>
          <li>40%-80%: Use task or ambient lighting as needed</li>
          <li>Below 40%: Use bright, energy-efficient bulbs</li>
          </ul>
        </div>

        <div className="energy-alert">
          <h3>Energy Usage Alert:</h3>
          <p>Your energy usage went up from last month.</p>
        </div>

        <div className="recommendations">
          <h3>Recommendations:</h3>
          <p>
        Dear User, your current light level is above 80%. 
        We would recommend you to turn off the lights and enjoy the natural sunlight. 
        </p>
        </div>
      </div>
    
     {/* Modal */}
     {isModalOpen && <ShareSensorData closeModal={closeShareSensorData} />}
    </div>
  );
};

export default LightLevel;