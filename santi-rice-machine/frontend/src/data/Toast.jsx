import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo } from "react-icons/fi";
import "../css/Toast.css";

export const Toast = ({ type, message, onClose }) => {
  const icons = {
    success: <FiCheckCircle />,
    error: <FiXCircle />,
    duplicate: <FiAlertCircle />,
    info: <FiInfo />
  };

  return (
    <div className={`toast-notification ${type}`}>
      <div className="toast-icon">
        {icons[type]}
      </div>
      <div className="toast-content">
        <p>{message}</p>
      </div>
      <button className="toast-close" onClick={onClose}>
        <FiXCircle />
      </button>
    </div>
  );
};