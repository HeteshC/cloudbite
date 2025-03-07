import React from 'react'
import './Footer.css' 
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" className='logo'/>
            
        </div>
        <div className="footer-content-left2">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        <div className="footer-content-center">
            <h2>MY ACCOUNT</h2>
            <ul>
                <li>My Account</li>
                <li>My Orders</li>
                <li>My Cart</li>
                <li>My Wishlist</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+1-534-748-9488</li>
                <li>contact@cloudbite.com</li>
            </ul>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
       </div>
       <hr />
       <p className="footer-copyright">Copyright 2025 © Cloudbite.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
