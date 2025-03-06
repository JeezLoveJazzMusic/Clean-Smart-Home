 /*( fix by Joe)*/
import React from "react";
import "./UserProfileMenu.css";
import userAvatar from "../../assets/user-profile1.jpg";

const UserProfile = ({ onClose }) => {
  return (
    <div className="profile-card">
      {/* Back Button to Close Pop-up */}
      <button onClick={onClose} className="back-UserProfileMenubtn">Back</button>
      
      <img src={userAvatar} alt="User Avatar" className="profile-image" />
      
      <div className="profile-details">
        <label>Username:</label>    
        <input type="text" value="DDTsmarthome" disabled />

        <label>Email:</label>
        <input type="email" value="ddtsmarthome@gmail.com" disabled />

        <label>User Type:</label>
        <input type="text" value="Admin" disabled />
      </div>

      <div className="profile-actions">
        <button className="delete-UserProfileMenubtn">Delete Account</button>  
      </div>
    </div>
  );
};

export default UserProfile;
