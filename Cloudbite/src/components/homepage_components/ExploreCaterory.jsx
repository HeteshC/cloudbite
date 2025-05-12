import React, { useState, useEffect } from "react";
import axios from "axios";
import globalBackendRoute from "../../config/config";
import FoodDisplay from "../FoodDisplay/FoodDisplay"; // Import FoodDisplay component

const SubCategoryExplore = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null); // State to track selected subcategory

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(`${globalBackendRoute}/api/all-subcategories`);
        setSubcategories(response.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error.message);
      }
    };

    fetchSubcategories();
  }, []);

  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId); // Set the clicked subcategory as selected
  };

  return (
    <div className="bg-[#f9f6f6] py-10 px-5">
      <h2 className="text-4xl font-semibold text-[#450c0c] mb-10">Explore Our Categories</h2>
      <div className="flex justify-start gap-20 flex-wrap">
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
