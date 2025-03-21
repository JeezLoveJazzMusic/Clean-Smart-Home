/*Made by Joe */
import React, { useState, useEffect} from "react";
import { useNavigate , useLocation} from "react-router-dom"; // Import useNavigate for navigation
import "./LightLevel.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { RWebShare} from "react-web-share";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const LightLevel = () => {
  const navigate = useNavigate(); // Create a navigate function
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  
  const [prevMonth, setPrevMonth] = useState([]);
  const [curMonth, setCurMonth] = useState([]);
  const [fetchedDeviceData, setFetchedDeviceData] = useState([]);

  const location = useLocation();
  const { houseId, roomId ,roomName, recc } = location.state || {};

  // Helper function to convert an array of objects (device data) to a CSV string.
  const convertToCSV = (dataArray) => {
    if (!dataArray?.length) return "";
    // Use object keys from the first item as headers.
    const headers = Object.keys(dataArray[0]).join(",");
    const rows = dataArray.map(item => Object.values(item).join(","));
    return [headers, ...rows].join("\r\n");
  };

  // Prepare a CSV file (as a File object) so it can be shared.
  const prepareCSVFile = () => {
    const csvData = convertToCSV(fetchedDeviceData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    return new File([blob], "lightlevel-data.csv", { type: "text/csv" });
  };

  const getData = async () => {
    try {
      let tempLastMonth = [];
      let tempCurrentMonth = [];
      const prevHigh = await axios.get(`http://localhost:8080/getHighestLastMonth/house/${houseId}/room/${roomId}/deviceType/LightLevel`);
      const prevAvg = await axios.get(`http://localhost:8080/getAverageLastMonth/house/${houseId}/room/${roomId}/deviceType/LightLevel`);
      const prevLow = await axios.get(`http://localhost:8080/getLowestLastMonth/house/${houseId}/room/${roomId}/deviceType/LightLevel`);
      tempLastMonth.push(prevHigh.data.highestLastMonth, prevAvg.data.averageLastMonth, prevLow.data.lowestLastMonth);

      const curHigh = await axios.get(`http://localhost:8080/getHighestCurrentMonth/house/${houseId}/room/${roomId}/deviceType/LightLevel`);
      const curAvg = await axios.get(`http://localhost:8080/getAverageCurrentMonth/house/${houseId}/room/${roomId}/deviceType/LightLevel`);
      const curLow = await axios.get(`http://localhost:8080/getLowestCurrentMonth/house/${houseId}/room/${roomId}/deviceType/LightLevel`);
      tempCurrentMonth.push(curHigh.data.highestCurrentMonth, curAvg.data.averageCurrentMonth, curLow.data.lowestCurrentMonth);
      
      const getAllDeviceData = await axios.get(`http://localhost:8080/getAllDeviceData/house/${houseId}/room/${roomId}/deviceType/LightLevel`);
      console.log("All Device Data", getAllDeviceData.data);
      setFetchedDeviceData(getAllDeviceData.data.deviceData);

      console.log("houseId", houseId);
      console.log("roomId", roomId);

      console.log("last month",tempLastMonth); 
      console.log("this month", tempCurrentMonth);
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
    <div className="card2">
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

      <div className="card2-header">
        <h2>Room: {roomName} - Light Level</h2>
        <RWebShare 
          data={{
            files: [prepareCSVFile()],
            text: `See the attached CSV file for ${roomName} light level sensor data.`,
            title: `${roomName} Light Level Data`
          }}
          onClick={() => console.log("Shared successfully!")}
        >
          <button className="share-button">
            Share Data
          </button>
        </RWebShare>
      </div>

      <div className="LightLevel-info">
        <h3>Light Level Comparison</h3>
        <div className="comparison-data">
        <p>Previous Month: High: {prevMonth[0]}% | Avg: {prevMonth[1]}% | Low: {prevMonth[2]}%</p>
        <p>Current Month: High: {curMonth[0]}% | Avg: {curMonth[1]}% | Low: {curMonth[2]}%</p>
        </div>
      </div>

      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>

      <div className="info-section">
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

        <div className="energy-alert">
          <h3>Energy Usage Alert:</h3>
          <p>Your energy usage went up from last month.</p>
        </div>

        <div className="recommendations">
          <h3>Recommendations:</h3>
          {recc && recc.message ? (
            <>
              <p>{recc.message}</p>
              {recc.tips && recc.tips.length > 0 && (
                <ul>
                  {recc.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p>No recommendations available.</p>
          )}
        </div>
      </div>
    
     {/* Modal */}
     {isModalOpen && <ShareSensorData closeModal={closeShareSensorData} />}
    </div>
  );
};

export default LightLevel;