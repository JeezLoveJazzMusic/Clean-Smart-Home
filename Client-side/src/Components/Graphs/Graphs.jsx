import React from "react";
// import pieIcon from "../../assets/Pie.png";
// import chartIcon from "../../assets/Chart.png";
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import axios, { Axios } from "axios";
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

const fetchData = async (houseID) => {
  response = axios.get(`http://localhost:8080/getAverageEnergyConsumption/house/${houseID}`);
  console.log("Graphs response", response);
  return response.data;
};

function Graphs({ currentHouse }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    console.log("Graphs currentHouse", currentHouse);
    const data = fetchData(currentHouse);
    setData(data);
  }, [currentHouse]);

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
   
    ],
    datasets: [
      {
        label: "Power Usage",
        data: data,
        borderColor: "green",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "green",
        fill: false, // No background fill
      },
    ],
  };

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
