import { Camera, Loader2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import api from '../services/api';

const empty = { name:'', category:'food', expiryDate:'', imageUrl:'', ocrRawText:'' };

export default function AddForm({ onSaved }) {
  const [form, setForm] = useState(empty);
  const [preview, setPreview] = useState('');
  const [scanning, setScanning] = useState(false);
  const [ocrMsg, setOcrMsg] = useState('');
  const fileRef = useRef(); const camRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const fd = new FormData(); fd.append('image', file);
    setScanning(true); setOcrMsg('');
    try {
      const { data } = await api.post('/products/scan', fd, { headers:{'Content-Type':'multipart/form-data'} });
      setForm(f => ({ ...f, imageUrl: data.imageUrl, ocrRawText: data.rawText,
        expiryDate: data.extractedDate ? new Date(data.extractedDate).toISOString().split('T')[0] : f.expiryDate }));
      setOcrMsg(data.matchedText ? `✓ Detected: ${data.matchedText}` : '⚠ Date not found — enter manually');
    } catch { setOcrMsg('✕ OCR failed — enter date manually'); }
    finally { setScanning(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/products', form);
    setForm(empty); setPreview(''); setOcrMsg('');
    onSaved();
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-teal-400">Add product</p>
        <h2 className="mt-1 text-xl font-black tracking-tight">Scan or enter manually</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold transition hover:bg-white/10">
          <Upload size={14}/> Upload
        </button>
        <button type="button" onClick={() => camRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold transition hover:bg-white/10">
          <Camera size={14}/> Camera
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e=>handleFile(e.target.files?.[0])} />
        <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e=>handleFile(e.target.files?.[0])} />
      </div>

      {preview && <img src={preview} alt="Preview" className="h-40 w-full rounded-2xl object-cover" />}
      {scanning && <p className="flex items-center gap-2 text-sm text-slate-400"><Loader2 size={14} className="animate-spin"/> Running OCR…</p>}
      {ocrMsg && <p className={`rounded-xl px-3 py-2 text-sm font-medium ${ocrMsg.startsWith('✓')?'bg-teal-500/10 text-teal-300':ocrMsg.startsWith('⚠')?'bg-amber-500/10 text-amber-300':'bg-rose-500/10 text-rose-300'}`}>{ocrMsg}</p>}

      <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" placeholder="Product name" value={form.name} onChange={f('name')} required />
      <div className="grid grid-cols-2 gap-3">
        <select className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none" value={form.category} onChange={f('category')}>
          <option value="food">Food</option><option value="medicine">Medicine</option>
          <option value="personal-care">Personal care</option><option value="other">Other</option>
        </select>
        <input type="date" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500" value={form.expiryDate} onChange={f('expiryDate')} required />
      </div>
      <button className="w-full rounded-xl bg-teal-500 py-3 text-sm font-bold text-slate-950 transition hover:bg-teal-400 active:scale-[0.98]">
        Add product
      </button>
    </form>
  );
}
