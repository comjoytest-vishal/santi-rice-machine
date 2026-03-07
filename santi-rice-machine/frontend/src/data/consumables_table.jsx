import React, { useEffect, useState } from "react";

const ConsumablesTable = () => {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const API_URL = "http://localhost/santi-rice-machine/backend/get_consumable_table.php";

  // ==============================
  // FETCH DATA FROM SERVER
  // ==============================
  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==============================
  // START EDIT
  // ==============================
  const handleEdit = (item) => {
    setEditId(item.id);
    setEditValue(item.consumable_name);
  };

  // ==============================
  // UPDATE DATA
  // ==============================
  const handleUpdate = async (id) => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update",
          id: id,
          consumable_name: editValue,
        }),
      });

      setEditId(null);
      setEditValue("");
      fetchData(); // refresh table
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Consumables Table</h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Consumable Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>

              <td>
                {editId === item.id ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                ) : (
                  item.consumable_name
                )}
              </td>

              <td>
                {editId === item.id ? (
                  <>
                    <button onClick={() => handleUpdate(item.id)}>
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditValue("");
                      }}
                      style={{ marginLeft: "10px" }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsumablesTable;