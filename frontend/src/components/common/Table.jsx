export default function Table({ columns, rows }) {
  return (
    <div className="panel overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-ink text-[11px] font-black uppercase tracking-[0.16em] text-white">
          <tr>{columns.map((column) => <th className="whitespace-nowrap px-6 py-4" key={column.key}>{column.label}</th>)}</tr>
        </thead>
        <tbody>
          {(rows || []).map((row, index) => (
            <tr className="border-t border-black/5 text-slate-700 transition hover:bg-orange-50/40" style={{ animation: `page-enter 320ms ease both ${index * 35}ms` }} key={row.id || index}>
              {columns.map((column) => <td className="whitespace-nowrap px-6 py-4" key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}
            </tr>
          ))}
          {(!rows || rows.length === 0) && (
            <tr><td className="px-5 py-10 text-center text-sm text-muted" colSpan={columns.length}>No records to show.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
