import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import CloudKitchens from './pages/Cloudkitchens/CloudKitchens'
import Menu from './pages/Menu/Menu'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import Login from './pages/user_pages/Login'
import Register from './pages/user_pages/Register'
import ContactUs from "./pages/ContactUs/ContactUs"
import ExploreKitchen from './pages/Cloudkitchens/CloudKitchens'
// import { Menu } from '@headlessui/react'

const App = () => {

  const [showLogin,setShowLogin] = useState(false)

  return (
    <>
    {showLogin?<Login/>:<></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/cloud-kitchens' element={<CloudKitchens/>} />
          <Route path='/explore-kitchen' element={<ExploreKitchen/>} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Routes>
      </div>
      <Footer />
    </>

  )
}

export default App
