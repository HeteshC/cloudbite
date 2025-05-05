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
            <h2>PAGES</h2>
            <ul>
            <li className="nav-item">
            <a className="nav-link text-light" href="/homepage">
              Home
            </a>
            </li>
            <li className="nav-item">
            <a className="nav-link text-light" href="/add">
            Add Items
            </a>
            </li>
            <li className="nav-item">
            <a className="nav-link text-light" href="/list">
            List Items
            </a>
            </li>
            <li className="nav-item">
            <a className="nav-link text-light" href="/orders">
            Orders
            </a>
            </li>
            </ul>
        </div>
        <div className="footer-content-center">
            <h2>ACCOUNTS</h2>
            <ul>
                <li>Super Admin</li>
                <li>Admin</li>
                <li>Employee</li>
                <li>Delivery Partner</li>
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
