import React from "react";

const filters = [
  {
    id: "glasses",
    name: "Glasses",
    preview: "/filters/glasses_preview.png",
    asset: "/filters/glasses.png",
  },
  {
    id: "beard",
    name: "Beard",
    preview: "/filters/beard_preview.png",
    asset: "/filters/beard.png",
  },
  {
    id: "hat",
    name: "Hat",
    preview: "/filters/hat_preview.png",
    asset: "/filters/hat.png",
  },
  {
    id: "flower",
    name: "Flower Crown",
    preview: "/filters/flower_preview.png",
    asset: "/filters/flower.png",
  },
];

function FiltersPanel({ selectedFilter, onFilterSelect }) {
  return (
    <div className="w-full max-w-6xl mx-auto mt-4 overflow-x-auto flex space-x-4 py-2">
      {filters.map((filter) => (
        <div
          key={filter.id}
          className={`flex-shrink-0 w-32 p-2 border rounded-lg shadow cursor-pointer transition-transform hover:scale-105 ${
            selectedFilter === filter.id ? "border-blue-500" : "border-gray-300"
          }`}
          onClick={() => onFilterSelect(filter)}
        >
          <img
            src={filter.preview}
            alt={`${filter.name} preview`}
            className="w-full h-24 object-cover rounded-md mb-2"
          />
          <p className="text-center font-medium text-sm">{filter.name}</p>
        </div>
      ))}
    </div>
  );
}

export default FiltersPanel;
