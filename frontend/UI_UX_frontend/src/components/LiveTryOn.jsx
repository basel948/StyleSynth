import React, { useState } from "react";
import FiltersPanel from "./FiltersPanel";
import HairstyleFilter from "./HairstyleFilter";
import LiveWebcam from "./LiveWebcam";
import HairstyleSlider from "./HairstyleSlider";

const hairstyleOptions = {
  Oval: [
    "/hairstyles/oval1.png",
    "/hairstyles/oval2.png",
    "/hairstyles/oval3.png",
  ],
  Round: [
    "/hairstyles/round1.png",
    "/hairstyles/round2.png",
    "/hairstyles/round3.png",
  ],
  Square: [
    "/hairstyles/square1.png",
    "/hairstyles/square2.png",
    "/hairstyles/square3.png",
  ],
  Heart: [
    "/hairstyles/heart1.png",
    "/hairstyles/heart2.png",
    "/hairstyles/heart3.png",
  ],
  Diamond: [
    "/hairstyles/diamond1.png",
    "/hairstyles/diamond2.png",
    "/hairstyles/diamond3.png",
  ],
};

function LiveTryOn() {
  const [selectedFaceShape, setSelectedFaceShape] = useState(null);
  const [selectedHairstyle, setSelectedHairstyle] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filter, setFilter] = useState({});

  const handleShapeClick = (shape) => {
    // Toggle the selection if already selected.
    if (selectedFaceShape === shape) {
      setSelectedFaceShape(null);
      setSelectedHairstyle(null);
    } else {
      setSelectedFaceShape(shape);
      setSelectedHairstyle(null);
    }
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    console.log("Selected filter:", filter);
  };

  const handleHairstyleClick = (hairstyle) => {
    setSelectedHairstyle(hairstyle);
  };

  const handleFilterChange = (newFilters) => {
    setFilter(newFilters);
    // Later, use newFilters to refine hairstyleOptions or trigger an API call.
    console.log("Filters applied:", newFilters);
  };

  return (
    <div className="flex min-h-screen overflow-y-auto">
      {/* Main Content Area */}
      <div className="flex-grow p-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">Try Any Hairstyle You Want</h1>

        {/* Content Container: left filter and main try-on content */}
        <div className="w-full max-w-6xl flex gap-4">
          {/* Filter Panel */}
          <HairstyleFilter onFilterChange={handleFilterChange} />

          {/* Try-On Section */}
          <div className="flex-grow">
            <LiveWebcam
              selectedHairstyle={selectedHairstyle}
              selectedFilter={selectedFilter}
            />
            {selectedFaceShape && (
              <HairstyleSlider
                faceShape={selectedFaceShape}
                hairstyleOptions={hairstyleOptions}
                selectedHairstyle={selectedHairstyle}
                onHairstyleClick={handleHairstyleClick}
              />
            )}
            <FiltersPanel
              selectedFilter={selectedFilter?.id}
              onFilterSelect={handleFilterSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveTryOn;
