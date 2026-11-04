/**
 * ToggleGroup — mirip MUI ToggleButtonGroup (exclusive).
 * Props:
 *   label, options: [{value, label}], value, onChange(value)
 */
export function ToggleGroup({ label, options = [], value, onChange }) {
  return (
    <div>
      {label && (
        <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 8, fontFamily: 'Manrope,sans-serif' }}>
          {label}
        </p>
      )}
      <div style={{ display: 'inline-flex', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
        {options.map((opt, i) => {
          const active = String(opt.value) === String(value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              style={{
                padding: '7px 18px',
                fontSize: 13.5, fontWeight: active ? 600 : 400,
                fontFamily: 'Manrope,sans-serif',
                cursor: 'pointer',
                border: 'none',
                borderLeft: i > 0 ? '1px solid #E2E8F0' : 'none',
                background: active ? 'rgba(1,82,234,0.08)' : '#fff',
                color: active ? '#0152EA' : '#6B7280',
                transition: 'background 150ms, color 150ms',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F8FAFC'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = '#fff'; }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
