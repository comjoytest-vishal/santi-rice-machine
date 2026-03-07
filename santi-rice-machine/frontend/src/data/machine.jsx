import { useState } from "react";
import { 
  FiSave, 
  FiXCircle, 
  FiCheckCircle, 
  FiAlertCircle,
  FiRefreshCw,
  FiCode,
  FiFileText
} from "react-icons/fi";
import { Toast } from "./Toast";
import "../css/Machine.css";

function Machine() {
  const [machineCode, setMachineCode] = useState("");
  const [machineDescription, setMachineDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 4000);
  };

  const handleClear = () => {
    setMachineCode("");
    setMachineDescription("");
    showToast("info", "Form cleared successfully");
  };

  const validateMachineCode = (code) => {
    const specialPattern = /^[A-Za-z0-9\-_/#+@!$%^&*()]+$/;
    return specialPattern.test(code);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateMachineCode(machineCode)) {
      showToast("error", "Machine code contains invalid characters!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost/santi-rice-machine/backend/add_machine.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            machine_code: machineCode,
            machine_description: machineDescription,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast("success", data.message);
        setMachineCode("");
        setMachineDescription("");
      } else {
        if (data.message.includes("duplicate") || data.message.includes("already exists")) {
          showToast("duplicate", data.message);
        } else {
          showToast("error", data.message);
        }
      }
    } catch (error) {
      showToast("error", "Error connecting to server");
    }

    setLoading(false);
  };

  return (
    <div className="machine-wrapper">
      <div className="machine-card">

        <form onSubmit={handleSubmit} className="machine-form">
          <div className="form-group">
            <label htmlFor="machineCode">
              <FiCode className="input-icon" />
              Machine Code
            </label>
            <div className="input-wrapper">
              <input
                id="machineCode"
                type="text"
                value={machineCode}
                onChange={(e) => setMachineCode(e.target.value)}
                placeholder="Enter machine code (e.g., MC-001)"
                required
                className="form-input"
              />
              {machineCode && (
                <span className="input-hint">
                  {validateMachineCode(machineCode) ? (
                    <FiCheckCircle className="valid-icon" />
                  ) : (
                    <FiAlertCircle className="invalid-icon" />
                  )}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="machineDescription">
              <FiFileText className="input-icon" />
              Machine Description
            </label>
            <div className="input-wrapper">
              <textarea
                id="machineDescription"
                value={machineDescription}
                onChange={(e) => setMachineDescription(e.target.value)}
                placeholder="Enter machine description (e.g., Rice Milling Machine - Model 2024)"
                required
                className="form-input textarea"
                rows="4"
              />
            </div>
          </div>

          <div className="button-group">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <FiRefreshCw className="spinning" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave />
                  <span>Save Machine</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="btn btn-secondary"
              disabled={loading}
            >
              <FiXCircle />
              <span>Clear</span>
            </button>
          </div>
        </form>

      </div>

      {toast.show && (
        <Toast 
          type={toast.type} 
          message={toast.message}
          onClose={() => setToast({ show: false, type: "", message: "" })}
        />
      )}
    </div>
  );
}

export default Machine;