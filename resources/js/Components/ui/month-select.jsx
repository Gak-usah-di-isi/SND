import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function MonthSelect({ value, onChange, options, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 border border-gray-200 bg-white text-sm text-gray-700 px-3 py-1.5 outline-none transition-colors hover:bg-gray-50"
        style={{ borderRadius: '6px', minWidth: 140 }}
      >
        <span className="flex-1 text-left">{selected?.label ?? '—'}</span>
        <ChevronDown size={14} className="text-gray-400 flex-shrink-0" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 bg-white border border-gray-200 overflow-hidden z-[9999] py-1"
          style={{ borderRadius: '9px', minWidth: 160, boxShadow: '0px 8px 24px rgba(0,0,0,0.12)' }}
        >
          <div className="max-h-[260px] overflow-y-auto">
            {options.map((opt) => {
              const isActive = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange?.(opt.value); setOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm transition-colors"
                  style={{
                    backgroundColor: isActive ? 'rgba(1,82,234,0.08)' : 'transparent',
                    color: isActive ? '#0152EA' : '#5A6A85',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#f6f7f9'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <span>{opt.label}</span>
                  {isActive && <Check size={14} className="flex-shrink-0" style={{ color: '#0152EA' }} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
