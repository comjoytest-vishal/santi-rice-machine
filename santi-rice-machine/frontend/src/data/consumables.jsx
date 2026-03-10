import React, { useState } from "react";
import "../css/Consumables.css";

/* ICON IMPORT */
import { FaBoxOpen } from "react-icons/fa";
import { FiTag, FiXCircle } from "react-icons/fi";

/* TOAST */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Consumables = () => {

  const [consumable, setConsumable] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (consumable.trim() === "") {
      toast.warning("Please enter consumable name");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/santi-rice-machine/backend/add_consumable.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            consumable_name: consumable
          })
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setConsumable("");
      } else {
        toast.error(result.message);
      }

    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error");
    }
  };

  /* CLEAR BUTTON */
  const handleClear = () => {
    setConsumable("");
    toast.info("Input cleared");
  };

  return (

    <div className="consumable-container">

      <div className="consumable-card">

        <form onSubmit={handleSubmit}>

          {/* LABEL WITH ICON */}
          <label className="label-icon">
            <FiTag className="icon" /> Consumable Name
          </label>

          <input
            type="text"
            placeholder="Enter consumable name (e.g., Rubber)"
            value={consumable}
            onChange={(e) => setConsumable(e.target.value)}
            required
          />

          <div className="btn-group">

            <button type="submit" className="save-btn">
              <FaBoxOpen /> Save Consumable
            </button>

            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
            >
              <FiXCircle />
              <span> Clear</span>
            </button>

          </div>

        </form>

      </div>

      {/* TOAST CONTAINER */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="colored"
      />

    </div>

  );
};

export default Consumables;