import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Events from './pages/Events';
import MapPage from './pages/MapPage';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="container nav-inner">
          <div className="brand">Núi Bà Đen</div>
          <div className="nav-links">
            <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/">Home</NavLink>
            <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/gioi-thieu">Giới thiệu</NavLink>
            <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/dich-vu">Dịch vụ</NavLink>
            <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/su-kien">Sự kiện</NavLink>
            <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/ban-do">Bản đồ</NavLink>
          </div>
        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gioi-thieu" element={<About />} />
          <Route path="/dich-vu" element={<Services />} />
          <Route path="/su-kien" element={<Events />} />
          <Route path="/ban-do" element={<MapPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
