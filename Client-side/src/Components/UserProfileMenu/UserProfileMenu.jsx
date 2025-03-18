import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfileMenu.css";
import userAvatar from "../../assets/user-profile1.jpg";
import axios from "axios";


const UserProfile = ({ onClose, thisUserID, thisHouse, }) => {
  const [userData, setUserData] = useState(null);
  const [ImagePreview, setImagePreview] = useState(userAvatar);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  }; 
  
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      // Call backend to delete the user
      const response = await axios.delete(`http://localhost:8080/deleteUser/user/${thisUserID}`);
      const result = response.data;
      console.log("Delete user response:", result);
      if (result.deleted) {
        // Deletion successful: navigate to signup (or logout)
        alert("Account deleted successfully.");
        navigate("/Signup");
      }
    } catch (error) {
      // If the backend returned a 400 status, it will be caught here.
      if (error.response && error.response.data) {
        const result = error.response.data;
        if (result.isCreator) {
          alert("Your account cannot be deleted because you are the creator of a house.");
        } else {
          alert("Unable to delete your account at this time.");
        }
      } else {
        console.error("Error deleting account:", error);
        alert("An error occurred while deleting your account.");
      }
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // console.log("userData:", userData);
  // console.log("userData.user_id:", userData.user_id);
  // console.log("userData.username:", userData.username);
  // console.log("userData.email:", userData.email);
  return (
    <div className="profile-card">
      {/* Back Button to Close Pop-up */}
      <button44 onClick={onClose} className="back-UserProfileMenubtn">Back</button44>
      
      <div className="profile-image">
        <input type="file" accept="image/*" onChange={handleImageChange} hidden id="fileUpload" />
        <label htmlFor="fileUpload">
          <img src={ImagePreview || "/images/DDTDefaultimage.jpg"} alt="Profile" className="clickable-avatar" />
        </label>
      </div>
      
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
        <p> No Home Data Found
        </p>
      )}
      <div className="profile-actions">
        <button41 className="delete-UserProfileMenubtn" onClick={handleDeleteClick}>Delete Account</button41>  
      </div>

      {showDeleteConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-msg">
            <p>Are you sure you want to delete your account?</p>
            <div className="confirm-buttons">
              <button42 className="confirmdeletebutton" onClick={confirmDelete}>Yes</button42>
              <button43 className="canceldeletebutton" onClick={cancelDelete}>No</button43>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
