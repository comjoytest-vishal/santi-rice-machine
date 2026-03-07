import React, { useEffect, useState } from "react";

const SubConsumableWork = () => {
  const [allConsumables, setAllConsumables] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [subConsumables, setSubConsumables] = useState([""]);

  const FETCH_URL =
    "http://localhost/santi-rice-machine/backend/get_sub_consumable_table.php";

  const SAVE_URL =
    "http://localhost/santi-rice-machine/backend/add_sub_consumable_work.php";

  /* ======================
     FETCH DATA FROM API
  ====================== */
  useEffect(() => {
    fetch(FETCH_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAllConsumables(data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  /* ======================
     HANDLE SEARCH
  ====================== */
  const handleSearch = (value) => {
    setSearch(value);

    if (value.length > 0) {
      const filtered = allConsumables.filter((item) =>
        item.sub_name.toLowerCase().includes(value.toLowerCase())
      );

      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  /* ======================
     SELECT SUGGESTION
  ====================== */
  const selectSuggestion = (item) => {
    setSelectedItem(item);
    setSearch(item.sub_name);
    setSuggestions([]);
  };

  /* ======================
     HANDLE INPUT CHANGE
  ====================== */
  const handleInputChange = (index, value) => {
    const updated = [...subConsumables];
    updated[index] = value;
    setSubConsumables(updated);
  };

  /* ======================
     ADD NEW INPUT
  ====================== */
  const addField = () => {
    setSubConsumables([...subConsumables, ""]);
  };

  /* ======================
     REMOVE INPUT
  ====================== */
  const removeField = (index) => {
    const updated = subConsumables.filter((_, i) => i !== index);
    setSubConsumables(updated);
  };

  /* ======================
     SAVE DATA TO SERVER
  ====================== */
  const handleSave = async () => {
    if (!selectedItem) {
      alert("Please select a consumable first");
      return;
    }

    const filtered = subConsumables.filter((s) => s.trim() !== "");

    if (filtered.length === 0) {
      alert("Please enter at least one sub consumable");
      return;
    }

    try {
      const response = await fetch(SAVE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent_id: selectedItem.id,
          sub_consumables: filtered,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Sub consumables saved successfully");

        setSubConsumables([""]);
        setSearch("");
        setSelectedItem(null);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div style={{ width: "450px", margin: "40px auto", fontFamily: "Arial" }}>
      <h2>Sub Consumable Work</h2>

      {/* SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search consumable..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      />

      {/* SUGGESTIONS */}
      {suggestions.length > 0 && (
        <ul
          style={{
            border: "1px solid #ccc",
            listStyle: "none",
            padding: 0,
            marginTop: 0,
          }}
        >
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => selectSuggestion(item)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {item.sub_name}
            </li>
          ))}
        </ul>
      )}

      {/* MULTIPLE INPUT FIELDS */}
      {selectedItem && (
        <div style={{ marginTop: "20px" }}>
          <h4>Selected: {selectedItem.sub_name}</h4>

          {subConsumables.map((sub, index) => (
            <div key={index} style={{ display: "flex", marginBottom: "8px" }}>
              <input
                type="text"
                placeholder="Enter sub consumable"
                value={sub}
                onChange={(e) => handleInputChange(index, e.target.value)}
                style={{ flex: 1, padding: "8px" }}
              />

              {index !== 0 && (
                <button
                  onClick={() => removeField(index)}
                  style={{ marginLeft: "5px" }}
                >
                  ❌
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addField}
            style={{
              marginTop: "5px",
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            + Add More
          </button>

          <br />

          <button
            onClick={handleSave}
            style={{
              marginTop: "15px",
              padding: "8px 15px",
              cursor: "pointer",
            }}
          >
            Save All
          </button>
        </div>
      )}
    </div>
  );
};

export default SubConsumableWork;