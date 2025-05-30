import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import globalBackendRoute from "../../config/config";
import FoodDisplay from "../FoodDisplay/FoodDisplay"; // Import FoodDisplay component

const KitchenExplore = () => {
  const [kitchens, setKitchens] = useState([]);
  const [selectedKitchen, setSelectedKitchen] = useState(null); // State to track selected kitchen
  const scrollContainerRef = useRef(null); // Ref for the scrollable container
  const isDragging = useRef(false); // Track drag state
  const startX = useRef(0); // Track initial X position
  const scrollLeft = useRef(0); // Track initial scroll position

  useEffect(() => {
    const fetchKitchens = async () => {
      try {
        const response = await axios.get(`${globalBackendRoute}/api/all-kitchens`);
        setKitchens(response.data);
      } catch (error) {
        console.error("Error fetching kitchens:", error.message);
      }
    };

    fetchKitchens();
  }, []);

  const handleKitchenClick = (id) => {
    setSelectedKitchen(id); // Set the clicked kitchen as selected
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Adjust scroll speed
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  return (
    <div className="bg-[#f9f6f6] py-10 px-5">
      <h2 className="text-4xl font-semibold text-[#450c0c] mb-10">Explore Our Kitchens</h2>
      <div
        ref={scrollContainerRef}
        className="flex gap-10 overflow-x-auto whitespace-nowrap scrollbar-hide" // Add 'scrollbar-hide' class
        style={{ scrollBehavior: "smooth" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {kitchens.map((kitchen) => (
          <div
            key={kitchen._id}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleKitchenClick(kitchen.name)}
          >
            <div
              className={`w-32 h-32 rounded-full bg-cover bg-center mb-3 ${
                selectedKitchen === kitchen.name
                  ? "border-3 border-black"
                  : "border border-gray-300"
              }`}
              style={{ backgroundImage: `url(${globalBackendRoute}/${kitchen.image})` }}
            ></div>
            <p className="text-base font-medium text-[#1f1f1f]">{kitchen.name}</p>
          </div>
        ))}
      </div>

      {/* Display Foods */}
      {selectedKitchen && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Foods from {selectedKitchen}
          </h3>
          <FoodDisplay category={selectedKitchen} filterType="kitchen" />
        </div>
      )}
    </div>
  );
};

export default KitchenExplore;
