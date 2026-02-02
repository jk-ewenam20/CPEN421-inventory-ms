import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import './ItemForm.css';

export default function EditItem() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [form,    setForm]    = useState({ name: '', description: '', price: '', quantity: '', inStock: true });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [saving,  setSaving]  = useState(false);

  /* ── fetch existing item ──
     GET /api/items/:sku  →  { item: { _id, name, description, price, quantity, inStock } }
  */
  useEffect(() => {
    api.get(`/items/${id}`)
      .then(res => {
        const { name, description, price, quantity, inStock } = res.data.item;
        setForm({ name, description: description || '', price, quantity, inStock });
      })
      .catch(() => setError('Item not found'))
      .finally(() => setLoading(false));
  }, [id]);

  /* generic change handler */
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  /* ── update ──
     PUT /api/items/update_item/:sku  { name, description, price, quantity, inStock }
     Response: { data: updatedItem, message }
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.put(`/items/update_item/${id}`, {
        ...form,
        price:    Number(form.price),
        quantity: Number(form.quantity),
      });
      navigate('/inventory');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  /* ── delete ──
     DELETE /api/items/delete_item/:sku
  */
  const handleDelete = async () => {
    if (!window.confirm('Delete this item permanently?')) return;
    try {
      await api.delete(`/items/delete_item/${id}`);
      navigate('/inventory');
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="item-form__loader">Loading…</div>;
  if (error && !form.name) return <div className="item-form__loader">{error}</div>;

  return (
    <section className="item-form">
      <div className="item-form__header">
        <h2>Edit Item</h2>
        <Link to="/inventory" className="item-form__back">← Back</Link>
      </div>

      {error && <div className="item-form__error">{error}</div>}

      <div className="item-form__card">
        <form onSubmit={handleSubmit}>
          <div className="item-form__row">
            <div className="item-form__field">
              <label>Name *</label>
              <input name="name" value={form.name} onChange={onChange} required />
            </div>
            <div className="item-form__field">
              <label>Price *</label>
              <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange} required />
            </div>
          </div>

          <div className="item-form__field">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={onChange} rows={3} />
          </div>

          <div className="item-form__row">
            <div className="item-form__field">
              <label>Quantity *</label>
              <input name="quantity" type="number" min="0" value={form.quantity} onChange={onChange} required />
            </div>

            <div className="item-form__field item-form__field--checkbox">
              <label>
                <input name="inStock" type="checkbox" checked={form.inStock} onChange={onChange} />
                <span>In Stock</span>
              </label>
            </div>
          </div>

          <div className="item-form__actions">
            <button type="button" className="item-form__btn item-form__btn--danger" onClick={handleDelete}>Delete Item</button>
            <div style={{ flex: 1 }} />
            <button type="button" className="item-form__btn item-form__btn--ghost"  onClick={() => navigate('/inventory')}>Cancel</button>
            <button type="submit"  className="item-form__btn item-form__btn--primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
