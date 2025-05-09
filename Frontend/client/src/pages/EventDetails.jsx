import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../Styles/EventDetails.css";

const EventDetails = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="soon-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="soon-card">
        <h2>Will be available soon</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </motion.div>
  );
};

export default EventDetails;
