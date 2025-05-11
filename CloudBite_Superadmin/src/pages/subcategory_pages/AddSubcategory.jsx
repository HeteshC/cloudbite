import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import globalBackendRoute from "../../config/Config";
import ModernTextInput from "../../components/common_components/MordernTextInput";
import ModernFileInput from "../../components/common_components/ModernFileInput";

export default function AddSubCategory() {
  const [subcategoryName, setSubcategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryImage, setSubcategoryImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${globalBackendRoute}/api/all-categories`);
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subcategoryName || !selectedCategory || !subcategoryImage) {
      setMessage("Please fill in all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("subcategory_name", subcategoryName);
    formData.append("category", selectedCategory);
    formData.append("image", subcategoryImage);

    try {
      await axios.post(`${globalBackendRoute}/api/add-sub-category`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Subcategory added successfully!");
      alert("Subcategory added.");
      setSubcategoryName("");
      setSelectedCategory("");
      setSubcategoryImage(null);
      navigate("/all-sub-categories");
    } catch (error) {
      console.error("Error adding subcategory:", error);
      setMessage("Failed to add subcategory. Try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center sm:text-left">
        Add Subcategory
      </h2>

      {message && (
        <p className="text-center text-sm text-red-500 mb-4">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        {/* Subcategory Name */}
        <ModernTextInput
          label="Subcategory Name"
          value={subcategoryName}
          onChange={(e) => setSubcategoryName(e.target.value)}
          placeholder="Enter subcategory name"
        />

        {/* Select Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Main Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subcategory Image
          </label>
          <ModernFileInput onFileSelect={(file) => setSubcategoryImage(file)} />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition duration-300"
          >
            Add Subcategory
          </button>
        </div>
      </form>
    </div>
  );
}
