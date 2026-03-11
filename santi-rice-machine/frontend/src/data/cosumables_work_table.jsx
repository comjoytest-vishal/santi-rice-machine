import React, { useEffect, useState } from "react";
import "../css/consumablesdetailstable.css";
import { FaTools, FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConsumablesDetailsTable = () => {

  const API_URL =
    "http://localhost/santi-rice-machine/backend/get_consumables_work_table.php";

  const UPDATE_URL =
    "http://localhost/santi-rice-machine/backend/get_consumables_work_table.php";

  const [data, setData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  /* DATE FORMAT FUNCTION */
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchData = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      if (json.success) {
        setData(json.data);
      } else {
        setData([]);
      }
    } catch {
      toast.error("Failed to load consumable data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (row) => {
    setEditRow({ ...row });
  };

  const handleChange = (e) => {
    setEditRow({
      ...editRow,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    const formData = new FormData();

    Object.keys(editRow).forEach((key) => {
      formData.append(key, editRow[key]);
    });

    try {
      const res = await fetch(UPDATE_URL, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Updated successfully");
        setEditRow(null);
        fetchData();
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const indexLast = currentPage * rowsPerPage;
  const indexFirst = indexLast - rowsPerPage;

  const currentRows = data.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="consumables-wrapper">

      <ToastContainer position="top-right" />

      <div className="consumables-card">

        <div className="consumables-header">
          <h2>
            <FaTools /> Consumable Work Records
          </h2>

          <span>Total Records : {data.length}</span>
        </div>

        <table className="consumables-table">

          <thead>
            <tr>

              <th>SL</th>

              {data[0] &&
                Object.keys(data[0]).map((key) => (
                  <th key={key}>{key.toUpperCase()}</th>
                ))}

              <th>ACTION</th>

            </tr>
          </thead>

          <tbody>

            {currentRows.length === 0 ? (

              <tr>
                <td colSpan="20" className="consumables-empty">
                  No Data Found
                </td>
              </tr>

            ) : (

              currentRows.map((row, index) => (

                <tr key={row.id}>

                  <td>{indexFirst + index + 1}</td>

                  {Object.keys(row).map((key) => (

                    <td key={key}>
                      {key === "created_at"
                        ? formatDate(row[key])
                        : row[key]}
                    </td>

                  ))}

                  <td>

                    <button
                      className="consumables-edit-btn"
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

        <div className="consumables-pagination">

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

      {editRow && (

        <div className="consumables-modal-overlay">

          <div className="consumables-modal">

            <h3>Edit Consumable Entry</h3>

            <div className="consumables-form">

              {Object.keys(editRow).map((key) =>
                key !== "id" ? (

                  <div className="consumables-field" key={key}>

                    <label>{key.toUpperCase()}</label>

                    <input
                      name={key}
                      value={editRow[key]}
                      onChange={handleChange}
                    />

                  </div>

                ) : null
              )}

            </div>

            <div className="consumables-modal-buttons">

              <button
                className="consumables-cancel"
                onClick={() => setEditRow(null)}
              >
                Cancel
              </button>

              <button
                className="consumables-update"
                onClick={handleUpdate}
              >
                Update
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default ConsumablesDetailsTable;