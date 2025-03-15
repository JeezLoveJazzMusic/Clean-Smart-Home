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


async function getUserListWithType(house_id) {
  try {
    // Query the database for all users in the house, including their user_type.
    const result = await turso.execute({
      sql: "SELECT u.user_id, u.username, u.email, hm.user_type FROM house_members hm JOIN users u ON hm.user_id = u.user_id WHERE hm.house_id = ?",
      args: [house_id],
    });
    // Return the list of users with their user_type
    return result.rows;
  } catch (error) {
    console.error("Error getting user list with type:", error.message);
    throw error;
  }
}

// Code added by: Ahmed Al-Ansi
// Function to add a user to a home profile
async function addUserToHouse(user_id, house_id, user_type) {
  try {
    // Insert the user into the house_members table.
    await turso.execute({
      sql: "INSERT INTO house_members (user_id, house_id, user_type) VALUES (?, ?, ?)",
      args: [user_id, house_id, user_type],
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
async function removePermission(user_id, house_id, device_id) {
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

async function getHouseList(user_id) {
  try {
    console.log("this is user id" + user_id);
    const result = await turso.execute({
      sql: "SELECT * FROM houses WHERE house_id IN (SELECT house_id FROM house_members WHERE user_id = ?)",
      args: [user_id],
    });
    console.log("this is result" + result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error getting house list:" + user_id, error.message);
    console.log("database:this is user id" + user_id);
    throw error;
  }
}

async function getHouseDevices(house_id) {
  try {
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
async function addDeviceToRoom(
  house_id,
  room_id,
  device_name,
  device_type,
  device_number
) {
  try {
    await turso.execute({
      sql: "INSERT INTO devices (house_id, room_id, device_name, device_type, device_number) VALUES (?, ?, ?, ?, ?)",
      args: [house_id, room_id, device_name, device_type, device_number],
    });
    console.log("Device added to room successfully!");
  }
  catch (error) {
    console.error("Error adding device to room:", error.message);
    throw error;
  }
}

//BY Hao Chen
async function getUserPermissions(user_id) {
  try {
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

//by hao chen
async function getUserType(user_id, house_id){
  try {
    const result = await turso.execute({
      sql: "SELECT user_type FROM house_members WHERE user_id = ? AND house_id = ?",
      args: [user_id, house_id],
    });
    return result.rows[0].user_type;
  } catch (error) {
    console.error("Error getting user type:", error.message);
    throw error;
  }
}

//by Hao Chen
async function removeAllDevicesFromRoom(house_id, room_id) {
  try {
    await turso.execute({
      sql: "DELETE FROM devices WHERE house_id = ? AND room_id = ?",
      args: [house_id, room_id],
    });
    console.log("All devices removed from room successfully!");
  }
  catch (error) {
    console.error("Error removing all devices from room:", error.message);
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
async function getSensorData(device_id) {
  try {
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
async function addRoomToHouse(house_id, room_name) {
  try {
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
async function removeRoomFromHouse(house_id, room_id) {
  try {
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
async function getRoomList(house_id) {
  try {
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
async function addHouseToUser(user_id, house_name, address) {
  const creator_id = user_id;
  try {
    await turso.execute({
      sql: "INSERT INTO houses (creator_id, house_name, address) VALUES (?, ?, ?)",
      args: [creator_id, house_name, address],
    });
    console.log("House added to user successfully!");
  } catch (error) {
    console.error("Error adding house to user:", error.message);
    throw error;
  }
}

//by Hao Chen
async function getHouseID(creator_id, house_name, address) {
  try {
    result = await turso.execute({
      sql: "SELECT house_id FROM houses WHERE creator_id = ? AND house_name = ? AND address = ?",
      args: [creator_id, house_name, address],
    });
    console.log("House ID retrieved successfully!");
    console.log("House ID: ", result.rows[0].house_id);
    return result.rows[0].house_id;
  } catch (error) {
    console.error("Error retrieving house ID:", error.message);
    throw error;
  }
}

//by Hao Chen (maybe not needed)
async function removeHouseFromUser(user_id, house_id) {
  try {
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

//by Hao Chen
//check if house exists
async function checkHouseExists(user_id, house_name, address) {
  try {
    const result = await turso.execute({
      sql: "SELECT 1 FROM houses WHERE creator_id = ? AND house_name = ? AND address = ?",
      args: [user_id, house_name, address],
    });
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error in checkHouseExists:", error);
    throw error;
  }
}

// Function to parse the data from the HomeIO server.
function parseHomeIOData(data) {
  const lines = data.trim().split(/\s+/);
  const parsedData = [];
  let timestamp = null;
  let currentLine = [];

  for (const part of lines) {
    currentLine.push(part);

    if (
      currentLine.length >= 2 &&
      (currentLine[0].includes("/") ||
        !isNaN(parseFloat(currentLine[1])) ||
        currentLine[1] === "true" ||
        currentLine[1] === "false" ||
        currentLine[1] === "open" ||
        currentLine[1] === "closed")
    ) {
      const line = currentLine.join(" ");
      const parts = line.split(" ");

      if (parts.length < 2) {
        console.warn(`Skipping invalid line: ${line}`);
        currentLine = [];
        continue;
      }

      const key = parts[0];
      let value = parts.slice(1).join(" ");

      const deviceData = {
        device_type: null,
        device_number: null,
        room_name: null,
        state_key: null,
        state_value: null,
        updated_at: null,
      };

      let stateKeyName = null;

      if (key.startsWith("lsw/")) {
        const [, device_number, room_name] = key.split("/");
        deviceData.device_type = "lsw";
        deviceData.device_number = parseInt(device_number);
        deviceData.room_name = room_name;
        deviceData.state_value = value;
        stateKeyName = "button";
      } else if (key.startsWith("udsw/")) {
        const [, device_number, room_name, direction] = key.split("/");
        deviceData.device_type = "udsw";
        deviceData.device_number = parseInt(device_number);
        deviceData.room_name = room_name;
        deviceData.state_value = direction + " " + value;
        stateKeyName = "roller shades button";
      } else if (key.startsWith("lsd/")) {
        const [, device_number, room_name, direction] = key.split("/");
        deviceData.device_type = "lsd";
        deviceData.device_number = parseInt(device_number);
        deviceData.room_name = room_name;
        deviceData.state_value = direction + " " + value;
        stateKeyName = "button direction";
      } else if (key.startsWith("ddtc/")) {
        const [, device_number, room_name] = key.split("/");
        deviceData.device_type = "ddtc";
        deviceData.device_number = parseInt(device_number);
        deviceData.room_name = room_name;
        deviceData.state_value = value;
        stateKeyName = "door opening sensor";
      } else if (key.startsWith("sdtc/")) {
        const [, room_name] = key.split("/");
        deviceData.device_type = "sdtc";
        deviceData.room_name = room_name;
        deviceData.state_value = value;
        stateKeyName = "smoke detector";
      } else if (key.startsWith("mdtc/")) {
        const [, room_name] = key.split("/");
        deviceData.device_type = "mdtc";
        deviceData.room_name = room_name;
        deviceData.state_value = value;
        stateKeyName = "motion sensor";
      } else if (key.startsWith("bdtc/")) {
        const [, room_name] = key.split("/");
        deviceData.device_type = "bdtc";
        deviceData.room_name = room_name;
        deviceData.state_value = value;
        stateKeyName = "light sensor";
      } else if (key.startsWith("gts/")) {
        const [, device_name, direction] = key.split("/");
        deviceData.device_type = "gts";
        deviceData.device_number = null;
        deviceData.room_name = device_name.replace(/_/g, " ");
        deviceData.state_value = direction + " " + value;
        stateKeyName = device_name.replace(/_/g, " ") + " sensor";
      } else if (key.startsWith("gtde/")) {
        const [, device_name] = key.split("/");
        const deviceNumberMatch = device_name.match(/\d+/);
        deviceData.device_type = "gtde";
        deviceData.device_number = deviceNumberMatch
          ? parseInt(deviceNumberMatch[0])
          : null;
        deviceData.room_name = "entrance gate";
        deviceData.state_value = value;
        stateKeyName = "entrance gate infrared";
      } else if (key.startsWith("gtdg")) {
        deviceData.device_type = "gtdg";
        deviceData.device_number = null;
        deviceData.room_name = "garage";
        deviceData.state_value = value;
        stateKeyName = "garage door infrared";
      } else if (key.startsWith("rmt/")) {
        const [, device_number] = key.split("/");
        deviceData.device_type = "rmt";
        deviceData.device_number = parseInt(device_number);
        deviceData.state_value = value;
        stateKeyName = "remote control button";
      } else if (key === "aa") {
        deviceData.device_type = "aa";
        deviceData.state_value = value;
        stateKeyName = "alarm";
      } else if (key.startsWith("rso/")) {
        const [, device_number, room_name] = key.split("/");
        deviceData.device_type = "rso";
        deviceData.device_number = parseInt(device_number);
        deviceData.room_name = room_name;
        deviceData.state_value = parseFloat(value).toFixed(3);
        stateKeyName = "roller shades sensor";
      } else if (key.startsWith("bgs/")) {
        const [, room_name] = key.split("/");
        deviceData.device_type = "bgs";
        deviceData.room_name = room_name;
        deviceData.state_value = parseFloat(value).toFixed(3);
        stateKeyName = "brightness sensor";
      } else if (key.startsWith("temp/")) {
        const [, room_name] = key.split("/");
        deviceData.device_type = "temp";
        deviceData.room_name = room_name;
        deviceData.state_value = parseFloat(value).toFixed(3);
        stateKeyName = "temperature sensor";
      } else if (key.startsWith("tsp/")) {
        const [, room_name] = key.split("/");
        deviceData.device_type = "tsp";
        deviceData.room_name = room_name;
        deviceData.state_value = parseFloat(value).toFixed(3);
        stateKeyName = "temperature setpoint";
      } else if (key === "otemp") {
        deviceData.device_type = "otemp";
        deviceData.state_value = parseFloat(value).toFixed(3);
        stateKeyName = "outdoor temperature";
      } else if (key === "rhm") {
        deviceData.device_type = "rhm";
        deviceData.state_value = parseFloat(value).toFixed(3);
        stateKeyName = "humidity";
      } else if (key === "wdsp") {
        deviceData.device_type = "wdsp";
        deviceData.state_value = parseFloat(value).toFixed(3);
        stateKeyName = "wind speed";
      } else if (key === "lat") {
        deviceData.device_type = "lat";
        deviceData.state_value = parseFloat(value).toFixed(3);
        stateKeyName = "latitude";
      } else if (key === "long") {
        deviceData.device_type = "long";
        deviceData.state_value = parseFloat(value).toFixed(3);
        stateKeyName = "longitude";
      } else if (
        ["year", "month", "day", "hour", "minute", "second"].includes(key)
      ) {
        if (!timestamp) {
          timestamp = {};
        }
        timestamp[key] = parseInt(value);
        currentLine = [];
        continue;
      } else {
        console.warn(`Unknown key: ${key}`);
      }

      deviceData.state_key = stateKeyName;
      if (deviceData.device_type) {
        parsedData.push(deviceData);
      }
      currentLine = [];
    }
  }

  if (timestamp && Object.keys(timestamp).length === 6) {
    const { year, month, day, hour, minute, second } = timestamp;
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    const timestampString = date
      .toISOString()
      .replace("T", " ")
      .replace(/\..+/, "");

    for (const device of parsedData) {
      device.updated_at = timestampString;
    }
  }

  return parsedData;
}

// Function to store the parsed data in the database.
async function storeParsedData(house_id, data) {
  house_id = 27;

  // Step 1: Parse the data
  const parsedData = parseHomeIOData(data);

  // Step 2: Process each parsed data entry one by one
  for (const deviceData of parsedData) {
    try {
      // Step 2a: Get room_id based on room_name
      let room_id = null;
      if (deviceData.room_name) {
        const roomQuery =
          "SELECT room_id FROM rooms WHERE room_name = ? AND house_id = ?";
        console.log(`Executing room query with room_name: ${deviceData.room_name} and house_id: ${house_id}`);
        const roomResult = await turso.execute({
          sql: roomQuery,
          args: [deviceData.room_name, house_id],
        });
        if (roomResult.rows.length > 0) {
          room_id = roomResult.rows[0].room_id;
        } else {
          console.warn(`Room not found for room_name: ${deviceData.room_name}`);
          continue; // Skip this device if room is not found
        }
      }

      // Step 2b: Get device_id based on device_type, device_number, and room_id
      let device_id = null;
      const deviceQuery =
        "SELECT device_id FROM devices WHERE house_id = ? AND room_id = ? AND device_type = ? AND device_number = ?";
      console.log(`Executing device query with house_id: ${house_id}, room_id: ${room_id}, device_type: ${deviceData.device_type}, device_number: ${deviceData.device_number || 1}`);
      const deviceResult = await turso.execute({
        sql: deviceQuery,
        args: [
          house_id,
          room_id,
          deviceData.device_type,
          deviceData.device_number || 1,
        ],
      });
      if (deviceResult.rows.length > 0) {
        device_id = deviceResult.rows[0].device_id;
      } else {
        console.warn(
          `Device not found for device_type: ${deviceData.device_type}, device_number: ${deviceData.device_number}, room_id: ${room_id}`
        );
        continue; // Skip this device if device is not found
      }

      // Step 2c: Insert the parsed data into the device_states table
      const insertQuery =
        "INSERT INTO device_states (device_id, state_key, state_value, updated_at) VALUES (?, ?, ?, ?)";
      console.log(`Executing insert query with device_id: ${device_id}, state_key: ${deviceData.state_key}, state_value: ${deviceData.state_value}, updated_at: ${deviceData.updated_at}`);
      await turso.execute({
        sql: insertQuery,
        args: [
          device_id,
          deviceData.state_key,
          deviceData.state_value,
          deviceData.updated_at,
        ],
      });
      console.log(
        `Data stored for device_id: ${device_id}, state_key: ${deviceData.state_key}, state_value: ${deviceData.state_value}`
      );
    } catch (error) {
      console.error(
        `Error processing device data: ${JSON.stringify(deviceData)}`,
        error
      );
    }
  }
}

// --- Function to get the current state of a device ---
async function getCurrentState(houseId, roomId, deviceType) {
  const query = `
      SELECT ds.state_value
      FROM device_states ds
      JOIN devices d ON ds.device_id = d.device_id
      WHERE d.house_id = ? AND d.room_id = ? AND d.device_type = ?
      ORDER BY ds.updated_at DESC
      LIMIT 1;
  `;
  try {
      const result = await turso.execute({ sql: query, args: [houseId, roomId, deviceType] });
      if (result.rows.length > 0) {
          return result.rows[0].state_value;
      } else {
          return null;
      }
  } catch (error) {
      console.error("Database error in getCurrentState:", error);
      return null;
  }
}

// --- Function to get the highest state value for a device in the last month ---
async function getHighestLastMonth(houseId, roomId, deviceType) {
  const query = `
      SELECT MAX(CAST(ds.state_value AS REAL)) as max_value
      FROM device_states ds
      JOIN devices d ON ds.device_id = d.device_id
      WHERE d.house_id = ? AND d.room_id = ? AND d.device_type = ?
        AND ds.updated_at >= DATE('now', 'start of month', '-1 month')
        AND ds.updated_at < DATE('now', 'start of month');
  `;
  try {
      const result = await turso.execute({ sql: query, args: [houseId, roomId, deviceType] });
      if (result.rows.length > 0 && result.rows[0].max_value !== null) {
          return result.rows[0].max_value;
      }
      return null;
  } catch (error) {
      console.error("Database error in getHighestLastMonth:", error);
      return null;
  }
}

// --- Function to get the average state value for a device in the last month ---
async function getAverageLastMonth(houseId, roomId, deviceType) {
  const query = `
      SELECT ROUND(AVG(CAST(ds.state_value AS REAL)), 3) as avg_value
      FROM device_states ds
      JOIN devices d ON ds.device_id = d.device_id
      WHERE d.house_id = ? AND d.room_id = ? AND d.device_type = ?
        AND ds.updated_at >= DATE('now', 'start of month', '-1 month')
        AND ds.updated_at < DATE('now', 'start of month');
  `;
  try {
      const result = await turso.execute({ sql: query, args: [houseId, roomId, deviceType] });
      if (result.rows.length > 0 && result.rows[0].avg_value !== null) {
          return result.rows[0].avg_value;
      }
      return null;
  } catch (error) {
      console.error("Database error in getAverageLastMonth:", error);
      return null;
  }
}

// --- Function to get the lowest state value for a device in the last month ---
async function getLowestLastMonth(houseId, roomId, deviceType) {
  const query = `
      SELECT MIN(CAST(ds.state_value AS REAL)) as min_value
      FROM device_states ds
      JOIN devices d ON ds.device_id = d.device_id
      WHERE d.house_id = ? AND d.room_id = ? AND d.device_type = ?
        AND ds.updated_at >= DATE('now', 'start of month', '-1 month')
        AND ds.updated_at < DATE('now', 'start of month');
  `;
  try {
      const result = await turso.execute({ sql: query, args: [houseId, roomId, deviceType] });
      if (result.rows.length > 0 && result.rows[0].min_value !== null) {
          return result.rows[0].min_value;
      }
      return null;
  } catch (error) {
      console.error("Database error in getLowestLastMonth:", error);
      return null;
  }
}

// --- Functions for the CURRENT month ---
async function getHighestCurrentMonth(houseId, roomId, deviceType) {
  const query = `
      SELECT MAX(CAST(ds.state_value AS REAL)) as max_value
      FROM device_states ds
      JOIN devices d ON ds.device_id = d.device_id
      WHERE d.house_id = ? AND d.room_id = ? AND d.device_type = ?
        AND ds.updated_at >= date('now', 'start of month');
  `;
  try {
      const result = await turso.execute({ sql: query, args: [houseId, roomId, deviceType] });
      if (result.rows.length > 0 && result.rows[0].max_value !== null) {
          return result.rows[0].max_value;
      }
      return null;
  } catch (error) {
      console.error("Database error in getHighestCurrentMonth:", error);
      return null;
  }
}

async function getAverageCurrentMonth(houseId, roomId, deviceType) {
  const query = `
      SELECT ROUND(AVG(CAST(ds.state_value AS REAL)), 3) as avg_value
      FROM device_states ds
      JOIN devices d ON ds.device_id = d.device_id
      WHERE d.house_id = ? AND d.room_id = ? AND d.device_type = ?
        AND ds.updated_at >= date('now', 'start of month');
  `;
  try {
      const result = await turso.execute({ sql: query, args: [houseId, roomId, deviceType] });
      if (result.rows.length > 0 && result.rows[0].avg_value !== null) {
          return result.rows[0].avg_value;
      }
      return null;
  } catch (error) {
      console.error("Database error in getAverageCurrentMonth:", error);
      return null;
  }
}

async function getLowestCurrentMonth(houseId, roomId, deviceType) {
  const query = `
      SELECT MIN(CAST(ds.state_value AS REAL)) as min_value
      FROM device_states ds
      JOIN devices d ON ds.device_id = d.device_id
      WHERE d.house_id = ? AND d.room_id = ? AND d.device_type = ?
        AND ds.updated_at >= date('now', 'start of month');
  `;
  try {
      const result = await turso.execute({ sql: query, args: [houseId, roomId, deviceType] });
      if (result.rows.length > 0 && result.rows[0].min_value !== null) {
          return result.rows[0].min_value;
      }
      return null;
  } catch (error) {
      console.error("Database error in getLowestCurrentMonth:", error);
      return null;
  }
}

async function getAllUserHouseData(user_id) {
  try {
    const result = await turso.execute({
      sql: `
        SELECT hm.*, h.*
        FROM house_members hm
        JOIN houses h ON hm.house_id = h.house_id
        WHERE hm.user_id = ?
      `,
      args: [user_id],
    });
    return result.rows;
  } catch (error) {
    console.error("Error getting user house data:", error.message);
    throw error;
  }
}

// Function to get user name
async function getUserName  (user_id) {
  console.log("this is user id" + user_id);
  try {
    const result = await turso.execute({
      sql: "SELECT username FROM users WHERE user_id = ?",
      args: [user_id],
    });
    console.log("username:", result.rows[0].username);
    return result.rows[0].username;
  } catch (error) {
    console.error("Error getting user name:", error.message);
    throw error;
  }
} 

async function getUserData(house_id, user_id) {
  try {
    const result = await turso.execute({
      sql: `
        SELECT hm.*, u.*
        FROM house_members hm
        JOIN users u ON hm.user_id = u.user_id
        WHERE hm.user_id = ? AND hm.house_id = ?
      `,
      args: [user_id, house_id], // Now both parameters are used correctly
    });
    return result.rows;
  } catch (error) {
    console.error("Error getting user house data:", error.message);
    throw error;
  }
}

//toggle device 
async function toggleDevice(device_id, device_power) {
  try {
    const result = await turso.execute({
      sql: "UPDATE devices SET device_power = ? WHERE device_id = ?",
      args: [device_power, device_id],
    });
    return result.rows;
  } catch (error) {
    console.error("Error toggling device:", error.message);
    throw error;
  }
}




//tester functions
// Modify database 
async function testdb() {
  try {
    // Query the database for all users.
    const result = await turso.execute("INSERT INTO devices (house_id, room_id, device_name, device_type, device_number, created_at) VALUES (27, 18, 'Smart Light 1', 'light', 1, '2025-03-01 10:00:00'), (27, 18, 'Smart Thermostat', 'thermostat', 1, '2025-03-01 10:05:00'), (27, 18, 'Smart Light 2', 'light', 2, '2025-03-01 10:10:00'), (27, 18, 'Smart Speaker', 'speaker', 1, '2025-03-01 10:15:00'), (27, 18, 'Smart Lock', 'lock', 1, '2025-03-01 10:20:00');");

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

//get house name
async function getHouseName(house_id) {
  try {
    const result = await turso.execute({
      sql: "SELECT house_name FROM houses WHERE house_id = ?",
      args: [house_id],
    });
    if (result.rows.length > 0) {
      return result.rows[0].house_name;
    }
    return null;
  } catch (error) {
    console.error("Error getting house name:", error.message);
    throw error;
  }
}

//get room name
async function getRoomName(room_id) {
  try {
    const result = await turso.execute({
      sql: "SELECT room_name FROM rooms WHERE room_id = ?",
      args: [room_id],
    });
    if (result.rows.length > 0) {
      return result.rows[0].room_name;
    }
    return null;
  } catch (error) {
    console.error("Error getting room name:", error.message);
    throw error;
  }
}

//exporting functions for routes
module.exports = {
  createUser,
  getUserByEmail,
  verifyPassword,
  getUserList,
  addUserToHouse,
  addPermission,
  removeUserFromHouse,
  removePermission,
  getHouseList,
  checkUserExists,
  getHouseDevices,
  getRoomDevices,
  addDeviceToRoom,
  getUserPermissions,
  getSensorData,
  removeDeviceFromRoom,
  addRoomToHouse,
  removeRoomFromHouse,
  getRoomList,
  addHouseToUser,
  removeHouseFromUser,
  removeHousePermissions,
  removeHouseDevices,
  removeHouseRooms,
  removeHouseMembers,
  removeHouse,
  printAllUsers,
  removeHouseDeviceStates,
  printAllHouses,
  getHouseID,
  checkHouseExists,
  storeParsedData,
  printAllRooms,
  printAllDevices,
  printAllPermissions,
  printAllHouseMembers,
  printAllDeviceStates,
  getCurrentState,
  getHighestLastMonth,
  getHouseName,
  getRoomName,
  getAverageLastMonth,
  getLowestLastMonth,
  getAverageCurrentMonth,
  getHighestCurrentMonth,
  getLowestCurrentMonth,
  getAllUserHouseData,
  getUserData,
  getUserName,
  testdb,
  toggleDevice,
  getUserListWithType,
  getUserType,
  removeAllDevicesFromRoom
};