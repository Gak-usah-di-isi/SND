import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { Icon } from '@iconify/react';
import ExecutivePageLayout from '../../../Components/ui/shared/ExecutivePageLayout';
import { FilterPopover } from '../../../Components/ui/FilterPopover';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import StatusBadge from '../../../Components/ui/StatusBadge';

/* ---------- Stat Card ---------- */
function StatCard({ label, value, description }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 8,
      boxShadow: '0px 4px 12px rgba(0,0,0,0.04)',
      padding: '16px 16px 24px 16px',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12,
      fontFamily: 'Manrope,sans-serif',
    }}>
      <span style={{ fontWeight: 700, fontSize: 18, color: 'rgba(42,53,71,0.8)' }}>{label}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 24, color: '#0152EA' }}>{value}</div>
        {description && (
          <div style={{ fontWeight: 700, fontSize: 12, marginTop: 4, color: '#0152EA', opacity: 0.4 }}>{description}</div>
        )}
      </div>
    </div>
  );
}

/* ---------- Avatar Initial ---------- */
function EmailBadge({ email }) {
  const initial = (email ?? '').split('@')[0].slice(0, 2).toUpperCase();
  return (
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0152EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'Manrope,sans-serif' }}>{initial}</span>
    </div>
  );
}

/* ---------- Expandable Row (Read-Only) ---------- */
function AbstractRow({ item }) {
  const [open, setOpen] = useState(false);
  const titleWords = (item.title ?? '').split(' ');
  const shortTitle = titleWords.slice(0, 8).join(' ') + (titleWords.length > 8 ? '...' : '');

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
        <td className="px-3 py-4 w-10">
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E2E8F0', background: open ? '#F0F5FF' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: open ? '#0152EA' : '#6B7280', transition: 'all 150ms' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </td>
        <td className="px-4 py-4" style={{ maxWidth: 320 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', lineHeight: 1.4 }} title={item.title}>
            {shortTitle}
          </span>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2.5">
            <EmailBadge email={item.corresponding_email} />
            <div className="flex flex-col">
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
                {(item.corresponding_email ?? '').split('@')[0]}
              </span>
              <span style={{ fontSize: 11.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>
                {item.corresponding_email}
              </span>
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <span style={{ fontSize: 12.5, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>
            {item.presentation_type ?? '-'}
          </span>
        </td>
        <td className="px-4 py-4">
          <StatusBadge label={item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '-'} />
        </td>
        <td className="px-4 py-4">
          {/* Read only, no action buttons */}
        </td>
      </tr>

      {open && (
        <tr style={{ background: '#F8FAFC' }}>
          <td />
          <td colSpan={5} className="px-4 pb-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2" style={{ fontSize: 13, fontFamily: 'Manrope,sans-serif' }}>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Full Title</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{item.title}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Symposium</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{item.symposium?.name ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Authors</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{item.authors ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Publication</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{item.publication ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Affiliations</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{item.affiliations ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Full Paper</span>
                {item.full_paper ? (
                  <div className="flex gap-3 mt-2">
                    {item.full_paper.file_path && (
                      <a href={`/storage/${item.full_paper.file_path}`} target="_blank" rel="noreferrer"
                        className="flex flex-col items-center gap-1" style={{ color: '#0152EA', textDecoration: 'none' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                        </svg>
                        <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>Download</span>
                      </a>
                    )}
                    {item.full_paper.revised_file_path && (
                      <a href={`/storage/${item.full_paper.revised_file_path}`} target="_blank" rel="noreferrer"
                        className="flex flex-col items-center gap-1" style={{ color: '#D97706', textDecoration: 'none' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/><path d="M12 18v-6M9 15l3 3 3-3"/>
                        </svg>
                        <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>Revised</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <p style={{ color: '#9CA3AF', marginTop: 4, fontSize: 13 }}>Not Submitted</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ---------- Main Page ---------- */
export default function ExecutiveAbstractIndexPage({
  abstracts,
  presentationTypes = [],
  oralTotal = 0,
  oralPaid = 0,
  posterTotal = 0,
  posterPaid = 0,
  openTotal = 0,
  revisionTotal = 0,
  search: initialSearch = '',
  filters = {},
}) {
  const [search, setSearch] = useState(initialSearch);
  const [filterVals, setFilterVals] = useState({
    status: filters.status ?? '',
    presentation_type: filters.presentation_type ?? '',
  });
  const [appliedVals, setAppliedVals] = useState({
    status: filters.status ?? '',
    presentation_type: filters.presentation_type ?? '',
  });

  const page = Math.max((abstracts?.current_page ?? 1) - 1, 0);
  const rowsPerPage = abstracts?.per_page ?? 10;
  const rows = abstracts?.data ?? [];

  const presentationTypeOptions = useMemo(() => {
    return presentationTypes
      .filter(t => t.is_active)
      .map(t => ({ value: t.name, label: t.name }));
  }, [presentationTypes]);

  const navigate = (params) => {
    router.get('/executive/abstracts', params, {
      preserveScroll: true,
      preserveState: true,
      only: ['abstracts', 'search', 'filters'],
    });
  };

  const handleSearch = (val) => {
    setSearch(val);
    navigate({ search: val, status: appliedVals.status, presentation_type: appliedVals.presentation_type, page: 1 });
  };

  const handleApply = () => {
    setAppliedVals({ ...filterVals });
    navigate({ search, status: filterVals.status, presentation_type: filterVals.presentation_type, page: 1 });
  };

  const handleClear = () => {
    const empty = { status: '', presentation_type: '' };
    setFilterVals(empty);
    setAppliedVals(empty);
    navigate({ search, page: 1 });
  };

  const handlePageChange = (nextPage) => {
    navigate({ search, status: appliedVals.status, presentation_type: appliedVals.presentation_type, page: nextPage + 1, per_page: rowsPerPage });
  };

  const handleRowsChange = (nextRows) => {
    navigate({ search, status: appliedVals.status, presentation_type: appliedVals.presentation_type, page: 1, per_page: nextRows });
  };

  return (
    <ExecutivePageLayout currentPath="/executive/abstracts">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope,sans-serif' }}>
        Abstracts
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Accepted for Oral" value={oralTotal} description={`${oralPaid} paid | ${oralTotal - oralPaid} unpaid`} />
        <StatCard label="Accepted for Poster" value={posterTotal} description={`${posterPaid} paid | ${posterTotal - posterPaid} unpaid`} />
        <StatCard label="Open" value={openTotal} description="Awaiting reviewer decision" />
        <StatCard label="Revision" value={revisionTotal} description="Needs revision from reviewer" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <FilterPopover
          filters={[
            {
              id: 'status', label: 'Status',
              options: [
                { value: 'open', label: 'Open' },
                { value: 'accepted', label: 'Accepted' },
                { value: 'revision', label: 'Revision' },
                { value: 'rejected', label: 'Rejected' },
              ],
            },
            {
              id: 'presentation_type', label: 'Presentation Type',
              options: presentationTypeOptions,
            },
          ]}
          values={filterVals}
          onChange={(id, val) => setFilterVals(prev => ({ ...prev, [id]: val }))}
          onApply={handleApply}
          onClear={handleClear}
          showRange={false}
        />

        <div className="flex items-center gap-2">
          {/* Download Abstract Book PDF Shortcut */}
          <a
            href="/admin/abstract-download-all-pdf"
            target="_blank"
            rel="noreferrer"
            style={{
              height: 36, display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '0 14px', borderRadius: 8,
              border: '1px solid #E2E8F0', background: '#fff',
              fontSize: 13, fontFamily: 'Manrope,sans-serif', color: '#374151',
              textDecoration: 'none',
            }}
          >
            <Icon icon="solar:file-download-outline" width={15} style={{ color: '#0152EA' }} />
            Download PDF
          </a>

          {/* Search */}
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

      {/* Table */}
      <DataTable
        columns={[
          { key: 'toggle', label: '' },
          { key: 'title', label: 'Title' },
          { key: 'correspondent', label: 'Correspondent' },
          { key: 'type', label: 'Presentation' },
          { key: 'status', label: 'Status' },
          { key: 'action', label: '' },
        ]}
        footer={(
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={abstracts?.total ?? 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[10, 25, 50]}
          />
        )}
      >
        {rows.map((item) => (
          <AbstractRow key={item.id} item={item} />
        ))}
      </DataTable>
    </ExecutivePageLayout>
  );
}
