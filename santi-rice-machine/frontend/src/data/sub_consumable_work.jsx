
import { useState, useEffect } from "react";
import Select from "react-select";

import {
  FiPlus,
  FiSave,
  FiXCircle,
  FiBox
} from "react-icons/fi";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../css/subConsumableWork.css";

function SubConsumableWork() {

  const [allConsumables, setAllConsumables] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [subConsumables, setSubConsumables] = useState([""]);

  const FETCH_URL =
    "http://localhost/santi-rice-machine/backend/get_sub_consumable_table.php";

  const SAVE_URL =
    "http://localhost/santi-rice-machine/backend/add_sub_consumable_work.php";

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {

    fetch(FETCH_URL)
      .then((res) => res.json())
      .then((data) => {

        if (data.success) {

          const options = data.data.map((item) => ({
            value: item.id,
            label: item.sub_name
          }));

          setAllConsumables(options);

        }

      });

  }, []);

  /* ---------------- ADD FIELD ---------------- */

  const addField = () => {

    setSubConsumables([...subConsumables, ""]);

  };

  /* ---------------- REMOVE FIELD ---------------- */

  const removeField = (index) => {

    const updated = subConsumables.filter((_, i) => i !== index);
    setSubConsumables(updated);

  };

  /* ---------------- CHANGE INPUT ---------------- */

  const handleInputChange = (index, value) => {

    const updated = [...subConsumables];
    updated[index] = value;

    setSubConsumables(updated);

  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async (e) => {

    e.preventDefault();

    if (!selectedItem) {
      toast.error("Please select a consumable first");
      return;
    }

    const filtered = subConsumables.filter((s) => s.trim() !== "");

    if (filtered.length === 0) {
      toast.warning("Please enter at least one sub consumable");
      return;
    }

    try {

      const response = await fetch(SAVE_URL, {

        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          parent_id: selectedItem.value,
          sub_consumables: filtered
        })

      });

      const data = await response.json();

      if (data.success) {

        toast.success("Saved Successfully");

        setSubConsumables([""]);
        setSelectedItem(null);

      } else {

        toast.error(data.message);

      }

    } catch {

      toast.error("Server Error");

    }

  };

  return (

    <div className="machine-wrapper">

      <ToastContainer position="top-right" autoClose={2500} />

      <div className="machine-card">

        <form className="machine-form" onSubmit={handleSave}>

          {/* SELECT CONSUMABLE */}

          <div className="form-group">

            <label>
              <FiBox className="input-icon" />
              Select Consumable
            </label>

            <Select
              options={allConsumables}
              value={selectedItem}
              onChange={setSelectedItem}
              placeholder="Select consumable..."
              isClearable
            />

          </div>

          {/* SUB CONSUMABLES */}

          {subConsumables.map((sub, index) => (

            <div className="form-group" key={index}>

              <label>
                Sub Consumable {index + 1}
              </label>

              <div style={{ display: "flex", gap: "10px" }}>

                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter sub consumable"
                  value={sub}
                  onChange={(e) =>
                    handleInputChange(index, e.target.value)
                  }
                />

                {index !== 0 && (

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeField(index)}
                  >
                    <FiXCircle />
                  </button>

                )}

              </div>

            </div>

          ))}

          {/* ADD BUTTON */}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={addField}
            style={{ marginBottom: "15px" }}
          >
            <FiPlus />
            <span>Add More</span>
          </button>

          {/* SAVE BUTTON */}

          <button type="submit" className="btn btn-primary">

            <FiSave />
            <span>Save All</span>

          </button>

        </form>

      </div>

    </div>

  );

}

export default SubConsumableWork;
