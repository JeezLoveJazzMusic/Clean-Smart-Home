/*Made by Joe */
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddnDltHome.css";
import { FaPlusCircle, FaTrash, FaEllipsisH } from "react-icons/fa";
import addHome1 from "../../assets/addhome1.jpg";
import addHome2 from "../../assets/addhome2.jpg";
import addHome3 from "../../assets/addhome3.jpg";
import axios from "axios";

const selectImage = (house_id) => {
  const images = [addHome1, addHome2, addHome3];
  return images[house_id % images.length];
};

const AddHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { allHouses , currentUserID} = location.state || {};
  const MAX_LENGTH = 20; // Maximum character limit

  const [homes, setHomes] = useState(() => {
    if (allHouses && allHouses.length) {
      return allHouses.map((house) => ({
        id: house.house_id,
        name: house.house_name,
        image: selectImage(house.house_id),
        user_type: house.user_type,
      }));
    } else {
      return [
        { id: 1, name: "Default Home 1", image: addHome1, user_type: "owner" },
        { id: 2, name: "Default Home 2", image: addHome2, user_type: "owner" },
        { id: 3, name: "Default Home 3", image: addHome3, user_type: "owner" },
      ];
    }
  });

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
        const response = await axios.post("http://localhost:8080/createHouse", {
          user_id: currentUserID,
          house_name: newHomeName,
          address: newHomeAddress,
        });
        console.log("newHomeName: ", newHomeName);
        console.log("newHomeAddress: ", newHomeAddress);
        console.log("currentUserId: ", currentUserID);
        // Assuming the created house is returned in response.data.house
        const createdHouse = response.data.house;
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
    <div className="AddnDltHome-container">
      <div className="AddnDltHome-header1">
        <h2>Home</h2>
        {!isDeleting && (
          <button onClick={() => setShowOptions(!showOptions)} className="AddnDltHome-options-btn">
            <FaEllipsisH />
          </button>
        )}
        {showOptions && (
          <div>
            <button onClick={toggleDeleteMode} className="AddnDltHome-delete-btn">
              {isDeleting ? "Cancel" : "Delete Home Profile"}
            </button>
            <button onClick={() => setIsAdding(true)} className="add1-addndltbtn">
              Add Home Profile <FaPlusCircle />
            </button>
          </div>
        )}
      </div>

      <div className="AddnDltHome-list">
        {homes.map((home) => (
          <div key={home.id} className={`AddnDltHome-item-container ${isDeleting ? "deleting" : ""}`}>
            <button
              className="AddnDltHome-item"
              style={{ backgroundImage: `url(${home.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
              <span>{home.name}</span>
            </button>
            {isDeleting && home.user_type === "owner" && (
              <FaTrash className="AddnDltHome-delete-icon" onClick={() => handleDeleteHome(home.id)} />
            )}
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="AddnDltHome-modal">
          <h3>Add Home</h3>
          <label>Home Name:</label>
          <input
            type="text"
            placeholder="Enter House Name (max 20 characters)"
            value={newHomeName}
            onChange={(e) => setNewHomeName(e.target.value)}
            maxLength={MAX_LENGTH}
            required
          />
          <label>Home Address:</label>
          <input
            type="text"
            placeholder="Enter Home Address"
            value={newHomeAddress}
            onChange={(e) => setNewHomeAddress(e.target.value)}
          />
          <div className="AddnDltHome-modal-buttons">
            <button className="AddnDltHome-create-btn" onClick={handleAddHome}>Create</button>
            <button className="AddnDltHome-modal-back-btn" onClick={() => setIsAdding(false)}>Back</button>
          </div>
        </div>
      )}

      <button onClick={() => navigate(-1)} className="AddnDltHome-main-back-btn">⬅ Back</button>
    </div>
  );
};

export default AddHome;
