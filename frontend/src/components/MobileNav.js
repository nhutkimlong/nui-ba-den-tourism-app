import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaConciergeBell, FaCalendarAlt, FaMapMarkedAlt, FaRoute, FaUtensils } from 'react-icons/fa';
import '../App.css';

const MobileNav = () => {
  return (
    <nav className="mobile-nav">
      <NavLink to="/" className="mobile-nav-item">
        <FaHome size={18} />
        <span>Trang chủ</span>
      </NavLink>
      <NavLink to="/about" className="mobile-nav-item">
        <FaInfoCircle size={18} />
        <span>Giới thiệu</span>
      </NavLink>
      <NavLink to="/services" className="mobile-nav-item">
        <FaConciergeBell size={18} />
        <span>Dịch vụ</span>
      </NavLink>
      <NavLink to="/tours" className="mobile-nav-item">
        <FaRoute size={18} />
        <span>Tours</span>
      </NavLink>
      <NavLink to="/restaurants" className="mobile-nav-item">
        <FaUtensils size={18} />
        <span>Nhà hàng</span>
      </NavLink>
      <NavLink to="/events" className="mobile-nav-item">
        <FaCalendarAlt size={18} />
        <span>Sự kiện</span>
      </NavLink>
      <NavLink to="/map" className="mobile-nav-item">
        <FaMapMarkedAlt size={18} />
        <span>Bản đồ</span>
      </NavLink>
    </nav>
  );
};

export default MobileNav;


