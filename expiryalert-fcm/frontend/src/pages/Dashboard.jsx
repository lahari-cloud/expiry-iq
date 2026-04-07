import { BellRing, LogOut, Package, ShieldAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AddForm from '../components/AddForm';
import EditModal from '../components/EditModal';
import NotificationBell from '../components/NotificationBell';
import ProductCard from '../components/ProductCard';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { daysUntil } from '../utils/date';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState({ products:[], summary:{total:0,expiringSoon:0,expired:0} });
  const [editTarget, setEditTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const load = async () => { const { data: d } = await api.get('/products'); setData(d); };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return data.products
      .filter(p => {
        if (filter==='expired') return daysUntil(p.expiryDate)<0;
        if (filter==='expiring') { const d=daysUntil(p.expiryDate); return d>=0&&d<=7; }
        if (filter==='safe') return daysUntil(p.expiryDate)>7;
        return true;
      })
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [data.products, filter, search]);

  const del = async (id) => { await api.delete(`/products/${id}`); load(); };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-4">
        <div className="mx-auto flex max-w-7xl items-center gap-3 py-3">
          <div className="flex items-center gap-2 mr-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-slate-950">
              <Package size={15} strokeWidth={2.5}/>
            </div>
            <span className="font-black tracking-tight">Expiry<span className="text-teal-400">Alert</span></span>
          </div>
          <NotificationBell />
          <button onClick={logout} className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10">
            <LogOut size={13}/> {user?.name}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
          <StatCard label="Total items" value={data.summary.total} icon={Package} colorClass="bg-teal-500/15 text-teal-300" />
          <StatCard label="Expiring soon" value={data.summary.expiringSoon} icon={BellRing} colorClass="bg-amber-500/15 text-amber-300" />
          <StatCard label="Expired" value={data.summary.expired} icon={ShieldAlert} colorClass="bg-rose-500/15 text-rose-300" />
          <StatCard label="Safe" value={data.products.filter(p=>daysUntil(p.expiryDate)>7).length} icon={Package} colorClass="bg-emerald-500/15 text-emerald-300" />
        </div>

        {/* Body */}
        <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
          <AddForm onSaved={load} />

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-1">Products</p>
            <h2 className="text-xl font-black tracking-tight mb-4">Tracked items</h2>
            <input className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-teal-500" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} />
            <div className="flex flex-wrap gap-2 mb-4">
              {[['all','All'],['expiring','⚠ Expiring'],['expired','✕ Expired'],['safe','✓ Safe']].map(([v,l])=>(
                <button key={v} onClick={()=>setFilter(v)} className={`rounded-full px-3 py-1 text-xs font-semibold border transition ${filter===v?'bg-teal-500 text-slate-950 border-transparent':'border-white/10 bg-white/5 text-slate-400 hover:text-white'}`}>{l}</button>
              ))}
            </div>
            <div className="space-y-3">
              {filtered.length===0
                ? <div className="flex min-h-[240px] flex-col items-center justify-center text-center text-slate-500">
                    <div className="text-4xl mb-3 opacity-30">📦</div>
                    <p className="font-semibold text-slate-300">No products found</p>
                    <p className="text-sm mt-1">Add a product or change your filter.</p>
                  </div>
                : filtered.map(p=><ProductCard key={p._id} product={p} onDelete={del} onEdit={setEditTarget}/>)}
            </div>
          </div>
        </div>
      </main>

      {editTarget && <EditModal product={editTarget} onSaved={load} onClose={()=>setEditTarget(null)} />}
    </div>
  );
}
