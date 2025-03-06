/*Made by Joe */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./Humidity.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import ShareSensorData from "../ShareSensorData/ShareSensorData";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Humidity = () => {
  const navigate = useNavigate(); // Create a navigate function
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
    <div className="card3">
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
        <h2>Humidity</h2>
        <button className="share-button" onClick={openShareSensorData}>
          Share Data
        </button>
      </div>

      <div className="Humidity-info">
        <h3>Humidity Comparison</h3>
        <div className="comparison-data">
          <p><strong>Previous Month:</strong> High: 105% | Avg: 73% | Low: 42%</p>
          <p><strong> Current  Month:</strong> High: 100% | Avg: 65% | Low: 30%</p>
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
            <li>Above 80% (High Temp & Humidity): Use AC for cooling and dehumidification</li>
            <li>70%-80% (Moderate Temp & Humidity): Set AC to moderate or "dry mode"</li>
            <li>Below 70% (Low Temp & Humidity): Use AC minimally or open windows for ventilation.</li>
          </ul>
        </div>

        <div className="energy-alert">
          <h3>Energy Usage Alert:</h3>
          <p>Your energy usage went up from last month.</p>
        </div>

        <div className="recommendations">
          <h3>Recommendations:</h3>
          <p>Dear User, your current humidity is around 75%. We recommend you turn on the AC.</p>
        </div>
      </div>
    

    {/* Modal */}
    {isModalOpen && <ShareSensorData closeModal6={closeShareSensorData} />}
    </div>
  );
};

export default Humidity;
 