const { addUserToHouse, addPermission, removeUserFromHouse, removePermission, getUserPermissions } = require("./database.js");

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
async function removeUser(user_id, house_id) {
    console.log("Removing user from home:", user_id);
    try {
        device_list = await getUserPermissions(user_id);
        console.log("This is the device list:", device_list);
        for (let i = 0; i < device_list.length; i++) {
            console.log("Removing permission for device:", device_list[i]);
            await removePermission(user_id,house_id, device_list[i]);
        }

        await removeUserFromHouse(user_id, house_id);
        // Loop to iterate through all device permissions and remove them from the user.

    } catch (error) {
        console.error("Error removing user from home:", error.message);
        throw error;
    }
}

module.exports = { addUser, removeUser };