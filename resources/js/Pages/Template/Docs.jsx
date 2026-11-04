import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Eye, EyeOff, ChevronDown, ChevronUp, FileText, Check } from 'lucide-react';
import PageLayout from '../../Components/ui/shared/PageLayout';
import { DataTable } from '../../Components/ui/DataTable';
import { TablePagination } from '../../Components/ui/TablePagination';
import { FilterPopover } from '../../Components/ui/FilterPopover';
import { FloatInput } from '../../Components/ui/FloatInput';
import { FloatSelect } from '../../Components/ui/FloatSelect';

/* ─── helpers ─── */
function Section({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: 56 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F2A3D', marginBottom: 4, fontFamily: 'Manrope, sans-serif', borderBottom: '2px solid #0152EA', paddingBottom: 8, display: 'inline-block' }}>
        {title}
      </h2>
      <div style={{ marginTop: 20 }}>{children}</div>
    </section>
  );
}

function SubSection({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#5A6A85', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Manrope, sans-serif' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Preview({ children, bg = '#F4F7FB' }) {
  return (
    <div style={{ background: bg, borderRadius: 12, padding: 24, border: '1px solid #e0e6eb', marginBottom: 12 }}>
      {children}
    </div>
  );
}

function Code({ children }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div style={{ position: 'relative', marginBottom: 8 }}>
      <pre style={{
        background: '#1E2A3A',
        color: '#E2E8F0',
        borderRadius: 10,
        padding: '16px 20px',
        fontSize: 12.5,
        lineHeight: 1.7,
        overflowX: 'auto',
        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
        margin: 0,
      }}>
        <code>{children}</code>
      </pre>
      <button
        onClick={copy}
        style={{
          position: 'absolute', top: 10, right: 10,
          padding: '4px 10px', borderRadius: 6, border: '1px solid #334155',
          background: copied ? '#10B981' : '#2D3748', color: '#fff',
          fontSize: 11, cursor: 'pointer', fontFamily: 'Manrope, sans-serif',
          display: 'flex', alignItems: 'center', gap: 4, transition: 'background 200ms',
        }}>
        {copied ? <><Check size={11} /> Copied!</> : 'Copy'}
      </button>
    </div>
  );
}

function PropTable({ rows }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 20 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'Manrope, sans-serif' }}>
        <thead>
          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #e0e6eb' }}>
            {['Prop', 'Type', 'Default', 'Keterangan'].map(h => (
              <th key={h} style={{ padding: '8px 14px', textAlign: 'left', color: '#64748B', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([prop, type, def, desc], i) => (
            <tr key={prop} style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
              <td style={{ padding: '9px 14px' }}><code style={{ background: 'rgba(1,82,234,0.07)', color: '#0152EA', borderRadius: 4, padding: '2px 6px', fontSize: 12 }}>{prop}</code></td>
              <td style={{ padding: '9px 14px' }}><code style={{ background: '#F1F5F9', color: '#475569', borderRadius: 4, padding: '2px 6px', fontSize: 12 }}>{type}</code></td>
              <td style={{ padding: '9px 14px', color: '#94A3B8', fontSize: 12 }}>{def || '—'}</td>
              <td style={{ padding: '9px 14px', color: '#475569' }}>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── icon helpers ─── */
function IconEdit({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
      <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415z" />
    </svg>
  );
}
function IconTrash({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
}

/* ─── Toast component ─── */
const TOAST_VARIANTS = {
  success: {
    color: '#065F46', bg: '#ECFDF5', iconBg: '#10B981',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4.5-4.5 1.41-1.41L10 13.67l7.09-7.09L18.5 8l-8.5 8.5z"/></svg>,
  },
  error: {
    color: '#991B1B', bg: '#FEF2F2', iconBg: '#EF4444',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>,
  },
  warning: {
    color: '#92400E', bg: '#FFFBEB', iconBg: '#F59E0B',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>,
  },
  info: {
    color: '#1E3A8A', bg: '#EFF6FF', iconBg: '#0152EA',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>,
  },
};

function ToastItem({ id, type, message, onClose }) {
  const [visible, setVisible] = useState(false);
  const { color, bg, iconBg, icon } = TOAST_VARIANTS[type];

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => { setVisible(false); setTimeout(() => onClose(id), 300); }, 4000);
    return () => clearTimeout(t);
  }, [id, onClose]);

  const dismiss = () => { setVisible(false); setTimeout(() => onClose(id), 300); };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: bg,
      borderRadius: 6,
      padding: '10px 14px',
      minWidth: 288, maxWidth: 400,
      boxShadow: '0 3px 10px rgba(0,0,0,0.16)',
      transform: visible ? 'translateX(0)' : 'translateX(110%)',
      opacity: visible ? 1 : 0,
      transition: 'transform 300ms cubic-bezier(0.22,1,0.36,1), opacity 300ms ease',
      fontFamily: 'Manrope, sans-serif',
    }}>
      <span style={{ color: iconBg, flexShrink: 0, display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: 13.5, lineHeight: 1.5, flex: 1, color, fontWeight: 500 }}>{message}</span>
      <button
        onClick={dismiss}
        style={{ background: 'none', border: 'none', color: iconBg, cursor: 'pointer', padding: '2px', lineHeight: 1, flexShrink: 0, display: 'flex', opacity: 0.7, borderRadius: 4 }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
  );
}

function ToastContainer({ toasts, onClose }) {
  if (!toasts.length) return null;
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem {...t} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

function useToastDemo() {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback(id => setToasts(prev => prev.filter(t => t.id !== id)), []);
  const show = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);
  return { toasts, remove, show };
}

/* ─── color tokens ─── */
const COLORS = [
  { name: 'Primary',       hex: '#0152EA',                  usage: 'Button, link, focus, badge aktif' },
  { name: 'Primary hover', hex: 'rgba(1,82,234,0.08)',       usage: 'Hover bg untuk icon edit' },
  { name: 'Text dark',     hex: '#1F2A3D',                  usage: 'Judul halaman (h1)' },
  { name: 'Text body',     hex: '#2A3547',                  usage: 'Text utama' },
  { name: 'Text secondary',hex: '#5A6A85',                  usage: 'Subtext, label section' },
  { name: 'Text muted',    hex: '#98A4AE',                  usage: 'Placeholder, helper text' },
  { name: 'Border',        hex: '#e0e6eb',                  usage: 'Border card, input, divider' },
  { name: 'Background',    hex: '#F4F7FB',                  usage: 'Background halaman' },
  { name: 'Success',       hex: '#10B981',                  usage: 'Badge aktif / selesai' },
  { name: 'Warning',       hex: '#F59E0B',                  usage: 'Badge draft' },
  { name: 'Error',         hex: '#EF4444',                  usage: 'Badge nonaktif, trash button' },
];

/* ─── sample table data ─── */
const TABLE_DATA = [
  { id: '1', nama: 'Alice Wonderland', email: 'alice@mail.com',  jabatan: 'Dokter',      status: 'aktif'    },
  { id: '2', nama: 'Bob Marley',       email: 'bob@mail.com',    jabatan: 'Front Office', status: 'nonaktif' },
  { id: '3', nama: 'Charlie Brown',    email: 'charlie@mail.com',jabatan: 'Kasir',        status: 'aktif'    },
];

const COL_CELL = 'px-6 py-4 text-sm text-gray-700';

/* ─── nav ─── */
const NAV = [
  { id: 'colors',      label: 'Warna' },
  { id: 'buttons',     label: 'Button' },
  { id: 'badges',      label: 'Badge / Status' },
  { id: 'inputs',      label: 'Input' },
  { id: 'selects',     label: 'Select' },
  { id: 'search',      label: 'Search' },
  { id: 'table',       label: 'DataTable' },
  { id: 'pagination',  label: 'Pagination' },
  { id: 'filter',      label: 'FilterPopover' },
  { id: 'avatar',      label: 'Avatar' },
  { id: 'toast',       label: 'Toast / Notifikasi' },
  { id: 'addpage',     label: 'Tambah Halaman' },
];

export default function DocsPage() {
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch]           = useState('');
  const [filterVals, setFilterVals]   = useState({ status: 'all' });
  const [appliedVals, setAppliedVals] = useState({ status: 'all' });
  const [inputVal, setInputVal]       = useState('');
  const [selectVal, setSelectVal]     = useState('');
  const [multilineVal, setMultilineVal] = useState('');
  const [visibility, setVisibility]   = useState('show');
  const { toasts, remove: removeToast, show: showToast } = useToastDemo();

  const filtered = TABLE_DATA.filter(r => {
    const ms = r.nama.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase());
    const mf = appliedVals.status === 'all' || r.status === appliedVals.status;
    return ms && mf;
  });
  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <PageLayout currentPath="/template/docs">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, alignItems: 'start' }}>

        {/* ── Left nav ── */}
        <div style={{ position: 'sticky', top: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#98A4AE', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontFamily: 'Manrope, sans-serif' }}>
            KOMPONEN
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV.map(n => (
              <a
                key={n.id}
                href={`#${n.id}`}
                style={{ padding: '7px 12px', borderRadius: 8, fontSize: 13.5, color: '#5A6A85', textDecoration: 'none', fontFamily: 'Manrope, sans-serif', fontWeight: 500, transition: 'background 150ms, color 150ms' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(1,82,234,0.07)'; e.currentTarget.style.color = '#0152EA'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5A6A85'; }}
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>

        {/* ── Content ── */}
        <div>
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1F2A3D', margin: 0, fontFamily: 'Manrope, sans-serif' }}>
              UI Components
            </h1>
            <p style={{ color: '#64748B', marginTop: 8, fontFamily: 'Manrope, sans-serif', fontSize: 15 }}>
              Dokumentasi semua komponen UI yang digunakan di project Nex Healthcare.
              Font: <strong>Manrope</strong> · Primary: <code style={{ background: 'rgba(1,82,234,0.08)', color: '#0152EA', padding: '1px 6px', borderRadius: 4 }}>#0152EA</code>
            </p>
          </div>

          {/* ─── COLORS ─── */}
          <Section id="colors" title="Warna Sistem">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {COLORS.map(c => (
                <div key={c.name} style={{ background: '#fff', border: '1px solid #e0e6eb', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ height: 48, backgroundColor: c.hex, borderBottom: '1px solid #e0e6eb' }} />
                  <div style={{ padding: '10px 12px' }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: '#1F2A3D', margin: 0, fontFamily: 'Manrope, sans-serif' }}>{c.name}</p>
                    <p style={{ fontSize: 11, color: '#64748B', margin: '2px 0', fontFamily: 'ui-monospace, monospace' }}>{c.hex}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8', margin: 0, fontFamily: 'Manrope, sans-serif' }}>{c.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ─── BUTTONS ─── */}
          <Section id="buttons" title="Button">
            <SubSection title="Variants">
              <Preview>
                <div className="flex flex-wrap gap-3 items-center">
                  {/* Primary solid */}
                  <button style={{ backgroundColor: '#0152EA', color: '#fff', borderRadius: 8, border: 'none', padding: '8px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
                    Primary
                  </button>
                  {/* Outlined */}
                  <button style={{ border: '1px solid #0152EA', color: '#0152EA', borderRadius: 8, background: '#fff', padding: '8px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
                    Outlined
                  </button>
                  {/* Neutral */}
                  <button style={{ border: '1px solid #e0e6eb', color: '#374151', borderRadius: 8, background: '#fff', padding: '8px 18px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }} className="flex items-center gap-2">
                    <FileText size={15} /> Export File <ChevronDown size={13} />
                  </button>
                  {/* Icon + label */}
                  <button style={{ backgroundColor: '#0152EA', color: '#fff', borderRadius: 8, border: 'none', padding: '8px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }} className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5v14" /></svg>
                    Tambah Data
                  </button>
                </div>
              </Preview>
              <Code>{`{/* Primary */}
<button style={{ backgroundColor: '#0152EA', color: '#fff', borderRadius: 8,
  border: 'none', padding: '8px 18px', fontSize: 14, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
  Primary
</button>

{/* Outlined */}
<button style={{ border: '1px solid #0152EA', color: '#0152EA', borderRadius: 8,
  background: '#fff', padding: '8px 18px', fontWeight: 600, cursor: 'pointer',
  fontFamily: 'Manrope, sans-serif' }}>
  Outlined
</button>

{/* Neutral / Export */}
<button style={{ border: '1px solid #e0e6eb', color: '#374151', borderRadius: 8,
  background: '#fff', padding: '8px 18px', cursor: 'pointer',
  fontFamily: 'Manrope, sans-serif' }}
  className="flex items-center gap-2">
  <FileText size={15} /> Export File <ChevronDown size={13} />
</button>`}
              </Code>
            </SubSection>

            <SubSection title="Action Icon Buttons (Edit & Hapus)">
              <Preview>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                    style={{ color: '#0152EA' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Edit">
                    <IconEdit />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                    style={{ color: '#EF4444' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Hapus">
                    <IconTrash />
                  </button>
                </div>
              </Preview>
              <Code>{`{/* Edit — biru */}
<button className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
  style={{ color: '#0152EA' }}
  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'}
  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
  title="Edit">
  <IconEdit />
</button>

{/* Hapus — merah */}
<button className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
  style={{ color: '#EF4444' }}
  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
  title="Hapus">
  <IconTrash />
</button>`}
              </Code>
            </SubSection>
          </Section>

          {/* ─── BADGES ─── */}
          <Section id="badges" title="Badge / Status">
            <SubSection title="Variants">
              <Preview>
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                    style={{ backgroundColor: 'rgba(19,222,185,0.1)', color: '#10B981' }}>Aktif</span>
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                    style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>Nonaktif</span>
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                    style={{ backgroundColor: 'rgba(19,222,185,0.1)', color: '#10B981' }}>Selesai</span>
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                    style={{ backgroundColor: 'rgba(255,174,31,0.12)', color: '#F59E0B' }}>Draft</span>
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                    style={{ backgroundColor: 'rgba(234,179,8,0.1)', color: '#CA8A04' }}>Gold</span>
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                    style={{ backgroundColor: 'rgba(100,116,139,0.1)', color: '#475569' }}>Silver</span>
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                    style={{ backgroundColor: 'rgba(180,83,9,0.1)', color: '#B45309' }}>Bronze</span>

                  {/* Visibility toggle */}
                  <button
                    onClick={() => setVisibility(v => v === 'show' ? 'hidden' : 'show')}
                    className="flex items-center gap-1.5 text-xs font-medium"
                    style={{ color: visibility === 'show' ? '#0152EA' : '#64748B', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    {visibility === 'show'
                      ? <Eye size={15} style={{ color: '#0152EA' }} />
                      : <EyeOff size={15} style={{ color: '#64748B' }} />}
                    {visibility === 'show' ? 'Show' : 'Hidden'}
                  </button>
                </div>
              </Preview>
              <Code>{`{/* Aktif */}
<span className="inline-block px-3 py-1 text-xs font-medium rounded-full"
  style={{ backgroundColor: 'rgba(19,222,185,0.1)', color: '#10B981' }}>
  Aktif
</span>

{/* Nonaktif */}
<span className="inline-block px-3 py-1 text-xs font-medium rounded-full"
  style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
  Nonaktif
</span>

{/* Draft */}
<span className="inline-block px-3 py-1 text-xs font-medium rounded-full"
  style={{ backgroundColor: 'rgba(255,174,31,0.12)', color: '#F59E0B' }}>
  Draft
</span>

{/* Dynamic berdasarkan value */}
const STATUS_STYLE = {
  completed: { label: 'Selesai', bg: 'rgba(19,222,185,0.1)',  color: '#10B981' },
  draft:     { label: 'Draft',   bg: 'rgba(255,174,31,0.12)', color: '#F59E0B' },
};

<span className="inline-block px-3 py-1 text-xs font-medium rounded-full"
  style={{ backgroundColor: STATUS_STYLE[item.status].bg, color: STATUS_STYLE[item.status].color }}>
  {STATUS_STYLE[item.status].label}
</span>`}
              </Code>
            </SubSection>
          </Section>

          {/* ─── INPUTS ─── */}
          <Section id="inputs" title="FloatInput">
            <PropTable rows={[
              ['label',      'string',  '—',    'Floating label text'],
              ['id',         'string',  '—',    'HTML id untuk input'],
              ['value',      'string',  "''",   'Nilai input (controlled)'],
              ['onChange',   '(e)=>void','—',   'Handler perubahan'],
              ['type',       'string',  'text', 'HTML input type'],
              ['disabled',   'boolean', 'false','Nonaktifkan input'],
              ['multiline',  'boolean', 'false','Gunakan textarea'],
              ['rows',       'number',  '4',    'Jumlah baris (multiline)'],
              ['error',      'boolean', 'false','Tampilkan state error'],
              ['helperText', 'string',  '—',    'Teks helper di bawah input'],
            ]} />
            <SubSection title="Contoh">
              <Preview bg="#fff">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 600 }}>
                  <FloatInput id="doc-nama" label="Nama" value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="Masukkan nama" />
                  <FloatInput id="doc-email" label="Email" type="email" value="" onChange={() => {}} />
                  <FloatInput id="doc-disabled" label="Kode (disabled)" value="AUTO-001" disabled />
                  <FloatInput id="doc-error" label="No. HP" value="abc" error helperText="Nomor tidak valid" onChange={() => {}} />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <FloatInput id="doc-area" label="Catatan" multiline rows={3} value={multilineVal} onChange={e => setMultilineVal(e.target.value)} />
                  </div>
                </div>
              </Preview>
              <Code>{`import { FloatInput } from '../../../Components/ui/FloatInput';

<FloatInput id="nama" label="Nama" value={nama}
  onChange={e => setNama(e.target.value)} placeholder="Masukkan nama" />

<FloatInput id="kode" label="Kode" value="AUTO-001" disabled />

<FloatInput id="hp" label="No. HP" value={hp}
  onChange={e => setHp(e.target.value)}
  error={!valid} helperText={!valid ? 'Nomor tidak valid' : ''} />

<FloatInput id="catatan" label="Catatan" multiline rows={4}
  value={catatan} onChange={e => setCatatan(e.target.value)} />`}
              </Code>
            </SubSection>
          </Section>

          {/* ─── SELECTS ─── */}
          <Section id="selects" title="FloatSelect">
            <PropTable rows={[
              ['label',    'string',              '—',    'Floating label text'],
              ['id',       'string',              '—',    'HTML id'],
              ['options',  'Array<{value,label}>','[]',   'Daftar pilihan'],
              ['value',    'string',              "''",   'Nilai terpilih'],
              ['onChange', '(value)=>void',       '—',    'Callback saat pilihan berubah'],
              ['disabled', 'boolean',             'false','Nonaktifkan select'],
              ['error',    'boolean',             'false','Tampilkan state error'],
            ]} />
            <SubSection title="Contoh">
              <Preview bg="#fff">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 600 }}>
                  <FloatSelect id="doc-status" label="Status"
                    value={selectVal}
                    options={[
                      { value: '',         label: 'Semua'    },
                      { value: 'aktif',    label: 'Aktif'    },
                      { value: 'nonaktif', label: 'Nonaktif' },
                    ]}
                    onChange={setSelectVal}
                  />
                  <FloatSelect id="doc-jabatan" label="Jabatan"
                    value=""
                    options={[
                      { value: 'dokter',       label: 'Dokter'       },
                      { value: 'front_office', label: 'Front Office' },
                      { value: 'kasir',        label: 'Kasir'        },
                    ]}
                    onChange={() => {}}
                  />
                </div>
              </Preview>
              <Code>{`import { FloatSelect } from '../../../Components/ui/FloatSelect';

<FloatSelect
  id="status"
  label="Status"
  value={status}
  options={[
    { value: '',         label: 'Semua'    },
    { value: 'aktif',    label: 'Aktif'    },
    { value: 'nonaktif', label: 'Nonaktif' },
  ]}
  onChange={val => setStatus(val)}
/>`}
              </Code>
            </SubSection>
          </Section>

          {/* ─── SEARCH ─── */}
          <Section id="search" title="Search Input">
            <SubSection title="Contoh">
              <Preview>
                <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2 w-fit" style={{ borderRadius: 8 }}>
                  <Search size={15} className="text-gray-400 flex-shrink-0" />
                  <input
                    placeholder="Cari data..."
                    className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                    style={{ width: 180 }}
                  />
                </div>
              </Preview>
              <Code>{`import { Search } from 'lucide-react';

<div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2"
  style={{ borderRadius: 8 }}>
  <Search size={15} className="text-gray-400 flex-shrink-0" />
  <input
    value={search}
    onChange={e => { setSearch(e.target.value); setPage(0); }}
    placeholder="Cari..."
    className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
    style={{ width: 150 }}
  />
</div>`}
              </Code>
            </SubSection>
          </Section>

          {/* ─── TABLE ─── */}
          <Section id="table" title="DataTable">
            <PropTable rows={[
              ['columns',  'Array<{key,label,align?}>','[]',           'Definisi kolom header'],
              ['children', 'ReactNode (<tr>)',          '—',            'Baris-baris tabel'],
              ['empty',    'ReactNode',                 'Default SVG',  'Tampilan saat tidak ada data'],
              ['colSpan',  'number',                    'columns.length','colSpan empty row'],
              ['footer',   'ReactNode',                 '—',            'Slot bawah tabel (TablePagination)'],
            ]} />
            <SubSection title="Contoh live">
              <div style={{ marginBottom: 16 }} className="flex items-center gap-2">
                <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2" style={{ borderRadius: 8 }}>
                  <Search size={15} className="text-gray-400" />
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
                    placeholder="Cari nama..." className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent" style={{ width: 150 }} />
                </div>
                <FilterPopover
                  filters={[{ id: 'status', label: 'Status', options: [{ value: 'all', label: 'Semua' }, { value: 'aktif', label: 'Aktif' }, { value: 'nonaktif', label: 'Nonaktif' }] }]}
                  values={filterVals}
                  onChange={(id, val) => setFilterVals(p => ({ ...p, [id]: val }))}
                  onApply={() => { setAppliedVals({ ...filterVals }); setPage(0); }}
                  onClear={() => { setFilterVals({ status: 'all' }); setAppliedVals({ status: 'all' }); setPage(0); }}
                />
              </div>
              <DataTable
                columns={[
                  { key: 'nama',    label: 'Nama'    },
                  { key: 'email',   label: 'Email'   },
                  { key: 'jabatan', label: 'Jabatan' },
                  { key: 'status',  label: 'Status'  },
                  { key: 'aksi',    label: '', align: 'right' },
                ]}
                footer={
                  <TablePagination page={page} rowsPerPage={rowsPerPage} total={filtered.length}
                    onPageChange={setPage} onRowsPerPageChange={n => { setRowsPerPage(n); setPage(0); }}
                    rowsPerPageOptions={[2, 5, 10]} />
                }
              >
                {paged.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className={COL_CELL}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: '#0152EA' }}>
                          {r.nama[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{r.nama}</span>
                      </div>
                    </td>
                    <td className={COL_CELL}>{r.email}</td>
                    <td className={COL_CELL}>{r.jabatan}</td>
                    <td className={COL_CELL}>
                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                        style={{ backgroundColor: r.status === 'aktif' ? 'rgba(19,222,185,0.1)' : 'rgba(239,68,68,0.1)', color: r.status === 'aktif' ? '#10B981' : '#EF4444' }}>
                        {r.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-md transition-colors" style={{ color: '#0152EA' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <IconEdit />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-md transition-colors" style={{ color: '#EF4444' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </DataTable>
            </SubSection>
            <Code>{`import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';

const COL_CELL = 'px-6 py-4 text-sm text-gray-700';

<DataTable
  columns={[
    { key: 'nama',  label: 'Nama'  },
    { key: 'email', label: 'Email' },
    { key: 'aksi',  label: '', align: 'right' },
  ]}
  footer={
    <TablePagination
      page={page}
      rowsPerPage={rowsPerPage}
      total={filtered.length}
      onPageChange={setPage}
      onRowsPerPageChange={n => { setRowsPerPage(n); setPage(0); }}
    />
  }
>
  {paged.map(item => (
    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
      <td className={COL_CELL}>{item.nama}</td>
      <td className={COL_CELL}>{item.email}</td>
      <td className="px-6 py-4">
        {/* action buttons */}
      </td>
    </tr>
  ))}
</DataTable>`}
            </Code>
          </Section>

          {/* ─── PAGINATION ─── */}
          <Section id="pagination" title="TablePagination">
            <PropTable rows={[
              ['page',               'number',       '—',        'Halaman aktif (0-based)'],
              ['rowsPerPage',        'number',       '—',        'Jumlah baris per halaman'],
              ['total',              'number',       '—',        'Total keseluruhan data'],
              ['onPageChange',       '(n)=>void',    '—',        'Callback ganti halaman'],
              ['onRowsPerPageChange','(n)=>void',    '—',        'Callback ganti rows per page'],
              ['rowsPerPageOptions', 'number[]',     '[5,10,25,50]','Pilihan jumlah baris'],
            ]} />
            <SubSection title="Contoh standalone">
              <Preview>
                <TablePagination page={0} rowsPerPage={10} total={47} onPageChange={() => {}} onRowsPerPageChange={() => {}} />
              </Preview>
            </SubSection>
          </Section>

          {/* ─── FILTER ─── */}
          <Section id="filter" title="FilterPopover">
            <PropTable rows={[
              ['filters',  'Array<{id,label,options[]}>','[]',       'Definisi filter select'],
              ['values',   '{[id]: value}',               '{}',       'Nilai filter saat ini'],
              ['onChange', '(id,value)=>void',            '—',        'Callback perubahan filter'],
              ['onApply',  '()=>void',                    '—',        'Callback tombol Terapkan'],
              ['onClear',  '()=>void',                    '—',        'Callback tombol Clear all'],
              ['maxSpent', 'number',                      '1000000',  'Nilai max range slider'],
            ]} />
            <SubSection title="Contoh">
              <Preview>
                <FilterPopover
                  filters={[
                    { id: 'tier', label: 'Tier', options: [{ value: 'all', label: 'Semua' }, { value: 'Gold', label: 'Gold' }, { value: 'Silver', label: 'Silver' }] },
                  ]}
                  values={{ tier: 'all' }}
                  onChange={() => {}}
                  onApply={() => {}}
                  onClear={() => {}}
                  maxSpent={5000000}
                />
              </Preview>
              <Code>{`import { FilterPopover } from '../../../Components/ui/FilterPopover';

const FILTER_DEFS = [
  {
    id: 'status',
    label: 'Status',
    options: [
      { value: 'all',    label: 'Semua'    },
      { value: 'aktif',  label: 'Aktif'    },
    ],
  },
];

const [filterVals, setFilterVals]   = useState({ status: 'all' });
const [appliedVals, setAppliedVals] = useState({ status: 'all' });

<FilterPopover
  filters={FILTER_DEFS}
  values={filterVals}
  onChange={(id, val) => setFilterVals(prev => ({ ...prev, [id]: val }))}
  onApply={() => { setAppliedVals({ ...filterVals }); setPage(0); }}
  onClear={() => { setFilterVals({ status: 'all' }); setAppliedVals({ status: 'all' }); }}
/>`}
              </Code>
            </SubSection>
          </Section>

          {/* ─── AVATAR ─── */}
          <Section id="avatar" title="Avatar Inisial">
            <SubSection title="Contoh">
              <Preview>
                <div className="flex items-center gap-4">
                  {[['Alice Wonderland','#0152EA'],['Bob Marley','#10B981'],['Charlie B','#F59E0B']].map(([name, bg]) => (
                    <div key={name} className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: bg }}>
                        {name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-700">{name}</span>
                    </div>
                  ))}
                </div>
              </Preview>
              <Code>{`function initials(item) {
  return \`\${item.first_name[0]}\${item.last_name[0]}\`.toUpperCase();
}

<div className="w-9 h-9 rounded-full flex items-center justify-center
  text-xs font-bold text-white flex-shrink-0"
  style={{ backgroundColor: '#0152EA' }}>
  {initials(item)}
</div>`}
              </Code>
            </SubSection>
          </Section>

          {/* ─── TOAST ─── */}
          <Section id="toast" title="Toast / Notifikasi">
            <SubSection title="Live Demo">
              <Preview>
                <div className="flex flex-wrap gap-3">
                  {[
                    { type: 'success', label: 'Show Success', msg: 'Data berhasil disimpan!' },
                    { type: 'error',   label: 'Show Error',   msg: 'Terjadi kesalahan. Coba lagi.' },
                    { type: 'warning', label: 'Show Warning', msg: 'Perhatikan perubahan sebelum menyimpan.' },
                    { type: 'info',    label: 'Show Info',    msg: 'Sesi akan berakhir dalam 5 menit.' },
                  ].map(({ type, label, msg }) => (
                    <button
                      key={type}
                      onClick={() => showToast(type, msg)}
                      style={{
                        backgroundColor: '#fff',
                        color: TOAST_VARIANTS[type].iconBg,
                        border: `1.5px solid ${TOAST_VARIANTS[type].iconBg}`,
                        borderRadius: 8,
                        padding: '7px 16px',
                        fontSize: 13.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'Manrope, sans-serif',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = TOAST_VARIANTS[type].iconBg;
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#fff';
                        e.currentTarget.style.color = TOAST_VARIANTS[type].iconBg;
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 12, fontFamily: 'Manrope, sans-serif' }}>
                  Klik tombol di atas — notifikasi akan muncul di pojok kanan atas dan hilang otomatis setelah 4 detik.
                </p>
              </Preview>
            </SubSection>

            <SubSection title="Cara Pakai">
              <Code>{`// 1. Buat ToastContext di aplikasi utama
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback(id =>
    setToasts(prev => prev.filter(t => t.id !== id)), []);
  const show = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  return (
    <ToastContext.Provider value={{ success: m => show('success', m),
                                    error:   m => show('error',   m),
                                    warning: m => show('warning', m),
                                    info:    m => show('info',    m) }}>
      {children}
      <ToastContainer toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

// 2. Gunakan di komponen mana pun
const toast = useContext(ToastContext);

toast.success('Branch created successfully!');
toast.error('Gagal menyimpan data.');
toast.warning('Stok hampir habis.');
toast.info('Update tersedia.');`}</Code>
            </SubSection>

            <SubSection title="Spesifikasi">
              <PropTable rows={[
                ['type',     "'success' | 'error' | 'warning' | 'info'", '—',         'Variant notifikasi'],
                ['message',  'string',                                    '—',         'Teks yang ditampilkan'],
                ['duration', 'number (ms)',                               '4000',      'Waktu sebelum otomatis hilang'],
                ['position', 'string',                                    'top-right', 'Posisi: pojok kanan atas layar'],
              ]} />
            </SubSection>

            <SubSection title="Warna Variant">
              <div className="flex flex-wrap gap-3">
                {Object.entries(TOAST_VARIANTS).map(([key, { iconBg, bg }]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, background: bg, border: '1px solid #e0e6eb', borderRadius: 8, padding: '8px 14px' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: iconBg }} />
                    <span style={{ fontSize: 13, fontFamily: 'Manrope, sans-serif', color: '#374151', fontWeight: 600, textTransform: 'capitalize' }}>{key}</span>
                    <code style={{ fontSize: 11, color: '#64748B', background: 'rgba(255,255,255,0.6)', borderRadius: 4, padding: '1px 6px' }}>{iconBg}</code>
                  </div>
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ─── ADD PAGE ─── */}
          <Section id="addpage" title="Menambahkan Halaman Baru">
            <div style={{ background: '#fff', border: '1px solid #e0e6eb', borderRadius: 12, padding: 24 }}>
              <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Manrope, sans-serif', fontSize: 14, color: '#374151' }}>
                <li>
                  <strong>Buat file JSX</strong> di:
                  <Code>resources/js/Pages/Template/{'{modul}'}/NamaHalaman.jsx</Code>
                </li>
                <li>
                  <strong>Tambah route</strong> di <code>routes/web.php</code>:
                  <Code>{`Route::get('/template/modul/nama', [TemplateController::class, 'namaHalaman'])->name('template.namaHalaman');`}</Code>
                </li>
                <li>
                  <strong>Tambah method</strong> di <code>app/Http/Controllers/TemplateController.php</code>:
                  <Code>public function namaHalaman() {`{`} return Inertia::render('Template/modul/NamaHalaman'); {`}`}</Code>
                </li>
                <li>
                  <strong>Update sidebar</strong> di <code>resources/js/Pages/layout/SidebarItems.js</code> — pastikan <code>url</code> sama persis dengan route.
                </li>
                <li>
                  <strong>currentPath</strong> di <code>PageLayout</code> harus sama persis dengan URL route agar sidebar highlight benar.
                </li>
              </ol>
            </div>
          </Section>

        </div>
      </div>
    </PageLayout>
  );
}
