import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Events from './pages/Events';
import MapPage from './pages/MapPage';
import MobileNav from './components/MobileNav';

import { useState } from 'react';

function App() {
  const [open, setOpen] = useState(false);
  const link = (to, label) => (
    <NavLink onClick={() => setOpen(false)} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to={to}>{label}</NavLink>
  );

  return (
    <Router>
      <nav className="navbar">
        <div className="container nav-inner">
          <div className="brand">Núi Bà Đen</div>
          <div className="nav-links">
            {link('/', 'Home')}
            {link('/gioi-thieu', 'Giới thiệu')}
            {link('/dich-vu', 'Dịch vụ')}
            {link('/su-kien', 'Sự kiện')}
            {link('/ban-do', 'Bản đồ')}
          </div>
          <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">≡</button>
        </div>
        {open && (
          <div className="container mobile-menu">
            {link('/', 'Home')}
            {link('/gioi-thieu', 'Giới thiệu')}
            {link('/dich-vu', 'Dịch vụ')}
            {link('/su-kien', 'Sự kiện')}
            {link('/ban-do', 'Bản đồ')}
          </div>
        )}
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gioi-thieu" element={<About />} />
          <Route path="/dich-vu" element={<Services />} />
          <Route path="/su-kien" element={<Events />} />
          <Route path="/ban-do" element={<MapPage />} />
        </Routes>
        <footer className="footer">© {new Date().getFullYear()} Núi Bà Đen Tourism</footer>
      </div>
      <MobileNav />
    </Router>
  );
}

export default App;
