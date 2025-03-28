//REMEMBER TO ADD CHECK FOR DUPLICATES WHEN ADDING SHIT
//Database imports
const { createUser, getUserByEmail, removeAllDevicesFromRoom, verifyPassword, addPermission, addUserToHouse, getUserList, removePermission, getHouseList,checkUserExists,getHouseDevices,getRoomDevices,addDeviceToRoom, getSensorData, removeDeviceFromRoom, addRoomToHouse, removeRoomFromHouse, getRoomList,addHouseToUser, removeHouseFromUser, removeHousePermissions,getAllUserHouseData, getUserData,getUserName, toggleDevice, getUserListWithType, getAllDeviceData,  getUserType,
  removeHouseDevices,removeHouseRooms,removeHouseMembers,removeHouse, printAllUsers, printAllHouses, printAllRooms, printAllDevices, printAllPermissions, printAllHouseMembers, printAllDeviceStates, removeHouseDeviceStates, getHouseID, checkHouseExists, getCurrentState, getHighestLastMonth, getAverageLastMonth, getLowestLastMonth, getAverageCurrentMonth, getHighestCurrentMonth, getLowestCurrentMonth, testdb, getHouseName, getRoomName,

  addAllPermission, removeAllUserPermissions, isCreator, getHouseCreator, deleteUser, getUserPermissionForRoom, checkPermission, updateUserPassword, requestDeletion, checkDeletionStatus, cancelDeletion, updateLastLogin, isCreatorOfAnyHouse, getPreviousMonthHouseAverage,getPreviousMonthRoomAverage, getCurrentMonthRoomAverage,getAverageLast12Months,getCurrentMonthHouseAverage, getPreviousMonthRoomAverageEnergy, getPreviousMonthRoomTotalEnergy, getCurrentRoomTotalEnergy,  getPreviousMonthHouseAverageEnergy } = require("./database.js"); 

//Middleware imports
const {addUser, removeUser, sensorMap, analyzeEnergyUsage, analyzeRoomEnergy, getPrediction} = require("./middleware.js");
const express = require("express");
const router = express.Router();

//signup route by Hao Chen ##
router.post("/signup", async (req, res) => {
   const { username, email, password } = req.body;
   try {

   //error if user of the same email already exists
   const existingUser = await getUserByEmail(email); // Get the user by email from the database.
   if (existingUser) {
     return res.status(409).send({ message: "Routes: User already exists" });
   }

   //validate input: username, email and password required
   if (!email || !password  || !username) {
       return res.status(400).send({ message: "Routes: Email and password are required" });
     }

   //if there are no issues, create a user object
   await createUser(username, email, password); // Create the user in the database.
   res.status(201).send({message: "Routes: New User successfully created"})

   }
   catch (error) {
       console.error(error);
       res.status(500).send({ message: "Routes: An error occurred during signup" });
     }
})


// Login route ( by Hao Chen ) ##
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Routes: Email and password are required" });
    }

    // Check if user exists
    const user = await getUserByEmail(email);
    console.log("routes: this is user:", JSON.stringify(user, null, 2));
    if (!user) {
      return res.status(401).send({ message: "Routes: Invalid email" });
    }

    // Verify password
    const isValidPassword = await verifyPassword(email, password);
    if (!isValidPassword) {
      return res.status(401).send({ message: "Routes: Invalid password" });
    }

    // Update last login timestamp
    await updateLastLogin(user.user_id);

    // Check deletion status before proceeding with login
    const deletionStatus = await checkDeletionStatus(user.user_id);

    if (deletionStatus.status === "deleted") {
      return res.status(401).send({ message: deletionStatus.message });
    }

    // Login successful
    console.log("routes: this is user.user_id:", user.user_id);
    homeList = await getHouseList(user.user_id);
    console.log("Raw homeList:", homeList);
    houseIDList = homeList.map((home) => home.house_id);
    console.log("houseIDList:", houseIDList);

    // If account was recovered, include recovery message
    if (deletionStatus.status === "recovered") {
      res.status(200).send({
        message: "Routes: Login successful",
        userID: user.user_id,
        houseList: houseIDList,
        recoveryMessage: deletionStatus.message,
      });
    } else {
      res.status(200).send({
        message: "Routes: Login successful",
        userID: user.user_id,
        houseList: houseIDList,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred during login" });
  }
});

//get dashboard data (by Hao Chen) 
router.get("/dashboard/house/:house_id", async (req, res) => {
 const { house_id } = req.params;
 try {
   // Get home-specific data (e.g., rooms, dwellers, house-level devices)
   const rooms = await getRoomList(house_id);
   const dwellers = await getUserListWithType(house_id);
   const houseDevices = await getHouseDevices(house_id);
   
   res.status(200).send({
     message: "Routes: House details retrieved successfully",
     roomList: rooms,
     dwellersList: dwellers,
     devicesList: houseDevices
   });
 

 } catch (error) {
   console.error(error);
   res.status(500).send({
     message: "Routes: An error occurred while retrieving house details"
   });
 }
});

//get user by email
router.post("/getUserByEmail", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await getUserByEmail(email);
    res.status(200).send({ message: "Routes: User successfully retrieved", user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting user" });
  }
});

//check if email exists (by Hao Chen) ##
router.post("/check_Email", async (req, res) => {
 const { email } = req.body;
 try {
   // Check if email doesn't exist
   const existBool = await checkUserExists(email);
   console.log("routes: this is existBool:",existBool);
   if (existBool == false) {
     return res.status(401).send({ message: "Routes: Email does not exist",existBool});
   }
   res.status(200).send({ message: "Routes: Email exists", existBool});
 } 
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while checking email" });
 }
});
 

// Get user list in a house(by Hao Chen ) ##
router.get("/houses/:house_id/users", async (req, res) => {
 const house_id = req.params.house_id;
 try {
   const users = await getUserList(house_id);
   res.status(200).send({message: "Routes: Users successfully retrieved", users});
 } 
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while getting users" });
 }
});

//Remove user from home (by Hao Chen) ##
router.delete("/removeUserFromHome/houses/:house_id/users/:user_id", async (req, res) => {
 const { house_id, user_id } = req.params;
 try {
   await removeUser(user_id, house_id);
   // Also remove all permissions for that user (this could be house-specific if needed)
   await removeAllUserPermissions(user_id);
   res.status(200).send({message: "Routes: User successfully removed"});
 } 
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while removing user" });
 }
});

//Add user to home (by Hao Chen)  ##
router.post("/add_UserToHome", async (req, res) => {
 const { user_id, house_id, device_list } = req.body;
 
 try {
   // Validate input
   if (!user_id || !house_id || !Array.isArray(device_list)) {
     return res.status(400).send({ message: "Routes: Invalid input: user_id, house_id and deviceList required" });
   }

   // Add user with device list
   await addUser(user_id, house_id, device_list);
   res.status(200).send({ message: "Routes: User successfully added with devices"});
 } 
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while adding user and devices" });
 }
});


//Add permissions to user (by Hao Chen) ##
//extra: this is adding single permissions. One request is sent per click
router.post("/add_permission", async (req, res) => {
 const { user_id, device_id } = req.body;
 try {
   await addPermission(user_id, device_id);
   res.status(200).send({message: "Routes: Permission successfully added"});
 } 
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while adding permissions" });
 }
})

//Remove permissions from user (by Hao Chen) ##
router.delete("/remove_permission/user/:user_id/device/:device_id", async (req, res) => {
 const { user_id, device_id } = req.params;
 console.log("routes: this is user_id:",user_id);
 console.log("routes: this is device_id:",device_id);
 try {
   await removePermission(user_id, device_id);
   res.status(200).send({message: "Routes: Permission successfully removed"});
 } 
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while removing permissions" });
 }
})

//Get room devices (by Hao Chen) ##
router.get("/getRoomDevices/houses/:house_id/rooms/:room_id", async (req, res) => {
  const house_id = req.params.house_id;
  const room_id = req.params.room_id;

  try {
    let devices = await getRoomDevices(house_id, room_id);
    
    // Remove sensors by filtering them out
    devices = devices.filter(device => !["bgs", "temp", "rhm", "smd"].includes(device.device_type));

    res.status(200).send({ message: "Routes: Devices successfully retrieved", devices });
    console.log("routes: this is devices:", devices);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting devices" });
  }
});

//add device to room (by Hao Chen) ## !!!!!!!!!!!!!!!!!!!!!!!!!
router.post("/add_DeviceToRoom", async (req, res) => {
 const { house_id, room_id, device_name, device_type } = req.body;
 try {
   await addDeviceToRoom(house_id, room_id,device_name, device_type);
   res.status(200).send({message: "Routes: Device successfully added to room"});
 } 
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while adding device to room" });
 }
});

//testing
router.post("/addDeviceTemp", async (req, res) => {
  const { house_id, room_id, device_name, device_type, device_num } = req.body;
  try {
    await addDeviceToRoom(house_id, room_id,device_name, device_type, device_num);
    res.status(200).send({message: "Routes: Device successfully added to room"});
  } 
  catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while adding device to room" });
  }
 });

 
//remove device from room (by Hao Chen) ##
router.delete("/remove_device/houses/:house_id/room/:room_id/device/:device_id", async (req, res) => {
 const { house_id, room_id, device_id } = req.params;
 try {
   await removeDeviceFromRoom(house_id, room_id, device_id);
   res.status(200).send({message: "Routes: Device successfully removed from room"});
 } 
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while removing device from room" });
 }
});

//view sensor data (by Hao Chen) ##
router.get("/viewSensorData/device/:device_id", async (req, res) => {
 const device_id = req.params.device_id;
 try {
   const sensorData = await getSensorData(device_id);
   res.status(200).send({message: "Routes: Sensor data successfully retrieved", sensorData});
 } 
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while getting sensor data" });
 }
 
});

//adding a room to a house (by Hao Chen) ##
router.post("/addRoom", async (req, res) => {
 const { house_id, room_name } = req.body;
 try {
   await addRoomToHouse(house_id, room_name);
   res.status(200).send({message: "Routes: Room successfully added to house"});
 } 
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while adding room to house" });
 }
});

//removing a room from a house (by Hao Chen) ##
router.delete("/removeRoom/houses/:house_id/room/:room_id", async (req, res) => {
 const { house_id, room_id } = req.params;
 try {
   await removeRoomFromHouse(house_id, room_id);
   res.status(200).send({message: "Routes: Room successfully removed from house"});
 } 
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while removing room from house" });
 }
});

//get room list (by Hao Chen) ##
router.get("/getRoomList/houses/:house_id", async (req, res) => {
 const house_id = req.params.house_id;
 try {
   const rooms = await getRoomList(house_id);
   const roomIDList = rooms.map(room => room.room_id);
   res.status(200).send({message: "Routes: Rooms successfully retrieved", roomIDList});
 } 
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while getting rooms" });
 }
});

//get house list (by Hao Chen) ##
router.get("/getHouseList/user/:user_id", async (req, res) => {
 const user_id = req.params.user_id;
 try {
   const homes = await getHouseList(user_id);
   const homeIDList = homes.map(home => home.house_id);
   console.log("routes: this is homeIDList:",homeIDList);
   res.status(200).send({message: "Routes: Homes successfully retrieved", homeIDList});
 } 
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while getting homes" });
 }
});

//get all user house data (by Hao Chen) ##
router.get("/getAllUserHouseData/user/:user_id", async (req, res) => {
 const user_id = req.params.user_id;
 try {
   const allUserHouseData = await getAllUserHouseData(user_id);
   res.status(200).send({message: "Routes: All user house data successfully retrieved", allUserHouseData});
 } 
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while getting all user house data" });
 }
});

//add house to user for owners(by Hao Chen) ##
router.post("/createHouse", async (req, res) => {
 const { user_id, house_name, address } = req.body;
 try {
   // Check if the house already exists
   const houseExists = await checkHouseExists(user_id, house_name, address);
   if (houseExists) {
     return res.status(409).send({ message: "Routes: House already exists" });
   }
   // Attempt both operations
   await addHouseToUser(user_id, house_name, address);
   houseIDList = await getHouseList(user_id);
   newlyCreatedHouseID = await getHouseID(user_id, house_name, address);
   console.log("routes: this is newlyCreatedHouseID:",newlyCreatedHouseID);
   await addUserToHouse(user_id, newlyCreatedHouseID, "owner");

   // Send only one response once both operations succeed.
   res.status(200).send({ message: "Routes: House added and user successfully added to house" });
 } catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while adding house and user to house" });
 }
});

//add dweller to house (by Hao Chen) 
router.post ("/addDwellerToHouse", async (req, res) => {
 const { user_id, house_id } = req.body;
 try {
   await addUserToHouse(user_id, house_id, "dweller");
   res.status(200).send({message: "Routes: Dweller successfully added to house"});
 } 
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while adding dweller to house" });
 }
});

//add owner to house (by Hao Chen)
router.post ("/addOwnerToHouse", async (req, res) => {
  const { user_id, house_id } = req.body;
  try {
    await addUserToHouse(user_id, house_id, "owner");
    res.status(200).send({message: "Routes: Owner successfully added to house"});
  }
  catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while adding owner to house" });
  }
});

router.post("/addUserToHouse", async (req, res) => { 
  const { user_id, house_id, user_type } = req.body;
  try {
    await addUserToHouse(user_id, house_id, user_type);
    res.status(200).send({message: "Routes: User successfully added to house"});
  }
  catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while adding user to house" });
  }
});


//remove house from user (by Hao Chen) NOT NEEDED
//this  removes owner from the house. Doing this will remove everything related to the house 
router.delete("/removeHouse/user/:user_id/house/:house_id", async (req, res) => {
 const { user_id, house_id } = req.params;
 try {
   await removeHouseFromUser(user_id, house_id);
   res.status(200).send({message: "Routes: House successfully removed from user"});
 } 
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while removing house from user" });
 }
});

//remove house and all related data (by Hao Chen) ##
//this removes everything related to the house. It is a hard delete
router.delete("/removeHouse/house/:house_id", async (req, res) => {
 const { house_id } = req.params;
 try {
   // Remove all permissions associated with this house.
   await removeHousePermissions(house_id);

   await removeHouseDeviceStates(house_id);

   // Remove all devices in this house.
   await removeHouseDevices(house_id);

   // Remove all rooms in this house.
   await removeHouseRooms(house_id);

   // Remove all membership records of the house.
   await removeHouseMembers(house_id);

   // Optionally, if you still need to remove the owner's record from a mapping table, you could call removeHouseFromUser(user_id, house_id);
   // Finally, remove the house record itself.
   await removeHouse(house_id);

   console.log("routes: House"+house_id+ "and all related data successfully removed");
   res.status(200).send({ message: "Routes: House"+house_id+ "and all related data successfully removed" });
 } catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while removing house data" });
 }
});

//get current state data (by Hao Chen) 
router.get("/getCurrentState/house/:house_id/room/:room_id/deviceType/:deviceType", async (req, res) => {
 const { house_id, room_id, deviceType } = req.params;
 dvType = await sensorMap(deviceType);
 try {
   const currentState = await getCurrentState(house_id, room_id, dvType);
   res.status(200).send({message: "Routes: Current state data successfully retrieved", currentState});
 }
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while getting current state data" });
 }
});


//get current month average data (by Hao Chen)
router.get("/getAverageCurrentMonth/house/:house_id/room/:room_id/deviceType/:deviceType", async (req, res) => {
 const { house_id, room_id, deviceType } = req.params;
 dvType = await sensorMap(deviceType);
 try {
   const averageCurrentMonth = await getAverageCurrentMonth(house_id, room_id, dvType);
   res.status(200).send({message: "Routes: Current month average data successfully retrieved", averageCurrentMonth});
 }
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while getting current month average data" });
 }
});

//get current month highest data (by Hao Chen)
router.get("/getHighestCurrentMonth/house/:house_id/room/:room_id/deviceType/:deviceType", async (req, res) => {
 const { house_id, room_id, deviceType } = req.params;
 dvType = await sensorMap(deviceType);
 try {
   const highestCurrentMonth = await getHighestCurrentMonth(house_id, room_id, dvType);
   res.status(200).send({message: "Routes: Current month highest data successfully retrieved", highestCurrentMonth});
 }
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while getting current month highest data" });
 }
});

//get current month lowest data (by Hao Chen)
router.get("/getLowestCurrentMonth/house/:house_id/room/:room_id/deviceType/:deviceType", async (req, res) => {
 const { house_id, room_id, deviceType } = req.params;
 dvType = await sensorMap(deviceType);
 try {
   const lowestCurrentMonth = await getLowestCurrentMonth(house_id, room_id, dvType);
   res.status(200).send({message: "Routes: Current month lowest data successfully retrieved", lowestCurrentMonth});
 }
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while getting current month lowest data" });
 }
});

//get last month average data (by Hao Chen)
router.get("/getAverageLastMonth/house/:house_id/room/:room_id/deviceType/:deviceType", async (req, res) => {
 const { house_id, room_id, deviceType } = req.params;
 dvType = await sensorMap(deviceType);
 console.log("routes: this is dvType:",dvType);
 try {
   const averageLastMonth = await getAverageLastMonth(house_id, room_id, dvType);
   res.status(200).send({message: "Routes: Last month average data successfully retrieved", averageLastMonth});
 }
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while getting last month average data" });
 }
});

//get last month highest data (by Hao Chen)
router.get("/getHighestLastMonth/house/:house_id/room/:room_id/deviceType/:deviceType", async (req, res) => {
 const { house_id, room_id, deviceType } = req.params;
 dvType = await sensorMap(deviceType);
 try {
   const highestLastMonth = await getHighestLastMonth(house_id, room_id, dvType);
   res.status(200).send({message: "Routes: Last month highest data successfully retrieved", highestLastMonth});
 }
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while getting last month highest data" });
 }
});

//get last month lowest data (by Hao Chen)
router.get("/getLowestLastMonth/house/:house_id/room/:room_id/deviceType/:deviceType", async (req, res) => {
 const { house_id, room_id, deviceType } = req.params;
 dvType = await sensorMap(deviceType);
 try {
   const lowestLastMonth = await getLowestLastMonth(house_id, room_id, dvType);
   res.status(200).send({message: "Routes: Last month lowest data successfully retrieved", lowestLastMonth});
 }
 catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while getting last month lowest data" });
 }
});

//get user data (by Hao Chen)
router.get("/getUserData/house/:house_id/user/:user_id", async (req, res) => {
  const { house_id, user_id } = req.params;
  try {
    const userData = await getUserData(house_id, user_id);
    res.status(200).send({message: "Routes: User data successfully retrieved", userData});
  }
  catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting user data" });
  }
  });

  //get user name (by Hao Chen)
router.get("/getUserName/user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const userName = await getUserName(user_id);
    res.status(200).send({message: "Routes: User name successfully retrieved", userName});
    console.log("routes: this is userName:",userName);
  }
  catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting user name" });
  }
  });

//toggle device (by Hao Chen)
router.put("/toggleDevice", async (req, res) => {
  const { device_id, device_power } = req.body;
  try {
    await toggleDevice(device_id, device_power);
    res.status(200).send({message: "Routes: Device successfully toggled"});
  }
  catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while toggling device" });
  }
});


//get user list with type (by Hao Chen)
router.get("/getUserListWithType/house/:house_id", async (req, res) => {
  const house_id = req.params.house_id;
  try {
    const users = await getUserListWithType(house_id);
    res.status(200).send({message: "Routes: Users successfully retrieved", users});
  }
  catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting users" });
  }
  });
  

//get house name (Dylan)
router.get("/getHouseName/house/:house_id", async (req, res) => {
  const { house_id } = req.params;
  try {
    const houseName = await getHouseName(house_id);
    if (houseName === null) {
      res.status(404).send({ message: "Routes: House not found" });
    } else {
      res.status(200).send({ message: "Routes: House name successfully retrieved", houseName });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting house name" });
  }
});


//get room name (Dylan)
router.get("/getRoomName/room/:room_id", async (req, res) => {
  const { room_id } = req.params;
  try {
    const roomName = await getRoomName(room_id);
    if (roomName === null) {
      res.status(404).send({ message: "Routes: Room not found" });
    } else {
      res.status(200).send({ message: "Routes: Room name successfully retrieved", roomName });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting room name" });
  }
});

//get All Device Data (Ing Ji)
router.get("/getAllDeviceData/house/:house_id/room/:room_id/deviceType/:deviceType", async (req, res) => {
  const { house_id, room_id, deviceType } = req.params;
  dvType = await sensorMap(deviceType);
  try {
    const allDeviceData = await getAllDeviceData(house_id, room_id, dvType);
    res.status(200).send({
      message: "Routes: All device data successfully retrieved",
      deviceData: allDeviceData
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting all device data" });
  }
});

//get user type (hao chen)
router.get("/getUserType/user/:user_id/house/:house_id", async (req, res) => {
  const { user_id, house_id } = req.params;
  try {
    const userType = await getUserType(user_id, house_id);
    if (userType === null) {
      res.status(404).send({ message: "Routes: User not found" });
    }
    else {
      res.status(200).send({ message: "Routes: User type successfully retrieved", userType });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting user type" });
  }
});

//delete all devices from room (by Hao Chen)
router.delete("/removeAllDevicesFromRoom/houses/:house_id/rooms/:room_id", async (req, res) => {
  const { house_id, room_id } = req.params;
  try {
    await removeAllDevicesFromRoom(house_id, room_id);
    res.status(200).send({ message: "Routes: All devices successfully removed from room" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while removing all devices from room" });
  }
});


//add all permissions (by Hao Chen)
router.post("/addAllPermission", async (req, res) => {
  const { user_id, house_id } = req.body;
  try {
    await addAllPermission(user_id, house_id);
    res.status(200).send({ message: "Routes: All permissions successfully added" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while adding all permissions" });
  }
});

//remove all user permissions (by Hao Chen)
router.delete("/removeAllUserPermissions/user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    await removeAllUserPermissions(user_id);
    res.status(200).send({ message: "Routes: All user permissions successfully removed" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while removing all user permissions" });
  }
});

//check if a user is a creator of a house (by Hao Chen)
router.get("/checkHouseCreator/user/:user_id/house/:house_id", async (req, res) => {
  const { user_id, house_id } = req.params;
  try {
    // isCreator should return a boolean
    const creatorFlag = await isCreator(user_id, house_id);
    if (creatorFlag) {
      res.status(200).send({ message: "Routes: User is the creator of the house", isCreator: true });
    } else {
      res.status(200).send({ message: "Routes: User is not the creator of the house", isCreator: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while checking house creator" });
  }
});

//get house creator (by Hao Chen)
router.get("/getHouseCreator/house/:house_id", async (req, res) => {
  const { house_id } = req.params;
  try {
    const creator = await getHouseCreator(house_id);
    if (creator === null) {
      res.status(404).send({ message: "Routes: House not found" });
    }
    else {
      res.status(200).send({ message: "Routes: House creator successfully retrieved", creator });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting house creator" });
  }
});

//delete user (by Hao Chen)
//be very careful fo this function. It deletes everything related to the user
// we have to check if the user owns any house. If the user owns a house, we have to delete the house first
// then we can delete the user
router.delete("/deleteUser/user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await deleteUser(user_id);
    if (!result.deleted) {
      // The database function indicates the user is a creator.
      return res.status(400).json({ deleted: false, isCreator: true });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while deleting user" });
  }
});

// Request account deletion
router.post("/requestDeletion/user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    // Check if user is a house creator first
    const isHouseCreator = await isCreatorOfAnyHouse(user_id);
    if (isHouseCreator) {
      return res.status(400).json({ 
        requested: false, 
        message: "Cannot delete account as you are a house creator." 
      });
    }
    
    const result = await requestDeletion(user_id);
    res.status(200).json({
      ...result,
      message: "Account deletion requested. You have 7 days to recover your account."
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred while requesting deletion" });
  }
});

// Cancel deletion request
router.post("/cancelDeletion/user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await cancelDeletion(user_id);
    res.status(200).json({
      ...result,
      message: "Account deletion cancelled successfully."
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred while cancelling deletion" });
  }
});

// Grant permissions for multiple devices in a room
router.post("/setUserPermissionsForRoom", async (req, res) => {
  const { user_id, device_ids } = req.body;
  
  // Validate input
  if (!user_id || !device_ids || !Array.isArray(device_ids)) {
    return res.status(400).json({ message: "Invalid input: user_id, room_id and an array of device_ids are required." });
  }
  
  try {
    // Iterate over the device IDs and add permission for each
    await Promise.all(device_ids.map(async (device_id) => {
      await addPermission(user_id, device_id);
    }));
    
    res.status(200).json({ message: "Permissions granted for selected devices." });
  } catch (error) {
    console.error("Error setting permissions:", error);
    res.status(500).json({ message: "An error occurred while setting permissions." });
  }
});

//get user permission for room (by Hao Chen)
router.get("/getUserPermissionForRoom/house/:house_id/user/:user_id/room/:room_id", async (req, res) => {
  const {  user_id, house_id, room_id } = req.params;
  try {
    const userPermission = await getUserPermissionForRoom(user_id, house_id, room_id);
    res.status(200).send({ message: "Routes: User permission successfully retrieved", userPermission });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting user permission" });
  }
});

//check user permission for device (by Hao Chen)
router.get("/hasPermission/user/:user_id/device/:device_id", async (req, res) => {
  const { user_id, device_id } = req.params;
  try {
    const hasPermission = await checkPermission(user_id, device_id);
    if (hasPermission) {
      res.status(200).send({ message: "Routes: User has permission for device", hasPermission: true });
    } else {
      res.status(200).send({ message: "Routes: User does not have permission for device", hasPermission: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while checking user permission" });
  }
});


//resetPassword (by ing ji)
router.put("/resetPassword/email/:email/password/:password", async (req, res) => {
  const { email, password } = req.params;
  if (!email || !password) {
    const result = await updateUserPassword(email, password);
    // If result indicates 0 rows updated, then the email might not exist.
    if (result && result.rowsAffected === 0) {
      return res.status(404).send({ message: "No user found with that email." });
    }
  }


  try {
    await updateUserPassword(email, password);
    res.status(200).send({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Routes: Error updating password:", error);
    res.status(500).send({ message: "An error occurred while updating the password." });
  }
});

//get the list of houses that a user has access to(by hao chen)
router.get("/getHouseList/user/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const houses = await getHouseList(user_id);
    res.status(200).send({ message: "Routes: Houses successfully retrieved", houses });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting houses" });
  }
});

//get the previous month's average temperature of entire house (by hao chen)
router.get("/getPreviousMonthAverageTemperature/house/:house_id", async (req, res) => {
  const house_id = req.params.house_id;
  try {
    const previousMonthAverageTemperature = await getPreviousMonthHouseAverage(house_id, "temp");
    res.status(200).send({ message: "Routes: Previous month's average temperature successfully retrieved", previousMonthAverageTemperature });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting previous month's average temperature" });
  }
});

//get the previous month's average energy consumption of entire house (by hao chen)
router.get("/getPreviousMonthAverageEnergyConsumption/house/:house_id", async (req, res) => {
  const house_id = req.params.house_id;
  try {
    const previousMonthAverageEnergyConsumption = await getPreviousMonthRoomTotalEnergy(house_id, "smd");
    res.status(200).send({ message: "Routes: Previous month's average energy consumption successfully retrieved", previousMonthAverageEnergyConsumption });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting previous month's average energy consumption" });
  }
});


//get the reccomendation for the house (by hao chen)
router.get("/getHouseRecommendation/house/:house_id/occupants/:occ_no", async (req, res) => {
  try {
  const house_id = req.params.house_id;
  const occ_no = req.params.occ_no;

  const pastEnergyConsumption = await getPreviousMonthHouseAverageEnergy(house_id, "smd");
  console.log("routes: this is pastEnergyConsumption:",pastEnergyConsumption);
  const pastTemperature = await getPreviousMonthHouseAverage(house_id, "temp");
  console.log("routes: this is pastTemperature:",pastTemperature  );

  //const currentEnergyConsumption = await getPreviousMonthHouseAverageEnergy(house_id, "smd");
  // const currentEnergy = await getCurrentMonthHouseAverage(house_id, "smd");
  // console.log("routes: this is currentEnergy:",currentEnergy);

  const prediction = await getPrediction(pastTemperature, occ_no, pastEnergyConsumption)

  const recommendation = analyzeEnergyUsage(prediction, pastEnergyConsumption);

  res.status(200).send({ message: "Routes: House recommendation successfully retrieved", recommendation, pastEnergyConsumption });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting house recommendation" });
  }
}
);


//get the reccomendation for the room (by hao chen)
router.get("/getRoomRecommendation/room/:room_id", async (req, res) => {
  try{
  const room_id = req.params.room_id;
  const prevenergyConsumption = await getPreviousMonthRoomTotalEnergy(room_id, "smd");
  const currentenergyConsumption = await getCurrentRoomTotalEnergy(room_id, "smd");
  const temperature = await getPreviousMonthRoomAverage(room_id, "temp");
  const recommendation = analyzeRoomEnergy(prevenergyConsumption, currentenergyConsumption, temperature);
  console.log("routes: this is prevenergyConsumption:",prevenergyConsumption);
  console.log("routes: this is currentenergyConsumption:",currentenergyConsumption);
  console.log("routes: this is temperature:",temperature);
  res.status(200).send({ message: "Routes: Room recommendation successfully retrieved", recommendation });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting room recommendation" });
  }
}
);

//get the average energy consumption for the past 12 months (by hao chen)
router.get("/getAverageEnergyConsumption/house/:house_id", async (req, res) => {
  try{
  const house_id = req.params.house_id;
  const averageEnergyConsumption = await getAverageLast12Months(house_id, "smd");
  res.status(200).send({ message: "Routes: Average energy consumption for the past 12 months successfully retrieved", averageEnergyConsumption });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting average energy consumption for the past 12 months" });
  }
}
);








//tester functions (by Xiang Wei)

// Modify Database
router.get("/testdb", async (req, res) => {
  try {
    const result = await testdb();
    res.status(200).send({ message: "Routes: All users printed to server console" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while printing users" });
  }
 });

// printAllUsers
router.get("/printAllUsers", async (req, res) => {
 try {
   const result = await printAllUsers();
   res.status(200).send({ message: "Routes: All users printed to server console" });
 } catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while printing users" });
 }
});

// printAllHouses
router.get("/printAllHouses", async (req, res) => {
 try {
   const result = await printAllHouses();
   res.status(200).send({ message: "Routes: All houses printed to server console" });
 } catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while printing houses" });
 }
});

// printAllRooms
router.get("/printAllRooms", async (req, res) => {
 try {
   const result = await printAllRooms();
   res.status(200).send({ message: "Routes: All rooms printed to server console" });
 } catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while printing rooms" });
 }
});

// printAllDevices
router.get("/printAllDevices", async (req, res) => {
 try {
   const result = await printAllDevices();
   res.status(200).send({ message: "Routes: All devices printed to server console" });
 } catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while printing devices" });
 }
});

// printAllPermissions
router.get("/printAllPermissions", async (req, res) => {
 try {
   const result = await printAllPermissions();
   res.status(200).send({ message: "Routes: All permissions printed to server console" });
 } catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while printing permissions" });
 }
});

// printAllHouseMembers
router.get("/printAllHouseMembers", async (req, res) => {
 try {
   const result = await printAllHouseMembers();
   res.status(200).send({ message: "Routes: All house members printed to server console" });
 } catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while printing house members" });
 }
});

// printAllDeviceStates
router.get("/printAllDeviceStates", async (req, res) => {
 try {
   const result = await printAllDeviceStates();
   res.status(200).send({ message: "Routes: All device states printed to server console" });
 } catch (error) {
   console.error(error);
   res.status(500).send({ message: "Routes: An error occurred while printing device states" });
 }
});

module.exports = router ;