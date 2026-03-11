import React, { useState } from "react";
import "../css/subconsumables.css";

import { FaTools } from "react-icons/fa";
import { FiTag, FiXCircle } from "react-icons/fi";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubConsumablesForm = () => {
  const [subName, setSubName] = useState("");

  const BASE_URL =
    "http://localhost/santi-rice-machine/backend/add_sub_consumable.php";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subName.trim()) {
      toast.warning("Sub Consumable name is required");
      return;
    }

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sub_name: subName,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Sub Consumable Added Successfully");
        setSubName("");
      } else if (result.message === "EXISTS") {
        toast.error("Sub Consumable already exists");
      } else {
        toast.error(result.message || "Insert Failed");
      }
    } catch (error) {
      toast.error("Server Error");
    }
  };

  const handleClear = () => {
    setSubName("");
    toast.info("Form Cleared");
  };

  return (
    <div className="sub-page">

      <div className="sub-card">

        <form onSubmit={handleSubmit}>

          <label className="sub-label">
            <FiTag /> Sub Consumable Name
          </label>

          <input
            type="text"
            className="sub-input"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            placeholder="Enter sub consumable (e.g., Bolt)"
          />

          <div className="sub-buttons">

            <button type="submit" className="save-btn">
              <FaTools /> Save
            </button>

            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
            >
              <FiXCircle /> Clear
            </button>

          </div>

        </form>

      </div>

      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
};

export default SubConsumablesForm;