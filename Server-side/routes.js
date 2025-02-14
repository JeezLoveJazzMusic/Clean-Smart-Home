//REMEMBER TO ADD CHECK FOR DUPLICATES WHEN ADDING SHIT
//Database imports
const { createUser, getUserByEmail, verifyPassword, addPermission, addUserToHouse, getUserList, removePermission, getHouseList,checkUserExists,getHouseDevices,getRoomDevices,addDeviceToRoom, getSensorData, removeDeviceFromRoom, addRoomToHouse, removeRoomFromHouse, getRoomList,addHouseToUser, removeHouseFromUser, removeHousePermissions,
   removeHouseDevices,removeHouseRooms,removeHouseMembers,removeHouse, printAllUsers, printAllHouses, printAllRooms, printAllDevices, printAllPermissions, printAllHouseMembers, printAllDeviceStates, removeHouseDeviceStates } = require("./database.js"); 
//Middleware imports
const {addUser, removeUser} = require("./middleware.js");
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
          return res.status(400).send({ message: "Routes: Email and password are required" });
      }

      // Check if user exists
      const user = await getUserByEmail(email);
      console.log("routes: this is user:",JSON.stringify(user, null, 2));
      if (!user) {
          return res.status(401).send({ message: "Routes: Invalid email" });
      }

      // Verify password
      const isValidPassword = await verifyPassword(email, password);
      if (!isValidPassword) {
          return res.status(401).send({ message: "Routes: Invalid password" });
      }

      // Login successful
      homeList = await getHouseList(user.user_id);
      console.log("routes: this is homeList:",JSON.stringify(homeList, null, 2));
      houseIDList = homeList.map(home => home.home_id);
      res.status(200).send({ message: "Routes: Login successful", homeList});

  } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Routes: An error occurred during login" });
  }
});

//check if email exists (by Hao Chen) ##
router.post("/check_Email", async (req, res) => {
  const { email } = req.body;
  try {
    // Check if email doesn't exist
    const existBool = await checkUserExists(email);
    if (existBool == false) {
      return res.status(401).send({ message: "Routes: Email does not exist",existBool});
    }
    res.status(200).send({ message: "Routes: Email exists" });
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
    const devices = await getRoomDevices(house_id, room_id);
    const deviceIDList = devices.map(device => device.device_id);
    res.status(200).send({message: "Routes: Devices successfully retrieved", deviceIDList});
  } 
  catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting devices" });
  }
});

//add device to room (by Hao Chen) ##
router.post("/add_DeviceToRoom", async (req, res) => {
  const { house_id, room_id, device_name, device_type, manufacturer, model } = req.body;
  try {
    await addDeviceToRoom(house_id, room_id,device_name, device_type, manufacturer, model);
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

//add house to user (by Hao Chen) ##
router.post("/addHouseToUser", async (req, res) => {
  const { user_id, house_name, address } = req.body;
  try {
    await addHouseToUser(user_id, house_name, address);
    res.status(200).send({message: "Routes: House successfully added to user"});
  } 
  catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while adding house to user" });
  }
});

//remove house from user (by Hao Chen) 
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

    

    res.status(200).send({ message: "Routes: House and all related data successfully removed" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while removing house data" });
  }
});
















//tester functions (by Xiang)


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