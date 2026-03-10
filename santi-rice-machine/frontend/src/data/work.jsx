import { useState, useEffect } from "react";
import Select from "react-select";
import {
  FiTool,
  FiCode,
  FiFileText,
  FiUser,
  FiSave,
  FiX,
  FiCalendar
} from "react-icons/fi";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../css/Work.css";

function Work() {

  const [machineCode, setMachineCode] = useState(null);
  const [description, setDescription] = useState("");
  const [work, setWork] = useState("");
  const [notes, setNotes] = useState("");
  const [staff, setStaff] = useState("");
  const [machines, setMachines] = useState([]);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const formatDate = (d) => d.toISOString().split("T")[0];
  const [date, setDate] = useState(formatDate(today));

  const displayDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  /* ---------------- LOAD MACHINES ---------------- */

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

  /* ---------------- FETCH MACHINE DESCRIPTION ---------------- */

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
        setDescription(data.description);
      } else {
        setDescription("");
      }

    } catch (error) {
      console.error(error);
    }

  };

  /* ---------------- MACHINE CHANGE ---------------- */

  const handleMachineChange = (selected) => {

    setMachineCode(selected);

    if (selected) {
      fetchMachine(selected.value);
    } else {
      setDescription("");
    }

  };

  /* ---------------- CLEAR FORM ---------------- */

  const handleClear = () => {

    setMachineCode(null);
    setDescription("");
    setWork("");
    setNotes("");
    setStaff("");
    setDate(formatDate(today));

    toast.info("Form Cleared");

  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!machineCode) {
      toast.error("Select Machine Code");
      return;
    }

    if (!work) {
      toast.error("Enter Machine Work");
      return;
    }

    if (!notes) {
      toast.error("Enter Additional Notes");
      return;
    }

    if (!staff) {
      toast.error("Enter Staff Name");
      return;
    }

    const workData = {
      machineCode: machineCode.value,
      description,
      work,
      notes,
      staff,
      date
    };

    try {

      const response = await fetch(
        "http://localhost/santi-rice-machine/backend/add_work.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workData)
        }
      );

      const data = await response.json();

      if (data.success) {

        toast.success("Work Saved Successfully");

        setMachineCode(null);
        setDescription("");
        setWork("");
        setNotes("");
        setStaff("");
        setDate(formatDate(today));

      } else {
        toast.error("Error Saving Work");
      }

    } catch (error) {
      toast.error("Server Error");
    }

  };

  return (

    <div className="machine-wrapper">

      <ToastContainer position="top-right" autoClose={2500} />

      <div className="machine-card">

        <form onSubmit={handleSubmit} className="machine-form">

          {/* MACHINE CODE */}

          <div className="form-group">

            <label>
              <FiCode className="input-icon" />
              Machine Code
            </label>

            <Select
              options={machines}
              value={machineCode}
              onChange={handleMachineChange}
              placeholder="Select or search machine code..."
              isClearable
            />

          </div>

          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              <FiFileText className="input-icon" />
              Machine Description
            </label>

            <input
              type="text"
              value={description}
              placeholder="Machine description will appear automatically"
              readOnly
              className="form-input"
            />

          </div>

          {/* WORK */}

          <div className="form-group">

            <label>
              <FiTool className="input-icon" />
              Machine Work
            </label>

            <input
              type="text"
              value={work}
              placeholder="Enter work performed (e.g., Belt replacement, Motor servicing)"
              onChange={(e) => setWork(e.target.value)}
              className="form-input"
            />

          </div>

          {/* NOTES */}

          <div className="form-group">

            <label>
              <FiFileText className="input-icon" />
              Additional Notes
            </label>

            <textarea
              value={notes}
              placeholder="Add extra details if required (parts changed, observations, etc.)"
              onChange={(e) => setNotes(e.target.value)}
              className="form-input textarea"
            />

          </div>

          {/* STAFF */}

          <div className="form-group">

            <label>
              <FiUser className="input-icon" />
              Staff Name
            </label>

            <input
              type="text"
              value={staff}
              placeholder="Enter technician or operator name"
              onChange={(e) => setStaff(e.target.value)}
              className="form-input"
            />

          </div>

          {/* DATE */}

          <div className="form-group">

            <label>
              <FiCalendar className="input-icon" />
              Date
            </label>

            <div className="date-control">

              <button
                type="button"
                className="date-arrow"
                onClick={() => setDate(formatDate(yesterday))}
                disabled={date === formatDate(yesterday)}
              >
                ◀
              </button>

              <span className="date-display">
                {displayDate(date)}
              </span>

              <button
                type="button"
                className="date-arrow"
                onClick={() => setDate(formatDate(today))}
                disabled={date === formatDate(today)}
              >
                ▶
              </button>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="button-group">

            <button type="submit" className="btn btn-primary">
              <FiSave />
              <span>Save Work</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="btn btn-secondary"
            >
              <FiX />
              <span>Clear</span>
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default Work;