import React from "react";

const Footer = () => {
  return (
    <div> 
    <div className="flex p-5 justify-evenly bg-gray-700">
      <ul className="nav flex-column text-center">
  <li className="nav-item">
    <a className="nav-link text-light font-bold" href="#">Web Links</a>
  </li>
  <li className="nav-item">
    <a className="nav-link text-light" href="/">Home</a>
  </li>
  <li className="nav-item">
    <a className="nav-link text-light" href="/contact-us">Contact</a>
  </li>
  <li className="nav-item">
    <a className="nav-link text-light" href="/about-us">About Us</a>
  </li>

</ul>

<ul className="nav flex-column text-center">
  <li className="nav-item">
    <a className="nav-link text-light font-bold" href="#">Social Links</a>
  </li>
  <li className="nav-item">
    <a className="nav-link text-light" href="https://facebook.com" target="_blank">Facebook</a>
  </li>
  <li className="nav-item">
  <a className="nav-link text-light" href="https://twitter.com" target="_blank">Twitter</a>
  </li>
  <li className="nav-item">
  <a className="nav-link text-light" href="https://linkedin.com" target="_blank">LinkedIn</a>
  </li>
</ul>

<ul className="nav flex-column text-center">
  <li className="nav-item">
  <a className="nav-link text-light font-bold" href="#">Address</a>
  </li>
  <li className="nav-item">
    <a className="nav-link text-light" href="#">ECODERS - #198</a>
  </li>
  <li className="nav-item">
    <a className="nav-link text-light" href="#">Hesaraghatta Road, Bagalgunte</a>
  </li>
  <li className="nav-item">
    <a className="nav-link text-light disabled" aria-disabled="true">Bangalore</a>
  </li>
</ul>
    </div>

    <p className="bg-gray-900 text-light p-3 text-center">copyright &copy; &rarr; ecoders Bangalore</p>

    </div>
  );
};

export default Footer;
