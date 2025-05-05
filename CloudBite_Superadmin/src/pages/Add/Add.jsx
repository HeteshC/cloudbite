import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import backendGlobalRoute from "../../config/config";

const Add = () => {
    const [image, setImage] = useState(null);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "RebelFoods"
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", Number(data.price));
            formData.append("category", data.category);
            formData.append("image", image);  // 'image' should match Multer field name

            const response = await axios.post(`${backendGlobalRoute}/api/food/add`, formData);

            if (response.data.message === "Food item added successfully!") {
                alert("Food item added!");
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "RebelFoods"
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
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img
                            src={image ? URL.createObjectURL(image) : assets.upload_area}
                            className="img-thumbnail"
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

                <div className="add-product-name flex-col">
                    <p>Product Name</p>
                    <input
                        onChange={onChangeHandler}
                        value={data.name}
                        type="text"
                        name="name"
                        placeholder="Type here"
                        required
                    />
                </div>

                <div className="add-product-description flex-col">
                    <p>Product description</p>
                    <textarea
                        onChange={onChangeHandler}
                        value={data.description}
                        name="description"
                        rows="6"
                        placeholder="Write content here"
                        required
                    ></textarea>
                </div>

                <div className="add-caterory-price">
                    <div className="add-Kitchens flex-col">
                        <p>Kitchens</p>
                        <select onChange={onChangeHandler} name="category" value={data.category}>
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

                    <div className="add-price flex-col">
                        <p>Product Price</p>
                        <input
                            onChange={onChangeHandler}
                            value={data.price}
                            type="number"
                            name="price"
                            placeholder="₹"
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="add-btn">ADD</button>
            </form>
        </div>
    );
};

export default Add;
