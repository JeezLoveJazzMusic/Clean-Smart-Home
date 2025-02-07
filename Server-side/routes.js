//Database imports
const { createUser, getUserByEmail, verifyPassword, addPermission, addUserToHouse, getUserList, removePermission, getHouseList,checkUserExists,getHouseDevices } = require("./database.js"); 
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
  

// Get user list (by Hao Chen ) ##
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

//Remove user from home (by Hao Chen) #
router.delete("/houses/:house_id/users/:user_id", async (req, res) => {
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
router.delete("/remove_permission/:user_id/:device_id", async (req, res) => {
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

//Get room devices (by Hao Chen) #(dont have getRoomDevices function)
router.get("/getRoomDevices/houses/:house_id/rooms/:room_id", async (req, res) => {
  const house_id = req.params.house_id;
  const room_id = req.params.room_id;
  try {
    const devices = await getHouseDevices(house_id);
    res.status(200).send({message: "Routes: Devices successfully retrieved", devices});
  } 
  catch (error) {
    console.error(error);
    res.status(500).send({ message: "Routes: An error occurred while getting devices" });
  }
});



module.exports = router ;