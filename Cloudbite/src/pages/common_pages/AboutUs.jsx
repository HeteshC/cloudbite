import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import RebelFoods from "../../assets/kitchen_1.png";
import FreshMenu from "../../assets/kitchen_2.png";
import EatFit from "../../assets/kitchen_3.png";
import Box8 from "../../assets/kitchen_4.png";
import SLAYCoffee from "../../assets/kitchen_5.png";
import SweetTruth from "../../assets/kitchen_6.png";
import BohriKitchen from "../../assets/kitchen_7.png";
import HOIFoods from "../../assets/kitchen_8.png";

const kitchen_list = [
  {
    kitchen_name: "RebelFoods",
    kitchen_image: RebelFoods,
  },
  {
    kitchen_name: "FreshMenu",
    kitchen_image: FreshMenu,
  },
  {
    kitchen_name: "EatFit",
    kitchen_image: EatFit,
  },
  {
    kitchen_name: "Box8",
    kitchen_image: Box8,
  },
  {
    kitchen_name: "SLAYCoffee",
    kitchen_image: SLAYCoffee,
  },
  {
    kitchen_name: "SweetTruth",
    kitchen_image: SweetTruth,
  },
  {
    kitchen_name: "BohriKitchen",
    kitchen_image: BohriKitchen,
  },
  {
    kitchen_name: "HOIFoods",
    kitchen_image: HOIFoods,
  },
];

const AboutUs = () => {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div className="px-6 py-10 bg-gray-50 min-h-screen text-gray-800">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">About CloudBite</h1>
        <p className="text-lg text-center mb-10 max-w-3xl mx-auto">
          At CloudBite, we collaborate with India's top cloud kitchens to bring fresh, high-quality, and hygienic food directly to your doorstep. Our mission is to provide a wide range of cuisines while maintaining exceptional standards in taste, safety, and service.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Our Kitchens</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {kitchen_list.map((kitchen, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-4 text-center hover:shadow-xl transition" // Card remains box-shaped
            >
              <div className="h-40 w-40 bg-gray-200 rounded-full mb-3 flex items-center justify-center mx-auto"> {/* Image container is circular */}
                <img
                  src={kitchen.kitchen_image}
                  alt={kitchen.kitchen_name}
                  className="h-full w-full object-cover rounded-full" // Image is circular
                />
              </div>
              <h3 className="text-lg font-medium">{kitchen.kitchen_name}</h3>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mb-4">Quality & Maintenance</h2>
        <ul className="list-disc pl-5 space-y-3 text-lg">
          <li>
            <strong>Fresh Ingredients:</strong> All meals are prepared using high-quality, fresh ingredients sourced from trusted suppliers.
          </li>
          <li>
            <strong>Hygiene First:</strong> All our kitchens follow strict cleanliness and food safety protocols, ensuring a safe cooking environment.
          </li>
          <li>
            <strong>Temperature Control:</strong> Proper storage and cooking temperatures are maintained to preserve food quality and safety.
          </li>
          <li>
            <strong>Regular Maintenance:</strong> Our kitchen equipment is regularly cleaned and serviced to guarantee efficiency and hygiene.
          </li>
        </ul>

        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-2">Join the CloudBite Family</h3>
          <p className="text-gray-700 mb-4">
            Explore a variety of flavors and trust us to deliver food that is safe, tasty, and prepared with love.
          </p>
          <button
            className="bg-blue-600   text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            onClick={() => navigate("/")} // Navigate to home page
          >
            Explore Our Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
