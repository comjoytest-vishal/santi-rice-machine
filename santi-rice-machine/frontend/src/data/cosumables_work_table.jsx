import React, { useEffect, useState } from "react";

const ConsumablesDetailsTable = () => {
  const API_URL = "http://localhost/santi-rice-machine/backend/get_consumables_work_table.php";
  const UPDATE_URL = "http://localhost/santi-rice-machine/backend/get_consumables_work_table.php";

  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      if (json.success) {
        setData(json.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= EDIT =================
  const handleEdit = (row) => {
    setEditId(row.id);
    setEditData(row);
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SAVE =================
  const handleSave = async () => {
    const formData = new FormData();

    Object.keys(editData).forEach((key) => {
      formData.append(key, editData[key]);
    });

    try {
      const res = await fetch(UPDATE_URL, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        setEditId(null);
        fetchData();
      } else {
        alert("Update Failed!");
      }
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Consumable Entries</h2>

      {data.length === 0 ? (
        <p>No Data Found</p>
      ) : (
        <table border="1" width="100%" cellPadding="8">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                {Object.keys(row).map((key) => (
                  <td key={key}>
                    {editId === row.id ? (
                      key === "id" ? (
                        row[key]
                      ) : (
                        <input
                          name={key}
                          value={editData[key] || ""}
                          onChange={handleChange}
                        />
                      )
                    ) : (
                      row[key]
                    )}
                  </td>
                ))}

                <td>
                  {editId === row.id ? (
                    <>
                      <button onClick={handleSave}>Save</button>
                      <button onClick={() => setEditId(null)}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(row)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ConsumablesDetailsTable;