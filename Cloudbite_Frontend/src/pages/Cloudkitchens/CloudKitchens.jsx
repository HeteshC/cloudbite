import React, { useState } from 'react';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import ExploreKitchens from '../../components/ExploreKitchens/ExploreKitchens';

const CloudKitchens = () => {
    const [category, setCategory] = useState("All");  
    const [showFood, setShowFood] = useState(false);  // New state to control FoodDisplay visibility

    // Function to handle category selection and show FoodDisplay
    const handleCategorySelect = (selectedCategory) => {
        setCategory((prev) => prev === selectedCategory ? "All" : selectedCategory);
        setShowFood(true); // Show FoodDisplay when a category is clicked
    };

    return (
        <div>
            <ExploreKitchens 
                category={category} 
                setCategory={handleCategorySelect}  // Pass modified function here
            /> 
            {showFood && <FoodDisplay category={category} />}  {/* Show FoodDisplay only when needed */}
        </div>
    );
};

export default CloudKitchens;
