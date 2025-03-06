/*Made by Joe */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddnDltHome.css";
import { FaPlusCircle, FaTrash, FaEllipsisH } from "react-icons/fa";
import addHome1 from "../../assets/addhome1.jpg";
import addHome2 from "../../assets/addhome2.jpg";
import addHome3 from "../../assets/addhome3.jpg";

const AddHome = () => {
  const navigate = useNavigate();
  const [homes, setHomes] = useState(() => {
    const savedHomes = localStorage.getItem("homes");
    return savedHomes
      ? JSON.parse(savedHomes)
      : [
          { id: 1, name: "Home 1", image: addHome1 },
          { id: 2, name: "Home 2", image: addHome2 },
          { id: 3, name: "Home 3", image: addHome3 },
        ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newHomeName, setNewHomeName] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    localStorage.setItem("homes", JSON.stringify(homes));
  }, [homes]);

  const handleAddHome = () => {
    if (newHomeName.trim()) {
      const homeImages = [addHome1, addHome2, addHome3];
      const newHome = {
        id: Date.now(),
        name: newHomeName,
        image: homeImages[Math.floor(Math.random() * homeImages.length)],
      };
      setHomes([...homes, newHome]);
      setNewHomeName("");
      setIsAdding(false);
    }
  };

  const handleDeleteHome = (id) => {
    setHomes(homes.filter((home) => home.id !== id));
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
            {isDeleting && (
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