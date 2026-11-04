export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
  confirmButtonClass = 'bg-red-500 hover:bg-red-600',
  disabled = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <p className="text-base font-semibold text-gray-800 mb-2">{title}</p>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-md text-white cursor-pointer disabled:opacity-50 ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
