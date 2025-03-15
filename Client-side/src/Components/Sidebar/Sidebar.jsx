/*Fix by Joe */

import React, { useState } from "react";
import addHome1 from "../../assets/addhome1.jpg";
import addHome2 from "../../assets/addhome2.jpg";
import addHome3 from "../../assets/addhome3.jpg";
import addButton from "../../assets/add-button.png";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom"; /*made by Joe */

function Sidebar({ allHouses, onHouseSelect, currentUserID }) {
  const navigate = useNavigate(); /*made by Joe */
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleHouseClick = (houseId) => {
    if (onHouseSelect) {
      onHouseSelect(houseId);
    }
  };

  /* Temporary Home Data */
  const testhomes = [
    { id: 1, name: "Home 1", image: addHome1 },
    { id: 2, name: "Home 2", image: addHome2 },
    { id: 3, name: "Home 3", image: addHome3 },
  ];

  console.log("Sidebar received houses:", allHouses);

  return (
    <div className="sidebar-container">
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Toggle Button (Remains Attached) */}
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isOpen ? "✖" : "☰"}
        </button>

        {/* Home List */}
        <div className="sidebar-list">
          {allHouses && allHouses.map((home) => (
            <button
              key={home.house_id}
              className="sidebar-container"
              onClick={() => handleHouseClick(home.house_id)}
            >
              <img src={home.image} alt={home.name} className="sidebar-image" />
              <span className="sidebar-home-name">{home.house_name}</span>
            </button>
          ))}
        </div>

        {/* Add Home Button */}
        <div className="add-sidebar-container">
          <button
            onClick={() => navigate("/AddnDltHome", { state: { allHouses, currentUserID } })}
            className="add-sidebar"
          >
            <img src={addButton} alt="Add" className="add-sidebar-icon" />
            Add Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
