import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./EnergyRecomendations.css";
import { Line } from "react-chartjs-2";
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
  const { state } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [recommendations, setRecommendations] = useState({
    prediction: "",
    expected_usage: 0,
    carbon_emissions: 0,
    cost: 0,
    savings: {
      energy: 0,
      cost: 0,
      carbon: 0
    },
    suggestions: []
  });
  const averageConsumption = state?.averageConsumption;
  const houseID = state?.currentHouse;
  const dwellersList = state?.dwellersList;
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      console.log("houseID:", houseID);
      console.log("dwellersList:", dwellersList);
      const response = await axios.get(
        `http://localhost:8080/getHouseRecommendation/house/${houseID}/occupants/${dwellersList.length}`
      );
      console.log("API response:", response.data);
      setRecommendations(response.data.recommendation);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching energy recommendations:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    console.log("recc dwellersList:", dwellersList);
  }, []);

  /* Data for Line Chart */
  const fallbackMonths = Array.from({ length: 16 }, (_, i) => (i + 1).toString());
  const fallbackValues = [200, 300, 260, 230, 360, 350, 250, 400, 320, 280, 230, 300, 350, 220, 340, 345];

  const lineData = {
    labels: averageConsumption && averageConsumption.months && averageConsumption.months.length > 0
      ? averageConsumption.months
      : fallbackMonths,
    datasets: [
      {
        label: "Power Usage",
        data: averageConsumption && averageConsumption.values && averageConsumption.values.length > 0
          ? averageConsumption.values
          : fallbackValues,
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
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "kWh",
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
          {isLoading ? (
            <p>Loading recommendations...</p>
          ) : (
            <>
              {recommendations.suggestions && recommendations.suggestions.length > 0 ? (
                recommendations.suggestions.map((suggestion, index) => (
                  <p key={index}>{suggestion}</p>
                ))
              ) : (
                <p>(Energy Usage Tips)</p>
              )}
            </>
          )}
        </div>

        <div className="energy-alert1">
          <h3>Alert:</h3>
          {isLoading ? (
            <p>Loading energy data...</p>
          ) : (
            <>
              <p>Expected Energy Usage: {recommendations.expected_usage?.toFixed(2)} KWH</p>
              <p>Carbon Emissions: {recommendations.carbon_emissions?.toFixed(2)} KG</p>
              <p>Estimated Bill: RM {recommendations.cost?.toFixed(2)}</p>
              <p>Prediction: {recommendations.prediction}</p>
            </>
          )}
        </div>

        <div className="recommendations1">
          <h3>Recommendations:</h3>
          {isLoading ? (
            <p>Loading savings information...</p>
          ) : (
            <p>
              Dear User, your energy prediction is to {recommendations.prediction.toLowerCase()}. 
              By following our suggestions, you could save {recommendations.savings?.energy?.toFixed(2)} kWh of energy, 
              RM {recommendations.savings?.cost?.toFixed(2)} on your bill, and reduce carbon emissions by {recommendations.savings?.carbon?.toFixed(2)} KG.
            </p>
          )}
        </div>
        <button onClick={() => navigate(-1)} className="back-ButtonInEnergyRecommendations">
          ⬅ Back
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && <ShareSensorData closeModal={closeShareSensorData} />}
    </div>
  );
};

// Ensure consistent export
export default EnergyRecomendations;