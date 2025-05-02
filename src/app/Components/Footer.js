import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa'; // Use react-icons for social icons

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-logo">
          <h2>Wish Consult Ltd</h2>
          <p>Your gateway to endless learning.</p>
          <br />
        </div>
        
        
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Courses</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#" className="social-icon">
              <FaFacebookF className="icon" />
            </a>
            <a href="#" className="social-icon">
              <FaTwitter className="icon" />
            </a>
            <a href="#" className="social-icon">
              <FaLinkedinIn className="icon" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 SmartLearn. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
