import React, { useState } from "react";

const ConsumablesDetails = () => {
  const [machineQuery, setMachineQuery] = useState("");
  const [machineDescription, setMachineDescription] = useState("");
  const [machineSuggestions, setMachineSuggestions] = useState([]);

  const [consumableQuery, setConsumableQuery] = useState("");
  const [consumableSuggestions, setConsumableSuggestions] = useState([]);

  const [date, setDate] = useState("");
  const [opening, setOpening] = useState("");
  const [dealer, setDealer] = useState("");
  const [purchase, setPurchase] = useState("");
  const [useQty, setUseQty] = useState("");
  const [staff, setStaff] = useState("");
  const [closing, setClosing] = useState("");

  const MACHINE_API = "http://localhost/santi-rice-machine/backend/get_machine_table.php";
  const CONSUMABLE_API = "http://localhost/santi-rice-machine/backend/get_consumable_table.php";
  const SAVE_API =
    "http://localhost/santi-rice-machine/backend/add_consumables_work_entry.php";

  // ================= MACHINE SEARCH =================
  const handleMachineSearch = async (value) => {
    setMachineQuery(value);
    setMachineDescription("");

    if (value.length < 1) {
      setMachineSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`${MACHINE_API}?search=${value}`);
      const data = await res.json();
      setMachineSuggestions(data);
    } catch (err) {
      console.error("Machine search error:", err);
    }
  };

  const selectMachine = (machine) => {
    setMachineQuery(machine.machine_code);
    setMachineDescription(machine.machine_description);
    setMachineSuggestions([]);
  };

  // ================= CONSUMABLE SEARCH =================
  const handleConsumableSearch = async (value) => {
    setConsumableQuery(value);

    if (value.length < 1) {
      setConsumableSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`${CONSUMABLE_API}?search=${value}`);
      const data = await res.json();
      setConsumableSuggestions(data);
    } catch (err) {
      console.error("Consumable search error:", err);
    }
  };

  const selectConsumable = (item) => {
    setConsumableQuery(item.consumable_name);
    setConsumableSuggestions([]);
  };

  // ================= SAVE =================
  const handleSubmit = async () => {
    if (!date || !machineQuery || !consumableQuery) {
      alert("Please fill required fields");
      return;
    }

    const payload = {
      date,
      machine_code: machineQuery,
      machine_description: machineDescription,
      consumable_name: consumableQuery,
      opening: opening || 0,
      dealer_entry: dealer,
      purchase_entry: purchase || 0,
      use_entry: useQty || 0,
      staff,
      closing_entry: closing || 0,
    };

    try {
      const res = await fetch(SAVE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        alert("Saved Successfully ✅");

        // CLEAR FORM
        setDate("");
        setMachineQuery("");
        setMachineDescription("");
        setConsumableQuery("");
        setOpening("");
        setDealer("");
        setPurchase("");
        setUseQty("");
        setStaff("");
        setClosing("");
      } else {
        alert(result.message || "Insert Failed ❌");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Server Error ❌");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h2>Consumable Entry Form</h2>

      {/* DATE */}
      <div style={{ marginBottom: "20px" }}>
        <label>Date</label>
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* MACHINE CODE */}
      <div style={{ marginBottom: "20px", position: "relative" }}>
        <label>Machine Code</label>
        <input
          type="text"
          className="form-control"
          value={machineQuery}
          onChange={(e) => handleMachineSearch(e.target.value)}
          placeholder="Type machine code..."
        />

        {machineSuggestions.length > 0 && (
          <ul
            className="list-group"
            style={{
              position: "absolute",
              width: "100%",
              zIndex: 1000,
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {machineSuggestions.map((item) => (
              <li
                key={item.id}
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
                onClick={() => selectMachine(item)}
              >
                {item.machine_code}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* DESCRIPTION */}
      <div style={{ marginBottom: "20px" }}>
        <label>Description</label>
        <input
          type="text"
          className="form-control"
          value={machineDescription}
          readOnly
        />
      </div>

      {/* CONSUMABLE */}
      <div style={{ marginBottom: "20px", position: "relative" }}>
        <label>Consumable</label>
        <input
          type="text"
          className="form-control"
          value={consumableQuery}
          onChange={(e) => handleConsumableSearch(e.target.value)}
          placeholder="Type consumable..."
        />

        {consumableSuggestions.length > 0 && (
          <ul
            className="list-group"
            style={{
              position: "absolute",
              width: "100%",
              zIndex: 1000,
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {consumableSuggestions.map((item) => (
              <li
                key={item.id}
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
                onClick={() => selectConsumable(item)}
              >
                {item.consumable_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* OTHER INPUTS */}
      <div style={{ marginBottom: "15px" }}>
        <label>Opening</label>
        <input type="number" className="form-control" value={opening} onChange={(e) => setOpening(e.target.value)} />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Dealer Entry</label>
        <input type="text" className="form-control" value={dealer} onChange={(e) => setDealer(e.target.value)} />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Purchase Entry</label>
        <input type="number" className="form-control" value={purchase} onChange={(e) => setPurchase(e.target.value)} />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Use Entry</label>
        <input type="number" className="form-control" value={useQty} onChange={(e) => setUseQty(e.target.value)} />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Staff</label>
        <input type="text" className="form-control" value={staff} onChange={(e) => setStaff(e.target.value)} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Closing</label>
        <input type="number" className="form-control" value={closing} onChange={(e) => setClosing(e.target.value)} />
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>
        Save Entry
      </button>
    </div>
  );
};

export default ConsumablesDetails;