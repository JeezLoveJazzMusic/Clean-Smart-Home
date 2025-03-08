/* Fix by Joe */
import React from "react";
import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";   /*made by Joe */
import user1 from "../../assets/user-profile1.jpg"
import user2 from "../../assets/user-profile2.jpg"
import user3 from "../../assets/user-profile3.jpg"
import user4 from "../../assets/user-profile4.jpg"
import addUser from "../../assets/add-button.png"

const users = [
  { id: 1, name: "User 1", avatar: user1 },
  { id: 2, name: "User 2", avatar: user2 },
  { id: 3, name: "User 3", avatar: user3 },
  { id: 4, name: "User 4", avatar: user4 },
];
 /*made by Joe */
const Users = () => {
  const navigate = useNavigate(); 
  return (
    <div className="container">
      <h3>Users</h3>
      <div className="user-list">
        {users.map(user => (
          <div key={user.id} className="user-avatar">
            <img src={user.avatar} alt={user.name} />
          </div>
        ))}
        <button onClick={() => navigate("/Userlist")} className="add-user1">  
          <img src={addUser} alt="Add User" />
        </button>
      </div>
    </div>
  );
};

export default Users;
