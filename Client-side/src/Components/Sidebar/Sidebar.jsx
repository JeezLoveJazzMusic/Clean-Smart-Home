/*Fix by Joe */

import React, { useState } from "react";
import addHome1 from "../../assets/addhome1.jpg";
import addHome2 from "../../assets/addhome2.jpg";
import addHome3 from "../../assets/addhome3.jpg";
import addButton from "../../assets/add-button.png";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom"; /*made by Joe */

function Sidebar({ allHouses }) {
  const navigate = useNavigate(); /*made by Joe */
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  /* Temporary Home Data */
  const homes = [
    { id: 1, name: "Home 1", image: addHome1 },
    { id: 2, name: "Home 2", image: addHome2 },
    { id: 3, name: "Home 3", image: addHome3 },
  ];

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
          {homes.map((home) => (
            <button
              key={home.id}
              className="sidebar-container"
              onClick={() => navigate(`/home/${home.id}`)}
            >
              <img src={home.image} alt={home.name} className="sidebar-image" />
              <span className="sidebar-home-name">{home.name}</span>
            </button>
          ))}
        </div>

        {/* Add Home Button */}
        <div className="add-sidebar-container">
          <button
            onClick={() => navigate("/AddnDltHome", { state: { allHouses } })}
            className="add-sidebar"
          >
            <button className="add-sidebar">
              <img src={addButton} alt="Add" className="add-sidebar-icon" />
              Add Home
            </button>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
