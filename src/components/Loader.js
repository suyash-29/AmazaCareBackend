import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader d-flex justify-content-center align-items-center bg-light">
      <div className="text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="watermark mt-3 text-secondary">AmazeCare</p>
      </div>
    </div>
  );
};

export default Loader;
