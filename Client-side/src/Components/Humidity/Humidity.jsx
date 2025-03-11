/*Made by Joe */
import React, { useState, useEffect } from "react";
import { useNavigate , useLocation} from "react-router-dom"; // Import useNavigate for navigation
import "./Humidity.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import ShareSensorData from "../ShareSensorData/ShareSensorData";
import axios from "axios";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Humidity = () => {
  const navigate = useNavigate(); // Create a navigate function
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const [prevMonth, setPrevMonth] = useState([]);
  const [curMonth, setCurMonth] = useState([]);

  const location = useLocation();
  const { houseId, roomId , roomName} = location.state || {};

  const getData = async () => {
    try {
      let tempLastMonth = [];
      let tempCurrentMonth = [];
      const prevHigh = await axios.get(`http://localhost:8080/getHighestLastMonth/house/${houseId}/room/${roomId}/deviceType/humidity`);
      const prevAvg = await axios.get(`http://localhost:8080/getAverageLastMonth/house/${houseId}/room/${roomId}/deviceType/humidity`);
      const prevLow = await axios.get(`http://localhost:8080/getLowestLastMonth/house/${houseId}/room/${roomId}/deviceType/humidity`);
      tempLastMonth.push(prevHigh.data.highestLastMonth, prevAvg.data.averageLastMonth, prevLow.data.lowestLastMonth);

      const curHigh = await axios.get(`http://localhost:8080/getHighestCurrentMonth/house/${houseId}/room/${roomId}/deviceType/humidity`);
      const curAvg = await axios.get(`http://localhost:8080/getAverageCurrentMonth/house/${houseId}/room/${roomId}/deviceType/humidity`);
      const curLow = await axios.get(`http://localhost:8080/getLowestCurrentMonth/house/${houseId}/room/${roomId}/deviceType/humidity`);
      tempCurrentMonth.push(curHigh.data.highestCurrentMonth, curAvg.data.averageCurrentMonth, curLow.data.lowestCurrentMonth);

      console.log(tempLastMonth); 
      console.log(tempCurrentMonth);
      setPrevMonth(tempLastMonth);
      setCurMonth(tempCurrentMonth);
    }catch(error){
      console.error("Error during temperature data fetch:", error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const data = {
    labels: ["High", "Average", "Low"],
    datasets: [
      {
        label: "Previous Month",
        data: prevMonth,
        backgroundColor: "#34D399",
      },
      {
        label: "Current Month",
        data: curMonth,
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
        <h2>Room: {roomName} - Humidity</h2>
        <button className="share-button" onClick={openShareSensorData}>
          Share Data
        </button>
      </div>

      <div className="Humidity-info">
        <h3>Humidity Comparison</h3>
        <div className="comparison-data">
          <p><strong>Previous Month:</strong> High: {prevMonth[0]}% | Avg: {prevMonth[1]}% | Low: {prevMonth[2]}%</p>
          <p><strong> Current  Month:</strong> High: {curMonth[0]}% | Avg: {curMonth[1]}% | Low: {curMonth[2]}%</p>
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
 