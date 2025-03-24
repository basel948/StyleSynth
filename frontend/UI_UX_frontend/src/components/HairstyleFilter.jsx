// File: frontend/UI_UX_frontend/src/components/HairstyleFilter.jsx
import React, { useState } from "react";

const initialFilters = {
  gender: "",
  hairType: "",
  curlyType: "",
  hairLength: "",
  skinType: "",
  beardType: "",
};

function HairstyleFilter({ onFilterChange }) {
  const [filters, setFilters] = useState(initialFilters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    // Pass the filter values upward
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  return (
    <div className="p-4 border-r border-gray-300 min-w-[250px]">
      <h2 className="text-xl font-bold mb-4">Filter Hairstyles</h2>

      {/* Gender */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Gender</label>
        <select
          name="gender"
          value={filters.gender}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* Hair Type */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Hair Type</label>
        <select
          name="hairType"
          value={filters.hairType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All</option>
          <option value="curly">Curly</option>
          <option value="straight">Straight</option>
          <option value="wavy">Wavy</option>
        </select>
      </div>

      {/* Curly Type (conditional) */}
      {filters.hairType === "curly" && (
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Curly Type</label>
          <select
            name="curlyType"
            value={filters.curlyType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All</option>
            <option value="loose">Loose</option>
            <option value="tight">Tight</option>
          </select>
        </div>
      )}

      {/* Hair Length */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Hair Length</label>
        <select
          name="hairLength"
          value={filters.hairLength}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All</option>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </div>

      {/* Skin Type */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Skin Type</label>
        <select
          name="skinType"
          value={filters.skinType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All</option>
          <option value="light">Light</option>
          <option value="medium">Medium</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Beard Type (only if male is selected) */}
      {filters.gender === "male" && (
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Beard Type</label>
          <select
            name="beardType"
            value={filters.beardType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All</option>
            <option value="none">No Beard</option>
            <option value="stubble">Stubble</option>
            <option value="full">Full Beard</option>
          </select>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="flex-grow bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="flex-grow bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default HairstyleFilter;
