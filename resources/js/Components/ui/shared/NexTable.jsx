import { useState } from 'react';
import { Icon } from '@iconify/react';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../dropdown-menu';

// Reusable table matching NexTable / VenturoTable from template
export default function NexTable({
  columns = [],
  data = [],
  loading = false,
  actions,
  actionType = 'icon', // 'icon' | 'dropdown'
  emptyTitle = 'No data available',
  emptyDesc = 'No data available yet.',
  pagination,
  onPageChange,
  onLimitChange,
}) {
  const [confirmState, setConfirmState] = useState(null);

  const handleActionClick = (action, row) => {
    if (action.needsConfirmation) {
      setConfirmState({ action, row });
    } else {
      action.onClick(row);
    }
  };

  return (
    <div className="bg-white overflow-hidden" style={{ borderRadius: '12px', boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <th key={col.id} className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  {col.header}
                </th>
              ))}
              {actions && <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  {columns.map((col) => (
                    <td key={col.id} className="px-5 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: '60%' }} />
                    </td>
                  ))}
                  {actions && <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-16 ml-auto" /></td>}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Icon icon="solar:box-minimalistic-outline" className="text-gray-300" width={48} />
                    <p className="font-medium text-gray-500">{emptyTitle}</p>
                    <p className="text-sm text-gray-400">{emptyDesc}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => {
                const rowActions = actions ? (typeof actions === 'function' ? actions(row) : actions) : [];
                return (
                  <tr key={row.id ?? i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    {columns.map((col) => (
                      <td key={col.id} className="px-5 py-4 text-sm text-gray-700">
                        {col.render ? col.render(row) : row[col.id]}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-5 py-4">
                        {actionType === 'dropdown' ? (
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors">
                                  <MoreHorizontal size={18} />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                {rowActions.map((action, ai) => (
                                  <DropdownMenuItem
                                    key={ai}
                                    onClick={() => handleActionClick(action, row)}
                                    disabled={action.disabled}
                                    className={action.color === 'error' ? 'text-red-600 focus:text-red-600' : ''}
                                  >
                                    {action.label ?? action.title}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            {rowActions.map((action, ai) => (
                              <button
                                key={ai}
                                onClick={() => handleActionClick(action, row)}
                                disabled={action.disabled}
                                title={action.title}
                                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors disabled:opacity-40"
                              >
                                {action.icon}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Total {pagination.total ?? 0} data
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40"
            >
              <Icon icon="solar:alt-arrow-left-line-duotone" width={16} />
            </button>
            <span className="text-sm text-gray-700 px-2">
              {pagination.page} / {pagination.total_pages ?? 1}
            </span>
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page >= (pagination.total_pages ?? 1)}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40"
            >
              <Icon icon="solar:alt-arrow-right-line-duotone" width={16} />
            </button>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl mx-4">
            <p className="font-semibold text-gray-800 text-base mb-2">
              {confirmState.action.confirmationTitle ?? 'Confirmation'}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {typeof confirmState.action.confirmationMessage === 'function'
                ? confirmState.action.confirmationMessage(confirmState.row)
                : confirmState.action.confirmationMessage ?? 'Are you sure?'}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmState(null)}
                className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => { confirmState.action.onClick(confirmState.row); setConfirmState(null); }}
                className="px-4 py-2 text-sm rounded-md text-white"
                style={{ backgroundColor: confirmState.action.confirmationType === 'danger' ? '#EF4444' : '#0152EA' }}
              >
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
