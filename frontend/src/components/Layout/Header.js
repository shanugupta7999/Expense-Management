import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import "./Header.css";

const Header = () => {
  const [loginUser, setLoginUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoginUser(user);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    message.success("Logout Successfully");
    navigate("/login");
  };

  return (
    <nav className="header-nav">
      <div className="header-container">
        {/* Brand Name */}
        <div className="header-brand">
          <Link className="header-link" to="/">
            Expense Management
          </Link>
        </div>

        {/* User Info and Logout */}
        <div className="header-user-actions">
          <p className="header-username">{loginUser && loginUser.name}</p>
          <button className="header-logout-btn" onClick={logoutHandler}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};


export default Header;
