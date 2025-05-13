import React, { useState } from 'react'
import "../../styles/Home.css"
import Header from '../../components/Header/Header'
import ExploreKitchens from '../../components/homepage_components/ExploreKitchens'
import ExploreCategory from '../../components/homepage_components/ExploreCaterory'
import BestSellingProducts from '../../components/homepage_components/BestSellingProducts'
import FeaturedProducts from '../../components/homepage_components/FeaturedProduct'
import Offer from "../../assets/images/offer.jpeg"
import MostPopular from '../../components/homepage_components/MostPopular'
import JustArrived from '../../components/homepage_components/JustArrived'
import Blog from '../../components/homepage_components/Blog'

const Home = () => {

  const [category, setCategory] = useState("All");

  return (
    <div>
      <Header />
      <ExploreKitchens />
      <div className="container">
        <BestSellingProducts />
        <FeaturedProducts />
      </div>


      <div className=" ml-24 my-5">
        <img src={Offer} alt="Offer Image" />
      </div>

      <ExploreCategory />


      <div className="container">
        <MostPopular />
        <JustArrived />
        <Blog />
      </div>
    </div>
  )
}

export default Home
