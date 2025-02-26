const { createClient } = require("@libsql/client");
require("dotenv").config();

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Function to add new sign up user to the database.
async function createUser(username, email, password) {
  try {
    // Insert the user's email and password into the database.
    await turso.execute({
      sql: "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      args: [username, email, password],
    });
    console.log("User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
}

// Function to get a user by email.
async function getUserByEmail(email) {
  try { 
    // Query the database for a user with the provided email.
    const result = await turso.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });
    // Return the first matching user.
    return result.rows[0];
  } catch (error) {
    console.error("Error getting user by email:", error.message);
    throw error;
  }
}

// Function to check if the user exists by email. 
async function checkUserExists(email) {
  try {
    // Query the database to check if a user with the provided email exists.
    const result = await turso.execute({
      sql: "SELECT 1 FROM users WHERE email = ?",
      args: [email],
    });
    // Return true if rows are found, otherwise false.
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error checking if user exists:", error.message);
    throw error;
  }
}

// Function to verify if the password is correct.
async function verifyPassword(email, password) { 
  try { 
    // Get the user by email.
    const user = await getUserByEmail(email);
    if (!user) { 
      return false; // User not found.
    } 
    // Compare the provided password with the stored password.
    return user.password === password;
  } catch (error) {
    console.error("Error verifying password:", error.message);
    throw error;
  }
}

// Code added by: Ahmed Al-Ansi
// Function to get all users in a home profile
async function getUserList(house_id) {
  try {
    // Query the database for all users in the house.
    const result = await turso.execute({
      sql: "SELECT u.user_id, u.username, u.email FROM house_members hm JOIN users u ON hm.user_id = u.user_id WHERE hm.house_id = ?",
      args: [house_id],
    });
    // Feturn the list of users
    return result.rows;
  } catch (error) {
    console.error("Error getting user list:", error.message);
    throw error;
  }
}

// Code added by: Ahmed Al-Ansi
// Function to add a user to a home profile 
async function addUserToHouse(user_id, house_id) {
  try {
    // Insert the user into the house_members table.
    await turso.execute({
      sql: "INSERT INTO house_members (user_id, house_id) VALUES (?, ?)",
      args: [user_id, house_id],
    });
    console.log("User added to house successfully!");
  } catch (error) {
    console.error("Error adding user to house:", error.message);
    throw error;
  }
}

// Code added by: Ahmed Al-Ansi
// Function to give user permission to a use a device/view its data
async function addPermission(user_id, device_id) {
  try {
    // Insert the user and device to permissions table to show that user has permission to use the device.
    await turso.execute({
      sql: "INSERT INTO permissions (user_id, device_id) VALUES (?, ?)",
      args: [user_id, device_id],
    });
    console.log("Permission added successfully!");
  } catch (error) {
    console.error("Error adding permission:", error.message);
    throw error;
  }
}

// Code added by: Ahmed Al-Ansi
// Function to remove a user from a home profile
async function removeUserFromHouse(user_id, house_id) {
  try {
    // Remover user from the house_members table.
    await turso.execute({
      sql: "DELETE FROM house_members WHERE user_id = ? AND house_id = ?",
      args: [user_id, house_id],
    });
    console.log("User removed from house successfully!");
  } catch (error) {
    console.error("Error removing user from house:", error.message);
    throw error;
  }
}

// Code added by: Ahmed Al-Ansi
// Function to remove a user's permission to use a device/view its data
async function removePermission(user_id,house_id, device_id) {
  console.log("this is removing ${device_id}");
  try {
    // Remove user's permission from the permissions table.
    await turso.execute({
      sql: "DELETE FROM permissions WHERE user_id = ? AND device_id = ? AND device_id IN (SELECT device_id FROM devices WHERE house_id = ?)",
      args: [user_id, device_id, house_id],
    });
    console.log("Permission removed successfully!");
  } catch (error) {
    console.error("Error removing permission:", error.message);
    throw error;
  }
}  

async function getHouseList(user_id){
  try{
    console.log("this is user id"+user_id);
    const result = await turso.execute({
      sql: "SELECT * FROM houses WHERE house_id IN (SELECT house_id FROM house_members WHERE user_id = ?)",
      args: [user_id],
    });
    console.log("this is result"+result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error getting house list:" +user_id, error.message);
    console.log("database:this is user id"+user_id);
    throw error;
  }
}


async function getHouseDevices(house_id){
  try{
    const result = await turso.execute({
      sql: "SELECT * FROM devices WHERE house_id = ?",
      args: [house_id],
    });
    return result.rows;
  } catch (error) {
    console.error("Error getting device list:", error.message);
    throw error;
  }
}

async function getRoomDevices(house_id, room_id) {
  try {
    const result = await turso.execute({
      sql: "SELECT * FROM devices WHERE house_id = ? AND room_id = ?",
      args: [house_id, room_id],
    });
    return result.rows;
  } catch (error) {
    console.error("Error getting room devices:", error.message);
    throw error;
  }
}
//by Hao Chen
async function addDeviceToRoom(house_id, room_id, device_name, device_type, manufacturer, model){
  try{
    await turso.execute({
      sql: "INSERT INTO devices (house_id, room_id, device_name, device_type, manufacturer, model) VALUES (?, ?, ?, ?, ?, ?)",
      args: [house_id, room_id,device_name, device_type, manufacturer, model],
    });
    console.log("Device added to room successfully!");
  } catch (error) {
    console.error("Error adding device to room:", error.message);
    throw error;
  }
}

//BY Hao Chen
async function getUserPermissions(user_id){
  try{
    const result = await turso.execute({
      sql: "SELECT * FROM permissions WHERE user_id = ?",
      args: [user_id],
    });
    return result.rows;
  } catch (error) {
    console.error("Error getting user permissions:", error.message);
    throw error;
  }
}

//by Hao Chen
async function removeDeviceFromRoom(house_id, room_id, device_id) {
  try {
    // First, remove dependent rows from device_states (if any)
    await turso.execute({
      sql: "DELETE FROM device_states WHERE device_id = ?",
      args: [device_id],
    });

    // Optionally, remove dependent permissions (if any)
    await turso.execute({
      sql: "DELETE FROM permissions WHERE device_id = ?",
      args: [device_id],
    });

    // Now remove the device from the devices table
    await turso.execute({
      sql: "DELETE FROM devices WHERE house_id = ? AND room_id = ? AND device_id = ?",
      args: [house_id, room_id, device_id],
    });
    console.log("Device removed from room successfully!");
  } catch (error) {
    console.error("Error removing device from room:", error.message);
    throw error;
  }
}

//by Hao Chen
async function getSensorData(device_id){
  try{
    const result = await turso.execute({
      sql: "SELECT * FROM device_states WHERE device_id = ?",
      args: [device_id],
    });
    return result.rows;
  } catch (error) {
    console.error("Error getting sensor data:", error.message);
    throw error;
  }
}

//by Hao Chen ##
async function addRoomToHouse(house_id, room_name){
  try{
    await turso.execute({
      sql: "INSERT INTO rooms (house_id, room_name) VALUES (?, ?)",
      args: [house_id, room_name],
    });
    console.log("Room added to house successfully!");
  } catch (error) {
    console.error("Error adding room to house:", error.message);
    throw error;
  }
}

//by Hao Chen
async function removeRoomFromHouse(house_id, room_id){
  try{
    await turso.execute({
      sql: "DELETE FROM rooms WHERE house_id = ? AND room_id = ?",
      args: [house_id, room_id],
    });
    console.log("Room removed from house successfully!");
  } catch (error) {
    console.error("Error removing room from house:", error.message);
    throw error;
  }
}

//by Hao Chen
async function getRoomList(house_id){
  try{
    const result = await turso.execute({
      sql: "SELECT * FROM rooms WHERE house_id = ?",
      args: [house_id],
    });
    return result.rows;
  } catch (error) {
    console.error("Error getting room list:", error.message);
    throw error;
  }
}

//by Hao Chen
async function addHouseToUser(user_id, house_name, address){
  const owner_id = user_id;
  try{
    await turso.execute({
      sql: "INSERT INTO houses (owner_id, house_name, address) VALUES (?, ?, ?)",
      args: [owner_id, house_name,address],
    });
    console.log("House added to user successfully!");
  } catch (error) {
    console.error("Error adding house to user:", error.message);
    throw error;
  }
}

//by Hao Chen (maybe not needed)
async function removeHouseFromUser(user_id, house_id){
  try{
    await turso.execute({
      sql: "DELETE FROM houses WHERE owner_id = ? AND house_id = ?",
      args: [user_id, house_id],
    });
    console.log("House removed from user successfully!");
  } catch (error) {
    console.error("Error removing house from user:", error.message);
    throw error;
  }
}

//by Hao Chen
// Remove all permissions related to devices in a house.
async function removeHousePermissions(house_id) {
  try {
    await turso.execute({
      sql: "DELETE FROM permissions WHERE device_id IN (SELECT device_id FROM devices WHERE house_id = ?)",
      args: [house_id],
    });
  } catch (error) {
    console.error("Error removing house permissions:", error.message);
    throw error;
  }
}

//by Hao Chen
// Remove all devices registered in a house.
async function removeHouseDevices(house_id) {
  try {
    await turso.execute({
      sql: "DELETE FROM devices WHERE house_id = ?",
      args: [house_id],
    });
  } catch (error) {
    console.error("Error removing house devices:", error.message);
    throw error;
  }
}

// by Hao Chen
// Remove all device states for devices in a house.
async function removeHouseDeviceStates(house_id) {
  try {
    await turso.execute({
      sql: "DELETE FROM device_states WHERE device_id IN (SELECT device_id FROM devices WHERE house_id = ?)",
      args: [house_id],
    });
  } catch (error) {
    console.error("Error removing house device states:", error.message);
    throw error;
  }
}

//by Hao Chen
// Remove all rooms associated with a house.
async function removeHouseRooms(house_id) {
  try {
    await turso.execute({
      sql: "DELETE FROM rooms WHERE house_id = ?",
      args: [house_id],
    });
  } catch (error) {
    console.error("Error removing house rooms:", error.message);
    throw error;
  }
}

//by Hao Chen
// Remove all membership records for a house.
async function removeHouseMembers(house_id) {
  try {
    await turso.execute({
      sql: "DELETE FROM house_members WHERE house_id = ?",
      args: [house_id],
    });
  } catch (error) {
    console.error("Error removing house members:", error.message);
    throw error;
  }
}

//by Hao Chen
// Finally, remove the house itself.
async function removeHouse(house_id) {
  try {
    await turso.execute({
      sql: "DELETE FROM houses WHERE house_id = ?",
      args: [house_id],
    });
  } catch (error) {
    console.error("Error removing house record:", error.message);
    throw error;
  }
}








//tester functions
  // Function to print all rows in the users table.
async function printAllUsers() {
  try {
    // Query the database for all users.
    const result = await turso.execute("SELECT * FROM users");
  
    // Check if there are any rows returned.
    if (result.rows.length > 0) {
      // Print the rows in a table format.
      console.table(result.rows);
    } else {
      console.log("No users found in the database.");
    }
  } catch (error) {
    console.error("Error printing all users:", error.message);
    throw error;
  }
}

// Function to print all rows in the houses table.
async function printAllHouses() {
  try {
    const result = await turso.execute("SELECT * FROM houses");
    if (result.rows.length > 0) {
      console.table(result.rows);
    } else {
      console.log("No houses found in the database.");
    }
  } catch (error) {
    console.error("Error printing all houses:", error.message);
    throw error;
  }
}

// Function to print all rows in the rooms table.
async function printAllRooms() {
  try {
    const result = await turso.execute("SELECT * FROM rooms");
    if (result.rows.length > 0) {
      console.table(result.rows);
    } else {
      console.log("No rooms found in the database.");
    }
  } catch (error) {
    console.error("Error printing all rooms:", error.message);
    throw error;
  }
}

// Function to print all rows in the devices table.
async function printAllDevices() {
  try {
    const result = await turso.execute("SELECT * FROM devices");
    if (result.rows.length > 0) {
      console.table(result.rows);
    } else {
      console.log("No devices found in the database.");
    }
  } catch (error) {
    console.error("Error printing all devices:", error.message);
    throw error;
  }
}

// Function to print all rows in the permissions table.
async function printAllPermissions() {
  try {
    const result = await turso.execute("SELECT * FROM permissions");
    if (result.rows.length > 0) {
      console.table(result.rows);
    } else {
      console.log("No permissions found in the database.");
    }
  } catch (error) {
    console.error("Error printing all permissions:", error.message);
    throw error;
  }
}

// Function to print all rows in the house_members table.
async function printAllHouseMembers() {
  try {
    const result = await turso.execute("SELECT * FROM house_members");
    if (result.rows.length > 0) {
      console.table(result.rows);
    } else {
      console.log("No house members found in the database.");
    }
  } catch (error) {
    console.error("Error printing all house members:", error.message);
    throw error;
  }
}

// Function to print all rows in the device_states table.
async function printAllDeviceStates() {
  try {
    const result = await turso.execute("SELECT * FROM device_states");
    if (result.rows.length > 0) {
      console.table(result.rows);
    } else {
      console.log("No device states found in the database.");
    }
  } catch (error) {
    console.error("Error printing all device states:", error.message);
    throw error;
  }
}


//exporting functions for routes
module.exports = { createUser, getUserByEmail, verifyPassword, getUserList, addUserToHouse, addPermission, removeUserFromHouse, removePermission, getHouseList,checkUserExists,getHouseDevices,getRoomDevices, addDeviceToRoom, getUserPermissions, 
  getSensorData, removeDeviceFromRoom, addRoomToHouse, removeRoomFromHouse, getRoomList, addHouseToUser, removeHouseFromUser, removeHousePermissions, removeHouseDevices,removeHouseRooms,removeHouseMembers,removeHouse, printAllUsers,removeHouseDeviceStates,
  printAllHouses,
  printAllRooms,
  printAllDevices,
  printAllPermissions,
  printAllHouseMembers,
  printAllDeviceStates  };

