import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FiBox } from "react-icons/fi";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../css/consumabletable.css";

const ConsumablesTable = () => {

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const rowsPerPage = 10;

  const API_URL = "http://localhost/santi-rice-machine/backend/get_consumable_table.php";

  /* =========================
     FETCH DATA
  ========================= */

  const fetchData = async () => {
    try {

      const response = await fetch(API_URL);
      const result = await response.json();

      const sorted = result.sort((a, b) => b.id - a.id);
      setData(sorted);

    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* =========================
     DELETE FUNCTION
  ========================= */

  const confirmDelete = async () => {

    try {

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete",
          id: deleteId,
        }),
      });

      const result = await response.json();

      if (result.success) {

        toast.success("Consumable Deleted Successfully");

        fetchData();
        setDeleteId(null);

      } else {
        toast.error("Delete Failed");
      }

    } catch (error) {
      toast.error("Server Error");
    }
  };

  /* =========================
     PAGINATION
  ========================= */

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (

    <div className="table-container">

      <ToastContainer position="top-right" autoClose={2000} />

      {/* =========================
          HEADER
      ========================= */}

      <div className="table-header">

        <h2>
          <FiBox className="table-icon"/>
          Consumable Management
        </h2>

        <span className="total-badge">
          Total Consumables : {data.length}
        </span>

      </div>

      {/* =========================
          TABLE
      ========================= */}

      <table className="modern-table">

        <thead>

          <tr>
            <th>SL NO</th>
            <th>CONSUMABLE NAME</th>
            <th>CREATED ON</th>
            <th>ACTION</th>
          </tr>

        </thead>

        <tbody>

          {currentRows.length === 0 ? (

            <tr>
              <td colSpan="4" className="empty">
                No Consumables Found
              </td>
            </tr>

          ) : (

            currentRows.map((item, index) => (

              <tr key={item.id}>

                <td>{indexOfFirstRow + index + 1}</td>

                {/* NAME BADGE */}

                <td>
                  <span className="badge">
                    {item.consumable_name}
                  </span>
                </td>

                {/* DATE BADGE */}

                <td>
                  <span className="date-badge">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : "N/A"}
                  </span>
                </td>

                {/* ACTION */}

                <td>

                  <button
                    className="delete-btn"
                    onClick={() => setDeleteId(item.id)}
                  >
                    <FaTrash/> Delete
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

      {/* =========================
          PAGINATION
      ========================= */}

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

      {/* =========================
          DELETE MODAL
      ========================= */}

      {deleteId && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>Delete Consumable</h3>

            <p>Are you sure you want to delete this consumable?</p>

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
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

export default ConsumablesTable;