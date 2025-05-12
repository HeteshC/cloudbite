import React from 'react';
import './Footer.css';
import SALogo from "../../assets/SA_LOGO.png";
import FacebookIcon from "../../assets/facebook_icon.png"; // Import Facebook icon
import TwitterIcon from "../../assets/twitter_icon.png";   // Import Twitter icon
import LinkedInIcon from "../../assets/linkedin_icon.png"; // Import LinkedIn icon

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={SALogo} alt="" className='logo'/>
        </div>
        <div className="footer-content-left2">
          <h2>COMPANY</h2>
          <ul>
            <li><a href="/superadmin-dashboard">Home</a></li>
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/contact-us">Contact Us</a></li>
            <li><a href="/superadmin-dashboard">Dashboard</a></li>
          </ul>
        </div>
        <div className="footer-content-center">
          <h2>ADMIN DASHBOARD</h2>
          <ul>
            <li><a href="/add-kitchen"> Add Kitchen</a></li>
            <li><a href="/add-category">Add Category</a></li>
            <li><a href="/add-subcategory">Add Subcategory</a></li>
            <li><a href="/add-food">Add Food</a></li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li><a href="tel:+15347489488">+1-534-748-9488</a></li>
            <li><a href="mailto:contact@cloudbite.com">contact@cloudbite.com</a></li>
          </ul>
          <div className="footer-social-icons">
            <img src={FacebookIcon} alt="Facebook" />
            <img src={TwitterIcon} alt="Twitter" />
            <img src={LinkedInIcon} alt="LinkedIn" />
          </div>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 © Cloudbite.com - All Right Reserved.</p>
    </div>
  );
};

export default Footer;
