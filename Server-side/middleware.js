const {
  addUserToHouse,
  addPermission,
  removeUserFromHouse,
  removePermission,
  getUserPermissions,
  storeParsedData,
} = require("./database.js");

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


// Call pollHomeIO every minute and log the returned data
// setInterval(() => {
//     pollHomeIO().then((data) => {
//         console.log('Data returned from pollHomeIO:', data);
//         storeParsedData(homeIO_ID, data);
//     });

// }, 6000);

// pollHomeIO().then((data) => {
//   console.log("Data returned from pollHomeIO:", data);
//   storeParsedData(homeIO_ID, data);
// });

// Function for whole house energy suggestions
function analyzeEnergyUsage(Energy_prediciton, prev_month_usage ,energy_rate, carbon_factor) {
  const carbon_emissions = prev_month_usage * carbon_factor; // kg CO2
  const cost = prev_month_usage * energy_rate; // Cost
  
  let prediction = Energy_prediciton;
  let expected_usage = prev_month_usage;
  let savings = { energy: 0, cost: 0, carbon: 0 };
  let suggestions = [];
  
  if (prediction == "Reduce usage") {
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
  }

  else if (prediction == "Usage is okay")
  {
    suggestions = ["Keep up the green living!"]
  }
  
  return {
      prediction,
      expected_usage,
      carbon_emissions,
      cost,
      savings,
      suggestions
  }
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

module.exports = { addUser, removeUser, sensorMap, analyzeEnergyUsage }