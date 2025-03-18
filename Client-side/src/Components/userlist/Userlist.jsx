import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Addndeleteuser from "../AddnDeleteUser/AddnDeleteUser";
import UserPermissions from "../UserPermissions/UserPermissions";
import axios from "axios";
import "./userlist.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [currentUserType, setCurrentUserType] = useState(null);
  const [creatorId, setCreatorId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // FOr UserPermissions

  const navigate = useNavigate();
  const location = useLocation();
  const DEFAULT_PROFILE_PIC = "/images/DDTDefaultimage.jpg";
  const dwellersList = location.state?.dwellersList || [];
  const currentHouse = location.state?.currentHouse;
  const UserID = location.state?.UserID;
  const currentRoom = location.state?.currentRoom;
  const houseId = currentHouse;

  useEffect(() => {
    const fetchCreatorId = async () => {
      if (!houseId) return;
      try {
        const res = await axios.get(
          `http://localhost:8080/getHouseCreator/house/${houseId}`
        );
        // Use res.data.creator since that's what is returned.
        setCreatorId(res.data.creator);
        console.log("Creator ID:", res.data.creator);
      } catch (error) {
        console.error("Error fetching house details:", error);
      }
    };
    fetchCreatorId();
  }, [houseId]);

  //get roomDevices
  // useEffect(() => {
  //   const fetchCurrentRoom = async () => {
  //     if (!currentRoom) return;
  //     console.log("userList: Current Room:", currentRoom);
  //     console.log("userList: House ID:", houseId);
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:8080/getRoomDevices/houses/${houseId}/rooms/${currentRoom}`
  //       );
  //       const { devices } = response.data;
  //       console.log("Devices in current room:", devices);
  //     } catch (error) {
  //       console.error("Error fetching devices for current room:", error);
  //     }
  //   };
  //   fetchCurrentRoom();
  // }, [currentRoom]);

  // Initialize users with dwellersList when component mounts
  useEffect(() => {
    const fetchUserType = async () => {
      if (!UserID) {
        console.log("User ID not found");
      }
      console.log("UserList Dwellers List:", dwellersList);
      console.log("UserList House ID:", houseId);

      try {
        const userTypeResponse = await axios.get(
          `http://localhost:8080/getUserType/user/${UserID}/house/${houseId}`
        );
        const { userType } = userTypeResponse.data;
        console.log("User Type:", userType);
        setCurrentUserType(userType.toLowerCase()); // Normalize the case
      } catch (error) {
        console.error("Error fetching user type:", error);
      }

      if (dwellersList && dwellersList.length > 0) {
        // Transform dwellers into the user format if needed
        const formattedDwellers = dwellersList.map((dweller) => ({
          id: dweller.user_id || Date.now() + Math.random(), // Ensure unique IDs
          name: dweller.username || "Unknown",
          userType: dweller.user_type || "Dweller",
          profilePic: dweller.profilePic || DEFAULT_PROFILE_PIC,
        }));

        setUsers(formattedDwellers);
      }
    };

    fetchUserType();
  }, [UserID, dwellersList]);

  // Toggle menu visibility
  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (!showMenu) {
      setDeleteMode(false);
      setSelectedUsers([]);
    }
  };

  // Add a new user
  const handleAddUser = async (newUser) => {
    if (!newUser || !newUser.name || !newUser.userType) {
      console.error("Invalid user data:", newUser);
      return;
    }
    console.log("New User:", newUser);

    try {
      // Step 1: Check if the user exists in the database
      const checkResponse = await axios.post(
        `http://localhost:8080/getUserByEmail`,
        {
          email: newUser.name,
        }
      );

      const returnedUser = checkResponse.data;
      console.log("Returned User:", returnedUser.user);

      if (!returnedUser || !returnedUser.user) {
        alert(
          "User does not exist in the system\nEmail address entered might be invalid or user has not registered yet"
        );
        return;
      }

      // Step 2: If user exists, send API request to add them to the house
      const addResponse = await axios.post(
        "http://localhost:8080/addUserToHouse",
        {
          house_id: houseId,
          user_id: returnedUser.user.user_id,
          user_type: newUser.userType,
        }
      );
      console.log("Add User Response:", addResponse.data);

      const userObject = {
        id: returnedUser.user.user_id,
        name: returnedUser.user.username, // Use username if available, fall back to email
        userType: newUser.userType,
        profilePic: returnedUser.profilePic || DEFAULT_PROFILE_PIC,
      };

      console.log("User Object:", JSON.stringify(userObject, null, 3));

      setUsers((prevUsers) => [...prevUsers, userObject]);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding user:", error);
      alert(
        "Failed to add user: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Toggle delete mode
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedUsers([]);
  };

  // Select users to delete
  const handleSelectUser = (id) => {
    const currentId = parseInt(UserID);
    const creator = creatorId ? parseInt(creatorId) : null;

    if (id === currentId) {
      alert("You cannot delete yourself from the house");
      return;
    }
    if (creator && id === creator) {
      alert("You cannot delete the creator of the house");
      return;
    }

    setSelectedUsers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id]
    );
  };

  // Delete selected users
  const handleDeleteUsers = async () => {
    try {
      // Call API to delete users from the house
      for (const userId of selectedUsers) {
        await axios.delete(
          `http://localhost:8080/removeUserFromHome/houses/${houseId}/users/${userId}`
        );
      }

      // Update the UI after successful deletion
      setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
      setDeleteMode(false);
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error deleting users:", error);
      alert(
        "Failed to delete users: " +
          (error.response?.data?.message || error.message)
      );
    }
  };
  return (
    <>
      <div
        className={`user-list-container ${showMenu ? "show-delete" : ""} ${
          deleteMode && selectedUsers.length > 0 ? "show-confirm-delete" : ""
        }`}
      >
        <div className="header-container">
          <h2 className="users-title">Users</h2>
          {currentUserType === "owner" && (
            <button className="menu-btn" onClick={toggleMenu}>
              ⋯
            </button>
          )}
        </div>

        <div className="button-container">
          {currentUserType === "owner" && (
            <>
              <button
                className="AddUserbtn-user-btn"
                onClick={() => setShowModal(true)}
              >
                Add Users
              </button>

              {showMenu && (
                <button className="delete-user-btn" onClick={toggleDeleteMode}>
                  {deleteMode ? "Cancel" : "Delete Users"}
                </button>
              )}
            </>
          )}
        </div>

        <div className="user-grid">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className={`user-item ${deleteMode ? "delete-mode" : ""}`}
                onClick={() => {
                  if (currentUserType === "owner" && !deleteMode) {
                  setSelectedUser(user);
                  }
                }}
              >
                {deleteMode &&
                  user.id !== parseInt(UserID) &&
                  (creatorId ? user.id !== parseInt(creatorId) : true) && (
                    <input
                      type="checkbox"
                      className="delete-checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  )}
                <img
                  src={user.profilePic || DEFAULT_PROFILE_PIC}
                  alt="User Profile"
                  className="user-avatar"
                />
                <p>
                  <strong>{user.name}</strong>
                  {creatorId && user.id === creatorId}
                </p>
                <p>{user.userType}</p>
              </div>
            ))
          ) : (
            <p className="no-users">No Users Added</p>
          )}
        </div>

        {deleteMode &&
          selectedUsers.length > 0 &&
          currentUserType === "owner" && (
            <button className="confirm-delete-btn" onClick={handleDeleteUsers}>
              Confirm Delete
            </button>
          )}

        <button className="BackBtn1-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {showModal && currentUserType === "owner" && (
        <div className="modal-overlay">
          <Addndeleteuser
            users={dwellersList}
            onAddUser={handleAddUser}
            onClose={() => setShowModal(false)}
          />
        </div>
      )}

      {selectedUser && (
        <UserPermissions
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          currentRoom={currentRoom}
          houseId={currentHouse}
        />
      )}
    </>
  );
}

export default UserList;
