import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Dashboard.css';

export default function Dashboard() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  /* ── fetch all items on mount ── */
  useEffect(() => {
    api.get('/items')
      .then(res => setItems(res.data.items))   // { items: [...] }
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ── derived KPIs ── */
  const kpi = useMemo(() => {
    const inStock    = items.filter(i =>  i.inStock).length;
    const outOfStock = items.filter(i => !i.inStock).length;
    const value      = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const lowStock   = items.filter(i => i.inStock && i.quantity <= 5).length;
    return { total: items.length, inStock, outOfStock, value, lowStock };
  }, [items]);

  /* recent 5 items (newest _id first) */
  const recent = useMemo(() =>
    [...items].sort((a, b) => (b._id > a._id ? 1 : -1)).slice(0, 5),
    [items]
  );

  if (loading) return <div className="dash__loader">Loading…</div>;

  return (
    <section className="dash">
      {/* ── KPI cards ── */}
      <div className="dash__cards">
        <Card label="Total Items"   value={kpi.total}     color="accent"  />
        <Card label="In Stock"      value={kpi.inStock}   color="success" />
        <Card label="Out of Stock"  value={kpi.outOfStock} color="danger" />
        <Card label="Total Value"   value={`$${kpi.value.toLocaleString(undefined,{minimumFractionDigits:2})}`} color="warning" />
      </div>

      {/* ── Recent items table ── */}
      <div className="dash__panel">
        <div className="dash__panel-head">
          <h3>Recent Items</h3>
          <button className="dash__view-all" onClick={() => navigate('/inventory')}>View all →</button>
        </div>

        {recent.length === 0 ? (
          <p className="dash__empty">No items yet. <button className="dash__link" onClick={() => navigate('/add-item')}>Add one →</button></p>
        ) : (
          <div className="dash__table-wrap">
            <table className="dash__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(item => (
                  <tr key={item._id} className="dash__row" onClick={() => navigate(`/edit-item/${item._id}`)}>
                    <td className="dash__name">{item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <span className={`dash__badge ${item.inStock ? 'dash__badge--success' : 'dash__badge--danger'}`}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

/* small stat-card sub-component */
function Card({ label, value, color }) {
  return (
    <div className={`dash__card dash__card--${color}`}>
      <span className="dash__card-value">{value}</span>
      <span className="dash__card-label">{label}</span>
    </div>
  );
}
