import React from 'react'
import './ExploreKitchens.css'
import { kitchen_list } from '../../assets/assets'

const ExploreKitchens = ({category,setCategory}) => {

  return (
    <div className='explore-kitchens fs-6 my-4' id='explore-kitchens'>
      <h1 className='fs-1'>Explore Our Kitchens</h1>
      <p className='explore-kitchen-text'>Step into a vibrant kitchen filled with a delightful selection of flavors. Our mission is to indulge your 
      taste buds and enhance your culinary journey, one exceptional dish at a time.</p>      
      <div className="explore-kitchen-list">
        {kitchen_list.map((item,index)=>{
            return(
                <div onClick={()=>setCategory(prev=>prev===item.kitchen_name?"All":item.kitchen_name)} key={index} className="explore-kitchen-list-item">
                    <img className={category===item.kitchen_name?"active":""} src={item.kitchen_image} alt="" />
                    <p>{item.kitchen_name}</p>
                </div>
            )
        })}
      </div>
      <hr />
    </div>
  )
}  

export default ExploreKitchens