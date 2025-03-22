/* Made by Joe */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EnergyRecomendations.css";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Ensure consistent naming
const EnergyRecomendations = () => {
  const navigate = useNavigate(); // Navigate function
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  /* Data for Line Chart */
  const lineData = {
    labels: Array.from({ length: 16 }, (_, i) => (i + 1).toString()),
    datasets: [
      {
        label: "Power Usage",
        data: [200, 300, 260, 230, 360, 350, 250, 400, 320, 280, 230, 300, 350, 220, 340, 345],
        borderColor: "green",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "green",
        fill: false, // No background fill
      },
    ],
  };

  /* Options for Line Chart */
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Usage",
        },
        beginAtZero: true,
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
    <div className="cardforEnergyRecomendations">
      {/* Back Button at Top Right */}
      <button
        onClick={() => navigate(-1)} // Navigate back when clicked
        style={{
          position: "absolute",
          top: "850px",
          right: "110px",
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

      <div className="cardforEnergyRecomendations-header">
        <h2>Energy Recommendations</h2>
        <button className="share-button" onClick={openShareSensorData}>
          Share Data
        </button>
      </div>

      {/* Power Usage Section */}
      <div className="lineEnergyRecomendations-container">
        <div className="chart-text">
          <h3>• Power Usage</h3>
        </div>
        <div className="line-box1">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      <div className="info-section1">
        <div className="tips1">
          <h9>Tips:</h9>
          <p>(Energy Usage Tips)</p>
          <ul>
            <li>Reduce your Energy Usage!</li>
            <li>Next month Energy Goal: 300 KWH (15% less)</li>
            <li>Money to be Saved: RM10</li>
            <li>Carbon Emission to be reduced: 15%</li>
          </ul>
        </div>

        <div className="energy-alert1">
          <h3>Alert:</h3>
          <p>Previous Month Energy Usage: 345 KWH</p>
          <p>Carbon Emissions: 172.5KG</p>
          <p>Estimated Bill: RM 75</p>
        </div>

        <div className="recommendations1">
          <h3>Recommendations:</h3>
          <p>
            Dear User, your current energy usage level is above 850W. We
            recommend turning off lights/appliances and using fans over AC.
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && <ShareSensorData closeModal={closeShareSensorData} />}
    </div>
  );
};

// Ensure consistent export
export default EnergyRecomendations;
