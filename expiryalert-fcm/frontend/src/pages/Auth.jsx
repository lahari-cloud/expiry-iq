import { ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault(); setError('');
    try { await login(form, mode); }
    catch (err) { setError(err.response?.data?.message || 'Auth failed'); }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#134e4a_0%,#080b12_50%)] text-white px-4 py-12">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-teal-400">ExpiryAlert</p>
            <h1 className="mt-4 text-5xl font-black tracking-tighter leading-none max-w-lg">Never let a product expire silently.</h1>
            <p className="mt-5 text-lg text-slate-300 max-w-md">Scan products, detect expiry dates with OCR, and get real push notifications on your phone — even when the app is closed.</p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5"><Sparkles className="text-teal-400" size={20}/><h3 className="mt-4 font-bold">OCR date scanning</h3><p className="mt-1 text-sm text-slate-400">Point camera at label. Date auto-fills.</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5"><ShieldCheck className="text-teal-400" size={20}/><h3 className="mt-4 font-bold">Real push notifications</h3><p className="mt-1 text-sm text-slate-400">FCM alerts at 7d, 3d, and expiry day.</p></div>
          </div>
        </div>
        <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-2xl font-black">{mode==='login'?'Sign in':'Sign up'}</h2>
            <button type="button" onClick={()=>setMode(m=>m==='login'?'register':'login')} className="text-sm text-teal-300 hover:text-white">
              {mode==='login'?'Create account →':'Have account?'}
            </button>
          </div>
          <div className="space-y-3">
            {mode==='register' && <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-teal-500" placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />}
            <input type="email" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-teal-500" placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required />
            <input type="password" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-teal-500" placeholder="Password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required />
            {error && <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
            <button className="w-full rounded-xl bg-teal-500 py-3 font-bold text-slate-950 hover:bg-teal-400">{mode==='login'?'Login':'Create account'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
