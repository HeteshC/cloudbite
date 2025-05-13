import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import globalBackendRoute from "../../config/config";
import FoodDisplay from "../FoodDisplay/FoodDisplay"; // Import FoodDisplay component

const SubCategoryExplore = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null); // State to track selected subcategory
  const scrollContainerRef = useRef(null); // Ref for the scrollable container
  const isDragging = useRef(false); // Track drag state
  const startX = useRef(0); // Track initial X position
  const scrollLeft = useRef(0); // Track initial scroll position

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const categoryResponse = await axios.get(`${globalBackendRoute}/api/all-categories`);
        const vegCategory = categoryResponse.data.find(
          (category) => category.category_name === "VEG"
        );


        if (vegCategory) {
          const subcategoryResponse = await axios.get(`${globalBackendRoute}/api/all-subcategories`);

          const vegSubcategories = subcategoryResponse.data.filter(
            (subcategory) => String(subcategory.category._id) === String(vegCategory._id) // Compare category._id
          );


          setSubcategories(vegSubcategories);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error.message);
      }
    };

    fetchSubcategories();
  }, []);

  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId); // Set the clicked subcategory as selected
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
      <h2 className="text-4xl font-semibold text-[#450c0c] mb-10">Explore Our Categories</h2>
      <div
        ref={scrollContainerRef}
        className="flex gap-10 overflow-x-auto whitespace-nowrap scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {subcategories.map((subcategory) => (
          <div
            key={subcategory._id}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleSubcategoryClick(subcategory._id)} // Pass subcategory ID to FoodDisplay
          >
            <div
              className={`w-32 h-32 rounded-full bg-cover bg-center mb-3 ${
                selectedSubcategory === subcategory._id
                  ? "border-3 border-black"
                  : "border border-gray-300"
              }`}
              style={{ backgroundImage: `url(${globalBackendRoute}/${subcategory.image})` }}
            ></div>
            <p className="text-base font-medium text-[#1f1f1f]">{subcategory.subcategory_name}</p>
          </div>
        ))}
      </div>

      {/* Display Foods */}
      {selectedSubcategory && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Foods from Selected Subcategory
          </h3>
          <FoodDisplay category={selectedSubcategory} filterType="subcategory" /> {/* Pass filterType="subcategory" */}
        </div>
      )}
    </div>
  );
};

export default SubCategoryExplore;
