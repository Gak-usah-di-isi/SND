/**
 * Reusable DataTable component.
 * Props:
 *   columns: [{ key, label, align? }]  — table headers
 *   children: <tr> rows rendered inside <tbody>
 *   empty?: ReactNode  — custom empty state (optional)
 *   colSpan?: number   — colSpan for empty row (default = columns.length)
 *   footer?: ReactNode — rendered below the table inside the card (e.g. TablePagination)
 */
export function DataTable({ columns = [], children, empty, colSpan, footer }) {
  const hasRows = !!children && (Array.isArray(children) ? children.length > 0 : true);
  const span = colSpan ?? columns.length;

  return (
    <div className="bg-white rounded-[12px] border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col.key ?? i}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {hasRows ? children : (
              <tr>
                <td colSpan={span} className="px-5 py-16 text-center">
                  {empty ?? (
                    <div className="flex flex-col items-center gap-2">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                        <path d="m14.5 12.5-5 5M9.5 12.5l5 5" />
                      </svg>
                      <p className="font-medium text-gray-500">No data found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search or filter.</p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {footer && footer}
    </div>
  );
}
