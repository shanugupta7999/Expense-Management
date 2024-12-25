import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h6>About Expense Manager</h6>
          <p>
            Expense Manager helps you track and manage your expenses easily. Stay
            organized and in control of your finances.
          </p>
        </div>

        <div className="footer-section links">
          <h6>Quick Links</h6>
          <ul>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section social">
          <h6>Follow Us</h6>
          <div className="social-icons">
            <a href="https://facebook.com"><FaFacebookF /></a>
            <a href="https://twitter.com"><FaTwitter /></a>
            <a href="https://linkedin.com"><FaLinkedinIn /></a>
            <a href="https://github.com"><FaGithub /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Expense Manager. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
