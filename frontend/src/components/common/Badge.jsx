export default function Badge({ children, tone = 'orange' }) {
  const tones = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    orange: 'bg-orange-100 text-orange-800',
    dark: 'bg-neutral-900 text-white',
  };
  return <span className={`inline-flex items-center rounded px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${tones[tone] || tones.orange}`}>{children}</span>;
}
