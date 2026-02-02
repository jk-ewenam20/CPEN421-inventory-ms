import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Inventory.css';

export default function Inventory() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');          // all | inStock | outOfStock
  const [sortKey, setSortKey] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [toast,   setToast]   = useState('');             // success message
  const navigate              = useNavigate();

  /* ── fetch ── */
  const load = () => {
    setLoading(true);
    api.get('/items')
      .then(res => setItems(res.data.items))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`/items/delete_item/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
      setToast('Item deleted');
      setTimeout(() => setToast(''), 2500);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  /* ── derived / filtered / sorted list ── */
  const displayed = useMemo(() => {
    let list = items;

    // search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.name.toLowerCase().includes(q) ||
        (i.description || '').toLowerCase().includes(q)
      );
    }

    // filter
    if (filter === 'inStock')    list = list.filter(i =>  i.inStock);
    if (filter === 'outOfStock') list = list.filter(i => !i.inStock);

    // sort
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name')     cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'price')    cmp = a.price - b.price;
      else if (sortKey === 'quantity') cmp = a.quantity - b.quantity;
      return sortAsc ? cmp : -cmp;
    });

    return list;
  }, [items, search, filter, sortKey, sortAsc]);

  /* toggle sort */
  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  const arrow = (key) => sortKey === key ? (sortAsc ? ' ↑' : ' ↓') : '';

  if (loading) return <div className="inv__loader">Loading…</div>;

  return (
    <section className="inv">
      {/* toast */}
      {toast && <div className="inv__toast">{toast}</div>}

      {/* toolbar: search + filter + add button */}
      <div className="inv__toolbar">
        <input
          className="inv__search"
          type="text"
          placeholder="Search items…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="inv__filters">
          {['all', 'inStock', 'outOfStock'].map(f => (
            <button
              key={f}
              className={`inv__filter ${filter === f ? 'inv__filter--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'inStock' ? 'In Stock' : 'Out of Stock'}
            </button>
          ))}
        </div>

        <button className="inv__add" onClick={() => navigate('/add-item')}>+ Add Item</button>
      </div>

      {/* table */}
      <div className="inv__table-wrap">
        <table className="inv__table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Name{arrow('name')}</th>
              <th>Description</th>
              <th onClick={() => handleSort('price')}>Price{arrow('price')}</th>
              <th onClick={() => handleSort('quantity')}>Qty{arrow('quantity')}</th>
              <th>Status</th>
              <th className="inv__th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr><td colSpan={6} className="inv__empty">No items found</td></tr>
            ) : displayed.map(item => (
              <tr key={item._id} className="inv__row">
                <td className="inv__name">{item.name}</td>
                <td className="inv__desc">{item.description || '—'}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>
                  <span className={`inv__badge ${item.inStock ? 'inv__badge--success' : 'inv__badge--danger'}`}>
                    {item.inStock ? 'In Stock' : 'Out'}
                  </span>
                </td>
                <td className="inv__actions">
                  <button className="inv__btn-edit" onClick={() => navigate(`/edit-item/${item._id}`)}>Edit</button>
                  <button className="inv__btn-del"  onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
