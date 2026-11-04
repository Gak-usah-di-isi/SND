import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

function DropdownList({ pos, filtered, value, onSelect }) {
  return createPortal(
    <div style={{
      position: 'fixed',
      zIndex: 99999,
      width: pos.width,
      ...(pos.openUpward ? { bottom: pos.bottom } : { top: pos.top }),
      left: pos.left,
      maxHeight: 220,
      overflowY: 'auto',
      background: '#fff',
      border: '1px solid #E2E8F0',
      borderRadius: 8,
      boxShadow: '0 8px 20px rgba(2,6,23,0.12)',
    }}>
      {filtered.length === 0 ? (
        <p style={{ fontSize: 14, color: '#94A3B8', padding: '10px 16px', margin: 0 }}>Tidak ditemukan</p>
      ) : filtered.map(opt => (
        <button
          key={opt.value}
          type="button"
          onMouseDown={e => { e.preventDefault(); onSelect(opt); }}
          style={{
            display: 'block', width: '100%', textAlign: 'left',
            padding: '10px 16px',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '0.875rem',
            fontWeight: String(opt.value) === String(value) ? 500 : 400,
            color: String(opt.value) === String(value) ? '#0152EA' : '#1E293B',
            background: String(opt.value) === String(value) ? 'rgba(1,82,234,0.06)' : 'transparent',
            border: 'none', cursor: 'pointer',
          }}
          onMouseEnter={e => { if (String(opt.value) !== String(value)) e.currentTarget.style.background = '#F0F5FF'; }}
          onMouseLeave={e => { if (String(opt.value) !== String(value)) e.currentTarget.style.background = String(opt.value) === String(value) ? 'rgba(1,82,234,0.06)' : 'transparent'; }}
        >
          {opt.label}
        </button>
      ))}
    </div>,
    document.body
  );
}

export function FloatSelect({
  label,
  id,
  options = [],
  value = '',
  onChange,
  placeholder = '',
  disabled = false,
  error = false,
  helperText,
}) {
  const [focused, setFocused] = useState(false);
  const [query,   setQuery]   = useState('');
  const [open,    setOpen]    = useState(false);
  const containerRef = useRef(null);
  const inputRef     = useRef(null);

  const selected    = options.find(o => String(o.value) === String(value));
  const filled      = !!selected;
  const floating    = open || focused || filled;
  const isActive    = open || focused;
  const borderColor = error ? '#d32f2f' : isActive ? '#0152EA' : '#E2E8F0';
  const labelColor  = error ? '#d32f2f' : isActive ? '#0152EA' : '#1F2A3D';

  // Notch width same formula as FloatInput
  const notchW = floating && label ? label.length * 6.6 + 10 : 0;

  const filtered = query
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false); setFocused(false); setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const DROPDOWN_MAX_HEIGHT = 220;
  const DROPDOWN_ROW_HEIGHT = 38;

  const getDropPos = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { top: 0, left: 0, width: 200 };

    // Only reserve as much space as the list actually needs, not the max cap -
    // short lists (e.g. 2 options) shouldn't flip upward just because they're near the bottom.
    const neededHeight = Math.min((filtered.length || 1) * DROPDOWN_ROW_HEIGHT, DROPDOWN_MAX_HEIGHT);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward = spaceBelow < neededHeight && spaceAbove > spaceBelow;

    return openUpward
      ? { openUpward: true, bottom: window.innerHeight - rect.top + 4, left: rect.left, width: rect.width }
      : { openUpward: false, top: rect.bottom + 4, left: rect.left, width: rect.width };
  };

  const handleOpen = () => {
    if (disabled) return;
    setOpen(true); setFocused(true); setQuery('');
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const handleClose = () => {
    setOpen(false); setFocused(false); setQuery('');
  };

  const handleSelect = (opt) => {
    onChange(opt.value);
    handleClose();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(''); setQuery('');
  };

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={containerRef}>

      {/* Floating label */}
      {label && (
        <label
          onClick={handleOpen}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 1,
            pointerEvents: floating ? 'none' : 'auto',
            cursor: 'pointer',
            transformOrigin: 'top left',
            transform: floating
              ? 'translate(14px, -9px) scale(0.75)'
              : 'translate(14px, 6px) scale(1)',
            transition: 'transform 200ms cubic-bezier(0,0,0.2,1), color 200ms',
            fontSize: '0.875rem',
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 600,
            lineHeight: 1.4375,
            color: labelColor,
            backgroundColor: floating ? '#fff' : 'transparent',
            padding: floating ? '0 4px' : '0',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </label>
      )}

      {/* Wrapper — the visible border box */}
      <div
        onClick={handleOpen}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          minHeight: 36,
          borderRadius: '8px',
          boxSizing: 'border-box',
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: disabled ? '#F8FAFC' : '#fff',
        }}
      >
        {/* Notched fieldset border */}
        <fieldset
          aria-hidden
          style={{
            position: 'absolute',
            inset: '-8px 0px 0px',
            bottom: 0,
            margin: 0,
            padding: '0 8px',
            borderRadius: '8px',
            border: `1px solid ${borderColor}`,
            pointerEvents: 'none',
            transition: 'border-color 200ms',
            overflow: 'hidden',
          }}
        >
          <legend style={{
            float: 'unset',
            display: 'block',
            visibility: 'hidden',
            overflow: 'hidden',
            height: '11px',
            padding: 0,
            fontSize: '0.75em',
            maxWidth: floating ? `${notchW}px` : '0.01px',
            transition: 'max-width 100ms cubic-bezier(0,0,0.2,1) 50ms',
            whiteSpace: 'nowrap',
            marginLeft: '6px',
          }}>&ZeroWidthSpace;{label}</legend>
        </fieldset>

        {/* Input area — same padding as FloatInput to get identical height */}
        <div style={{
          flex: 1,
          minWidth: 0,
          padding: '0 14px',
          paddingRight: '40px',
          boxSizing: 'border-box',
        }}>
          {open ? (
            <input
              ref={inputRef}
              id={id}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={`Cari ${label || ''}...`}
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 400,
                color: '#1E293B',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                width: '100%',
                padding: 0,
                margin: 0,
                height: 36,
                lineHeight: '36px',
              }}
            />
          ) : (
            <span style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 400,
              color: selected ? '#1E293B' : 'transparent',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: '36px',
            }}>
              {selected ? selected.label : ' '}
            </span>
          )}
        </div>

        {/* Icons */}
        <div style={{
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pointerEvents: 'auto',
        }}>
          <button
            type="button"
            onClick={open ? (e) => { e.stopPropagation(); handleClose(); } : (e) => { e.stopPropagation(); handleOpen(); }}
            style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', padding: 0, borderRadius: 4 }}
          >
            <svg
              style={{ transition: 'transform 200ms', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
              width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
            >
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown — fixed position to avoid clipping */}
      {open && <DropdownList
        pos={getDropPos()}
        filtered={filtered}
        value={value}
        onSelect={handleSelect}
      />}

      {helperText && (
        <p style={{ fontSize: '0.75rem', marginTop: 4, marginLeft: 2, color: error ? '#d32f2f' : '#94A3B8' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}
