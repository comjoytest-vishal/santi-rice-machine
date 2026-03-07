import React, { useState, useEffect } from "react";

const SubConsumableMain = () => {

  const [machineData, setMachineData] = useState([]);
  const [machineSuggestions, setMachineSuggestions] = useState([]);

  const [machineCode, setMachineCode] = useState("");
  const [machineDescription, setMachineDescription] = useState("");

  const [data, setData] = useState([]);
  const [parentInput, setParentInput] = useState("");
  const [subInput, setSubInput] = useState("");

  const [parentSuggestions, setParentSuggestions] = useState([]);
  const [subSuggestions, setSubSuggestions] = useState([]);

  const [date, setDate] = useState("");
  const [opening, setOpening] = useState("");
  const [purchase, setPurchase] = useState("");
  const [useEnter, setUseEnter] = useState("");
  const [dealer, setDealer] = useState("");
  const [staff, setStaff] = useState("");
  const [closingEntry, setClosingEntry] = useState("");

  const MACHINE_API = "http://localhost/santi-rice-machine/backend/get_machine_table.php";
  const CONSUMABLE_API = "http://localhost/santi-rice-machine/backend/get_sub_consumable_work.php";
  const INSERT_API = "http://localhost/santi-rice-machine/backend/add_sub_consumable_main.php";


  /* FETCH MACHINE DATA */

  useEffect(() => {

    fetch(MACHINE_API)
      .then(res => res.json())
      .then(data => setMachineData(data))
      .catch(err => console.log("Machine fetch error:", err));

  }, []);


  /* FETCH CONSUMABLE DATA */

  useEffect(() => {

    fetch(CONSUMABLE_API)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setData(res.data);
        }
      })
      .catch(err => console.log("Consumable fetch error:", err));

  }, []);


  /* MACHINE SEARCH */

  const handleMachineChange = (value) => {

    setMachineCode(value);

    const filtered = machineData.filter(machine =>
      machine.machine_code.toLowerCase().includes(value.toLowerCase())
    );

    setMachineSuggestions(value ? filtered : []);

  };

  const selectMachine = (machine) => {

    setMachineCode(machine.machine_code);
    setMachineDescription(machine.machine_description);
    setMachineSuggestions([]);

  };


  /* PARENT SEARCH */

  const handleParentChange = (value) => {

    setParentInput(value);

    const filtered = data.filter(item =>
      item.parent_name &&
      item.parent_name.toLowerCase().includes(value.toLowerCase())
    );

    const unique = [...new Map(filtered.map(i => [i.parent_name, i])).values()];

    setParentSuggestions(value ? unique : []);

  };


  /* SUB SEARCH */

  const handleSubChange = (value) => {

    setSubInput(value);

    const filtered = data.filter(item =>
      item.parent_name === parentInput &&
      item.sub_name.toLowerCase().includes(value.toLowerCase())
    );

    setSubSuggestions(value ? filtered : []);

  };


  /* FORM SUBMIT */

  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = {
      machine_code: machineCode,
      machine_description: machineDescription,
      parent_name: parentInput,
      sub_name: subInput,
      date: date,
      opening: opening,
      purchase: purchase,
      use_enter: useEnter,
      dealer: dealer,
      staff: staff,
      closing_entry: closingEntry
    };

    console.log("FORM DATA:", formData);

    try {

      const res = await fetch(INSERT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const text = await res.text();

      console.log("SERVER RESPONSE:", text);

      const result = JSON.parse(text);

      if (result.success) {

        alert("Data inserted successfully");

        setMachineCode("");
        setMachineDescription("");
        setParentInput("");
        setSubInput("");
        setDate("");
        setOpening("");
        setPurchase("");
        setUseEnter("");
        setDealer("");
        setStaff("");
        setClosingEntry("");

      } else {

        alert("Insert failed");

      }

    } catch (err) {

      console.log("Fetch Error:", err);

    }

  };


  return (

    <div style={{ width: "500px", margin: "40px auto", fontFamily: "Arial" }}>

      <h2>Machine Consumable Form</h2>

      <form onSubmit={handleSubmit}>


        <label>Machine Code</label>

        <input
          type="text"
          value={machineCode}
          placeholder="Type machine code..."
          onChange={(e) => handleMachineChange(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        {machineSuggestions.map(machine => (
          <div
            key={machine.id}
            style={{ padding: "6px", borderBottom: "1px solid #ddd", cursor: "pointer" }}
            onClick={() => selectMachine(machine)}
          >
            {machine.machine_code}
          </div>
        ))}


        <label style={{ marginTop: "15px", display: "block" }}>
          Machine Description
        </label>

        <input
          type="text"
          value={machineDescription}
          readOnly
          style={{ width: "100%", padding: "8px", background: "#eee" }}
        />


        <label style={{ marginTop: "20px", display: "block" }}>
          Consumable
        </label>

        <input
          type="text"
          value={parentInput}
          placeholder="Type consumable..."
          onChange={(e) => handleParentChange(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        {parentSuggestions.map((item, index) => (
          <div
            key={index}
            style={{ padding: "6px", borderBottom: "1px solid #ddd", cursor: "pointer" }}
            onClick={() => {
              setParentInput(item.parent_name);
              setParentSuggestions([]);
            }}
          >
            {item.parent_name}
          </div>
        ))}


        <label style={{ marginTop: "20px", display: "block" }}>
          Sub Consumable
        </label>

        <input
          type="text"
          value={subInput}
          placeholder="Type sub consumable..."
          onChange={(e) => handleSubChange(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        {subSuggestions.map(item => (
          <div
            key={item.id}
            style={{ padding: "6px", borderBottom: "1px solid #ddd", cursor: "pointer" }}
            onClick={() => {
              setSubInput(item.sub_name);
              setSubSuggestions([]);
            }}
          >
            {item.sub_name}
          </div>
        ))}


        <label style={{ marginTop: "20px", display: "block" }}>Date</label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />


        <label style={{ marginTop: "20px", display: "block" }}>Opening</label>

        <input
          type="number"
          value={opening}
          onChange={(e) => setOpening(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />


        <label style={{ marginTop: "20px", display: "block" }}>Purchase</label>

        <input
          type="number"
          value={purchase}
          onChange={(e) => setPurchase(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />


        <label style={{ marginTop: "20px", display: "block" }}>Use</label>

        <input
          type="number"
          value={useEnter}
          onChange={(e) => setUseEnter(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />


        <label style={{ marginTop: "20px", display: "block" }}>Dealer</label>

        <input
          type="text"
          value={dealer}
          onChange={(e) => setDealer(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />


        <label style={{ marginTop: "20px", display: "block" }}>Staff</label>

        <input
          type="text"
          value={staff}
          onChange={(e) => setStaff(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />


        <label style={{ marginTop: "20px", display: "block" }}>Closing Entry</label>

        <input
          type="number"
          value={closingEntry}
          onChange={(e) => setClosingEntry(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />


        <button
          type="submit"
          style={{
            marginTop: "20px",
            padding: "10px",
            width: "100%",
            background: "#28a745",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Submit
        </button>

      </form>

    </div>
  );
};

export default SubConsumableMain;