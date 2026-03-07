import React, { useState } from "react";

const SubConsumablesForm = () => {
  const [subName, setSubName] = useState("");
  const [message, setMessage] = useState("");

  const BASE_URL = "http://localhost/santi-rice-machine/backend/add_sub_consumable.php";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subName.trim()) {
      setMessage("Sub Consumable name is required");
      return;
    }

    try {
      const response = await fetch(BASE_URL, {   // ✅ FIXED HERE
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
        setMessage("Sub Consumable Added Successfully");
        setSubName("");
      } else {
        setMessage(result.message || "Insert Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server Error");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Add Sub Consumable</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={subName}
          onChange={(e) => setSubName(e.target.value)}
          placeholder="Enter Sub Consumable Name"
          required
        />

        <br /><br />

        <button type="submit">Save</button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default SubConsumablesForm;