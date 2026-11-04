import { useCallback, useEffect, useState } from 'react';

const TOAST_VARIANTS = {
  success: {
    color: '#065F46', bg: '#ECFDF5', iconBg: '#10B981',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4.5-4.5 1.41-1.41L10 13.67l7.09-7.09L18.5 8l-8.5 8.5z" />
      </svg>
    ),
  },
  error: {
    color: '#991B1B', bg: '#FEF2F2', iconBg: '#EF4444',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
  },
  warning: {
    color: '#92400E', bg: '#FFFBEB', iconBg: '#F59E0B',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
    ),
  },
  info: {
    color: '#1E3A8A', bg: '#EFF6FF', iconBg: '#0152EA',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    ),
  },
};

function ToastItem({ id, type, message, onClose }) {
  const [visible, setVisible] = useState(false);
  const { color, bg, iconBg, icon } = TOAST_VARIANTS[type];

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(id), 300);
    }, 4000);
    return () => clearTimeout(t);
  }, [id, onClose]);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: bg,
        borderRadius: 6,
        padding: '10px 14px',
        minWidth: 288,
        maxWidth: 400,
        boxShadow: '0 3px 10px rgba(0,0,0,0.16)',
        transform: visible ? 'translateX(0)' : 'translateX(110%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 300ms cubic-bezier(0.22,1,0.36,1), opacity 300ms ease',
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      <span style={{ color: iconBg, flexShrink: 0, display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: 13.5, lineHeight: 1.5, flex: 1, color, fontWeight: 500 }}>{message}</span>
      <button
        type="button"
        onClick={dismiss}
        style={{
          background: 'none',
          border: 'none',
          color: iconBg,
          cursor: 'pointer',
          padding: '2px',
          lineHeight: 1,
          flexShrink: 0,
          display: 'flex',
          opacity: 0.7,
          borderRadius: 4,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ToastContainer({ toasts = [], onClose = () => {} }) {
  if (!toasts || !toasts.length) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback(
    (id) => setToasts((prev) => prev.filter((toast) => toast.id !== id)),
    []
  );

  const show = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  return {
    toasts,
    remove,
    success: (message) => show('success', message),
    error: (message) => show('error', message),
    warning: (message) => show('warning', message),
    info: (message) => show('info', message),
  };
}
