import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';
import './Layout.css';

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="layout">
      {/* mobile overlay when drawer is open */}
      {drawerOpen && <div className="layout__overlay" onClick={() => setDrawerOpen(false)} />}

      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="layout__main">
        <Topbar onHamburger={() => setDrawerOpen(true)} />
        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
