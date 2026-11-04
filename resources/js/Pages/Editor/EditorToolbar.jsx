import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { FilterPopover } from '../../Components/ui/FilterPopover';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'under review', label: 'Under Review' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'revision', label: 'Revision' },
  { value: 'rejected', label: 'Rejected' },
];

const PRESENTATION_OPTIONS = [
  { value: 'Oral presentation', label: 'Oral Presentation' },
  { value: 'Poster', label: 'Poster' },
];

/**
 * Toolbar filter + search + export untuk menu Editor — tata letaknya
 * mengikuti Admin/Abstract/Index.jsx (filter di kiri, export & search di kanan).
 *
 * @param {string} baseUrl  URL halaman ini (tujuan router.get)
 * @param {string} initialSearch  nilai search dari server
 * @param {object} initialFilters  { status, presentation_type } dari server
 * @param {boolean} showStatusFilter  sembunyikan di halaman yang statusnya sudah dikunci
 *                                    (Revision / No Decision / With Decision)
 * @param {number} perPage  jumlah baris aktif, ikut dibawa saat navigasi
 */
export default function EditorToolbar({
  baseUrl,
  initialSearch = '',
  initialFilters = {},
  showStatusFilter = true,
  perPage,
  exportUrl = null,
}) {
  const [search, setSearch] = useState(initialSearch);
  const [exportOpen, setExportOpen] = useState(false);
  const [filterVals, setFilterVals] = useState({
    status: initialFilters.status ?? '',
    presentation_type: initialFilters.presentation_type ?? '',
  });
  const [appliedVals, setAppliedVals] = useState({
    status: initialFilters.status ?? '',
    presentation_type: initialFilters.presentation_type ?? '',
  });

  const navigate = (params) => {
    router.get(baseUrl, { per_page: perPage, ...params }, { preserveScroll: true, preserveState: true });
  };

  const handleSearch = (val) => {
    setSearch(val);
    navigate({ search: val, ...appliedVals, page: 1 });
  };

  const handleApply = () => {
    setAppliedVals({ ...filterVals });
    navigate({ search, ...filterVals, page: 1 });
  };

  const handleClear = () => {
    const empty = { status: '', presentation_type: '' };
    setFilterVals(empty);
    setAppliedVals(empty);
    navigate({ search, page: 1 });
  };

  const filters = [
    ...(showStatusFilter ? [{ id: 'status', label: 'Status', options: STATUS_OPTIONS }] : []),
    { id: 'presentation_type', label: 'Presentation Type', options: PRESENTATION_OPTIONS },
  ];

  // Export mengikuti pencarian & filter yang sedang tampil di tabel.
  const exportParams = new URLSearchParams();
  if (search) exportParams.set('search', search);
  Object.entries(appliedVals).forEach(([key, value]) => {
    if (value) exportParams.set(key, value);
  });
  const exportQuery = exportParams.toString();
  const exportHref = exportUrl
    ? `${exportUrl}${exportQuery ? `${exportUrl.includes('?') ? '&' : '?'}${exportQuery}` : ''}`
    : null;

  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
      {/* Dibungkus dengan tinggi tetap 36px supaya sebaris persis dengan
          tombol Export & kotak search di kanan (tidak "naik" sendiri). */}
      <div className="flex items-center" style={{ height: 36 }}>
        <FilterPopover
          filters={filters}
          values={filterVals}
          onChange={(id, val) => setFilterVals(prev => ({ ...prev, [id]: val }))}
          onApply={handleApply}
          onClear={handleClear}
          showRange={false}
        />
      </div>

      <div className="flex items-center gap-2">
        {exportHref ? (
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setExportOpen(v => !v)}
              style={{
                height: 36, display: 'flex', alignItems: 'center', gap: 6,
                padding: '0 14px', borderRadius: 8,
                border: '1px solid #E2E8F0', background: '#fff',
                fontSize: 13, fontFamily: 'Manrope,sans-serif', color: '#374151', cursor: 'pointer',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
              </svg>
              Export File
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: exportOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 150ms' }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {exportOpen && (
              <>
                <div onClick={() => setExportOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: '#fff', borderRadius: 10, zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #E2E8F0', overflow: 'hidden', minWidth: 240 }}>
                  <a
                    href={exportHref}
                    onClick={() => { setExportOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', fontSize: 13, fontFamily: 'Manrope,sans-serif', color: '#374151', textDecoration: 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                    </svg>
                    Export Papers (Excel)
                  </a>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            type="button"
            style={{
              height: 36, display: 'flex', alignItems: 'center', gap: 6,
              padding: '0 14px', borderRadius: 8,
              border: '1px solid #E2E8F0', background: '#fff',
              fontSize: 13, fontFamily: 'Manrope,sans-serif', color: '#374151', cursor: 'pointer',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
            </svg>
            Export File
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        )}

        <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2" style={{ borderRadius: 8, height: 36 }}>
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search title..."
            className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            style={{ width: 170, fontFamily: 'Manrope,sans-serif' }}
          />
        </div>
      </div>
    </div>
  );
}
