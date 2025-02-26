import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./Temperature.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import ShareSensorData from "../ShareSensorData/ShareSensorData";
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Temperature = () => {
  const navigate = useNavigate(); // Initialize navigate function
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  
  const data = {
    labels: ["High", "Average", "Low"],
    datasets: [
      {
        label: "Previous Month",
        data: [41, 35, 29],
        backgroundColor: "#34D399",
      },
      {
        label: "Current Month",
        data: [40, 34, 28],
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
    <div className="card1">
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
        <h2>Temperature</h2>
        <button className="share-button" onClick={openShareSensorData}>
          Share Data
        </button>
      </div>

      <div className="Temperature-info">
        <h3>Temperature Comparison</h3>
        <div className="comparison-data">
          <p><strong>Previous Month:</strong> High: 41°C | Avg: 35°C | Low: 29°C</p>
          <p><strong>Current Month: </strong> High: 40°C | Avg: 34°C | Low: 28°C</p>
        </div>
      </div>

      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>

      <div className="info-section">
        <div className="tips">
          <h3>Tips:</h3>
          <p>(Air Conditioner Tips)</p>
          <ul>
            <li>Above 39°C: AC (cooling mode)</li>
            <li>29°C - 39°C: AC (moderate)</li>
            <li>Below 29°C: Don’t turn on the AC</li>
          </ul>
        </div>

        <div className="energy-alert">
          <h3>Energy Usage Alert:</h3>
          <p>Your energy usage went up from last month.</p>
        </div>

        <div className="recommendations">
          <h3>Recommendations:</h3>
          <p>
            Dear User, your current temperature is 35°C. We would recommend you
            to turn on the air conditioner with normal Temperature.
          </p>
        </div>
        </div>

      {/* Modal */}
      {isModalOpen && <ShareSensorData closeModal={closeShareSensorData} />}
    </div>
  );
};


export default Temperature;
