import React, { useState } from "react";

const Consumables = () => {
  const [consumable, setConsumable] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost/santi-rice-machine/backend/add_consumable.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ consumable_name: consumable })
        }
      );

      const result = await response.json();
      alert(result.message);

      if (result.success) {
        setConsumable("");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  // ✅ NEW FUNCTION TO OPEN PHP PAGE
  const openConsumableTable = () => {
    window.open("http://localhost/santi-rice-machine/backend/get_consumable.php", "_blank");
  };

  return (
    <div>
      <h2>Add Consumable</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Consumable"
          value={consumable}
          onChange={(e) => setConsumable(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Save</button>
      </form>

      {/* ✅ NEW BUTTON */}
      <br />
      <button
        type="button"
        onClick={openConsumableTable}
        style={{
          marginTop: "15px",
          padding: "10px 15px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        View Consumables
      </button>
    </div>
  );
};

export default Consumables;