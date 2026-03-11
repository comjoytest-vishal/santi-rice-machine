import React, { useEffect, useState } from "react";
import "../css/subConsumablesTable.css";

import { FaTrash } from "react-icons/fa";
import { FiBox } from "react-icons/fi";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubConsumablesTable = () => {

  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const API_URL =
    "http://localhost/santi-rice-machine/backend/get_sub_consumable_table.php";

  /* FETCH DATA */

  const fetchData = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* DATE FORMAT */

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* DELETE MODAL */

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  /* DELETE API */

  const handleDelete = async () => {

    try {

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: deleteId
        }),
      });

      const result = await response.json();

      if (result.success) {

        toast.success("Sub Consumable Deleted Successfully ✅");

        fetchData();

      } else {

        toast.error(result.message);

      }

    } catch (error) {

      toast.error("Something went wrong");

    }

    setShowModal(false);
  };

  /* PAGINATION */

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentData = data.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="sub-table-container">

      <ToastContainer position="top-right" autoClose={2000} />

      <div className="sub-table-card">

        <div className="sub-table-header">

          <h2>
            <FiBox /> Sub Consumable Management
          </h2>

          <span className="total-count">
            Total Items : {data.length}
          </span>

        </div>

        <table className="sub-table">

          <thead>
            <tr>
              <th>SL NO</th>
              <th>SUB CONSUMABLE NAME</th>
              <th>CREATED ON</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>

            {currentData.map((item, index) => (

              <tr key={item.id}>

                <td>{indexOfFirst + index + 1}</td>

                <td>
                  <span className="name-badge">
                    {item.sub_name.toUpperCase()}
                  </span>
                </td>

                <td>
                  <span className="date-pill">
                    {formatDate(item.created_at)}
                  </span>
                </td>

                <td>

                  <button
                    className="delete-btn"
                    onClick={() => openDeleteModal(item.id)}
                  >
                    <FaTrash /> Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {/* PAGINATION */}

        <div className="pagination">

          {[...Array(totalPages)].map((_, i) => (

            <button
              key={i}
              className={currentPage === i + 1 ? "active-page" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>

          ))}

        </div>

      </div>

      {/* DELETE MODAL */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal-box">

            <h3>Delete Consumable</h3>

            <p>Are you sure you want to delete this consumable?</p>

            <div className="modal-buttons">

              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-delete"
                onClick={handleDelete}
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

export default SubConsumablesTable;