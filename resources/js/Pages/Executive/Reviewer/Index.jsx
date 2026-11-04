import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import ExecutivePageLayout from '../../../Components/ui/shared/ExecutivePageLayout';
import { FilterPopover } from '../../../Components/ui/FilterPopover';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import InitialBadge from '../../../Components/ui/InitialBadge';
import StatusBadge from '../../../Components/ui/StatusBadge';

const COL_CELL = 'px-6 py-4 text-sm text-gray-700';

export default function ReviewerIndex({
  users,
  roles = [],
  search: initialSearch = '',
  role: initialRole = '',
}) {
  const [search, setSearch] = useState(initialSearch);
  const [filterVals, setFilterVals] = useState({ role: initialRole });
  const [page, setPage] = useState(Math.max((users?.current_page ?? 1) - 1, 0));
  const [rowsPerPage, setRowsPerPage] = useState(users?.per_page ?? 8);

  const rows = users?.data ?? [];
  const roleFilterOptions = roles.map(item => ({
    value: item.name,
    label: item.display_name,
  }));

  const navigate = (params) => {
    router.get('/executive/reviewers', params, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(0);
    navigate({
      page: 1,
      per_page: rowsPerPage,
      search: value,
      role: filterVals.role,
    });
  };

  const handleApplyFilter = () => {
    setPage(0);
    navigate({
      page: 1,
      per_page: rowsPerPage,
      search,
      role: filterVals.role,
    });
  };

  const handleClearFilter = () => {
    setFilterVals({ role: '' });
    setPage(0);
    navigate({
      page: 1,
      per_page: rowsPerPage,
      search,
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
    });
  };

  return (
    <ExecutivePageLayout currentPath="/executive/reviewers">
      <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          color: '#1F2A3D',
          fontFamily: 'Manrope, sans-serif',
        }}>
          Reviewers
        </h1>
      </div>

      <div
        className="flex items-center justify-between gap-3 flex-wrap"
        style={{ marginBottom: 16 }}
      >
        <FilterPopover
          filters={[{
            id: 'role',
            label: 'Role',
            options: roleFilterOptions,
          }]}
          values={filterVals}
          onChange={(id, value) => setFilterVals(prev => ({ ...prev, [id]: value }))}
          onApply={handleApplyFilter}
          onClear={handleClearFilter}
          showRange={false}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            border: '1px solid #E2E8F0',
            background: '#fff',
            padding: '6px 12px',
            borderRadius: 8,
            height: 36,
          }}
        >
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={event => handleSearch(event.target.value)}
            placeholder="Search name / email / institution..."
            style={{
              width: 220,
              border: 'none',
              outline: 'none',
              fontSize: 13,
              fontFamily: 'Manrope, sans-serif',
              background: 'transparent',
              color: '#374151',
            }}
          />
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'no', label: 'No' },
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'institution', label: 'Institution' },
          { key: 'role', label: 'Role' },
        ]}
        footer={(
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={users?.total ?? 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[8, 25, 50]}
          />
        )}
      >
        {rows.map((user, index) => (
          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
            <td className={`${COL_CELL} w-[60px]`}>{(users?.from ?? 1) + index}</td>
            <td className={`${COL_CELL} max-w-[220px]`}>
              <div className="flex items-center gap-3">
                <InitialBadge label={user.name} />
                <span className="text-sm font-medium text-gray-800 truncate" title={user.name}>
                  {user.name}
                </span>
              </div>
            </td>
            <td className={COL_CELL}>{user.email}</td>
            <td className={COL_CELL}>{user.institution}</td>
            <td className={COL_CELL}>
              {user.roles?.map(userRole => (
                <StatusBadge key={userRole.id} label={userRole.display_name} />
              ))}
            </td>
          </tr>
        ))}
      </DataTable>
    </ExecutivePageLayout>
  );
}
