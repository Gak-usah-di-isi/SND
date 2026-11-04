import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { X, Search, ChevronDown } from 'lucide-react';
import { ToggleGroup } from '../../../Components/ui/ToggleGroup';
import { Icon } from '@iconify/react';

const CURRENCY_OPTIONS = [
  { value: 'IDR', label: 'Rupiah (IDR)' },
  { value: 'USD', label: 'Dollar (USD)' },
];

/* Searchable select flat — tanpa floating label, persis template */
function FlatSelect({ options = [], value = '', onChange, placeholder = 'Select...', error, helperText }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const ref               = useRef(null);
  const inputRef          = useRef(null);

  const selected = options.find(o => String(o.value) === String(value));
  const filtered = query.trim()
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()) || (o.sub ?? '').toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQuery(''); } };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 14px', paddingBottom: 4, height: 38, borderRadius: 8, boxSizing: 'border-box',
          border: `1px solid ${error ? '#d32f2f' : 'rgb(226,232,240)'}`,
          background: '#fff', cursor: 'pointer',
          fontFamily: 'Manrope, sans-serif',
        }}
      >
        <span style={{ fontSize: '0.875rem', color: selected ? 'rgb(31,42,61)' : 'rgb(148,163,184)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '38px' }}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} style={{ color: 'rgb(148,163,184)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 150ms' }} />
      </div>
      {helperText && <p style={{ fontSize: 11.5, color: '#d32f2f', margin: '4px 0 0 14px', fontFamily: 'Manrope,sans-serif' }}>{helperText}</p>}
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', borderRadius: 10, zIndex: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid rgb(226,232,240)', overflow: 'hidden' }}>
          <div style={{ padding: '8px 10px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={14} style={{ color: 'rgb(148,163,184)', flexShrink: 0 }} />
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, color: 'rgb(31,42,61)', background: 'transparent', fontFamily: 'Manrope,sans-serif' }} />
          </div>
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {filtered.length === 0
              ? <div style={{ padding: '14px 16px', fontSize: 13, color: 'rgb(148,163,184)', textAlign: 'center', fontFamily: 'Manrope,sans-serif' }}>No results found</div>
              : filtered.map(opt => {
                  const active = String(opt.value) === String(value);
                  return (
                    <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); setQuery(''); }}
                      style={{ padding: '10px 14px', cursor: 'pointer', background: active ? 'rgba(1,82,234,0.06)' : 'transparent', borderLeft: active ? '3px solid #0152EA' : '3px solid transparent' }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F8FAFC'; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(1,82,234,0.06)' : 'transparent'; }}
                    >
                      <div style={{ fontSize: 13.5, fontWeight: active ? 600 : 400, color: active ? '#0152EA' : 'rgb(31,42,61)', fontFamily: 'Manrope,sans-serif' }}>{opt.label}</div>
                      {opt.sub && <div style={{ fontSize: 11.5, color: 'rgb(148,163,184)', fontFamily: 'Manrope,sans-serif', marginTop: 1 }}>{opt.sub}</div>}
                    </div>
                  );
                })
            }
          </div>
        </div>
      )}
    </div>
  );
}

const ABOVE_LABEL = {
  fontSize: '0.875rem', fontWeight: 600, color: 'rgb(31,42,61)',
  fontFamily: 'Manrope, sans-serif', margin: '0 0 6px', display: 'block',
};

/* Disabled input dengan floating label — persis template HTML */
function DisabledField({ label, value, placeholder = '' }) {
  const filled = !!value;
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {label && (
        <label style={{
          position: 'absolute', left: 0, top: 0, zIndex: 1,
          pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
          transformOrigin: 'left top',
          transform: filled ? 'translate(14px, -9px) scale(0.75)' : 'translate(14px, 6px) scale(1)',
          transition: 'transform 200ms cubic-bezier(0,0,0.2,1)',
          fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.4375,
          fontFamily: 'Manrope, sans-serif', color: 'rgb(31,42,61)',
          background: filled ? '#fff' : 'transparent',
          padding: filled ? '0 4px' : '0',
        }}>
          {label}
        </label>
      )}
      <div style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center',
        width: '100%', minHeight: 36, borderRadius: 8, boxSizing: 'border-box',
        cursor: 'not-allowed', backgroundColor: 'rgb(248,250,252)',
      }}>
        <fieldset aria-hidden="true" style={{
          position: 'absolute', inset: '-8px 0 0', margin: 0, padding: '0 8px',
          borderRadius: 8, border: '1px solid rgb(226,232,240)',
          pointerEvents: 'none', overflow: 'hidden',
        }}>
          <legend style={{
            display: 'block', visibility: 'hidden', overflow: 'hidden',
            height: 11, padding: 0, fontSize: '0.75em',
            maxWidth: filled && label ? `${label.length * 6.6 + 10}px` : '0.01px',
            transition: 'max-width 100ms cubic-bezier(0,0,0.2,1) 50ms',
            whiteSpace: 'nowrap', marginLeft: 6,
          }}>
            <span style={{ opacity: 0, fontSize: '0.66rem' }}>{label}</span>
          </legend>
        </fieldset>
        <input
          disabled
          value={value ?? ''}
          placeholder={!filled && !label ? placeholder : ''}
          type="text"
          style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem', fontWeight: 400,
            color: 'rgba(0,0,0,0.38)', background: 'transparent',
            border: 'none', outline: 'none', width: '100%',
            boxSizing: 'border-box', cursor: 'not-allowed',
            padding: '0 14px', height: 36, lineHeight: '36px',
          }}
        />
      </div>
    </div>
  );
}

/* Disabled textarea dengan floating label — persis Complaints/Notes di template */
function DisabledTextarea({ label, value, rows = 4 }) {
  const filled = !!value;
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {label && (
        <label style={{
          position: 'absolute', left: 0, top: 0, zIndex: 1,
          pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
          transformOrigin: 'left top',
          transform: filled ? 'translate(14px, -9px) scale(0.75)' : 'translate(14px, 8px) scale(1)',
          transition: 'transform 200ms cubic-bezier(0,0,0.2,1)',
          fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.4375,
          fontFamily: 'Manrope, sans-serif', color: 'rgb(31,42,61)',
          background: filled ? '#fff' : 'transparent',
          padding: filled ? '0 4px' : '0',
        }}>
          {label}
        </label>
      )}
      <div style={{
        position: 'relative', display: 'inline-flex', alignItems: 'flex-start',
        width: '100%', borderRadius: 8, boxSizing: 'border-box',
        cursor: 'not-allowed', backgroundColor: 'rgb(248,250,252)',
      }}>
        <fieldset aria-hidden="true" style={{
          position: 'absolute', inset: '-8px 0 0', margin: 0, padding: '0 8px',
          borderRadius: 8, border: '1px solid rgb(226,232,240)',
          pointerEvents: 'none', overflow: 'hidden',
        }}>
          <legend style={{
            display: 'block', visibility: 'hidden', overflow: 'hidden',
            height: 11, padding: 0, fontSize: '0.75em',
            maxWidth: filled && label ? `${label.length * 6.6 + 10}px` : '0.01px',
            transition: 'max-width 100ms cubic-bezier(0,0,0.2,1) 50ms',
            whiteSpace: 'nowrap', marginLeft: 6,
          }}>
            <span style={{ opacity: 0, fontSize: '0.66rem' }}>{label}</span>
          </legend>
        </fieldset>
        <textarea
          disabled
          rows={rows}
          value={value ?? ''}
          style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem', fontWeight: 400,
            color: 'rgba(0,0,0,0.38)', background: 'transparent',
            border: 'none', outline: 'none', width: '100%',
            boxSizing: 'border-box', cursor: 'not-allowed',
            padding: '6px 14px 12px', resize: 'none', lineHeight: 1.5,
          }}
        />
      </div>
    </div>
  );
}

export default function CreatePaymentDrawer({ open, onClose, users = [] }) {
  const fileRef = useRef(null);
  const [form, setForm]         = useState({ user_id: '', currency: 'IDR', amount: '' });
  const [file, setFile]         = useState(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const userOptions = users.map(u => ({
    value: u.id, label: u.name,
    sub: u.institution ?? u.email ?? '',
  }));

  useEffect(() => {
    if (open) {
      setForm({ user_id: '', currency: 'IDR', amount: '' });
      setFile(null); setErrors({}); setSelectedUser(null);
    }
  }, [open]);

  useEffect(() => {
    const u = users.find(u => String(u.id) === String(form.user_id));
    setSelectedUser(u ?? null);
  }, [form.user_id]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const setVal   = (key) => (val) => setForm(f => ({ ...f, [key]: val }));
  const setInput = (key) => (e)   => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = () => {
    const errs = {};
    if (!form.user_id) errs.user_id = 'Participant is required.';
    if (!form.amount)  errs.amount  = 'Amount is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const data = new FormData();
    data.append('user_id',  form.user_id);
    data.append('currency', form.currency);
    data.append('amount',   form.amount);
    if (file) data.append('file', file);
    router.post('/admin/manual-receipt', data, {
      forceFormData: true,
      onSuccess: () => { setLoading(false); onClose(); },
      onError: (e) => { setErrors(e); setLoading(false); },
    });
  };

  return (
    <>
      {/* Backdrop — terpisah dari drawer, tidak jadi parent */}
      {open && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          zIndex: 998,
        }} />
      )}

      {/* Drawer — z-index lebih tinggi dari backdrop */}
      <div className="fixed top-0 right-0 h-full bg-white flex flex-col transition-transform duration-300" style={{ zIndex: 999,
        width: '75vw', maxWidth: '75vw',
        transform: open ? 'translateX(0px)' : 'translateX(100%)',
        boxShadow: 'rgba(0,0,0,0.14) -4px 0px 32px',
        borderRadius: '16px 0px 0px 16px',
      }}>

        {/* Header */}
        <div className="flex items-center justify-between px-10 pt-8 pb-5 flex-shrink-0 bg-white" style={{ borderRadius: '16px 0px 0px' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: 'rgb(17,24,39)', lineHeight: 1.2, margin: 0 }}>
            Create Payment
          </h2>
          <button type="button" onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Divider */}
        <div className="px-10 flex-shrink-0">
          <div className="border-t border-gray-200 mb-1" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-10 py-6">
          <div className="grid grid-cols-2 gap-5">

            {/* Participant */}
            <FlatSelect
              options={userOptions}
              value={form.user_id}
              onChange={setVal('user_id')}
              placeholder="Search and select participant..."
              error={!!errors.user_id}
              helperText={errors.user_id}
            />

            {/* No Handphone — disabled */}
            <div style={{ marginTop: 2 }}>
              <DisabledField
                label="Phone Number"
                value={selectedUser?.phone_number ?? ''}
              />
            </div>

            {/* Amount */}
            <div>
              <label style={ABOVE_LABEL}>Payment Amount *</label>
              <input
                type="number"
                value={form.amount}
                onChange={setInput('amount')}
                placeholder="Example: 500000"
                style={{
                  width: '100%', height: 36, padding: '0 14px', boxSizing: 'border-box',
                  borderRadius: 8, border: errors.amount ? '1px solid #d32f2f' : '1px solid rgb(226,232,240)',
                  background: '#fff', cursor: 'text', outline: 'none',
                  fontSize: '0.875rem', fontFamily: 'Manrope, sans-serif', color: 'rgb(31,42,61)',
                  lineHeight: '36px',
                }}
              />
              {errors.amount && <p style={{ fontSize: 11.5, color: '#d32f2f', margin: '4px 0 0 14px', fontFamily: 'Manrope,sans-serif' }}>{errors.amount}</p>}
            </div>

            {/* Currency */}
            <div>
              <ToggleGroup
                label="Currency *"
                options={CURRENCY_OPTIONS}
                value={form.currency}
                onChange={setVal('currency')}
              />
            </div>

            {/* Institusi — span 2, disabled */}
            <div className="col-span-2">
              <DisabledField label="Institution" value={selectedUser?.institution ?? ''} />
            </div>

            {/* Upload bukti — span 2 */}
            <div className="col-span-2">
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgb(31,42,61)', margin: '0 0 8px' }}>
                Payment Proof <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span>
              </p>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); }}
                style={{
                  padding: '20px 16px', borderRadius: 10, cursor: 'pointer',
                  border: `2px dashed ${dragging ? '#1976D2' : file ? '#10B981' : '#E0E0E0'}`,
                  background: dragging ? 'rgba(25,118,210,0.04)' : file ? 'rgba(16,185,129,0.04)' : '#fff',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  transition: 'border-color 150ms',
                }}
                onMouseEnter={e => { if (!file && !dragging) e.currentTarget.style.borderColor = '#1976D2'; }}
                onMouseLeave={e => { if (!file && !dragging) e.currentTarget.style.borderColor = '#E0E0E0'; }}
              >
                <Icon icon={file ? 'solar:check-circle-outline' : 'solar:upload-minimalistic-outline'}
                  width={28} style={{ color: file ? '#10B981' : '#9CA3AF' }} />
                <span style={{ fontSize: 13, color: file ? '#10B981' : '#6B7280', fontFamily: 'Manrope,sans-serif' }}>
                  {file ? file.name : 'Click or drag file here'}
                </span>
                <span style={{ fontSize: 11.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>
                  JPG, PNG, PDF — max 2MB
                </span>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
                  onChange={e => setFile(e.target.files?.[0] ?? null)} />
              </div>
              {file && (
                <button type="button" onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                  style={{ marginTop: 6, fontSize: 12, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Manrope,sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon icon="solar:trash-bin-minimalistic-outline" width={13} /> Remove file
                </button>
              )}
            </div>

            {/* Email — disabled */}
            <DisabledField label="Email" value={selectedUser?.email ?? ''} />

            {/* Negara — disabled */}
            <DisabledField label="Country" value={selectedUser?.country ?? ''} />

            {/* Judul Abstract + Abstract — 2 kolom textarea */}
            <DisabledTextarea
              label="Abstract Title"
              value={selectedUser?.abstracts?.[0]?.title ?? ''}
              rows={4}
            />
            <DisabledTextarea
              label="Abstract"
              value={selectedUser?.abstracts?.[0]?.abstract ?? ''}
              rows={4}
            />

          </div>
        </div>

        {/* Footer — persis template */}
        <div className="px-10 py-5 border-t border-gray-200 flex items-center gap-3 flex-shrink-0 bg-white" style={{ borderRadius: '0 0 0 16px' }}>
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            style={{ borderRadius: 9, fontFamily: 'Manrope,sans-serif' }}>
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-white transition-colors"
            style={{
              backgroundColor: loading ? '#93BFFD' : 'rgb(1,82,234)',
              borderRadius: 9, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Manrope,sans-serif', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
            {loading
              ? <><Icon icon="solar:refresh-outline" width={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
              : 'Create Payment'
            }
          </button>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
