import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { Icon } from '@iconify/react';
import SekretarisPageLayout from '../../../Components/ui/shared/SekretarisPageLayout';
import { FilterPopover } from '../../../Components/ui/FilterPopover';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import InitialBadge from '../../../Components/ui/InitialBadge';
import StatusBadge from '../../../Components/ui/StatusBadge';

const COL_CELL = 'px-6 py-4 text-sm text-gray-700';

export default function SekretarisReviewerIndexPage({
  users,
  reviewers,
  roles = [],
  years = [],
  activeYear = '',
  search: initialSearch = '',
  role: initialRole = '',
  selectedYear = '',
  selectedStatus = '',
}) {
  const dataUsers = users || reviewers;

  const [search, setSearch] = useState(initialSearch);
  const [filterVals, setFilterVals] = useState({
    role: initialRole,
    year: selectedYear || activeYear,
    status: selectedStatus || '',
  });
  const [page, setPage] = useState(Math.max((dataUsers?.current_page ?? 1) - 1, 0));
  const [rowsPerPage, setRowsPerPage] = useState(dataUsers?.per_page ?? 8);

  const rows = dataUsers?.data ?? [];
  const roleFilterOptions = [
    { value: '', label: 'All Roles' },
    ...roles.map(r => ({ value: r.name, label: r.display_name })),
  ];

  const otherYears = years.filter(y => String(y) !== String(activeYear));
  const yearFilterOptions = [
    { value: String(activeYear), label: `${activeYear} (Active Year)` },
    ...otherYears.map(y => ({ value: String(y), label: String(y) })),
    { value: 'all', label: 'All Years' },
  ];

  const statusFilterOptions = [
    { value: '', label: 'Default (Active in Active Year)' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'all', label: 'All Status' },
  ];

  const navigate = (params) => {
    router.get('/sekretaris/reviewers', params, { preserveScroll: true, preserveState: true });
  };

  const handleSearch = (value) => {
    setSearch(value);
    navigate({
      page: 1,
      per_page: rowsPerPage,
      search: value,
      role: filterVals.role,
      year: filterVals.year,
      status: filterVals.status,
    });
  };

  const handleApplyFilter = () => {
    setPage(0);
    navigate({
      page: 1,
      per_page: rowsPerPage,
      search,
      role: filterVals.role,
      year: filterVals.year,
      status: filterVals.status,
    });
  };

  const handleClearFilter = () => {
    const defaultVals = { role: '', year: String(activeYear), status: '' };
    setFilterVals(defaultVals);
    setPage(0);
    navigate({
      page: 1,
      per_page: rowsPerPage,
      search,
      year: String(activeYear),
    });
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 0) return;
    setPage(nextPage);
    navigate({
      page: nextPage + 1,
      per_page: rowsPerPage,
      search,
      role: filterVals.role,
      year: filterVals.year,
      status: filterVals.status,
    });
  };

  const handleRowsChange = (nextRows) => {
    setRowsPerPage(nextRows);
    setPage(0);
    navigate({
      page: 1,
      per_page: nextRows,
      search,
      role: filterVals.role,
      year: filterVals.year,
      status: filterVals.status,
    });
  };

  const exportUrl = `/sekretaris/reviewers/export?${new URLSearchParams({
    ...(search ? { search } : {}),
    ...(filterVals.role ? { role: filterVals.role } : {}),
    ...(filterVals.year ? { year: filterVals.year } : (selectedYear ? { year: selectedYear } : {})),
    ...(filterVals.status ? { status: filterVals.status } : (selectedStatus ? { status: selectedStatus } : {})),
  }).toString()}`;

  return (
    <SekretarisPageLayout currentPath="/sekretaris/reviewers">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Reviewers
      </h1>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        {/* Kiri: Filter (Year, Status, Role) */}
        <FilterPopover
          filters={[
            {
              id: 'year',
              label: 'Year',
              options: yearFilterOptions,
            },
            {
              id: 'status',
              label: 'Status',
              options: statusFilterOptions,
            },
            {
              id: 'role',
              label: 'Role',
              options: roleFilterOptions,
            },
          ]}
          values={filterVals}
          onChange={(id, val) => setFilterVals(prev => ({ ...prev, [id]: val }))}
          onApply={handleApplyFilter}
          onClear={handleClearFilter}
          showRange={false}
        />

        {/* Kanan: Export + Search (Read-only tanpa Add Reviewer) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a
            href={exportUrl}
            style={{
              height: 36, padding: '0 14px', borderRadius: 8,
              border: '1px solid #E2E8F0', background: '#fff',
              fontSize: 13, fontWeight: 500, color: '#374151',
              fontFamily: 'Manrope,sans-serif', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <Icon icon="solar:file-text-outline" width={15} />
            Export
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E2E8F0', background: '#fff', padding: '6px 12px', borderRadius: 8, height: 36 }}>
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search name / email / institution..."
              style={{ width: 220, border: 'none', outline: 'none', fontSize: 13, fontFamily: 'Manrope,sans-serif', background: 'transparent', color: '#374151' }}
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'no', label: 'No' },
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'institution', label: 'Institution' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p className="font-medium text-gray-500">No reviewers found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or search keywords.</p>
          </div>
        )}
        footer={(
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={dataUsers?.total ?? 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[8, 25, 50]}
          />
        )}
      >
        {rows.map((user, i) => (
          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
            <td className={`${COL_CELL} w-[60px]`}>{(dataUsers?.from ?? 1) + i}</td>
            <td className={`${COL_CELL} max-w-[220px]`}>
              <div className="flex items-center gap-3">
                <InitialBadge label={user.name} />
                <span className="text-sm font-medium text-gray-800 truncate" title={user.name}>{user.name}</span>
              </div>
            </td>
            <td className={COL_CELL}>{user.email}</td>
            <td className={COL_CELL}>{user.institution || '-'}</td>
            <td className={COL_CELL}>
              {user.roles?.map(role => (
                <StatusBadge key={role.id} label={role.display_name} />
              ))}
            </td>
            <td className={COL_CELL}>
              <StatusBadge label={user.is_active ? 'Active' : 'Inactive'} />
            </td>
          </tr>
        ))}
      </DataTable>
    </SekretarisPageLayout>
  );
}
