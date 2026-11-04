import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

/**
 * Dropdown select with built-in search filter.
 * Props:
 *   id, label, options: [{value, label, sub?}], value, onChange(value),
 *   placeholder, error, helperText, disabled
 */
export function SearchableSelect({
  id, label, options = [], value = '', onChange,
  placeholder = 'Select...', error = false, helperText, disabled = false,
}) {
  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState('');
  const containerRef          = useRef(null);
  const inputRef              = useRef(null);

  const selected = options.find(o => String(o.value) === String(value));

  const filtered = query.trim()
    ? options.filter(o =>
        o.label.toLowerCase().includes(query.toLowerCase()) ||
        (o.sub ?? '').toLowerCase().includes(query.toLowerCase())
      )
    : options;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleSelect = (opt) => {
    onChange(opt.value);
    setOpen(false);
    setQuery('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setQuery('');
  };

  const borderColor = error ? '#d32f2f' : open ? '#0152EA' : '#E2E8F0';
  const labelColor  = error ? '#d32f2f' : open ? '#0152EA' : '#9CA3AF';
  const floating    = open || !!selected;
  const notchW      = floating && label ? label.length * 6.6 + 10 : 0;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Floating label */}
      {label && (
        <label
          htmlFor={id}
          style={{
            position: 'absolute', left: 0, top: 0, zIndex: 2,
            pointerEvents: 'none',
            transformOrigin: 'top left',
            transform: floating
              ? 'translate(14px, -9px) scale(0.75)'
              : 'translate(14px, 10px) scale(1)',
            transition: 'transform 150ms, color 150ms',
            fontSize: '0.875rem', color: labelColor,
            fontFamily: 'Manrope, sans-serif', fontWeight: 500,
            background: floating ? '#fff' : 'transparent',
            padding: floating ? '0 4px' : '0',
          }}
        >
          {label}
        </label>
      )}

      {/* Trigger button */}
      <div
        id={id}
        role="combobox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 12px', borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
          border: 'none', outline: 'none',
          background: disabled ? '#F9FAFB' : '#fff',
          height: 36, minHeight: 36, position: 'relative',
          fontFamily: 'Manrope, sans-serif',
        }}
      >
        {/* Notch border — satu-satunya border */}
        <fieldset style={{
          position: 'absolute', inset: '-6px 0 0', margin: 0, padding: '0 8px',
          borderRadius: 8, border: `1.5px solid ${borderColor}`,
          pointerEvents: 'none', overflow: 'hidden',
          transition: 'border-color 150ms',
        }}>
          <legend style={{ padding: 0, lineHeight: 0, width: floating ? notchW : 0, transition: 'width 150ms' }}>
            <span style={{ opacity: 0, fontSize: '0.66rem' }}>{label}</span>
          </legend>
        </fieldset>

        <span style={{
          fontSize: 14, color: selected ? '#1F2A3D' : '#9CA3AF',
          fontFamily: 'Manrope, sans-serif', flex: 1, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 4,
        }}>
          {selected ? selected.label : (!label ? placeholder : '')}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {selected && !disabled && (
            <span onClick={handleClear} style={{ display: 'flex', cursor: 'pointer', color: '#9CA3AF', padding: 2 }}>
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={16}
            style={{
              color: '#9CA3AF',
              transform: open ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 150ms',
            }}
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: '#fff', borderRadius: 10, zIndex: 100,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          border: '1px solid #E2E8F0', overflow: 'hidden',
        }}>
          {/* Search input */}
          <div style={{
            padding: '8px 10px', borderBottom: '1px solid #F1F5F9',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Search size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cari nama..."
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: 13, color: '#1F2A3D', background: 'transparent',
                fontFamily: 'Manrope, sans-serif',
              }}
            />
            {query && (
              <span onClick={() => setQuery('')} style={{ cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
                <X size={13} />
              </span>
            )}
          </div>

          {/* Options list */}
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{
                padding: '14px 16px', fontSize: 13, color: '#9CA3AF',
                fontFamily: 'Manrope, sans-serif', textAlign: 'center',
              }}>
                No results found
              </div>
            ) : (
              filtered.map(opt => {
                const isActive = String(opt.value) === String(value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt)}
                    style={{
                      padding: '10px 14px', cursor: 'pointer',
                      background: isActive ? 'rgba(1,82,234,0.06)' : 'transparent',
                      borderLeft: isActive ? '3px solid #0152EA' : '3px solid transparent',
                      transition: 'background 100ms',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F8FAFC'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ fontSize: 13.5, fontWeight: isActive ? 600 : 400, color: isActive ? '#0152EA' : '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
                      {opt.label}
                    </div>
                    {opt.sub && (
                      <div style={{ fontSize: 11.5, color: '#9CA3AF', fontFamily: 'Manrope, sans-serif', marginTop: 1 }}>
                        {opt.sub}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {helperText && (
        <p style={{ fontSize: 11.5, color: error ? '#d32f2f' : '#6B7280', marginTop: 4, marginLeft: 14, fontFamily: 'Manrope, sans-serif' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}
