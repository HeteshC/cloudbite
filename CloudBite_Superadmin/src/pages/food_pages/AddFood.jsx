import React, { useState, useEffect } from "react";
import "../../styles/Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

const AddFood = () => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    stock: "", // Add stock field
    sku: "", // Add SKU field
    kitchen: "RebelFoods", // Ensure kitchen field remains
  });
  const [categories, setCategories] = useState([]);
  const [subcategoriesAll, setSubcategoriesAll] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          axios.get(`${backendGlobalRoute}/api/all-categories`),
          axios.get(`${backendGlobalRoute}/api/all-subcategories`),
        ]);
        setCategories(catRes.data);
        setSubcategoriesAll(subRes.data);
      } catch (error) {
        console.error("Failed to fetch categories or subcategories:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.category) {
      const filtered = subcategoriesAll.filter(
        (sub) =>
          String(sub.category?._id || sub.category) === String(data.category)
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [data.category, subcategoriesAll]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("subcategory", data.subcategory);
      formData.append("stock", Number(data.stock)); // Include stock field
      formData.append("sku", data.sku); // Include SKU field
      formData.append("kitchen", data.kitchen); // Include kitchen field
      formData.append("image", image);

      const response = await axios.post(`${backendGlobalRoute}/api/add-food`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.message === "Food item added successfully!") {
        alert("Food item added!");
        setData({
          name: "",
          description: "",
          price: "",
          category: "",
          subcategory: "",
          stock: "", // Reset stock field
          sku: "", // Reset SKU field
          kitchen: "RebelFoods", // Reset kitchen field
        });
        setImage(null);
      } else {
        alert("Failed to add food item.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="add-food-container">
      <h1 className="add-food-title">Add Food Item</h1>
      <form className="add-food-form" onSubmit={onSubmitHandler}>
        <div className="form-group">
          <label htmlFor="image" className="form-label">Upload Image</label>
          <div className="image-upload">
            <label htmlFor="image" className="image-label">
              <img
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                className="image-preview"
                alt="Upload"
              />
            </label>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name" className="form-label">Product Name</label>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            id="name"
            className="form-input"
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Product Description</label>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            id="description"
            className="form-textarea"
            rows="6"
            placeholder="Enter product description"
            required
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              onChange={onChangeHandler}
              name="category"
              id="category"
              value={data.category}
              className="form-select"
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subcategory" className="form-label">Subcategory</label>
            <select
              onChange={onChangeHandler}
              name="subcategory"
              id="subcategory"
              value={data.subcategory}
              className="form-select"
            >
              <option value="">-- Select Subcategory --</option>
              {filteredSubcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.subcategory_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="stock" className="form-label">Stock</label>
          <input
            onChange={onChangeHandler}
            value={data.stock}
            type="number"
            name="stock"
            id="stock"
            className="form-input"
            placeholder="Enter stock quantity"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="sku" className="form-label">SKU</label>
          <input
            onChange={onChangeHandler}
            value={data.sku}
            type="text"
            name="sku"
            id="sku"
            className="form-input"
            placeholder="Enter SKU (unique)"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="kitchen" className="form-label">Kitchen</label>
          <select
            onChange={onChangeHandler}
            name="kitchen"
            id="kitchen"
            value={data.kitchen}
            className="form-select"
            required
          >
            <option value="RebelFoods">RebelFoods</option>
            <option value="FreshMenu">FreshMenu</option>
            <option value="EatFit">EatFit</option>
            <option value="Box8">Box8</option>
            <option value="SLAYCoffee">SLAYCoffee</option>
            <option value="SweetTruth">SweetTruth</option>
            <option value="BohriKitchen">BohriKitchen</option>
            <option value="HOIFoods">HOIFoods</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price" className="form-label">Product Price</label>
          <input
            onChange={onChangeHandler}
            value={data.price}
            type="number"
            name="price"
            id="price"
            className="form-input"
            placeholder="Enter price (₹)"
            required
          />
        </div>

        <button type="submit" className="form-submit-btn">Add Food</button>
      </form>
    </div>
  );
};

export default AddFood;
