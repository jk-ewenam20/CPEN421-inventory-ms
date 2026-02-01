import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import './ItemForm.css';

export default function AddItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:        '',
    description: '',
    price:       '',
    quantity:    '',
    inStock:     true,
  });

  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  /* generic change handler */
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /* submit → POST /api/items/create_item */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/items/create_item', {
        ...form,
        price:    Number(form.price),
        quantity: Number(form.quantity),
      });
      navigate('/inventory');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="item-form">
      <div className="item-form__header">
        <h2>Add New Item</h2>
        <Link to="/inventory" className="item-form__back">← Back</Link>
      </div>

      {error && <div className="item-form__error">{error}</div>}

      <div className="item-form__card">
        <form onSubmit={handleSubmit}>
          <div className="item-form__row">
            <div className="item-form__field">
              <label>Name *</label>
              <input name="name" value={form.name} onChange={onChange} placeholder="Widget Pro" required />
            </div>
            <div className="item-form__field">
              <label>Price *</label>
              <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange} placeholder="29.99" required />
            </div>
          </div>

          <div className="item-form__field">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={onChange} placeholder="Optional description…" rows={3} />
          </div>

          <div className="item-form__row">
            <div className="item-form__field">
              <label>Quantity *</label>
              <input name="quantity" type="number" min="0" value={form.quantity} onChange={onChange} placeholder="100" required />
            </div>

            <div className="item-form__field item-form__field--checkbox">
              <label>
                <input name="inStock" type="checkbox" checked={form.inStock} onChange={onChange} />
                <span>In Stock</span>
              </label>
            </div>
          </div>

          <div className="item-form__actions">
            <button type="button" className="item-form__btn item-form__btn--ghost" onClick={() => navigate('/inventory')}>Cancel</button>
            <button type="submit"  className="item-form__btn item-form__btn--primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
