import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Events from './pages/Events';
import MapPage from './pages/MapPage';
import Tours from './pages/Tours';
import Restaurants from './pages/Restaurants';
import MobileNav from './components/MobileNav';
import './App.css';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="container nav-inner">
            <NavLink to="/" className="brand">Núi Bà Đen</NavLink>
            <div className="nav-links">
              <NavLink to="/" className="nav-link">Trang chủ</NavLink>
              <NavLink to="/about" className="nav-link">Giới thiệu</NavLink>
              <NavLink to="/services" className="nav-link">Dịch vụ</NavLink>
              <NavLink to="/tours" className="nav-link">Tours</NavLink>
              <NavLink to="/restaurants" className="nav-link">Nhà hàng</NavLink>
              <NavLink to="/events" className="nav-link">Sự kiện</NavLink>
              <NavLink to="/map" className="nav-link">Bản đồ</NavLink>
            </div>
            <button className="mobile-toggle" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          {isMobileMenuOpen && (
            <div className="mobile-menu container">
              <NavLink to="/" className="nav-link" onClick={toggleMobileMenu}>Trang chủ</NavLink>
              <NavLink to="/about" className="nav-link" onClick={toggleMobileMenu}>Giới thiệu</NavLink>
              <NavLink to="/services" className="nav-link" onClick={toggleMobileMenu}>Dịch vụ</NavLink>
              <NavLink to="/tours" className="nav-link" onClick={toggleMobileMenu}>Tours</NavLink>
              <NavLink to="/restaurants" className="nav-link" onClick={toggleMobileMenu}>Nhà hàng</NavLink>
              <NavLink to="/events" className="nav-link" onClick={toggleMobileMenu}>Sự kiện</NavLink>
              <NavLink to="/map" className="nav-link" onClick={toggleMobileMenu}>Bản đồ</NavLink>
            </div>
          )}
        </nav>

        <div className="page">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/events" element={<Events />} />
              <Route path="/map" element={<MapPage />} />
            </Routes>
          </div>
        </div>

        <footer className="footer">
          <div className="container">
            &copy; 2024 Núi Bà Đen Tourism App. All rights reserved.
          </div>
        </footer>

        <MobileNav />
      </div>
    </Router>
  );
}

export default App;
