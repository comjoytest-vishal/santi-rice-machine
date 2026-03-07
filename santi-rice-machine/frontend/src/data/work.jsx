import { useState } from "react";

function Work() {
  const [machineCode, setMachineCode] = useState("");
  const [description, setDescription] = useState("");
  const [work, setWork] = useState("");
  const [notes, setNotes] = useState("");
  const [staff, setStaff] = useState("");
  const [message, setMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // ===============================
  // Fetch Machine Description
  // ===============================
  const fetchMachine = async (code) => {
    try {
      const response = await fetch(
        "http://localhost/santi-rice-machine/backend/get_machine_work_form.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ machine_code: code }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setDescription(data.description);
      } else {
        setDescription("");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setDescription("");
    }
  };

  // ===============================
  // Handle Machine Code Change
  // ===============================
  const handleMachineChange = (e) => {
    const code = e.target.value;
    setMachineCode(code);

    if (code.trim() !== "") {
      fetchMachine(code);
    } else {
      setDescription("");
    }
  };

  // ===============================
  // Submit Work Entry to Server
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!work || !staff) {
      setMessage("Work and Staff Name are compulsory!");
      return;
    }

    const workData = {
      machineCode,
      description,
      work,
      notes,
      staff,
      date: today,
    };

    try {
      const response = await fetch(
        "http://localhost/santi-rice-machine/backend/add_work.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(workData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Work Saved Successfully!");

        setMachineCode("");
        setDescription("");
        setWork("");
        setNotes("");
        setStaff("");
      } else {
        setMessage("❌ Error saving work!");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      setMessage("❌ Server Error!");
    }
  };

  // ===============================
  // NEW BUTTON FUNCTION
  // ===============================
  const openWorkTable = () => {
    window.open("http://localhost/MACHINERY/vis2.php", "_blank");
  };

  return (
    <div className="machine-container">
      <h2>Machine Work Entry</h2>

      <form onSubmit={handleSubmit} className="machine-form">
        <label>Machine Code</label>
        <input
          type="text"
          value={machineCode}
          onChange={handleMachineChange}
          required
        />

        <label>Description</label>
        <input type="text" value={description} readOnly />

        <label>Work *</label>
        <input
          type="text"
          value={work}
          onChange={(e) => setWork(e.target.value)}
          required
        />

        <label>Additional Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <label>Staff Name *</label>
        <input
          type="text"
          value={staff}
          onChange={(e) => setStaff(e.target.value)}
          required
        />

        <label>Date</label>
        <input type="date" value={today} readOnly />

        <button type="submit" className="submit-btn">
          Save Work
        </button>
      </form>

      {/* ✅ NEW BUTTON */}
      <button
        type="button"
        onClick={openWorkTable}
        style={{
          marginTop: "15px",
          padding: "10px 15px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        View Work Records
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Work;