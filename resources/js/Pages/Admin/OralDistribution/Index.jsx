import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { router } from '@inertiajs/react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Icon } from '@iconify/react';
import AdminPageLayout from '../../../Components/ui/shared/AdminPageLayout';
import StatusBadge from '../../../Components/ui/StatusBadge';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import { FilterPopover } from '../../../Components/ui/FilterPopover';

const ROLE_LABEL = {
  'indonesia-participants': 'ID Participant',
  'indonesia-presenter':    'ID Presenter',
  'foreign-participants':   'Foreign Participant',
  'foreign-presenter':      'Foreign Presenter',
};

/* ---------- Inline Symposium Dropdown ---------- */
// Menu is rendered through a portal to <body>, so it can never be clipped by
// the accordion's `overflow: hidden` (which is kept to round the card corners).
const SYM_MENU_WIDTH = 260;
const SYM_MENU_MAX_HEIGHT = 200;
const SYM_MENU_ROW_HEIGHT = 35;

function SymposiumInlineSelect({ abstractId, currentSymposiumId, symposiums, onSuccess }) {
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [pos, setPos]         = useState({ top: 0, left: 0, width: SYM_MENU_WIDTH, openUpward: false, bottom: 0 });
  const btnRef  = useRef(null);
  const listRef = useRef(null);
  const current = symposiums.find(s => String(s.id) === String(currentSymposiumId));

  const handleSelect = (sym) => {
    if (String(sym.id) === String(currentSymposiumId)) { setOpen(false); return; }
    setLoading(true);
    router.put(`/admin/oral/${abstractId}`, { symposium_id: sym.id }, {
      onSuccess: () => { setLoading(false); setOpen(false); onSuccess(sym); },
      onError:   () => { setLoading(false); setOpen(false); },
      preserveScroll: true,
    });
  };

  const openDropdown = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Flip upward when the list would run past the bottom of the viewport
    // (e.g. the last rows of the last accordion).
    const neededHeight = Math.min(Math.max(symposiums.length, 1) * SYM_MENU_ROW_HEIGHT, SYM_MENU_MAX_HEIGHT);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward = spaceBelow < neededHeight && spaceAbove > spaceBelow;

    const width = Math.max(SYM_MENU_WIDTH, rect.width);
    const maxLeft = document.documentElement.clientWidth - width - 8;
    const left = Math.min(Math.max(8, rect.right - width), Math.max(8, maxLeft));

    setPos(openUpward
      ? { openUpward: true, bottom: window.innerHeight - rect.top + 4, left, width }
      : { openUpward: false, top: rect.bottom + 4, left, width });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e) => {
      if (listRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKeyDown = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openDropdown())}
        disabled={loading}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 7, height: 30,
          border: '1px solid #E2E8F0', background: '#fff',
          fontSize: 12.5, fontFamily: 'Manrope,sans-serif', fontWeight: 500,
          color: '#374151', cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'border-color 150ms', whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#0152EA'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
      >
        {loading
          ? <Icon icon="solar:refresh-outline" width={13} style={{ animation: 'spin 1s linear infinite' }} />
          : null
        }
        <span style={{ color: '#0152EA', fontWeight: 600 }}>{current?.abbreviation ?? '—'}</span>
        <ChevronDown size={12} style={{ color: '#9CA3AF' }} />
      </button>

      {open && createPortal(
        <div
          ref={listRef}
          onMouseDown={e => e.stopPropagation()}
          style={{
            position: 'fixed', zIndex: 99999,
            ...(pos.openUpward ? { bottom: pos.bottom } : { top: pos.top }),
            left: pos.left, width: pos.width,
            background: '#fff', borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            border: '1px solid #E2E8F0', overflow: 'hidden',
          }}
        >
          <div style={{ maxHeight: SYM_MENU_MAX_HEIGHT, overflowY: 'auto' }}>
            {symposiums.map(sym => {
              const active = String(sym.id) === String(currentSymposiumId);
              return (
                <div
                  key={sym.id}
                  onClick={() => handleSelect(sym)}
                  style={{
                    padding: '8px 14px', cursor: 'pointer',
                    background: active ? 'rgba(1,82,234,0.06)' : '#fff',
                    borderLeft: active ? '3px solid #0152EA' : '3px solid transparent',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F8FAFC'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(1,82,234,0.06)' : '#fff'; }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0152EA', background: 'rgba(1,82,234,0.08)', padding: '1px 6px', borderRadius: 4, flexShrink: 0, fontFamily: 'Manrope,sans-serif' }}>
                    {sym.abbreviation}
                  </span>
                  <span style={{ fontSize: 12.5, color: active ? '#0152EA' : '#374151', fontFamily: 'Manrope,sans-serif', fontWeight: active ? 600 : 400 }}>
                    {sym.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

/* ---------- Symposium Accordion ---------- */
function SymposiumSection({ symposium, allSymposiums, toast }) {
  const [open, setOpen]       = useState(false);
  const [abstracts, setAbstracts] = useState(symposium.abstracts ?? []);
  const count = abstracts.length;

  const handleMoved = (abstractId, newSym) => {
    toast.success(`Abstract moved to ${newSym.abbreviation}.`);
    setAbstracts(prev => prev.map(a =>
      a.id === abstractId ? { ...a, symposium_id: newSym.id } : a
    ));
  };

  if (count === 0) return null;

  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: '1px solid #E2E8F0', marginBottom: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden',
    }}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: open ? '#F8FAFF' : '#fff',
          border: 'none', borderBottom: open ? '1px solid #E2E8F0' : 'none',
          cursor: 'pointer', transition: 'background 150ms',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            background: 'rgba(1,82,234,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon icon="solar:microphone-3-outline" width={17} style={{ color: '#0152EA' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 14.5, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
              {symposium.name}
            </p>
            <p style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
              {symposium.abbreviation}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
            background: 'rgba(1,82,234,0.08)', color: '#0152EA',
            fontFamily: 'Manrope,sans-serif',
          }}>
            {count} presenter
          </span>
          {open ? <ChevronUp size={16} style={{ color: '#6B7280' }} /> : <ChevronDown size={16} style={{ color: '#6B7280' }} />}
        </div>
      </button>

      {/* Table */}
      {open && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['#', 'Title & Author', 'Status', 'Symposium'].map(h => (
                  <th key={h} style={{
                    padding: '10px 16px', fontSize: 11.5, fontWeight: 600,
                    color: '#6B7280', fontFamily: 'Manrope,sans-serif',
                    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em',
                    borderBottom: '1px solid #F1F5F9',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {abstracts.map((abstract, i) => {
                const initials = (abstract.user?.name ?? abstract.authors ?? '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
                const shortTitle = abstract.title?.length > 80
                  ? abstract.title.slice(0, 80) + '...'
                  : abstract.title;

                return (
                  <tr key={abstract.id} style={{ borderBottom: '1px solid #F1F5F9' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFBFF'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    {/* No */}
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', width: 40 }}>
                      {i + 1}
                    </td>

                    {/* Judul + Author */}
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: '0 0 3px', lineHeight: 1.3 }}>
                        {shortTitle}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', background: '#0152EA',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', fontFamily: 'Manrope,sans-serif' }}>{initials}</span>
                        </div>
                        <span style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>
                          {abstract.authors ?? abstract.user?.name ?? '-'}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px 16px', width: 110 }}>
                      <StatusBadge label={abstract.status ?? 'open'} />
                    </td>

                    {/* Symposium inline select */}
                    <td style={{ padding: '12px 16px', width: 140 }}>
                      <SymposiumInlineSelect
                        abstractId={abstract.id}
                        currentSymposiumId={abstract.symposium_id ?? symposium.id}
                        symposiums={allSymposiums}
                        onSuccess={(newSym) => handleMoved(abstract.id, newSym)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------- Main Page ---------- */
export default function OralDistributionIndexPage({ symposiums = [], allSymposiums = [], stats = [], search: initialSearch = '', filter: initialFilter = '' }) {
  const toast = useToast();
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState(initialFilter);

  const totalOral = stats.reduce((sum, s) => sum + s.count, 0);

  const navigate = (params) => {
    router.get('/admin/oral', params, { preserveScroll: true, preserveState: true });
  };

  const handleSearch = (val) => {
    setSearch(val);
    navigate({ search: val, symposium: filter });
  };

  const handleFilter = (val) => {
    setFilter(val);
    navigate({ search, symposium: val });
  };

  return (
    <AdminPageLayout currentPath="/admin/oral">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
            Oral Distribution
          </h1>
          <p style={{ fontSize: 13, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', marginTop: 4 }}>
            {stats.filter(s => s.count > 0).length} symposiums · {totalOral} oral presenters
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {stats.filter(s => s.count > 0).map(s => {
          const active = filter === String(s.id);
          return (
            <div
              key={s.id}
              onClick={() => handleFilter(active ? '' : String(s.id))}
              style={{
                padding: '14px 18px', borderRadius: 10, cursor: 'pointer',
                border: active ? '1.5px solid #0152EA' : '1px solid #E2E8F0',
                background: active ? 'rgba(1,82,234,0.06)' : '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                display: 'flex', flexDirection: 'column', gap: 2, minWidth: 90,
                transition: 'all 150ms',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', fontFamily: 'Manrope,sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {s.abbr}
              </span>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#0152EA', fontFamily: 'Manrope,sans-serif', lineHeight: 1 }}>
                {s.count}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(1,82,234,0.45)', fontFamily: 'Manrope,sans-serif', fontWeight: 500 }}>presenter</span>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {/* Kiri: Filter symposium */}
        <FilterPopover
          filters={[{
            id: 'symposium',
            label: 'Symposium',
            options: allSymposiums.map(s => ({ value: String(s.id), label: `${s.abbreviation} — ${s.name}` })),
          }]}
          values={{ symposium: filter }}
          onChange={(_, val) => handleFilter(val)}
          onApply={() => {}}
          onClear={() => handleFilter('')}
          showRange={false}
        />

        {/* Kanan: Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E2E8F0', background: '#fff', padding: '6px 12px', borderRadius: 8, height: 36 }}>
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search title / author..."
            style={{ width: 200, border: 'none', outline: 'none', fontSize: 13, fontFamily: 'Manrope,sans-serif', background: 'transparent', color: '#374151' }}
          />
        </div>
      </div>

      {/* Symposium accordions */}
      {symposiums.filter(s => (s.abstracts?.length ?? 0) > 0).map(symposium => (
        <SymposiumSection
          key={symposium.id}
          symposium={symposium}
          allSymposiums={allSymposiums}
          toast={toast}
        />
      ))}

      {symposiums.every(s => (s.abstracts?.length ?? 0) === 0) && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Icon icon="solar:microphone-3-outline" width={48} style={{ color: '#D1D5DB' }} />
          <p style={{ fontSize: 14, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', marginTop: 12 }}>
            No oral presenters found
          </p>
        </div>
      )}

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </AdminPageLayout>
  );
}
