import React from "react";
import { XCircle } from "lucide-react";

const PopUpCard = ({ image, results, onClose }) => {
  // Fixed list of expected face shapes.
  const faceShapes = ["Oval", "Round", "Square", "Heart", "Diamond"];

  const handleOverlayClick = () => onClose();
  const handleCardClick = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl relative w-full max-w-3xl overflow-hidden p-6"
        onClick={handleCardClick}
      >
        {/* Header with title and close icon */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-800">
            Classification Results
          </h3>
          <button
            className="text-gray-600 hover:text-gray-800 transition-colors"
            onClick={onClose}
          >
            <XCircle size={32} />
          </button>
        </div>

        {/* Image container, centered and with fixed dimensions */}
        <div className="w-3/4 mx-auto h-80 overflow-hidden mb-6">
          <img
            src={image}
            alt="Classified"
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        {/* Progress bars for each face shape */}
        <div className="space-y-4">
          {faceShapes.map((label) => (
            <div key={label}>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>{label}</span>
                <span>{results[label] ? results[label] + "%" : "0%"}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${results[label] || 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopUpCard;
