import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/cloud-kitchens');  // Corrected route path
  };

  return (
    <div className='header' id="header">
      <div className="header-contents">
        <h2>From Our Kitchen to Your Doorstep</h2>
        <p>
          Explore a variety of mouthwatering dishes prepared in top-tier cloud kitchens,
          ensuring fresh, flavorful, and hygienic meals delivered right to your doorstep.
        </p>
        <button onClick={handleExploreClick}>Explore Kitchens</button>
      </div>
    </div>
  );
};

export default Header;
