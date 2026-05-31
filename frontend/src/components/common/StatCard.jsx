export default function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="metric-card rounded-lg p-6 transition hover:-translate-y-1 hover:border-primary/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <p className="mt-4 text-3xl font-black tracking-tight text-ink">{value}</p>
          <p className="mt-3 text-xs font-bold text-primary">Club metric</p>
        </div>
        {Icon && <div className="grid h-12 w-12 place-items-center rounded bg-primary/10 text-primary"><Icon className="h-6 w-6" /></div>}
      </div>
    </div>
  );
}
