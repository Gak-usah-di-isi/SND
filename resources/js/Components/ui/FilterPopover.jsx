import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FloatSelect } from './FloatSelect';

function Thumb({ pct, onMouseDown }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        left: `${pct}%`,
        transform: 'translateX(-50%)',
        width: hovered ? 38 : 20,
        height: hovered ? 38 : 20,
        borderRadius: '50%',
        background: hovered ? 'rgba(1,82,234,0.16)' : '#0152EA',
        border: hovered ? 'none' : '2px solid #fff',
        boxShadow: hovered ? 'none' : '0 2px 4px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        zIndex: 2,
        transition: 'width 150ms, height 150ms, background 150ms',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {hovered && (
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#0152EA', border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', flexShrink: 0 }} />
      )}
    </div>
  );
}

/* ---- Two-handle range slider (no external dep) ---- */
function RangeSlider({ min, max, value, onChange, step = 1 }) {
  const trackRef  = useRef(null);
  const dragging  = useRef(null); // 0 = left thumb, 1 = right thumb

  const pct = (v) => (max === min ? 0 : ((v - min) / (max - min)) * 100);

  const clamp = (v) => {
    const safeStep = step > 0 ? step : 1;
    return Math.min(max, Math.max(min, Math.round(v / safeStep) * safeStep));
  };

  const getValFromX = useCallback((clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return min;
    if (max === min) return min;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return clamp(min + ratio * (max - min));
  }, [min, max]);

  const onMouseDown = (e, idx) => {
    e.preventDefault();
    dragging.current = idx;
    const move = (ev) => {
      const v = getValFromX(ev.clientX);
      onChange(prev => {
        const next = [...prev];
        next[idx] = v;
        if (next[0] > next[1]) next[idx === 0 ? 1 : 0] = v;
        return [Math.min(next[0], next[1]), Math.max(next[0], next[1])];
      });
    };
    const up = () => { dragging.current = null; window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const leftPct  = pct(value[0]);
  const rightPct = pct(value[1]);

  return (
    <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
      {/* Track background */}
      <div ref={trackRef} style={{ position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 2, background: '#E2E8F0' }} />
      {/* Active range */}
      <div style={{ position: 'absolute', left: `${leftPct}%`, right: `${100 - rightPct}%`, height: 4, borderRadius: 2, background: '#0152EA' }} />
      {/* Left thumb */}
      <Thumb pct={leftPct} onMouseDown={e => onMouseDown(e, 0)} />
      {/* Right thumb */}
      <Thumb pct={rightPct} onMouseDown={e => onMouseDown(e, 1)} />
    </div>
  );
}

/**
 * Reusable filter popover — Filter button → floating panel with fields + Terapkan.
 * Props:
 *   filters: [{ id, label, options: [{value,label}] }]  — list of select filters
 *   values: { [id]: value }
 *   onChange: (id, value) => void
 *   onApply: () => void
 *   onClear: () => void
 */
const FORMAT_SPENT = (v) => {
  if (v >= 1000000) return `${(v / 1000000).toFixed(v % 1000000 === 0 ? 0 : 1)}jt`;
  if (v >= 1000)    return `${Math.floor(v / 1000)}rb`;
  return String(v);
};

function TerapkanButton({ onApply, setOpen }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { onApply?.(); setOpen(false); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        padding: '10px 0',
        borderRadius: 8,
        border: 'none',
        background: hovered ? 'rgba(1,82,234,0.2)' : 'rgba(1,82,234,0.1)',
        color: '#0152EA',
        fontSize: '0.875rem',
        fontWeight: 600,
        fontFamily: 'Manrope, sans-serif',
        cursor: 'pointer',
        marginTop: 4,
        transition: 'background 150ms',
      }}
    >
      Terapkan
    </button>
  );
}

export function FilterPopover({
  filters = [],
  values = {},
  onChange,
  onApply,
  onClear,
  showRange = true,
  maxSpent = 1000000,
  rangeLabel = 'Total Spent',
  rangeValue,
  onRangeChange,
  formatRange = FORMAT_SPENT,
  rangeStep = 10000,
}) {
  const [open, setOpen]   = useState(false);
  const [pos, setPos]     = useState({ top: 0, left: 0 });
  const [range, setRange] = useState([0, maxSpent]);
  const btnRef     = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(rangeValue) && rangeValue.length === 2) {
      const next = [rangeValue[0], rangeValue[1]];
      if (next[0] !== range[0] || next[1] !== range[1]) {
        setRange(next);
      }
    }
  }, [rangeValue, range]);

  const handleRangeChange = (next) => {
    if (Array.isArray(rangeValue)) {
      onRangeChange?.(next);
      return;
    }
    setRange(next);
    onRangeChange?.(next);
  };

  const updatePos = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const popW = 360;
    const vw   = document.documentElement.clientWidth;
    const left = Math.min(Math.max(16, rect.left), vw - popW - 16);
    setPos({ top: rect.bottom + 8, left });
  };

  const handleToggle = () => {
    if (!open) setTimeout(updatePos, 0);
    setOpen(v => !v);
  };

  useEffect(() => {
    if (!open) return;
    const onResize = () => updatePos();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, { passive: true });
    return () => { window.removeEventListener('resize', onResize); window.removeEventListener('scroll', onResize); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (popoverRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return;
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
        onClick={handleToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          height: 36, padding: '0 14px',
          border: `1px solid ${open ? '#0152EA' : '#E2E8F0'}`,
          borderRadius: 8,
          background: '#fff',
          fontSize: '0.875rem',
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 500,
          color: open ? '#0152EA' : '#374151',
          cursor: 'pointer',
          transition: 'border-color 150ms, color 150ms',
        }}
      >
        {/* Tabler IconFilter */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16v2.172a2 2 0 0 1-.586 1.414L14 13v7l-4-2v-5L4.586 7.586A2 2 0 0 1 4 6.172V4z" />
        </svg>
        Filter
      </button>

      {open && createPortal(
        <div
          ref={popoverRef}
          style={{
            position: 'fixed',
            zIndex: 99999,
            top: pos.top,
            left: pos.left,
            width: 360,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(16,24,40,0.10)',
            border: '1px solid #F1F5F9',
            padding: 16,
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>Filter</span>
            <button
              type="button"
              onClick={() => { onClear?.(); }}
              style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#0152EA', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
            >
              Clear all
            </button>
          </div>

          {/* Filter fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filters.map(f => (
              <FloatSelect
                key={f.id}
                id={`filter-${f.id}`}
                label={f.label}
                options={f.options}
                value={values[f.id] ?? ''}
                onChange={v => onChange?.(f.id, v)}
              />
            ))}

            {/* Range slider */}
            {showRange && (
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>{rangeLabel}</span>
                <div style={{ marginTop: 10, padding: '0 2px' }}>
                  <RangeSlider min={0} max={maxSpent} value={range} onChange={handleRangeChange} step={rangeStep} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'Manrope, sans-serif' }}>{formatRange(range[0])}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'Manrope, sans-serif' }}>{formatRange(range[1])}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Terapkan */}
            <TerapkanButton onApply={onApply} setOpen={setOpen} />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
