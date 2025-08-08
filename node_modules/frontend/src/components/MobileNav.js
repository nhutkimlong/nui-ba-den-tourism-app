import { NavLink } from 'react-router-dom';
import { FiHome, FiInfo, FiMap, FiCalendar, FiShoppingBag } from 'react-icons/fi';

const links = [
  { to: '/', label: 'Home', icon: FiHome },
  { to: '/gioi-thieu', label: 'Giới thiệu', icon: FiInfo },
  { to: '/dich-vu', label: 'Dịch vụ', icon: FiShoppingBag },
  { to: '/su-kien', label: 'Sự kiện', icon: FiCalendar },
  { to: '/ban-do', label: 'Bản đồ', icon: FiMap },
];

export default function MobileNav() {
  return (
    <nav className="mobile-tabs">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}


