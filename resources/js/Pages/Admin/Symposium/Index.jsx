import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import AdminPageLayout from "../../../Components/ui/shared/AdminPageLayout.jsx";
import { FilterPopover } from '../../../Components/ui/FilterPopover';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import InitialBadge from '../../../Components/ui/InitialBadge';
import StatusBadge from '../../../Components/ui/StatusBadge';
import BackButton from '../../../Components/ui/BackButton';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import FormActions from '../../../Components/ui/FormActions';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';

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

const COL_CELL = 'px-6 py-4 text-sm text-gray-700';

export default function SymposiumIndexPage({ symposiums, maxAbstracts = 0, search: initialSearch = '' }) {
  const [search, setSearch] = useState(initialSearch);
  const [filterVals, setFilterVals] = useState({ status: '' });
  const [rangeVals, setRangeVals] = useState([0, maxAbstracts]);
  const [page, setPage] = useState(Math.max((symposiums?.current_page ?? 1) - 1, 0));
  const [rowsPerPage, setRowsPerPage] = useState(symposiums?.per_page ?? 5);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    code: '',
    name: '',
    abbreviation: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({ name: '', abbreviation: '' });
  const [confirmRow, setConfirmRow] = useState(null);
  const toast = useToast();

  const handleCreateSubmit = () => {
    if (!form.name.trim() || !form.abbreviation.trim()) {
      setFormErrors({
        name: form.name.trim() ? '' : 'Name is required.',
        abbreviation: form.abbreviation.trim() ? '' : 'Abbreviation is required.',
      });
      return;
    }

    router.post('/admin/symposium', {
      name: form.name.trim(),
      abbreviation: form.abbreviation.trim(),
      description: form.description.trim(),
    }, {
      onError: (errors) => {
        if (errors?.name || errors?.abbreviation) {
          setFormErrors({
            name: errors?.name || '',
            abbreviation: errors?.abbreviation || '',
          });
        } else {
          toast.error('A server error occurred. Please try again.');
        }
      },
      onSuccess: () => {
        setForm({ code: '', name: '', abbreviation: '', description: '' });
        setFormErrors({ name: '', abbreviation: '' });
        setView('list');
        toast.success('Symposium created successfully.');
      },
    });
  };

  const handleEditSubmit = () => {
    if (!selected) return;
    if (!form.name.trim() || !form.abbreviation.trim()) {
      setFormErrors({
        name: form.name.trim() ? '' : 'Name is required.',
        abbreviation: form.abbreviation.trim() ? '' : 'Abbreviation is required.',
      });
      return;
    }

    router.put(`/admin/symposium/${selected.id}`, {
      name: form.name.trim(),
      abbreviation: form.abbreviation.trim(),
      description: form.description.trim(),
    }, {
      onError: (errors) => {
        setFormErrors({
          name: errors?.name || '',
          abbreviation: errors?.abbreviation || '',
        });
      },
      onSuccess: () => {
        setForm({ code: '', name: '', abbreviation: '', description: '' });
        setFormErrors({ name: '', abbreviation: '' });
        setSelected(null);
        setView('list');
        toast.success('Symposium updated successfully.');
      },
    });
  };

  useEffect(() => {
    setPage(Math.max((symposiums?.current_page ?? 1) - 1, 0));
    setRowsPerPage(symposiums?.per_page ?? 5);
  }, [symposiums?.current_page, symposiums?.per_page]);

  const rows = symposiums?.data ?? [];
  const filtered = rows;

  const handleDelete = (row) => {
    setConfirmRow(row);
  };

  const handleConfirmDelete = () => {
    if (!confirmRow) return;
    router.delete(`/admin/symposium/${confirmRow.id}`, {
      onSuccess: () => {
        toast.success('Symposium deleted successfully.');
        setConfirmRow(null);
      },
      onError: () => {
        toast.error('Failed to delete symposium.');
      },
    });
  };

  const handleSearch = (value) => {
    setSearch(value);
    router.get(
      '/admin/symposium',
      { page: 1, per_page: rowsPerPage, search: value },
      { preserveScroll: true, preserveState: true }
    );
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 0) return;
    router.get(
      '/admin/symposium',
      { page: nextPage + 1, per_page: rowsPerPage, search },
      { preserveScroll: true, preserveState: true }
    );
  };

  const handleRowsChange = (nextRows) => {
    router.get(
      '/admin/symposium',
      { page: 1, per_page: nextRows, search },
      { preserveScroll: true, preserveState: true }
    );
  };

  if (view === 'create' || view === 'edit') {
    return (
      <AdminPageLayout currentPath="/admin/symposium">
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <BackButton onClick={() => {
            setForm({ code: '', name: '', abbreviation: '', description: '' });
            setFormErrors({ name: '', abbreviation: '' });
            setSelected(null);
            setView('list');
          }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
            {view === 'create' ? 'Add Symposium' : 'Edit Symposium'}
          </h1>
        </div>

        <Card>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
            Symposium Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatInput
              id="symposium-code"
              label="Code"
              value={form.code}
              onChange={(event) => setForm(prev => ({ ...prev, code: event.target.value }))}
              placeholder="- Auto Generated -"
              disabled
            />
            <FloatInput
              id="symposium-name"
              label="Symposium Name *"
              value={form.name}
              onChange={(event) => {
                setForm(prev => ({ ...prev, name: event.target.value }));
                if (formErrors.name) setFormErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholder="Enter Name"
              error={Boolean(formErrors.name)}
              helperText={formErrors.name || undefined}
            />
            <FloatInput
              id="symposium-abbr"
              label="Abbreviation *"
              value={form.abbreviation}
              onChange={(event) => {
                setForm(prev => ({ ...prev, abbreviation: event.target.value }));
                if (formErrors.abbreviation) setFormErrors(prev => ({ ...prev, abbreviation: '' }));
              }}
              placeholder="Enter Abbreviation"
              error={Boolean(formErrors.abbreviation)}
              helperText={formErrors.abbreviation || undefined}
            />
          </div>

          <div className="mt-4">
            <FloatInput
              id="symposium-desc"
              label="Description"
              value={form.description}
              onChange={(event) => setForm(prev => ({ ...prev, description: event.target.value }))}
              placeholder="Enter Description (Optional)"
              multiline
              rows={3}
            />
          </div>
        </Card>

        <div className="mt-6">
          <FormActions
            id="symposium-form"
            cancelText="Cancel"
            submitText="Save"
            onCancel={() => {
              setForm({ code: '', name: '', abbreviation: '', description: '' });
              setFormErrors({ name: '', abbreviation: '' });
              setSelected(null);
              setView('list');
            }}
            onSubmit={view === 'create' ? handleCreateSubmit : handleEditSubmit}
          />
        </div>

        <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout currentPath="/admin/symposium">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Symposium
      </h1>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <FilterPopover
          filters={[
            {
              id: 'status',
              label: 'Status',
              options: [
                { value: 'aktif', label: 'Active' },
                { value: 'nonaktif', label: 'Inactive' },
              ],
            },
          ]}
          values={filterVals}
          onChange={(id, val) => setFilterVals(prev => ({ ...prev, [id]: val }))}
          onApply={() => {
            setPage(0);
          }}
          onClear={() => {
            setFilterVals({ status: '' });
            setRangeVals([0, maxAbstracts]);
            setPage(0);
          }}
          rangeLabel="Total Abstract"
          maxSpent={maxAbstracts}
          rangeValue={rangeVals}
          onRangeChange={setRangeVals}
          formatRange={(v) => String(v)}
          rangeStep={1}
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView('create')}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Add Symposium
          </button>

          <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2" style={{ borderRadius: 8 }}>
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search Symposium"
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              style={{ width: 170 }}
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'code', label: 'Code' },
          { key: 'name', label: 'Symposium Name' },
          { key: 'abstract', label: 'Abstract', align: 'right' },
          { key: 'status', label: 'Status', align: 'right' },
          { key: 'action', label: '', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="m14.5 12.5-5 5M9.5 12.5l5 5" />
            </svg>
            <p className="font-medium text-gray-500">No symposiums found</p>
            <p className="text-sm text-gray-400">Click the "Add Symposium" button to add one.</p>
          </div>
        )}
        footer={(
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={symposiums?.total ?? 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[5, 8, 10, 25]}
          />
        )}
      >
        {filtered.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className={COL_CELL}>{`SYM-${item.abbreviation}`}</td>
            <td className={`${COL_CELL} max-w-[360px]`}>
              <div className="flex items-center gap-3">
                <InitialBadge label={item.name} />
                <span className="text-sm font-medium text-gray-800 truncate" title={item.name}>{item.name}</span>
              </div>
            </td>
            <td className={`${COL_CELL} text-right w-[140px]`}>{item.abstracts_count} Abstracts</td>
            <td className={`${COL_CELL} text-right`}>
              <StatusBadge label="Active" />
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelected(item);
                    setForm({
                      code: `SYM-${item.abbreviation}`,
                      name: item.name || '',
                      abbreviation: item.abbreviation || '',
                      description: item.description || '',
                    });
                    setFormErrors({ name: '', abbreviation: '' });
                    setView('edit');
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                  style={{ color: '#0152EA', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Edit"
                >
                  <IconEdit />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                  style={{ color: '#EF4444', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Delete"
                >
                  <IconTrash />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <ConfirmDialog
        open={Boolean(confirmRow)}
        title="Confirm Delete"
        message={confirmRow ? `Are you sure you want to delete item ${confirmRow.name}? This action cannot be undone.` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        onClose={() => setConfirmRow(null)}
        onConfirm={handleConfirmDelete}
      />
    </AdminPageLayout>
  );
}
