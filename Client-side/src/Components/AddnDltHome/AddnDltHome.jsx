/*Made by Joe */
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddnDltHome.css";
import { FaPlusCircle, FaTrash, FaEllipsisH } from "react-icons/fa";
import addHome1 from "../../assets/addhome1.jpg";
import addHome2 from "../../assets/addhome2.jpg";
import addHome3 from "../../assets/addhome3.jpg";
import axios from "axios";




// // const sampleallHouses = [
//   {
//     "house_member_id": 11,
//     "house_id": 1000,
//     "user_id": 11,
//     "joined_at": "2025-02-27 11:30:36",
//     "user_type": "owner",
//     "owner_id": 11,
//     "house_name": "joe house1",
//     "address": "dueiubfieubfiue",
//     "created_at": "2025-02-27 11:27:31"
//   },
//   {
//     "house_member_id": 12,
//     "house_id": 14000,
//     "user_id": 11,
//     "joined_at": "2025-02-27 11:36:09",
//     "user_type": "dweller",
//     "owner_id": 11,
//     "house_name": "joe house2",
//     "address": "dueiubfieubfiue",
//     "created_at": "2025-02-27 11:30:36"
//   }
// // ];

// Helper function to choose an image based on the house_id
const selectImage = (house_id) => {
  const images = [addHome1, addHome2, addHome3];
  return images[house_id % images.length];
};

const AddHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { allHouses } = location.state || {};

  // Use the data passed in as props (if available) to populate homes.
  const [homes, setHomes] = useState(() => {
  if (allHouses && allHouses.length) {
    return allHouses.map((house) => ({
      id: house.house_id,
      name: house.house_name,
      image: selectImage(house.house_id),
      user_type: house.user_type,
    }));
  } else {
    // Fallback default data
    return [
      { id: 1, name: "Default Home 1", image: addHome1, user_type: "owner" },
      { id: 2, name: "Default Home 2", image: addHome2, user_type: "owner" },
      { id: 3, name: "Default Home 3", image: addHome3, user_type: "owner" },
    ];
  }
});

  // If the prop changes, update the state accordingly.
  useEffect(() => {
    if (allHouses && allHouses.length) {
      setHomes(
        allHouses.map((house) => ({
          id: house.house_id,
          name: house.house_name,
          image: selectImage(house.house_id),
          user_type: house.user_type,
        }))
      );
    }
  }, []);

  const currentUserId = localStorage.getItem("userID");
  const [isAdding, setIsAdding] = useState(false);
  const [newHomeName, setNewHomeName] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newHomeAddress, setNewHomeAddress] = useState("");

  useEffect(() => {
    localStorage.setItem("homes", JSON.stringify(homes));
  }, []);

  const handleAddHome = async () => {
    if (newHomeName.trim() && newHomeAddress.trim()) {
      try {
        // Send POST request to create a new house
        const response = await axios.post("http://localhost:8080/createHouse", {
          user_id: 11,
          house_name: newHomeName,
          address: newHomeAddress,
        });
        console.log("newHomeName: ", newHomeName);
        console.log("newHomeAddress: ", newHomeAddress);
        console.log("currentUserId: ", currentUserId);
        // Assuming the created house is returned in response.data.house
        const createdHouse = response.data.house;
        // Map the response to your local house shape
        const newHouse = {
          id: createdHouse.house_id,
          name: createdHouse.house_name,
          image: selectImage(createdHouse.house_id),
        };
        setHomes(homes.filter((home) => home.id !== newHouse.id).concat(newHouse));
        setNewHomeName("");
        setNewHomeAddress("");
        setIsAdding(false);
      } catch (error) {
        console.error("Error adding house:", error);
      }
    }
  };

  const handleDeleteHome = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/removeHouse/house/${id}`);
      setHomes(homes.filter((home) => home.id !== id));
    } catch (error) {
      console.error("Error deleting house:", error);
    }
  };

  const toggleDeleteMode = () => {
    setIsDeleting(!isDeleting);
    setShowOptions(!isDeleting);
  };

  return (
    <div className="home-container">
      <div className="home-header1">
        <h2>Home</h2>
        {!isDeleting && (
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="options-btn"
          >
            <FaEllipsisH />
          </button>
        )}
        {showOptions && (
          <button onClick={toggleDeleteMode} className="delete-btn">
            {isDeleting ? "Cancel" : "Delete Home Profile"}
          </button>
        )}
      </div>

      <button onClick={() => setIsAdding(true)} className="add1-addndltbtn">
        Add Home Profile <FaPlusCircle />
      </button>

      <div className="home-list">
        {homes.map((home) => (
          <div
            key={home.id}
            className={`home-item-container ${isDeleting ? "deleting" : ""}`}
          >
            <button
              className="home-item"
              style={{
                backgroundImage: `url(${home.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <span>{home.name}</span>
            </button>
            {isDeleting && home.user_type === "owner" &&(
              <FaTrash
                className="delete-icon"
                onClick={() => handleDeleteHome(home.id)}
              />
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isAdding && (
        <div className="modal">
          <h3>Add Home</h3>
          <label>Home Name:</label>
          <input
            type="text"
            placeholder="Enter Home Name"
            value={newHomeName}
            onChange={(e) => setNewHomeName(e.target.value)}
          />
          <label>Home Address:</label>
          <input
            type="text"
            placeholder="Enter Home Address"
            value={newHomeAddress}
            onChange={(e) => setNewHomeAddress(e.target.value)}
          />

          <div className="modal-buttons">
            <button className="create-btn" onClick={handleAddHome}>
              Create
            </button>
            <button className="modal-back-btn" onClick={() => setIsAdding(false)}>
              Back
            </button>
          </div>
        </div>
      )}

      {/* MAIN BACK BUTTON */}
      <button onClick={() => navigate(-1)} className="main-back-btn">
        ⬅ Back
      </button>
    </div>
  );
};

export default AddHome;