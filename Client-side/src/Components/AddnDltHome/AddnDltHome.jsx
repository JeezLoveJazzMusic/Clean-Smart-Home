/* Made by Joe */
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
  const { allHouses, currentUserID } = location.state || {};
  const MAX_LENGTH = 20;

  const [homes, setHomes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newHomeName, setNewHomeName] = useState("");
  const [newHomeAddress, setNewHomeAddress] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (allHouses) {
      setHomes(
        allHouses.map((house) => ({
          id: house.house_id,
          name: house.house_name,
          image: selectImage(house.house_id),
          user_type: house.user_type,
        }))
      );
    }
  }, [allHouses]);

  const fetchRefreshHomes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/getAllUserHouseData/user/${currentUserID}`
      );
      const { allUserHouseData } = response.data;
      if (Array.isArray(allUserHouseData)) {
        setHomes(
          allUserHouseData.map((house) => ({
            id: house.house_id,
            name: house.house_name,
            image: selectImage(house.house_id),
            user_type: house.user_type,
          }))
        );
      } else {
        console.error("Invalid house data received:", response.data);
      }
    } catch (error) {
      console.error("Error fetching homes:", error);
    }
  };

  const handleAddHome = async () => {
    if (!newHomeName.trim() || !newHomeAddress.trim()) {
      alert("Error: Home Name and Home Address cannot be empty. Please enter valid values.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/createHouse", {
        user_id: currentUserID,
        house_name: newHomeName,
        address: newHomeAddress,
      });
      fetchRefreshHomes();
      setNewHomeName("");
      setNewHomeAddress("");
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding house:", error);
    }
  };

  const handleDeleteHome = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/removeHouse/house/${id}`);
      setHomes((prevHomes) => prevHomes.filter((home) => home.id !== id));
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
      <button onClick={() => navigate(-1)} className="AddnDltHome-main-back-btn">
        ⬅ Back
      </button>
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
              style={{
                backgroundImage: `url(${home.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <span className="AddnDltHome-home-name">{home.name}</span>
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
          />
          <label>Home Address:</label>
          <input
            type="text"
            placeholder="Enter Home Address"
            value={newHomeAddress}
            onChange={(e) => setNewHomeAddress(e.target.value)}
          />
          <div className="AddnDltHome-modal-buttons">
            <button className="AddnDltHome-create-btn" onClick={handleAddHome}>
              Create
            </button>
            <button className="AddnDltHome-modal-back-btn" onClick={() => setIsAdding(false)}>
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddHome;
