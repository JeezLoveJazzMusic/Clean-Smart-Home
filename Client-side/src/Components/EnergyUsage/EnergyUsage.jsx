/*Made by Joe */
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import "./EnergyUsage.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const EnergyUsage = () => {
  const navigate = useNavigate(); // Navigate function
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const location = useLocation();
  const { houseId, roomId ,roomName, recc } = location.state || {};

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
      <div className="energy-alert">
          <h3>Energy Usage Alert:</h3>
          <p>{recc.message}</p>
        </div>
        
        <div className="tips">
          <h3>Tips:</h3>
          {recc && recc.tips && recc.tips.length > 0 ? (
            <ul>
              {recc.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          ) : (
            <>
              <p>(No Tips Available)</p>
            </>
          )}
        </div>



      
      </div>

      {/* Modal */}
      {isModalOpen && <ShareSensorData closeModal={closeShareSensorData} />}
    </div>
  );
};

export default EnergyUsage;
