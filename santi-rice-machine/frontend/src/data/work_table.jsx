import React, { useEffect, useState } from "react";
import "../css/WorkTable.css";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTools, FaEdit } from "react-icons/fa";

const WorkTable = () => {

  const API_URL = "http://localhost/santi-rice-machine/backend/get_work_table.php";

  const [data, setData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [machines, setMachines] = useState([]);

  const rowsPerPage = 10;

  /* ================= FETCH DATA ================= */

  const fetchData = async () => {

    try {

      const res = await fetch(API_URL);
      const result = await res.json();

      if (Array.isArray(result)) {
        setData(result);
      } else {
        setData([]);
      }

    } catch {
      toast.error("Failed to load work data");
    }

  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= LOAD MACHINES ================= */

  useEffect(() => {

    fetch("http://localhost/santi-rice-machine/backend/get_machine_table.php")
      .then((res) => res.json())
      .then((data) => {

        const options = data.map((m) => ({
          value: m.machine_code.toUpperCase(),
          label: m.machine_code.toUpperCase()
        }));

        setMachines(options);

      });

  }, []);

  /* ================= FETCH MACHINE DESCRIPTION ================= */

  const fetchMachine = async (code) => {

    try {

      const response = await fetch(
        "http://localhost/santi-rice-machine/backend/get_machine_work_form.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ machine_code: code })
        }
      );

      const data = await response.json();

      if (data.success) {

        setEditRow(prev => ({
          ...prev,
          machine_code: code,
          description: data.description
        }));

      }

    } catch (error) {
      console.log(error);
    }

  };

  /* ================= MACHINE CHANGE ================= */

  const handleMachineChange = (selected) => {

    if (!selected) return;

    fetchMachine(selected.value);

  };

  /* ================= EDIT ================= */

  const handleEdit = (row) => {
    setEditRow({ ...row });
  };

  const handleChange = (e) => {
    setEditRow({ ...editRow, [e.target.name]: e.target.value });
  };

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {

    try {

      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editRow)
      });

      toast.success("Work updated successfully");

      setEditRow(null);

      fetchData();

    } catch {

      toast.error("Update failed");

    }

  };

  /* ================= DATE FORMAT ================= */

  const formatDate = (date) => {

    const d = new Date(date);

    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  };

  /* ================= PAGINATION ================= */

  const indexLast = currentPage * rowsPerPage;
  const indexFirst = indexLast - rowsPerPage;

  const currentRows = data.slice(indexFirst, indexLast);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (

    <div className="machine-wrapper-table">

      <ToastContainer position="top-right" />

      <div className="table-card">

        <div className="table-header">

          <h2>
            <FaTools /> Machine Work Records
          </h2>

          <span>Total Records : {data.length}</span>

        </div>

        <table className="premium-table">

          <thead>

            <tr>
              <th>SL No</th>
              <th>Machine Code</th>
              <th>Machine Description</th>
              <th>Machine Work</th>
              <th>Additional Notes</th>
              <th>Staff Name</th>
              <th>Created On</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {currentRows.length === 0 ? (

              <tr>
                <td colSpan="8" className="empty">
                  No Work Records Found
                </td>
              </tr>

            ) : (

              currentRows.map((row, index) => (

                <tr
                  key={row.id}
                 className={row.edited ? "edited-row" : ""}
                >

                  <td>{indexFirst + index + 1}</td>

                  <td>
                    <span className="code">
                      {row.machine_code?.toUpperCase()}
                    </span>
                  </td>

                  <td>{row.description.toUpperCase()}</td>

                  <td>{row.work.toUpperCase()}</td>

                  <td>{row.notes.toUpperCase()}</td>

                  <td>{row.staff.toUpperCase()}</td>

                  <td>
                    <span className="date">
                      {formatDate(row.work_date)}
                    </span>
                  </td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() => handleEdit(row)}
                    >
                      <FaEdit /> Edit
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

        {/* PAGINATION */}

        <div className="pagination">

          {[...Array(totalPages)].map((_, i) => (

            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>

          ))}

        </div>

      </div>

      {/* EDIT MODAL */}

      {editRow && (

        <div className="modal-overlay">

          <div className="modal work-edit-modal">

            <h3>Edit Machine Work</h3>

            <div className="modal-form">

              {/* MACHINE CODE */}

              <div className="form-field">

                <label>Machine Code</label>

                <Select
                  options={machines}
                  value={
                    machines.find(
                      (m) =>
                        m.value === editRow.machine_code?.toUpperCase()
                    ) || null
                  }
                  onChange={handleMachineChange}
                  placeholder="Select machine code"
                />

              </div>

              {/* DESCRIPTION */}

              <div className="form-field">

                <label>Machine Description</label>

                <input
                  value={editRow.description}
                  readOnly
                />

              </div>

              <div className="form-field">
                <label>Machine Work</label>
                <input
                  name="work"
                  value={editRow.work}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Additional Notes</label>
                <textarea
                  name="notes"
                  value={editRow.notes}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Staff Name</label>
                <input
                  name="staff"
                  value={editRow.staff}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="modal-actions">

              <button
                className="cancel"
                onClick={() => setEditRow(null)}
              >
                Cancel
              </button>

              <button
                className="confirm"
                onClick={handleUpdate}
              >
                Update Work
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default WorkTable;