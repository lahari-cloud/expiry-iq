import { useState } from 'react';
import api from '../services/api';

export default function EditModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({ name:product.name, category:product.category, expiryDate:product.expiryDate.split('T')[0] });
  const f = (k) => (e) => setForm(p=>({...p,[k]:e.target.value}));
  const save = async () => { await api.put(`/products/${product._id}`, form); onSaved(); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-teal-400">Edit product</p>
            <h3 className="mt-1 text-xl font-black">{product.name}</h3>
          </div>
          <button onClick={onClose} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-slate-400 hover:text-white">×</button>
        </div>
        <div className="space-y-3">
          <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-teal-500" value={form.name} onChange={f('name')} />
          <div className="grid grid-cols-2 gap-3">
            <select className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm" value={form.category} onChange={f('category')}>
              <option value="food">Food</option><option value="medicine">Medicine</option>
              <option value="personal-care">Personal care</option><option value="other">Other</option>
            </select>
            <input type="date" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm" value={form.expiryDate} onChange={f('expiryDate')} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold">Cancel</button>
            <button onClick={save} className="flex-1 rounded-xl bg-teal-500 py-2.5 text-sm font-bold text-slate-950 hover:bg-teal-400">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
