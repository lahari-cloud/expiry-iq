import { Calendar, Pencil, Trash2 } from 'lucide-react';
import { fmtDate, daysUntil } from '../utils/date';

export default function ProductCard({ product, onDelete, onEdit }) {
  const days = daysUntil(product.expiryDate);
  const status = days < 0 ? 'expired' : days <= 7 ? 'expiring' : 'safe';
  const badge = {
    expired:  { label:`Expired ${Math.abs(days)}d ago`, cls:'bg-rose-500/15 text-rose-300' },
    expiring: { label: days===0?'Expires today!':`${days}d left`, cls:'bg-amber-500/15 text-amber-300' },
    safe:     { label:`${days}d left`, cls:'bg-emerald-500/15 text-emerald-300' },
  }[status];
  const border = { expired:'border-rose-500/25', expiring:'border-amber-500/25', safe:'border-white/8' }[status];
  const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN || '';

  return (
    <div className={`flex gap-3 rounded-2xl border ${border} bg-white/[0.03] p-4 transition hover:-translate-y-0.5`}>
      <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
        {product.imageUrl
          ? <img src={`${backendOrigin}${product.imageUrl}`} alt="" className="h-14 w-14 rounded-xl object-cover" />
          : { food:'🥩', medicine:'💊', 'personal-care':'🧴', other:'📦' }[product.category]}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold">{product.name}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.cls}`}>{badge.label}</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 capitalize">
          <Calendar size={11} /> {product.category} · {fmtDate(product.expiryDate)}
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={() => onEdit(product)} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300 transition hover:bg-white/10"><Pencil size={11} /> Edit</button>
          <button onClick={() => onDelete(product._id)} className="flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1 text-xs font-semibold text-slate-400 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300"><Trash2 size={11} /> Delete</button>
        </div>
      </div>
    </div>
  );
}
