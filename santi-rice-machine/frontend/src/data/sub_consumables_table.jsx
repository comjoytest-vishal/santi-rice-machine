import React, { useEffect, useState } from "react";

const SubConsumablesTable = () => {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const URL =
    "http://localhost/santi-rice-machine/backend/get_sub_consumable_table.php";

  const fetchData = () => {
    fetch(URL)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result.data);
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditValue(item.sub_name);
  };

  const handleUpdate = async (id) => {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, sub_name: editValue }),
    });

    const result = await response.json();

    if (result.success) {
      setEditId(null);
      fetchData();
    } else {
      alert("Update failed");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Sub Consumables List</h2>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <table border="1" cellPadding="10" style={{ minWidth: "600px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Sub Name</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  <td>
                    {editId === item.id ? (
                      <input
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
                        <button onClick={() => handleUpdate(item.id)}>
                          Save
                        </button>
                        <button onClick={() => setEditId(null)}>
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
              ))
            ) : (
              <tr>
                <td colSpan="4">No Data Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubConsumablesTable;