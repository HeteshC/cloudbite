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
                <li><a href="/">Home</a></li>
                <li><a href="/about-us">About Us</a></li>
                <li><a href="/contact-us">Contact Us</a></li>
                <li><a href="/privacy-policy">Privacy Policy</a></li>
            </ul>
        </div>
        <div className="footer-content-center">
            <h2>MY ACCOUNT</h2>
            <ul>
                <li><a href="/my-account">My Account</a></li>
                <li><a href="/orders">My Orders</a></li>
                <li><a href="/cart">My Cart</a></li>
                <li><a href="/my-wishlist">My Wishlist</a></li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li><a href="tel:+15347489488">+1-534-748-9488</a></li>
                <li><a href="mailto:contact@cloudbite.com">contact@cloudbite.com</a></li>
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
