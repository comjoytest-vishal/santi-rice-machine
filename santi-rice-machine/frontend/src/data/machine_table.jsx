import React, { useEffect, useState } from "react";
import "../css/MachineTable.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaCogs } from "react-icons/fa";

const MachineTable = () => {

  const API_URL = "http://localhost/santi-rice-machine/backend/get_machine_table.php";

  const [machines, setMachines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const rowsPerPage = 10;

  // ================= FETCH DATA
  const fetchMachines = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setMachines(data);
    } catch (error) {
      toast.error("Failed to load machines");
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  // ================= DELETE MACHINE
  const confirmDelete = async () => {

    try {
      await fetch(`${API_URL}?delete=${deleteId}`);

      toast.success("Machine deleted successfully");

      setDeleteId(null);
      fetchMachines();

    } catch (error) {

      toast.error("Delete failed");

    }

  };

  // ================= DATE FORMAT
  const formatDate = (date) => {

    const d = new Date(date);

    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  };

  // ================= PAGINATION
  const indexLast = currentPage * rowsPerPage;
  const indexFirst = indexLast - rowsPerPage;

  const currentMachines = machines.slice(indexFirst, indexLast);

  const totalPages = Math.ceil(machines.length / rowsPerPage);

  return (

    <div className="machine-wrapper-table">

      <ToastContainer position="top-right" />

      <div className="table-card">

        <div className="table-header">

          <h2><FaCogs /> Machine Management</h2>

          <span>Total Machines : {machines.length}</span>

        </div>

        <table className="premium-table">

          <thead>

            <tr>
              <th>SL No</th>
              <th>Machine Code</th>
              <th>Machine Description</th>
              <th>Created On</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {currentMachines.length === 0 ? (

              <tr>
                <td colSpan="5" className="empty">
                  No Machines Found
                </td>
              </tr>

            ) : (

              currentMachines.map((machine, index) => (

                <tr key={machine.id}>

                  <td>{indexFirst + index + 1}</td>
                  <td>
                    <span className="code">{machine.machine_code?.toUpperCase()}</span>
                  </td>
                  <td>
                    {machine.machine_description?.toUpperCase()}
                  </td>
                  <td>
                    <span className="date">{formatDate(machine.created_at)}</span>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => setDeleteId(machine.id)}
                    >
                     <FaTrash /> Delete
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

      {/* DELETE MODAL */}

      {deleteId && (

        <div className="modal-overlay-machine">

          <div className="modal-machine">

            <h3>Delete Machine</h3>

            <p>Are you sure you want to delete this machine?</p>

            <div className="modal-actions-machine">

              <button
                className="cancel-machine"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                className="confirm-machine"
                onClick={confirmDelete}
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
};

export default MachineTable;