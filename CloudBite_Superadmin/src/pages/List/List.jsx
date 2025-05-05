import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from "react-toastify";
import backendGlobalRoute from "../../config/config";

const List = () => {
  const [list, setList] = useState([]);

  // Fetch food items
  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendGlobalRoute}/api/food/list`);
      if (response.data && response.data.data) {
        setList(response.data.data);
        toast.success(response.data.message || "Items fetched");
      } else {
        toast.error("Failed to fetch data properly");
      }
    } catch (error) {
      console.error("API Error:", error); 
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Delete function
  const removeFood = async (id) => {
    try {
      const response = await axios.delete(`${backendGlobalRoute}/api/food/remove/${id}`);
      toast.success(response.data.message || "Deleted");
  
      // Refresh the list
      fetchList();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <img
              src={`${backendGlobalRoute}/uploads/${item.image}`}
              alt={item.name}
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{item.price}</p>
            <p onClick={() => removeFood(item._id)} style={{ color: 'red', cursor: 'pointer' }}>X</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
