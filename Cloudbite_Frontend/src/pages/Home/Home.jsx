import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreKitchens from '../../components/ExploreKitchens/ExploreKitchens'

const Home = () => {

    const[category,setCategory] = useState("All");  

  return (
    <div>
      <Header/>
      <ExploreKitchens category={category} setCategory={setCategory}/> 
    </div>
  )
}

export default Home
