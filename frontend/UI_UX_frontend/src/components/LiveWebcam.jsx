import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

const LiveWebcam = ({ selectedHairstyle }) => {
  const [activateCamera, setActivateCamera] = useState(false);
  const webcamRef = useRef(null);

  const handleActivateCamera = () => {
    setActivateCamera(true);
  };

  return (
    <div className="relative w-[1000px] max-w-6xl mb-4">
      {activateCamera ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full h-[550px] border rounded shadow-lg object-cover"
          onUserMedia={() => console.log("Webcam access granted.")}
          onUserMediaError={(err) =>
            console.error("Error accessing webcam:", err)
          }
        />
      ) : (
        <div className="flex flex-col items-center justify-center border rounded shadow-lg w-full h-[500px] bg-gray-200">
          <p className="mb-4 text-lg text-gray-800">
            Please allow camera access to activate webcam
          </p>
          <button
            onClick={handleActivateCamera}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Activate Webcam
          </button>
        </div>
      )}

      {selectedHairstyle && (
        <img
          src={selectedHairstyle}
          alt="Hairstyle Overlay"
          className="absolute"
          style={{
            top: "20%", // Adjust based on your testing
            left: "60%",
            width: "200px", // Adjust as needed
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

export default LiveWebcam;
