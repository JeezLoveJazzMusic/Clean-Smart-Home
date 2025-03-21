const {
  addUserToHouse,
  addPermission,
  removeUserFromHouse,
  removePermission,
  getUserPermissions,
  storeParsedData,
  storeEnergyUsage,
  parseSmartMeterData,
  storeSmartMeterData
} = require("./database.js");

const fs = require('fs');
const csvParser = require('csv-parser');

// import fs from 'fs';
// import csvParser from 'csv-parser'

const homeIO_ID = 1;

// Code added by: Ahmed Al-Ansi
// Function to add a user to a home profile with proper permissions settings.
async function addUser(user_id, house_id, device_list) {
  try {
    await addUserToHouse(user_id, house_id);
    // Loop to iterate through all device permissions and add them to the user.
    for (let i = 0; i < device_list.length; i++) {
      await addPermission(user_id, device_list[i]);
    }
  } catch (error) {
    console.error("Error adding user to home:", error.message);
    throw error;
  }
}

// Code added by: Ahmed Al-Ansi (device list not defined)
// Function to remove a user from a home profile with proper permissions settings.
//removes user from house-member table and removes all permissions for the user
async function removeUser(user_id, house_id) {
  console.log("Removing user from home:", user_id);
  try {
    device_list = await getUserPermissions(user_id);
    if (device_list.length === 0) {
      console.log("No devices to remove permission for.");
    }
    console.log("This is the device list:", device_list);
    for (let i = 0; i < device_list.length; i++) {
      console.log("Removing permission for device:", device_list[i]);
      await removePermission(user_id, house_id, device_list[i].device_id);
    }

    await removeUserFromHouse(user_id, house_id);
    // Loop to iterate through all device permissions and remove them from the user.
  } catch (error) {
    console.error("Error removing user from home:", error.message);
    throw error;
  }
}
//a function to send poll request to homeIO server
async function pollHomeIO() {
  try {
    const response = await fetch("http://127.0.0.1:9797/poll");
    if (!response.ok) {
      throw new Error('HTTP error! Status: ${response.status}');
    }
    // If the response is HTML, use text() instead of json()
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error fetching Home IO poll data:", error);
    return null;
  }
}

// function to translate sensor type to the corresponding type in the database
async function sensorMap(sensorType){
  let sensorMap = {
    "Temperature": "temp",
    "humidity": "rhm",
    "LightLevel": "bgs",
    //"EnergyUsage ": " "
  };
  return sensorMap[sensorType];
}

// Function to get a variation of smart meter values with 3 decimal places
function getRandomizedValue(value) {
  const variation = value * (Math.random() * 0.3 - 0.15); // ±15%
  return parseFloat((value + variation).toFixed(3));
}

// Read data from .csv file and process it
async function getSmartMeterData(filePath) {
  // Define the specific rooms we want to use
  const validRooms = ['A', 'D', 'E', 'G', 'H', 'I', 'J'];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', async (row) => {
      try {
        const originalValue = parseFloat(row['Cumulative Energy Usage (kWh)']);
        if (!isNaN(originalValue)) {
          // Randomize the energy usage value and format to 3 decimal places
          const modifiedValue = getRandomizedValue(originalValue);
          row['Cumulative Energy Usage (kWh)'] = modifiedValue.toFixed(3);
          
          // Randomly select a room from the valid rooms
          const randomRoomIndex = Math.floor(Math.random() * validRooms.length);
          row['Room'] = validRooms[randomRoomIndex];
          
          const parsedData = await parseSmartMeterData(row);
          await storeSmartMeterData(parsedData);
        } else {
          console.warn("Skipping invalid row - energy usage is not a number:", row);
        }
      } catch (error) {
        console.warn("Error processing row:", error);
      }
    })
    .on('end', () => {
      console.log("CSV processing completed.");
    });
}

// // Call pollHomeIO every minute and log the returned data
// setInterval(() => {
//     pollHomeIO().then((data) => {
//         console.log('Data returned from pollHomeIO:', data);
//         storeParsedData(homeIO_ID, data);
//     });
// }, 60000);

// pollHomeIO().then((data) => {
//   console.log("Data returned from pollHomeIO:", data);
//   storeParsedData(homeIO_ID, data);
// });

// // Process smart meter data
// setInterval(() => {
//   const csvFilePath = "../smart_meter_readings.csv";
//   getSmartMeterData(csvFilePath)
//     .then(() => {
//       console.log("Smart meter data processing completed");
//     })
//     .catch((error) => {
//       console.error("Error processing smart meter data:", error);
//     });
// }, 3600000); 

// // Initial processing of smart meter data
// const csvFilePath = "../smart_meter_readings.csv";
// getSmartMeterData(csvFilePath).then(() => {
//     console.log('Initial smart meter data processing completed');
// }).catch(error => {
//     console.error('Error processing initial smart meter data:', error);
// });

// Function for whole house energy suggestions
function analyzeEnergyUsage(Energy_prediction, prev_month_usage) {
  const carbon_emissions = prev_month_usage * carbon_factor; // kg CO2
  const cost = prev_month_usage * energy_rate; // Cost
  const energy_rate = 0.218;
  const carbon_factor = 0.5;
  
  let prediction = Energy_prediction;
  let expected_usage = prev_month_usage;
  let savings = { energy: 0, cost: 0, carbon: 0 };
  let suggestions = [];
  
  if (prediction === "Reduce usage") {
    expected_usage = prev_month_usage * 0.85; // Suggest reducing by 15%
    savings.energy = prev_month_usage - expected_usage;
    savings.cost = savings.energy * energy_rate;
    savings.carbon = savings.energy * carbon_factor;
    suggestions = [
      "Turn off unnecessary lights and appliances.",
      "Use energy-efficient lighting and appliances.",
      "Adjust thermostat settings for better efficiency.",
      "Unplug devices when not in use."
    ];
  } else if (prediction === "Usage is okay") {
    suggestions = ["Keep up the green living!"];
  }
  
  const response = {
    prediction,
    expected_usage,
    carbon_emissions,
    cost,
    savings,
    suggestions
  };

  return JSON.stringify(response, null, 2); // Convert to JSON
}

// Function for single room tips
function analyzeRoomEnergy(prev_month_average, current_average, temperature, occupancy) {
  let response = {
    message: "",
    tips: []
  };

  if (current_average > prev_month_average) {
    response.message = "Your energy usage is predicted to increase if you follow this trend!";
    
    // Energy-saving tips based on conditions
    if (temperature < 27) {
      response.tips.push("Consider reducing AC usage as the temperature is already cool.");
    }

    if (new Date().getHours() >= 6 && new Date().getHours() <= 18) {
      response.tips.push("Make use of natural daylight to reduce lighting costs.");
    }

    response.tips.push("Turn off unused appliances when no one is in the room.");
    response.tips.push("Use energy-efficient LED lights.");
    response.tips.push("Unplug devices that are not in use to reduce phantom energy consumption.");
    
  } else {
    response.message = "Good job on green living! Your energy usage is stable or decreasing.";
  }

  return JSON.stringify(response, null, 2); // Convert to JSON
}


// ML model API
async function getPrediction(temperature, occupancy, energyUsage) {
  const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          temperature: temperature,
          occupancy: occupancy,
          energy_usage: energyUsage
      })
  });

  const data = await response.json();
  console.log("Prediction:", data.prediction);
  return data.prediction;
}

// getPrediction(34,1,500);

module.exports = { addUser, removeUser, sensorMap, analyzeEnergyUsage, getSmartMeterData };