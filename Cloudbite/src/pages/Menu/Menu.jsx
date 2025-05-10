import React, { useState } from 'react';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';

const Menu = () => {
  const [category, setCategory] = useState("All"); // Default to 'All' items

  return (
    <div>
      <FoodDisplay category={category} />
    </div>
  );
};

export default Menu;
