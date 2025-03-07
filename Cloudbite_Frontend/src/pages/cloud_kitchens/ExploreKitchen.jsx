import React, { useState } from 'react'

import ExploreKitchens from '../../components/ExploreKitchens/ExploreKitchens'

const ExploreKitchen = () => {

    const[category,setCategory] = useState("All");  

  return (
    <div>
      <ExploreKitchens category={category} setCategory={setCategory}/> 
    </div>
  )
}

export default ExploreKitchen
