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

module.exports = { addUser, removeUser, sensorMap };