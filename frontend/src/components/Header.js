import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate(); // hook to programmatically navigate
  const isAuthenticated = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    navigate("/login"); // Redirect to the login page after logout
  };

  return (
    <header className=" flex bg-black justify-between min-h-24 px-10 items-center">
      <div>
        <Link to="/">
          <img src="/spyne_logo.jpg" className="w-16 rounded-md"></img>
        </Link>
      </div>
      {isAuthenticated ? (
        <div className="flex gap-2 text-white">
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <Link to="/" className="text-white">
            Login/
          </Link>
          <Link to="/register" className="text-white">
            Register
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
