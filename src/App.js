import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout       from './components/Layout';
import Dashboard    from './pages/Dashboard';
import Inventory    from './pages/Inventory';
import AddItem      from './pages/AddItem';
import EditItem     from './pages/EditItem';

/* ── guard: redirects to /login when not authenticated ── */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;                          // still hydrating
  if (!user)   return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* public */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* protected – all share the sidebar+topbar Layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index          element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="add-item"  element={<AddItem />} />
        <Route path="edit-item/:id" element={<EditItem />} />
      </Route>

      {/* catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
