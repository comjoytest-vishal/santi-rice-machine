import React, { useEffect, useState } from "react";

const SubConsumableWorkTable = () => {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const API_URL =
    "http://localhost/santi-rice-machine/backend/get_sub_consumable_work.php";

  /* ======================
     FETCH DATA
  ====================== */
  const fetchData = async () => {
    try {
      const res = await fetch(API_URL);
      const result = await res.json();

      if (result.success) {
        setData(result.data);
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ======================
     START EDIT
  ====================== */
  const startEdit = (item) => {
    setEditId(item.id);
    setEditValue(item.sub_name);
  };

  /* ======================
     CANCEL EDIT
  ====================== */
  const cancelEdit = () => {
    setEditId(null);
    setEditValue("");
  };

  /* ======================
     SAVE EDIT
  ====================== */
  const saveEdit = async (id) => {
    if (!editValue.trim()) {
      alert("Sub name cannot be empty");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          sub_name: editValue,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Updated successfully");
        setEditId(null);
        setEditValue("");
        fetchData();
      } else {
        alert(result.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Server error");
    }
  };

  return (
    <div style={{ width: "900px", margin: "40px auto", fontFamily: "Arial" }}>
      <h2>Sub Consumable Work Table</h2>

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Parent Consumable</th>
            <th>Sub Consumable</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" align="center">
                No Data Found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>

                <td>{item.parent_name}</td>

                <td>
                  {editId === item.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    item.sub_name
                  )}
                </td>

                <td>{item.created_at}</td>

                <td>
                  {editId === item.id ? (
                    <>
                      <button onClick={() => saveEdit(item.id)}>Save</button>

                      <button
                        onClick={cancelEdit}
                        style={{ marginLeft: "5px" }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(item)}>Edit</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SubConsumableWorkTable;