import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HairstyleSlider = ({
  faceShape,
  hairstyleOptions,
  selectedHairstyle,
  onHairstyleClick,
}) => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  return (
    <div className="w-full max-w-4xl ml-11">
      <Slider {...sliderSettings}>
        {hairstyleOptions[faceShape].map((hairstyle, index) => (
          <div key={index} className="p-2">
            <img
              src={hairstyle}
              alt={`Hairstyle ${index + 1}`}
              className={`cursor-pointer border rounded ${
                selectedHairstyle === hairstyle
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => onHairstyleClick(hairstyle)}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HairstyleSlider;
