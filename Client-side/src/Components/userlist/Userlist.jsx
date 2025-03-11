import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Addndeleteuser from "../addndeleteuser/Addndeleteuser";
import "../userlist/userlist.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate(); 
  const DEFAULT_PROFILE_PIC = "/images/DDTDefaultimage.jpg";

  // Toggle menu visibility
  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (!showMenu) {
      setDeleteMode(false);
      setSelectedUsers([]);
    }
  };

  // Add a new user
  const handleAddUser = (newUser) => {
    if (!newUser || !newUser.name || !newUser.userType) {
      console.error("Invalid user data:", newUser);
      return;
    }

    const userObject = {
      id: Date.now(), 
      name: newUser.name,
      userType: newUser.userType,
      profilePic: DEFAULT_PROFILE_PIC,
    };

    console.log("User Object:", JSON.stringify(userObject, null, 2));

    setUsers((prevUsers) => [...prevUsers, userObject]);
    setShowModal(false);
  };

  // Toggle delete mode
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedUsers([]);
  };

  // Select users to delete
  const handleSelectUser = (id) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id]
    );
  };

  // Delete selected users
  const handleDeleteUsers = () => {
    setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
    setDeleteMode(false);
    setSelectedUsers([]);
  };

  return (
    <>
      <div className={`user-list-container ${showMenu ? "show-delete" : ""} ${deleteMode && selectedUsers.length > 0 ? "show-confirm-delete" : ""}`}>
        <div className="header-container">
          <h2 className="users-title">Users</h2>
          <button className="menu-btn" onClick={toggleMenu}>⋯</button>
        </div>

        <div className="button-container">
          <button className="add-user-btn" onClick={() => setShowModal(true)}>Add Users</button>

          {showMenu && (
            <button className="delete-user-btn" onClick={toggleDeleteMode}>
              {deleteMode ? "Cancel" : "Delete Users"}
            </button>
          )}
        </div>

        <div className="user-grid">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className={`user-item ${deleteMode ? "delete-mode" : ""}`}>
                {deleteMode && (
                  <input
                    type="checkbox"
                    className="delete-checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                )}
                <img src={user.profilePic || DEFAULT_PROFILE_PIC} alt="User Profile" className="user-avatar" />
                <p><strong>{user.name}</strong></p>
              </div>
            ))
          ) : (
            <p className="no-users">No Users Added</p>
          )}
        </div>

        {deleteMode && selectedUsers.length > 0 && (
          <button className="confirm-delete-btn" onClick={handleDeleteUsers}>Confirm Delete</button>
        )}

        <button className="gay-btn" onClick={() => navigate(-1)}>Back</button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <Addndeleteuser onAddUser={handleAddUser} onClose={() => setShowModal(false)} />
        </div>
      )}
    </>
  );
}

export default UserList;
