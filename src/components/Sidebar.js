import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const LINKS = [
  { to: '/',          label: 'Dashboard',  icon: '▣' },
  { to: '/inventory', label: 'Inventory',  icon: '☰' },
  { to: '/add-item',  label: 'Add Item',   icon: '+' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      {/* brand */}
      <div className="sidebar__brand">
        <span>Inven<strong>Track</strong></span>
      </div>

      {/* nav */}
      <nav className="sidebar__nav">
        {LINKS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            onClick={onClose}   /* close drawer on mobile after tap */
          >
            <span className="sidebar__icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* user card + logout */}
      <div className="sidebar__footer">
        {user && (
          <div className="sidebar__user">
            <div className="sidebar__avatar">{user.name[0].toUpperCase()}</div>
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{user.name}</span>
              <span className="sidebar__user-email">{user.email}</span>
            </div>
          </div>
        )}
        <button className="sidebar__logout" onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}
