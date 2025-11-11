import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiSettings } from "react-icons/fi";

const navItems = ['Home', 'Predictions', 'About', 'History', 'Login'];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const popupRef = useRef(null);
  const isLoggedIn = localStorage.getItem("token") !== null;


  useEffect(() => {
    if (showPopup) {
      gsap.fromTo(
        popupRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [showPopup]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleolaClick = () => {
    setShowPopup(false);
    navigate('/Olapredictions');
  };

  const handlerevoltClick = () => {
    setShowPopup(false);
    navigate('/Revoltpredictions');
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50  ">
      <div className="flex justify-between items-center px-6 py-4 md:px-14">

        {/* Logo or Brand */}


        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-40 mt-10 ml-6 text-white">
          {navItems.map((item) => {
            const isActive = location.pathname === `/${item.toLowerCase()}`;
            return (
              <div key={item} className="relative">
                {item === 'Predictions' ? (
                  <button
                    onClick={() => setShowPopup(!showPopup)}
                    className={`nav-hover-btn ${isActive ? "font-extrabold text-white" : "text-white"}`}
                  >
                    {item}
                  </button>
                ) : (
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className={`nav-hover-btn ${isActive ? "font-extrabold text-white" : "text-white"}`}
                  >
                    {item}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* ✅ Settings Icon */}
          {isLoggedIn && (
            <FiSettings
              className="text-white hover:text-cyan-400 cursor-pointer text-2xl mt-10 mr-4"
              onClick={() => navigate("/settings")}
              title="Settings"
            />
          )}
        </div>


        {/* Mobile Hamburger */}
        <div className="md:hidden text-white text-2xl">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>


      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0f172a00] px-20 pb-4 text-white flex flex-row justify-center items-center space-x-6 gap-9" >
          {navItems.map((item) =>
            item === 'Predictions' ? (
              <button
                key={item}
                onClick={() => {
                  setShowPopup(!showPopup);
                  setMenuOpen(false);
                }}
                className="block w-full text-left"
              >
                {item}
              </button>
            ) : (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block"
              >
                {item}
              </Link>
            )
          )}
        </div>
      )}



      {/* Popup Prediction Box */}
      {showPopup && (
        <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-md flex justify-center items-center z-50">
          <div ref={popupRef} className="flex flex-col md:flex-row gap-10">
            {/* OLA Card */}
            <div
              onClick={handleolaClick}
              className="w-52 h-52 bg-[#0d1b2a] border border-cyan-400/30 rounded-2xl shadow-md hover:shadow-[0_0_30px_#00f7ff] hover:scale-105 transition-all duration-300 text-white flex flex-col justify-center items-center backdrop-blur-sm"
            >
              <i className="fas fa-bolt fa-2x text-cyan-300 mb-3 animate-pulse" />
              <span className="text-lg font-semibold tracking-wide">OLA Prediction</span>
              <p className="text-sm text-cyan-100 mt-1 text-center px-4">Check SOH and RUL for Ola EV</p>
            </div>

            {/* REVOLT Card */}
            <div
              onClick={handlerevoltClick}
              className="w-52 h-52 bg-[#2a0a0a] border border-pink-400/30 rounded-2xl shadow-md hover:shadow-[0_0_30px_#ff69b4] hover:scale-105 transition-all duration-300 text-white flex flex-col justify-center items-center backdrop-blur-sm"
            >
              <i className="fas fa-motorcycle fa-2x text-pink-300 mb-3 animate-pulse" />
              <span className="text-lg font-semibold tracking-wide">REVOLT Prediction</span>
              <p className="text-sm text-pink-100 mt-1 text-center px-4">Analyze SOH and RUL for Revolt EV</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
