import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/config";

const SingleFoodPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await axios.get(`${globalBackendRoute}/api/get-food-by-id/${id}`);
        setFood(response.data);
      } catch (error) {
        console.error("Error fetching food details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!food) {
    return <p>Food item not found.</p>;
  }

  return (
    <div className="single-food-page">
      <h1 className="text-3xl font-bold">{food.product_name}</h1>
      <img
        src={`${globalBackendRoute}/${food.product_image}`}
        alt={food.product_name}
        className="w-full max-w-md mx-auto"
      />
      <p className="text-gray-700">{food.description}</p>
      <p className="text-lg font-semibold">Price: ₹{food.selling_price}</p>
    </div>
  );
};

export default SingleFoodPage;
