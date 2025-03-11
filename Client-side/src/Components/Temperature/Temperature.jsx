/*made by Joe */
import React, { useState, useEffect} from "react";
import { useNavigate , useLocation} from "react-router-dom"; // Import useNavigate for navigation
import "./Temperature.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Temperature = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  
  const [prevMonth, setPrevMonth] = useState([]);
  const [curMonth, setCurMonth] = useState([]);

  const location = useLocation();
  const { houseId, roomId , roomName} = location.state || {};

  const getData = async () => {
    console.log("houseId", houseId);
    console.log("roomId", roomId);
    try {
      let tempLastMonth = [];
      let tempCurrentMonth = [];
      const prevHigh = await axios.get(`http://localhost:8080/getHighestLastMonth/house/${houseId}/room/${roomId}/deviceType/Temperature`);
      const prevAvg = await axios.get(`http://localhost:8080/getAverageLastMonth/house/${houseId}/room/${roomId}/deviceType/Temperature`);
      const prevLow = await axios.get(`http://localhost:8080/getLowestLastMonth/house/${houseId}/room/${roomId}/deviceType/Temperature`);
      tempLastMonth.push(prevHigh.data.highestLastMonth, prevAvg.data.averageLastMonth, prevLow.data.lowestLastMonth);

      const curHigh = await axios.get(`http://localhost:8080/getHighestCurrentMonth/house/${houseId}/room/${roomId}/deviceType/Temperature`);
      const curAvg = await axios.get(`http://localhost:8080/getAverageCurrentMonth/house/${houseId}/room/${roomId}/deviceType/Temperature`);
      const curLow = await axios.get(`http://localhost:8080/getLowestCurrentMonth/house/${houseId}/room/${roomId}/deviceType/Temperature`);
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
        <h2>Room: {roomName} - Temperature</h2>
        <button className="share-button" onClick={openShareSensorData}>
          Share Data
        </button>
      </div>

      <div className="Temperature-info">
        <h3>Temperature Comparison</h3>
        <div className="comparison-data">
          <p><strong>Previous Month:</strong> High: {prevMonth[0]}°C | Avg: {prevMonth[1]}°C | Low: {prevMonth[2]}°C</p>
          <p><strong>Current Month: </strong> High: {curMonth[0]}°C | Avg: {curMonth[1]}°C | Low: {curMonth[2]}°C</p>
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
