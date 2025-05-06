import React, { useContext } from "react";
import { StoreContext } from "../Context/StoreContext";

const FoodList = () => {
    const { foodList } = useContext(StoreContext);

    return (
        <div>
            <h1>Food List</h1>
            {foodList.length > 0 ? (
                <ul>
                    {foodList.map((food) => (
                        <li key={food.id}>
                            {food.name} - ${food.price}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading food items...</p>
            )}
        </div>
    );
};

export default FoodList;
