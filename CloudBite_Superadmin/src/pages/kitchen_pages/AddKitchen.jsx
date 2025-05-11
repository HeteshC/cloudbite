import globalBackendRoute from "../../config/config";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModernTextInput from "../../components/common_components/MordernTextInput";

export default function AddKitchen() {
  const navigate = useNavigate();
  const [kitchenData, setKitchenData] = useState({
    name: "",
    location: "",
    contact_number: "",
    email: "",
    status: "active",
    operating_hours: "",
    tags: "",
    createdBy: "64a7f8e2b4d6c8f9e8a12345", // Replace with the logged-in admin's ID
  });
  const [kitchenImage, setKitchenImage] = useState(null);
  const [relatedKitchens, setRelatedKitchens] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRelatedKitchens = async () => {
      try {
        const res = await axios.get(`${globalBackendRoute}/api/all-kitchens`);
        setRelatedKitchens(res.data);
      } catch (error) {
        console.error("Failed to fetch related kitchens:", error);
      }
    };
    fetchRelatedKitchens();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKitchenData({ ...kitchenData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!kitchenData.name.trim()) {
      setMessage("Kitchen name is required.");
      return;
    }

    if (!kitchenData.contact_number.trim()) {
      setMessage("Contact number is required.");
      return;
    }

    if (!kitchenData.location.trim()) {
      setMessage("Location is required.");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(kitchenData).forEach(([key, val]) => {
        formData.append(key, val);
      });

      if (kitchenImage) formData.append("image", kitchenImage);

      const res = await axios.post(
        `${globalBackendRoute}/api/add-kitchen`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 201) {
        alert("Kitchen added successfully!");
        navigate("/all-kitchens");
      } else {
        throw new Error("Kitchen not created");
      }
    } catch (error) {
      console.error("Error adding kitchen:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to add kitchen. Try again.";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6">Add New Kitchen</h2>
      {message && <p className="text-red-500 text-center">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <ModernTextInput
          label="Kitchen Name *"
          name="name"
          placeholder="Enter kitchen name"
          value={kitchenData.name}
          onChange={handleChange}
        />
        <ModernTextInput
          label="Location *"
          name="location"
          placeholder="Enter kitchen location"
          value={kitchenData.location}
          onChange={handleChange}
        />
        <ModernTextInput
          label="Contact Number *"
          name="contact_number"
          placeholder="Enter contact number"
          value={kitchenData.contact_number}
          onChange={handleChange}
        />
        <ModernTextInput
          label="Email"
          name="email"
          placeholder="Enter email (optional)"
          value={kitchenData.email}
          onChange={handleChange}
        />
        <ModernTextInput
          label="Operating Hours *"
          name="operating_hours"
          placeholder="e.g., 9:00 AM - 9:00 PM"
          value={kitchenData.operating_hours}
          onChange={handleChange}
        />
        <ModernTextInput
          label="Tags (comma separated)"
          name="tags"
          placeholder="e.g., vegan, fast food, delivery"
          value={kitchenData.tags}
          onChange={handleChange}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kitchen Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setKitchenImage(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Related Kitchens
          </label>
          <select
            name="related_kitchens"
            multiple
            value={kitchenData.related_kitchens || []}
            onChange={(e) =>
              setKitchenData({
                ...kitchenData,
                related_kitchens: Array.from(e.target.selectedOptions, (opt) =>
                  opt.value
                ),
              })
            }
            className="w-full border rounded px-3 py-2"
          >
            {relatedKitchens.map((kitchen) => (
              <option key={kitchen._id} value={kitchen._id}>
                {kitchen.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:opacity-90"
        >
          Add Kitchen
        </button>
      </form>
    </div>
  );
}
