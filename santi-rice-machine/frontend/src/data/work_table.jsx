import React, { useEffect, useState } from "react";

const WorkTable = () => {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const API_URL = "http://localhost/santi-rice-machine/backend/get_work_table.php";

  // FETCH DATA
  const fetchData = async () => {
    const res = await fetch(API_URL);
    const result = await res.json();

    if (Array.isArray(result)) {
      setData(result);
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // EDIT BUTTON
  const handleEdit = (row) => {
    setEditId(row.id);
    setEditData(row);
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // UPDATE (POST)
  const handleUpdate = async () => {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });

    setEditId(null);
    fetchData();
  };

  // DELETE (?delete=id)
  const handleDelete = async (id) => {
    await fetch(`${API_URL}?delete=${id}`);
    fetchData();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Work Entry Table</h2>

      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Machine</th>
            <th>Description</th>
            <th>Work</th>
            <th>Notes</th>
            <th>Staff</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>

              {editId === row.id ? (
                <>
                  <td>
                    <input
                      name="machine_code"
                      value={editData.machine_code || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="description"
                      value={editData.description || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="work"
                      value={editData.work || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="notes"
                      value={editData.notes || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="staff"
                      value={editData.staff || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      name="work_date"
                      value={editData.work_date || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{row.machine_code}</td>
                  <td>{row.description}</td>
                  <td>{row.work}</td>
                  <td>{row.notes}</td>
                  <td>{row.staff}</td>
                  <td>{row.work_date}</td>
                  <td>
                    <button onClick={() => handleEdit(row)}>Edit</button>
                    <button onClick={() => handleDelete(row.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkTable;