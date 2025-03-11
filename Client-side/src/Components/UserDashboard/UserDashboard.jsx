import React from "react";
import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";
import user1 from "../../assets/user-profile1.jpg";
import user2 from "../../assets/user-profile2.jpg";
import user3 from "../../assets/user-profile3.jpg";
import user4 from "../../assets/user-profile4.jpg";
import addUser from "../../assets/add-button.png";

// Array of icons to select from
const userIcons = [user1, user2, user3, user4];

const Users = ({ dwellersList = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h3>Users</h3>
      <div className="user-list">
        {dwellersList.slice(0, 4).map(user => {
          // Use modulus to choose an icon deterministically
          const icon = userIcons[user.user_id % userIcons.length];
          return (
            <div key={user.user_id} className="user-avatar" title={user.username}>
              <img src={icon} alt={user.username} />
            </div>
          );
        })}
        <button onClick={() => navigate("/Userlist")} className="add-user1">
          <img src={addUser} alt="Add User" />
        </button>
      </div>
    </div>
  );
};

export default Users;
