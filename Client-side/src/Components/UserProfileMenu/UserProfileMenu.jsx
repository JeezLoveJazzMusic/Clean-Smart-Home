 /*( fix by Joe)*/
import React, { useState, useEffect } from "react";
import "./UserProfileMenu.css";
import userAvatar from "../../assets/user-profile1.jpg";
import axios from "axios";


const UserProfile = ({ onClose, thisUserID, thisHouse, }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(`http://localhost:8080/getUserData/house/${thisHouse}/user/${thisUserID}`);
        console.log("userID:", thisUserID);
        console.log("houseID:", thisHouse);
        console.log("API Response:", response.data);
  
        // Ensure userData is set to the first object in the array
        setUserData(response.data.userData?.[0] || null);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  
    if (thisUserID) {
      fetchUserData();
    }
  }, [thisUserID, thisHouse]);
  
 

  // console.log("userData:", userData);
  // console.log("userData.user_id:", userData.user_id);
  // console.log("userData.username:", userData.username);
  // console.log("userData.email:", userData.email);
  return (
    <div className="profile-card">
      {/* Back Button to Close Pop-up */}
      <button onClick={onClose} className="back-UserProfileMenubtn">Back</button>
      
      <img src={userAvatar} alt="User Avatar" className="profile-image" />
      
      {userData ? (
      <div className="profile-details">
        <label>Username:</label>    
        <input type="text" value={userData.username} disabled />

        <label>Email:</label>
        <input type="email" value={userData.email} disabled />

        <label>User Type:</label>
        <input type="text" value={userData.user_type} disabled />
      </div>
      ) : (
        <p>Loading user data...</p>
      )}
      <div className="profile-actions">
        <button className="delete-UserProfileMenubtn">Delete Account</button>  
      </div>
    </div>
  );
};

export default UserProfile;
