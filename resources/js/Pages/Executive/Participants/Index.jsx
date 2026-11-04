import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const dropdownItem = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '10px 14px', fontSize: 13, color: '#374151',
  fontFamily: 'Manrope,sans-serif', textDecoration: 'none', cursor: 'pointer',
};
const hoverIn = (e) => e.currentTarget.style.background = '#F8FAFC';
const hoverOut = (e) => e.currentTarget.style.background = '#fff';
import { Icon } from '@iconify/react';
import ExecutivePageLayout from '../../../Components/ui/shared/ExecutivePageLayout';
import { FilterPopover } from '../../../Components/ui/FilterPopover';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import StatusBadge from '../../../Components/ui/StatusBadge';

const ROLE_LABEL = {
  'indonesia-participants': 'Indonesia Participant',
  'indonesia-presenter': 'Indonesia Presenter',
  'foreign-participants': 'Foreign Participant',
  'foreign-presenter': 'Foreign Presenter',
};

/* ---------- Export Dropdown ---------- */
function ExportDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          height: 36,
          padding: '0 14px',
          borderRadius: 8,
          border: '1px solid #E2E8F0',
          background: '#fff',
          fontSize: 13,
          fontWeight: 500,
          color: '#374151',
          fontFamily: 'Manrope,sans-serif',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Icon icon="solar:file-text-outline" width={15} />
        Export File
        <ChevronDown size={13} style={{ color: '#9CA3AF' }} />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              right: 0,
              background: '#fff',
              borderRadius: 10,
              zIndex: 100,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              minWidth: 220,
            }}
          >
            <a
              href="/executive/participants/export"
              style={dropdownItem}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
            >
              <Icon icon="solar:file-outline" width={15} style={{ color: '#10B981' }} />
              Export Participants (Excel)
            </a>
            <a
              href="/executive/participants/export-not-paid"
              style={dropdownItem}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
            >
              <Icon icon="solar:file-outline" width={15} style={{ color: '#EF4444' }} />
              Export Not Paid (Excel)
            </a>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Stat Card ---------- */
function StatCard({ label, value, color, bg, img, imgFilter }) {
  return (
    <div className="flex items-center p-5 w-full" style={{ backgroundColor: bg, height: 132, borderRadius: 8 }}>
      <div className="flex items-center gap-4">
        <img
          alt={label}
          className="w-16 h-16 object-contain flex-shrink-0"
          src={img}
          style={imgFilter ? { filter: imgFilter } : undefined}
        />
        <div>
          <p className="font-bold" style={{ fontSize: 14.5, color, fontFamily: 'Manrope,sans-serif', margin: 0, lineHeight: 1.3 }}>{label}</p>
          <p className="font-bold mt-1" style={{ fontSize: 30, color, lineHeight: 1.2, fontFamily: 'Manrope,sans-serif', margin: 0 }}>{value}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Expandable Participant Row (Read-Only) ---------- */
function ParticipantRow({ user }) {
  const [open, setOpen] = useState(false);
  const role = user.roles?.[0]?.name ?? '';
  const initials = (user.name ?? '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const abstract = user.abstracts?.[0] ?? null;
  const paymentStatus = user.file_payment?.status;

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
        {/* Expand */}
        <td className="px-3 py-4 w-10">
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E2E8F0', background: open ? '#F0F5FF' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: open ? '#0152EA' : '#6B7280' }}
          >
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </td>

        {/* Nama + email */}
        <td className="px-4 py-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0152EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Manrope,sans-serif' }}>{initials}</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>{user.name}</span>
                {Boolean(user.is_student) && (
                  <span
                    className="inline-flex items-center px-1.5 py-0.5 text-xs font-semibold rounded"
                    style={{ background: 'rgba(1,82,234,0.08)', color: '#0152EA', fontSize: 11, fontFamily: 'Manrope,sans-serif' }}
                    title="Student / Mahasiswa"
                  >
                    🎓 Student
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>{user.phone_number ?? '-'}</div>
            </div>
          </div>
        </td>

        {/* Institusi */}
        <td className="px-4 py-4">
          <span style={{ fontSize: 13, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>{user.institution ?? '-'}</span>
        </td>

        {/* Registration Type */}
        <td className="px-4 py-4">
          <span style={{ fontSize: 13, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>{ROLE_LABEL[role] ?? role}</span>
        </td>

        {/* Abstract status */}
        <td className="px-4 py-4">
          {abstract
            ? <StatusBadge label={abstract.status ?? 'open'} />
            : <span style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>No abstract</span>}
        </td>

        {/* Actions (Read-Only: View abstract if exists) */}
        <td className="px-4 py-4">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
            {abstract && (
              <a
                href={`/admin/abstracts-participant/${abstract.id}`}
                target="_blank"
                rel="noreferrer"
                title="View Abstract"
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <Icon icon="solar:document-text-outline" width={16} />
              </a>
            )}
          </div>
        </td>
      </tr>

      {/* Expanded detail */}
      {open && (
        <tr>
          <td colSpan={6} style={{ padding: 0, background: '#FAFBFC', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ padding: '16px 20px 16px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
              <DetailItem label="Email" value={user.email} />
              <DetailItem label="Country" value={user.country} />
              <DetailItem label="Job Title" value={user.job_title} />
              <DetailItem label="Attendance" value={user.attendance} />
              <DetailItem
                label="Student Status"
                value={user.is_student ? (
                  <span style={{ color: '#0152EA', fontWeight: 600 }}>🎓 Student / Mahasiswa</span>
                ) : (
                  <span style={{ color: '#6B7280' }}>Regular (Non-Student)</span>
                )}
              />

              {/* Payment + Document icons (LOA & Paper) */}
              <DetailItem label="Payment" value={
                paymentStatus
                  ? <StatusBadge label={paymentStatus === 'verified' ? 'Verified' : paymentStatus} />
                  : <StatusBadge label="Not Yet Paid" />
              } />
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Documents</div>
                <div className="flex gap-4 mt-2">
                  {/* LOA */}
                  {abstract ? (
                    <a href={`/admin/abstracts-participant/${abstract.id}/acceptance-pdf`} target="_blank" rel="noreferrer"
                      className="flex flex-col items-center gap-1" style={{ color: '#0152EA', textDecoration: 'none' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" /><circle cx="10" cy="13" r="2" /><path d="M8 21v-3l2-1 2 1v3l-2-1z" />
                      </svg>
                      <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>LOA</span>
                    </a>
                  ) : (
                    <span style={{ color: '#9CA3AF', fontSize: 13 }}>No abstract</span>
                  )}
                  {/* Paper */}
                  {abstract?.full_paper?.file_path ? (
                    <a href={`/storage/${abstract.full_paper.file_path}`} target="_blank" rel="noreferrer"
                      className="flex flex-col items-center gap-1" style={{ color: '#EF4444', textDecoration: 'none' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                      </svg>
                      <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>Paper</span>
                    </a>
                  ) : (
                    abstract && <span style={{ color: '#9CA3AF', fontSize: 13, alignSelf: 'center' }}>No paper</span>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function DetailItem({ label, value, span }) {
  return (
    <div style={{ gridColumn: span ? 'span 2' : 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>{value ?? '-'}</div>
    </div>
  );
}

/* ---------- Main Page ---------- */
export default function ExecutiveParticipantsIndexPage({
  users,
  stats,
  search: initialSearch = '',
  role: initialRole = '',
  filters: initialFilters = {},
  roleOptions = [],
}) {
  const [search, setSearch] = useState(initialSearch);
  const [filterVals, setFilterVals] = useState({
    role: initialRole,
    paper: initialFilters?.paper ?? '',
    payment: initialFilters?.payment ?? '',
  });

  const rows = users?.data ?? [];
  const page = Math.max((users?.current_page ?? 1) - 1, 0);
  const rowsPerPage = users?.per_page ?? 10;

  const navigate = (params) => {
    router.get('/executive/participants', params, {
      preserveScroll: true,
      preserveState: true,
      only: ['users', 'search', 'role', 'filters'],
    });
  };

  const fv = () => ({ role: filterVals.role, paper: filterVals.paper, payment: filterVals.payment });

  const handleSearch = (val) => { setSearch(val); navigate({ search: val, ...fv() }); };
  const handleApply = () => navigate({ search, ...fv(), page: 1 });
  const handleClear = () => { setFilterVals({ role: '', paper: '', payment: '' }); navigate({ search, page: 1 }); };
  const handlePageChange = (next) => navigate({ search, ...fv(), page: next + 1, per_page: rowsPerPage });
  const handleRowsChange = (next) => navigate({ search, ...fv(), page: 1, per_page: next });

  return (
    <ExecutivePageLayout currentPath="/executive/participants">
      {/* Title */}
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope,sans-serif' }}>
        Participants
      </h1>

      {/* Stat Cards — sama persis dengan Admin */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Indonesia Participant" value={stats?.indoParticipant ?? 0} bg="rgba(255,174,31,0.1)" color="#F59E0B" img="/images/person-orange.png" />
        <StatCard label="Indonesia Presenter" value={stats?.indoPresenter ?? 0} bg="rgba(255,174,31,0.1)" color="#F59E0B" img="/images/person-orange.png" />
        <StatCard label="Foreign Participant" value={stats?.foreignParticipant ?? 0} bg="rgba(139,92,246,0.1)" color="#8B5CF6" img="/images/person-blue.png" imgFilter="hue-rotate(40deg) saturate(1.1)" />
        <StatCard label="Foreign Presenter" value={stats?.foreignPresenter ?? 0} bg="rgba(139,92,246,0.1)" color="#8B5CF6" img="/images/person-blue.png" imgFilter="hue-rotate(40deg) saturate(1.1)" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <FilterPopover
          filters={[
            {
              id: 'role', label: 'Registration Type',
              options: roleOptions.map(r => ({ value: r.name, label: ROLE_LABEL[r.name] ?? r.name })),
            },
            {
              id: 'paper', label: 'Paper Uploaded',
              options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
            },
            {
              id: 'payment', label: 'Payment Status',
              options: [{ value: 'verified', label: 'Verified' }, { value: 'unverified', label: 'Unverified' }],
            },
          ]}
          values={filterVals}
          onChange={(id, val) => setFilterVals(prev => ({ ...prev, [id]: val }))}
          onApply={handleApply}
          onClear={handleClear}
          showRange={false}
        />

        <div className="flex items-center gap-2">
          {/* Export Dropdown — sama persis Admin */}
          <ExportDropdown />

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E2E8F0', background: '#fff', padding: '6px 12px', borderRadius: 8, height: 36 }}>
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search name / email / institution..."
              style={{ width: 190, border: 'none', outline: 'none', fontSize: 13, fontFamily: 'Manrope,sans-serif', background: 'transparent', color: '#374151' }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={[
          { key: 'exp', label: '' },
          { key: 'name', label: 'Name' },
          { key: 'inst', label: 'Institution' },
          { key: 'role', label: 'Registration Type' },
          { key: 'abs', label: 'Abstract' },
          { key: 'action', label: '' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-6">
            <Icon icon="solar:users-group-rounded-outline" width={48} style={{ color: '#D1D5DB' }} />
            <p style={{ color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>No participants found</p>
          </div>
        )}
        footer={(
          <TablePagination
            page={page} rowsPerPage={rowsPerPage} total={users?.total ?? 0}
            onPageChange={handlePageChange} onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[10, 25, 50]}
          />
        )}
      >
        {rows.map((user) => (
          <ParticipantRow key={user.id} user={user} />
        ))}
      </DataTable>
    </ExecutivePageLayout>
  );
}
