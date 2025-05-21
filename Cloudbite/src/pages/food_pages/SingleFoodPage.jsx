import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import globalBackendRoute from "../../config/config";
import { Heart, Minus, Plus, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { CartContext } from "../../components/cart_components/CartContext"; // Import CartContext

const SingleFoodPage = () => {
  // Accept both slug and id from the URL
  const { id } = useParams(); // id can be slug or ObjectId
  const navigate = useNavigate();
  const { addToCart, removeFromCart, cartItems } = useContext(CartContext); // Use CartContext
  const [food, setFood] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]); // State for related foods
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [startIndex, setStartIndex] = useState(0); // State for sliding logic
  const VISIBLE_COUNT = 4; // Number of visible items

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        let response;
        // Try fetching by slug first, fallback to id if not found
        try {
          response = await axios.get(`${globalBackendRoute}/api/get-food-by-slug/${id}`);
        } catch (err) {
          // If not found by slug, try by id
          response = await axios.get(`${globalBackendRoute}/api/get-food-by-id/${id}`);
        }
        setFood(response.data);

        // Fetch related foods
        const relatedResponse = await axios.get(
          `${globalBackendRoute}/api/all-foods?category=${response.data.category?._id}`
        );
        setRelatedFoods(relatedResponse.data);
      } catch (error) {
        console.error("Error fetching food details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id]);

  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === "inc") return prev + 1;
      if (type === "dec") return prev > 1 ? prev - 1 : 1;
      return prev;
    });
  };

  const handleAddToCart = () => {
    addToCart(food, quantity); // Add the specified quantity to the cart
  };

  const handleNext = () => {
    if (startIndex + VISIBLE_COUNT < relatedFoods.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const visibleFoods = relatedFoods.slice(startIndex, startIndex + VISIBLE_COUNT);

  const getCartQuantity = (id) => {
    const item = cartItems.find((item) => item._id === id);
    return item ? item.quantity : 0;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!food) {
    return <p>Food item not found.</p>;
  }

  return (
    <div className="">
      <div className="flex flex-col lg:flex-row px-10 py-10 max-w-screen-xl mx-auto gap-10">
        {/* Left: Food Image */}
        <div className="relative flex-1 flex justify-center items-center bg-white">
          <img
            src={`${globalBackendRoute}/${food.product_image}`}
            alt={food.product_name}
            className="object-cover w-full h-full"
          />
          <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-gray-100">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Right: Food Info */}
        <div className="flex-1 space-y-6">
          <div>
            <p className="text-sm text-gray-400 uppercase">
              {food.kitchen?.name || "Kitchen"}
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">{food.product_name}</h2>
            <p className="text-xl text-gray-500 mt-1">
              {food.category?.category_name || "Category not available"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
            ))}
            <a href="#" className="text-sm text-gray-500 underline ml-2">
              {food.total_reviews || 0} Reviews
            </a>
          </div>

          <div className="flex items-center gap-10">
            <div className="text-3xl font-semibold text-orange-600">₹{food.selling_price}</div>
            <div className="text-3xl font-semibold text-gray-700 line-through">₹{food.display_price}</div>
            <div className="flex items-center gap-2 border rounded-full px-4 py-1">
              <button onClick={() => handleQuantityChange("dec")}>
                <Minus className="w-4 h-4 text-gray-700" />
              </button>
              <span className="mx-2">{quantity}</span>
              <button onClick={() => handleQuantityChange("inc")}>
                <Plus className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Description Tabs */}
          <div className="flex gap-6 border-b text-sm font-medium text-gray-500 mt-4">
            <button
              className={`pb-2 ${activeTab === "description" ? "border-b-2 border-gray-900 text-gray-900" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`pb-2 ${activeTab === "details" ? "border-b-2 border-gray-900 text-gray-900" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
          </div>

          {activeTab === "description" && (
            <div className="text-sm text-gray-600 leading-relaxed break-words w-auto max-w-xl">
              <p>{food.description}</p>
            </div>
          )}
          {activeTab === "details" && (
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>Stock: {food.stock}</p>
              <p>SKU: {food.sku}</p>
              <p>Delivery Time Estimate: {food.delivery_time_estimate || "N/A"}</p>
              <p>Replacement Policy: {food.replacement_policy || "N/A"}</p>
            </div>
          )}

          {/* Total & CTA */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-400">
              Total Price
              <span className="block text-xl font-semibold text-gray-900">
                ₹{(food.selling_price * quantity).toLocaleString()}
              </span>
            </p>
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-sm font-semibold shadow"
              onClick={handleAddToCart} // Add to cart only when this button is clicked
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="px-10 py-10 max-w-screen-xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Customer Reviews</h3>
        <div className="space-y-6">
          {/* Review 1 */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">John Doe</p>
                  <p className="text-sm text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              The food was absolutely delicious! The flavors were perfectly balanced, and the
              portion size was generous. Highly recommend!
            </p>
          </div>

          {/* Review 2 */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">Jane Smith</p>
                  <p className="text-sm text-gray-500">1 week ago</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                ))}
                <Star className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Great taste, but the delivery was a bit late. Overall, a good experience.
            </p>
          </div>

          {/* Review 3 */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">Alice Johnson</p>
                  <p className="text-sm text-gray-500">3 weeks ago</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                ))}
                {Array.from({ length: 2 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gray-300" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              The food was good, but the portion size could have been larger. Overall, a decent experience.
            </p>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      <div className="px-10 py-10 max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">You May Also Like</h3>
          <div className="flex gap-2 items-center">
            <button
              onClick={handlePrev}
              className={`p-2 rounded-full border border-gray-300 text-gray-600 ${
                startIndex === 0 ? "opacity-0 pointer-events-none" : ""
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className={`p-2 rounded-full border border-gray-300 text-gray-600 ${
                startIndex + VISIBLE_COUNT >= relatedFoods.length
                  ? "opacity-0 pointer-events-none"
                  : ""
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleFoods.map((relatedFood) => (
            <div
              key={relatedFood._id}
              className="bg-white shadow-md rounded-lg flex flex-col h-full cursor-pointer"
              onClick={() => navigate(`/food/${relatedFood.slug}`)} // Navigate using slug
            >
              <img
                src={`${globalBackendRoute}/${relatedFood.product_image}`}
                alt={relatedFood.product_name}
                className="h-40 w-full object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 text-lg">{relatedFood.product_name}</h4>
                <p className="text-sm text-gray-600 truncate">{relatedFood.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-semibold text-gray-900">₹{relatedFood.selling_price}</span>
                  {relatedFood.display_price > relatedFood.selling_price && (
                    <span className="line-through text-gray-500 text-sm">
                      ₹{relatedFood.display_price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore from the Same Category Section */}
      <div className="px-10 py-10 max-w-screen-xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Explore from the Same Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedFoods
            .filter((relatedFood) => relatedFood.category?._id === food.category?._id)
            .map((relatedFood) => (
              <div
                key={relatedFood._id}
                className="bg-white shadow-md rounded-lg flex flex-col h-full cursor-pointer"
                onClick={() => navigate(`/food/${relatedFood.slug}`)} // Navigate using slug
              >
                <img
                  src={`${globalBackendRoute}/${relatedFood.product_image}`}
                  alt={relatedFood.product_name}
                  className="h-40 w-full object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 text-lg">{relatedFood.product_name}</h4>
                  <p className="text-sm text-gray-600 truncate">{relatedFood.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-semibold text-gray-900">₹{relatedFood.selling_price}</span>
                    {relatedFood.display_price > relatedFood.selling_price && (
                      <span className="line-through text-gray-500 text-sm">
                        ₹{relatedFood.display_price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SingleFoodPage;
