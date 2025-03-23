import React from "react";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import AIBot from "../../assets/AIbot.png";

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

import "./Graphs.css";

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

function Graphs() {
  const navigate = useNavigate();  

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
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Usage" }, beginAtZero: true },
    },
  };

  return (
    <div className="graphs-container1">
      <div className="grid-container">
        <div className="left-column">
          <div className="chart-text">
            <h3>Power Recommendations</h3>
          </div>
          <button onClick={() => navigate("/EnergyRecomendations")} className="Navigate-btn">
            <img src={AIBot} alt="AIBOT" className="iconfoaibot" />
            AI Generated Recommendations
          </button>
        </div>
        <div className="line-boxingraph">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
}

export default Graphs;