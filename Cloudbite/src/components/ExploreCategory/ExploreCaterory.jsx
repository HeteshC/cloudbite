import React, { useState, useEffect } from 'react';
import './ExploreCategory.css';
import axios from 'axios';
import globalBackendRoute from '../../config/config';

const ExploreCategory = ({ category, setCategory }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [vegSubcategories, setVegSubcategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, subcategoriesRes] = await Promise.all([
          axios.get(`${globalBackendRoute}/api/all-categories`),
          axios.get(`${globalBackendRoute}/api/all-subcategories`),
        ]);

        // Find the "Veg" category ID
        const vegCategory = categoriesRes.data.find(
          (cat) => cat.category_name.toLowerCase() === "veg"
        );

        if (vegCategory) {
          const vegSubcategories = subcategoriesRes.data.filter(
            (sub) => String(sub.category?._id || sub.category) === String(vegCategory._id)
          );
          setVegSubcategories(vegSubcategories);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='explore-category fs-6 my-4' id='explore-category'>
      <h2 className='fs-1'>Inspiration for your first order</h2>
      {/* <p className='explore-kitchen-text'>
        Step into a vibrant kitchen filled with a delightful selection of flavors. 
        Our mission is to indulge your taste buds and enhance your culinary journey, one exceptional dish at a time.
      </p> */}
      <div className="explore-category-list">
        {vegSubcategories.map((sub) => (
          <div
            onClick={() => setCategory(sub.subcategory_name)}
            key={sub._id}
            className="explore-category-list-item"
          >
            <img
              className={category === sub.subcategory_name ? "active" : ""}
              src={`${globalBackendRoute}/${sub.image}`}
              alt={sub.subcategory_name}
            />
            <p>{sub.subcategory_name}</p>
          </div>
        ))}
      </div>
      {/* <hr /> */}
    </div>
  );
};

export default ExploreCategory;
