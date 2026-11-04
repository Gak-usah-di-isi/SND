import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

function RowsDropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos]   = useState({ top: 0, left: 0, width: 0 });
  const btnRef          = useRef(null);
  const listRef         = useRef(null);

  const openDropdown = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const optionHeight = 36;
    const totalHeight = options.length * optionHeight + 8;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < totalHeight + 8;
    setPos({
      top: openUpward ? rect.top - totalHeight - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (listRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => open ? setOpen(false) : openDropdown()}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 10px',
          border: '1px solid #e0e6eb',
          borderRadius: 8,
          background: '#fff',
          fontSize: '0.8125rem',
          color: '#374151',
          cursor: 'pointer',
          fontFamily: 'Manrope, sans-serif',
          minWidth: 58,
          justifyContent: 'space-between',
        }}
      >
        <span>{value}</span>
        <ChevronDown size={13} style={{ color: '#64748B', flexShrink: 0, transition: 'transform 150ms', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {open && createPortal(
        <div
          ref={listRef}
          style={{
            position: 'fixed',
            zIndex: 99999,
            top: pos.top,
            left: pos.left,
            minWidth: pos.width,
            background: '#fff',
            border: '1px solid #e0e6eb',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(16,24,40,0.08)',
            overflow: 'hidden',
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          {options.map(n => (
            <div
              key={n}
              onClick={() => { onChange(n); setOpen(false); }}
              style={{
                padding: '8px 14px',
                fontSize: '0.8125rem',
                color: n === value ? '#0152EA' : '#374151',
                background: n === value ? 'rgba(1,82,234,0.07)' : '#fff',
                cursor: 'pointer',
                fontFamily: 'Manrope, sans-serif',
              }}
              onMouseEnter={e => { if (n !== value) e.currentTarget.style.background = 'rgba(1,82,234,0.05)'; }}
              onMouseLeave={e => { if (n !== value) e.currentTarget.style.background = '#fff'; }}
            >
              {n}
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}

export function TablePagination({ page, rowsPerPage, total, onPageChange, onRowsPerPageChange, rowsPerPageOptions = [5, 10, 25, 50] }) {
  const from  = total === 0 ? 0 : page * rowsPerPage + 1;
  const to    = Math.min((page + 1) * rowsPerPage, total);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 20px',
      fontSize: '0.8125rem',
      color: '#64748B',
      fontFamily: 'Manrope, sans-serif',
      borderTop: '1px solid #F1F5F9',
      flexWrap: 'wrap',
      gap: 8,
    }}>
      <span>Menampilkan {from} - {to} dari {total} entri</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>Tampilkan</span>
          <RowsDropdown
            value={rowsPerPage}
            options={rowsPerPageOptions}
            onChange={n => { onRowsPerPageChange?.(n); }}
          />
          <span>per halaman</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <button
            onClick={() => onPageChange?.(page - 1)}
            disabled={page === 0}
            style={{
              width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid #e0e6eb', borderRadius: 6, background: '#fff',
              color: page === 0 ? '#CBD5E1' : '#374151',
              cursor: page === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => onPageChange?.(page + 1)}
            disabled={to >= total}
            style={{
              width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid #e0e6eb', borderRadius: 6, background: '#fff',
              color: to >= total ? '#CBD5E1' : '#374151',
              cursor: to >= total ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
