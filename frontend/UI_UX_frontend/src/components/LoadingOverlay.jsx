// LoadingOverlay.jsx
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingOverlay = ({ message }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-70">
      <CircularProgress color="inherit" />
      <p className="mt-4 text-white text-lg">{message}</p>
    </div>
  );
};

export default LoadingOverlay;
