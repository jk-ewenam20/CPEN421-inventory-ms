import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Topbar.css';

const TITLES = {
  '/':          'Dashboard',
  '/inventory': 'Inventory',
  '/add-item':  'Add Item',
};

export default function Topbar({ onHamburger }) {
  const loc        = useLocation();
  const { user }   = useAuth();
  // EditItem pages start with /edit-item/
  const title      = TITLES[loc.pathname] || (loc.pathname.startsWith('/edit-item') ? 'Edit Item' : 'InvenTrack');

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__hamburger" onClick={onHamburger} aria-label="Open menu">
          ☰
        </button>
        <h1 className="topbar__title">{title}</h1>
      </div>

      {user && (
        <div className="topbar__avatar">
          {user.name[0].toUpperCase()}
        </div>
      )}
    </header>
  );
}
