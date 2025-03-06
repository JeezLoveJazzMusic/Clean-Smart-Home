/*Fix by Joe */

import React, { useState } from "react";
import addHome1 from "../../assets/addhome1.jpg";
import addHome2 from "../../assets/addhome2.jpg";
import addHome3 from "../../assets/addhome3.jpg";
import addButton from "../../assets/add-button.png";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";  /*made by Joe */

function Sidebar() {
  const navigate = useNavigate();  /*made by Joe */
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sidebar-container">
      {/* Sidebar */}
      <div className={`Sidebar ${isOpen ? "open" : ""}`}>
        {/* Toggle Button (Remains Attached) */}
        <button className="Sidebar-toggle" onClick={toggleSidebar}>
          {isOpen ? "✖" : "☰"}
        </button>

        {/* Home List */}
        <div className="Sidebar-list">
          <div className="Sidebar-container">
            <img src={addHome1} alt="Home 1" className="Sidebar-image" />
            <span className="Sidebar-name">Home 1</span>
          </div>
          <div className="Sidebar-container">
            <img src={addHome2} alt="Home 2" className="Sidebar-image" />
            <span className="Sidebar-name">Home 2</span>
          </div>
          <div className="Sidebar-container">
            <img src={addHome3} alt="Home 3" className="Sidebar-image" />
            <span className="Sidebar-name">Home 3</span>
          </div>
        </div>


        {/* Add Home Button */}
        <div className="add-Sidebar-container">
          <button onClick={() => navigate("/AddnDltHome")} className="add-Sidebar">   
          <button className="add-Sidebar">
            <img src={addButton} alt="Add" className="add-Sidebar-icon" />
            Add Home
          </button>
          </button>
        </div>

      </div>
    </div>
  );
}

export default Sidebar;
