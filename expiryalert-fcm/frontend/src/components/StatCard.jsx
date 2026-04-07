export default function StatCard({ label, value, icon: Icon, colorClass }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
      <div className={`mb-3 inline-flex rounded-xl p-2.5 ${colorClass}`}>
        <Icon size={18} />
      </div>
      <div className="text-3xl font-black tracking-tight">{value}</div>
      <div className="mt-1.5 text-sm text-slate-400">{label}</div>
    </div>
  );
}
