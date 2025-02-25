import React, { useState } from "react";
import AddUserModal from "./AddUserModal"; 
import  "./components/userlist/userlist.css";
;

function UserList() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  // Toggle menu visibility
  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (!showMenu) {
      setDeleteMode(false);
      setSelectedUsers([]); // Reset selection
    }
  };

  //  Add a new user properly
  const handleAddUser = (newUser) => {
    if (!newUser || !newUser.name || !newUser.profilePic) {
      console.error("Invalid user data:", newUser);
      return;
    }
    setUsers((prevUsers) => [...prevUsers, newUser]); 
    setShowModal(false);
  };

  // Toggle delete mode
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedUsers([]); 
  };

  // Select users to delete
  const handleSelectUser = (name) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(name)
        ? prevSelected.filter((user) => user !== name)
        : [...prevSelected, name]
    );
  };

  //Delete selected users properly
  const handleDeleteUsers = () => {
    setUsers(users.filter((user) => !selectedUsers.includes(user.name)));
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
          <button className="add-user-btn" onClick={() => setShowModal(true)}>
            Add Users
          </button>

          {showMenu && (
            <button className="delete-user-btn" onClick={toggleDeleteMode}>
              {deleteMode ? "Cancel" : "Delete Users"}
            </button>
          )}
        </div>

        <div className="user-grid">
          {users.length > 0 ? (
            users.map((user, index) => (
              <div key={index} className={`user-item ${deleteMode ? "delete-mode" : ""}`}>
                {deleteMode && (
                  <input
                    type="checkbox"
                    className="delete-checkbox"
                    checked={selectedUsers.includes(user.name)}
                    onChange={() => handleSelectUser(user.name)}
                  />
                )}
                <img src={user.profilePic} alt={user.name} className="user-avatar" />
                <p>{user.name}</p>
              </div>
            ))
          ) : (
            <p className="no-users">No users added yet.</p>
          )}
        </div>

        //Confirm Delete button appears when at least one user is selected 
        {deleteMode && selectedUsers.length > 0 && (
          <button className="confirm-delete-btn" onClick={handleDeleteUsers}>
            Confirm Delete
          </button>
        )}

        <button className="back-btn">Back</button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <AddUserModal onAddUser={handleAddUser} onClose={() => setShowModal(false)} />
        </div>
      )}
    </>
  );
}

export default UserList;
