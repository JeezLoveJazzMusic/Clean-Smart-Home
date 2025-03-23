import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import AIBot from "../../assets/AIbot.png";
import axios from "axios";

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

function Graphs({ currentHouse, dwellersList }) {
  const navigate = useNavigate();
  const [averageConsumption, setAverageConsumption] = useState([]);

  useEffect(() => {
    const fetchAverage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/getAverageEnergyConsumption/house/${currentHouse}`
        );
        console.log("API response:", response.data);
        // Transform the array of objects to separate arrays for labels and values
        const fetchedData = response.data.averageEnergyConsumption;
        const months = fetchedData.map(item => item.month);
        const avgValues = fetchedData.map(item => item.avg_value);
        console.log("Months:", months);
        console.log("Average Values:", avgValues);
        // Update state with the average values (and you can also store months for dynamic labels)
        setAverageConsumption({ months, values: avgValues });
      } catch (error) {
        console.error("Error fetching average energy consumption:", error);
      }
    };
  
    if (currentHouse) {
      fetchAverage();
    }
  }, [currentHouse]);





  /* Data for Line Chart */
  // Inside your Graphs component after state is updated
const lineData = {
  labels: 
    averageConsumption.months && averageConsumption.months.length > 0
      ? averageConsumption.months
      : Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
  datasets: [
    {
      label: "12-Month Avg Energy Consumption",
      data: 
        averageConsumption.values && averageConsumption.values.length > 0
          ? averageConsumption.values
          : Array(12).fill(0),
      borderColor: "green",
      borderWidth: 2,
      pointRadius: 5,
      pointBackgroundColor: "green",
      fill: false,
    },
  ],
};

  /* Options for Line Chart */
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: "Month" } },
      y: { title: { display: true, text: "kWh" }, beginAtZero: true },
    },
  };

  return (
    <div className="graphs-container1">
      <div className="grid-container">
        <div className="left-column">
          <div className="chart-text">
            <h3>Power Recommendations</h3>
          </div>
          <button
            onClick={() =>
              navigate("/EnergyRecomendations", { state: { averageConsumption, currentHouse, dwellersList } })
            }
            className="Navigate-btn"
          >
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