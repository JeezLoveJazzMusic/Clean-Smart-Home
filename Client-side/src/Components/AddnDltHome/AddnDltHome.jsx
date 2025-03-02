import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddnDltHome.css";
import { FaPlusCircle, FaTrash, FaEllipsisH } from "react-icons/fa";

const AddHome = () => {
  const navigate = useNavigate();
  const [homes, setHomes] = useState(() => {
    const savedHomes = localStorage.getItem("homes");
    return savedHomes
      ? JSON.parse(savedHomes)
      : [
          { id: 1, name: "Home 1" },
          { id: 2, name: "Home 2" },
          { id: 3, name: "Home 3" },
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
      const newHome = { id: Date.now(), name: newHomeName };
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

  const homeImages = [
    "/assets/addhome1.jpg",
    "/assets/addhome2.jpg",
    "/assets/addhome3.jpg",
  ];

  return (
    <div className="home-container">
      <div className="home-header">
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

      <button onClick={() => setIsAdding(true)} className="add-btn">
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
                backgroundImage: `url(${
                  homeImages[Math.floor(Math.random() * homeImages.length)]
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <p>{home.name}</p>
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
