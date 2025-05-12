import React, { useEffect, useState } from "react";
import axios from "axios";
import globalBackendRoute from "../../config/config";
import FoodDisplay from "../FoodDisplay/FoodDisplay"; // Import FoodDisplay component
import "./ExploreKitchens.css";

const ExploreKitchens = ({ category, setCategory }) => {
  const [kitchens, setKitchens] = useState([]);
  const [selectedKitchenId, setSelectedKitchenId] = useState(null); // Track selected kitchen ID

  useEffect(() => {
    const fetchKitchens = async () => {
      try {
        const res = await axios.get(`${globalBackendRoute}/api/all-kitchens`);
        setKitchens(res.data);
      } catch (error) {
        console.error("Failed to fetch kitchens:", error);
      }
    };

    fetchKitchens();
  }, []);

  const getImageUrl = (img) => {
    if (img) {
      const normalized = img.replace(/\\/g, "/").split("/").pop();
      return `${globalBackendRoute}/uploads/kitchens/${normalized}`;
    }
    return "https://via.placeholder.com/150";
  };

  const handleImageError = (e) => {
    if (!e.target.dataset.fallback) {
      e.target.src = "https://via.placeholder.com/150";
      e.target.dataset.fallback = "true";
    }
  };

  const handleKitchenClick = (kitchen) => {
    setCategory(kitchen.name);
    setSelectedKitchenId(kitchen._id); // Update selected kitchen ID
  };

  return (
    <div className="explore-kitchens fs-6 my-4" id="explore-kitchens">
      <h1 className="fs-1">Explore Our Kitchens</h1>
      <div className="explore-kitchen-list">
        {kitchens.map((kitchen) => (
          <div
            onClick={() => handleKitchenClick(kitchen)}
            key={kitchen._id}
            className="explore-kitchen-list-item"
          >
            <img
              className={category === kitchen.name ? "active" : ""}
              src={getImageUrl(kitchen.image)}
              alt={kitchen.name}
              onError={handleImageError}
              style={{ aspectRatio: "16/9", objectFit: "cover" }}
            />
            <p>{kitchen.name}</p>
          </div>
        ))}
      </div>
      <div className="explore-food-list">
        <h2 className="fs-2">Foods {category ? `in ${category}` : "Available"}</h2>
        {/* Use FoodDisplay component to show food items */}
        <FoodDisplay category={selectedKitchenId || "All"} />
      </div>
    </div>
  );
};

export default ExploreKitchens;
