import React from "react";
// import pieIcon from "../../assets/Pie.png";
// import chartIcon from "../../assets/Chart.png";
import { Doughnut } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
// import { faker } from "@faker-js/faker";

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

import "./Graphs.css";

/* Data for Doughnut Chart */
const doughnutData = {
  datasets: [
    {
      label: "My First Dataset",
      data: [75, 75, 50],
      backgroundColor: [
        "rgb(56, 110, 61)",
        "rgb(32, 120, 34)",
        "rgb(150, 218, 152)",
      ],
      hoverOffset: 4,
    },
  ],
};

/* Options for Doughnut Chart */
const doughnutOptions = {
  cutout: "70%", // Adjust this value to make the hole bigger or smaller
};

/* Data for Line Chart */
const lineData = {
  labels: [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
  ],
  datasets: [
    {
      label: "Power Usage",
      data: [50, 30, 60, 20, 70, 10, 75, 55, 60, 65, 45, 55, 35, 20, 40, 55],
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

function Graphs() {
  return (
    <div className="graphs-container1">
      <div className="chart-container1">
        {/* Energy Saving Section */}
        <div className="doughnut-container1">
          <div className="chart-text">
            <h3>• Energy Saving</h3>
          </div>
          <div className="doughnut-box">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Power Usage Section */}
        <div className="line-container">
          <div className="chart-text">
            <h3>• Power Usage</h3>
          </div>
          <div className="line-box">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Graphs;
