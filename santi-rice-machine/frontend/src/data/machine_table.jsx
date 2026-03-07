import React, { useEffect, useState } from "react";

const MachineTable = () => {
  const API_URL = "http://localhost/santi-rice-machine/backend/get_machine_table.php";

  const [machines, setMachines] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  // ===============================
  // FETCH DATA
  // ===============================
  const fetchMachines = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setMachines(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  // ===============================
  // EDIT BUTTON
  // ===============================
  const handleEdit = (machine) => {
    setEditId(machine.id);
    setEditData(machine);
  };

  // ===============================
  // INPUT CHANGE
  // ===============================
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // ===============================
  // UPDATE MACHINE
  // ===============================
  const handleUpdate = async () => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      setEditId(null);
      fetchMachines();
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  // ===============================
  // DELETE MACHINE
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this machine?")) {
      return;
    }

    try {
      await fetch(`${API_URL}?delete=${id}`);
      fetchMachines();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Machine Table</h2>

      <table border="1" width="100%" cellPadding="10">
        <thead style={{ backgroundColor: "#28a745", color: "white" }}>
          <tr>
            <th>Machine Code</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {machines.length === 0 ? (
            <tr>
              <td colSpan="5" align="center">
                No Data Found
              </td>
            </tr>
          ) : (
            machines.map((machine) => (
              <tr key={machine.id}>
                

                {editId === machine.id ? (
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
                        name="machine_description"
                        value={editData.machine_description || ""}
                        onChange={handleChange}
                      />
                    </td>
                    <td>{machine.created_at}</td>
                    <td>
                      <button onClick={handleUpdate}>Save</button>{" "}
                      <button onClick={() => setEditId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{machine.machine_code}</td>
                    <td>{machine.machine_description}</td>
                    <td>{machine.created_at}</td>
                    <td>
                      <button onClick={() => handleDelete(machine.id)}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MachineTable;