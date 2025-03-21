/*Made by Joe */
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import "./EnergyUsage.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { RWebShare} from "react-web-share";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const EnergyUsage = () => {
  const navigate = useNavigate(); // Navigate function
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

    const [prevMonth, setPrevMonth] = useState([]);
    const [curMonth, setCurMonth] = useState([]);
    const [fetchedDeviceData, setFetchedDeviceData] = useState([]);

  const location = useLocation();
  const { houseId, roomId ,roomName, recc } = location.state || {};

  const getData = async () => {
    try {
      let tempLastMonth = [];
      let tempCurrentMonth = [];

      const prevHigh = await axios.get(`http://localhost:8080/getHighestLastMonth/house/${houseId}/room/${roomId}/deviceType/EnergyUsage`);
      const prevAvg  = await axios.get(`http://localhost:8080/getAverageLastMonth/house/${houseId}/room/${roomId}/deviceType/EnergyUsage`);
      const prevLow  = await axios.get(`http://localhost:8080/getLowestLastMonth/house/${houseId}/room/${roomId}/deviceType/EnergyUsage`);
      tempLastMonth.push(prevHigh.data.highestLastMonth, prevAvg.data.averageLastMonth, prevLow.data.lowestLastMonth);

      const curHigh  = await axios.get(`http://localhost:8080/getHighestCurrentMonth/house/${houseId}/room/${roomId}/deviceType/EnergyUsage`);
      const curAvg   = await axios.get(`http://localhost:8080/getAverageCurrentMonth/house/${houseId}/room/${roomId}/deviceType/EnergyUsage`);
      const curLow   = await axios.get(`http://localhost:8080/getLowestCurrentMonth/house/${houseId}/room/${roomId}/deviceType/EnergyUsage`);
      tempCurrentMonth.push(curHigh.data.highestCurrentMonth, curAvg.data.averageCurrentMonth, curLow.data.lowestCurrentMonth);

      // Fetch complete device data if needed
      const allDeviceData = await axios.get(`http://localhost:8080/getAllDeviceData/house/${houseId}/room/${roomId}/deviceType/EnergyUsage`);
      console.log("All Device Data", allDeviceData.data);
      setFetchedDeviceData(allDeviceData.data.deviceData);

      console.log("Previous Month:", tempLastMonth);
      console.log("Current Month:", tempCurrentMonth);

      setPrevMonth(tempLastMonth);
      setCurMonth(tempCurrentMonth);
    } catch (error) {
      console.error("Error during energy usage data fetch:", error);
    }
  };

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
          <p>
            Previous Month: High: {prevMonth[0] || '-'}W | Avg: {prevMonth[1] || '-'}W | Low: {prevMonth[2] || '-'}W
          </p>
          <p>
            Current Month: High: {curMonth[0] || '-'}W | Avg: {curMonth[1] || '-'}W | Low: {curMonth[2] || '-'}W
          </p>
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
