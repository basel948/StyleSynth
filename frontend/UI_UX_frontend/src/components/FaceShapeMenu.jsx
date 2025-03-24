import React from "react";
import {
  Circle,
  Radio,
  Square,
  Heart,
  Diamond,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const shapeIcons = {
  Oval: <Circle size={24} />,
  Round: <Radio size={24} />,
  Square: <Square size={24} />,
  Heart: <Heart size={24} />,
  Diamond: <Diamond size={24} />,
};

const FaceShapeMenu = ({ selectedFaceShape, onShapeClick }) => {
  const faceShapes = Object.keys(shapeIcons);
  return (
    <div className="flex justify-around w-full max-w-4xl mb-4 ml-11">
      {faceShapes.map((shape) => (
        <button
          key={shape}
          onClick={() => onShapeClick(shape)}
          className={`w-56 flex items-center justify-between p-4 pl-6 border rounded transition-colors 
            ${
              selectedFaceShape === shape
                ? "bg-gray-700 text-white border-gray-700"
                : "bg-white text-gray-800 border-gray-300"
            }`}
        >
          <div className="flex items-center gap-2">
            {shapeIcons[shape]}
            <span className="mt-1 text-sm font-bold">{shape}</span>
          </div>
          <div>
            {selectedFaceShape === shape ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronUp size={16} />
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default FaceShapeMenu;
