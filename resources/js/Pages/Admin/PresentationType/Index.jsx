import { useEffect, useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import AdminPageLayout from '../../../Components/ui/shared/AdminPageLayout.jsx';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import InitialBadge from '../../../Components/ui/InitialBadge';
import StatusBadge from '../../../Components/ui/StatusBadge';
import BackButton from '../../../Components/ui/BackButton';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import { FloatSelect } from '../../../Components/ui/FloatSelect';
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

export default function PresentationTypeIndexPage({ presentationTypes, search: initialSearch = '' }) {
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(Math.max((presentationTypes?.current_page ?? 1) - 1, 0));
  const [rowsPerPage, setRowsPerPage] = useState(presentationTypes?.per_page ?? 10);
  const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({ name: '' });
  const [confirmRow, setConfirmRow] = useState(null);
  const toast = useToast();

  useEffect(() => {
    setPage(Math.max((presentationTypes?.current_page ?? 1) - 1, 0));
    setRowsPerPage(presentationTypes?.per_page ?? 10);
  }, [presentationTypes?.current_page, presentationTypes?.per_page]);

  const rows = presentationTypes?.data ?? [];

  const handleSearch = (value) => {
    setSearch(value);
    router.get(
      '/admin/presentation-type',
      { search: value, per_page: rowsPerPage, page: 1 },
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    router.get(
      '/admin/presentation-type',
      { search, per_page: rowsPerPage, page: nextPage + 1 },
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };

  const handleRowsChange = (nextRows) => {
    setRowsPerPage(nextRows);
    setPage(0);
    router.get(
      '/admin/presentation-type',
      { search, per_page: nextRows, page: 1 },
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };

  const handleCreateSubmit = () => {
    if (!form.name.trim()) {
      setFormErrors({ name: 'Presentation type name is required.' });
      return;
    }

    router.post('/admin/presentation-type', {
      name: form.name.trim(),
      description: form.description.trim(),
      is_active: form.is_active,
    }, {
      onError: (errors) => {
        if (errors?.name) {
          setFormErrors({ name: errors.name });
        } else {
          toast.error('A server error occurred. Please try again.');
        }
      },
      onSuccess: () => {
        setForm({ name: '', description: '', is_active: true });
        setFormErrors({ name: '' });
        setView('list');
        toast.success('Presentation type created successfully.');
      },
    });
  };

  const handleEditSubmit = () => {
    if (!selected) return;
    if (!form.name.trim()) {
      setFormErrors({ name: 'Presentation type name is required.' });
      return;
    }

    router.put(`/admin/presentation-type/${selected.id}`, {
      name: form.name.trim(),
      description: form.description.trim(),
      is_active: form.is_active,
    }, {
      onError: (errors) => {
        if (errors?.name) {
          setFormErrors({ name: errors.name });
        } else {
          toast.error('A server error occurred. Please try again.');
        }
      },
      onSuccess: () => {
        setForm({ name: '', description: '', is_active: true });
        setFormErrors({ name: '' });
        setSelected(null);
        setView('list');
        toast.success('Presentation type updated successfully.');
      },
    });
  };

  const handleDelete = () => {
    if (!confirmRow) return;

    router.delete(`/admin/presentation-type/${confirmRow.id}`, {
      onSuccess: () => {
        toast.success('Presentation type deleted successfully.');
        setConfirmRow(null);
      },
      onError: (errors) => {
        toast.error(errors?.message || 'Failed to delete presentation type.');
        setConfirmRow(null);
      },
    });
  };

  if (view === 'create' || view === 'edit') {
    return (
      <AdminPageLayout currentPath="/admin/presentation-type">
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <BackButton onClick={() => {
            setForm({ name: '', description: '', is_active: true });
            setFormErrors({ name: '' });
            setSelected(null);
            setView('list');
          }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
            {view === 'create' ? 'Add Presentation Type' : 'Edit Presentation Type'}
          </h1>
        </div>

        <Card>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
            Presentation Type Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatInput
              id="presentation-name"
              label="Presentation Type Name *"
              value={form.name}
              onChange={(event) => {
                setForm(prev => ({ ...prev, name: event.target.value }));
                if (formErrors.name) setFormErrors({ name: '' });
              }}
              placeholder="E.g. Oral presentation, Poster presentation"
              error={Boolean(formErrors.name)}
              helperText={formErrors.name || undefined}
            />

            <FloatSelect
              id="presentation-status"
              label="Status *"
              options={[
                { value: '1', label: 'Active' },
                { value: '0', label: 'Inactive' },
              ]}
              value={form.is_active ? '1' : '0'}
              onChange={(val) => setForm(prev => ({ ...prev, is_active: val === '1' }))}
            />
          </div>

          <div className="mt-4">
            <FloatInput
              id="presentation-desc"
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
            id="presentation-type-form"
            cancelText="Cancel"
            submitText="Save"
            onCancel={() => {
              setForm({ name: '', description: '', is_active: true });
              setFormErrors({ name: '' });
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
    <AdminPageLayout currentPath="/admin/presentation-type">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Presentation Types
      </h1>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="text-sm text-gray-500">
          Manage presentation types available for presenters when submitting abstracts.
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setForm({ name: '', description: '', is_active: true });
              setFormErrors({ name: '' });
              setSelected(null);
              setView('create');
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Add Presentation Type
          </button>

          <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2" style={{ borderRadius: 8 }}>
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search Presentation Type"
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              style={{ width: 170 }}
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Presentation Type Name' },
          { key: 'description', label: 'Description' },
          { key: 'abstract', label: 'Used By', align: 'right' },
          { key: 'status', label: 'Status', align: 'center' },
          { key: 'action', label: '', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-8">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="m14.5 12.5-5 5M9.5 12.5l5 5" />
            </svg>
            <p className="font-medium text-gray-500">No presentation types found</p>
            <p className="text-sm text-gray-400">Click the "Add Presentation Type" button to add one.</p>
          </div>
        )}
        footer={(
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={presentationTypes?.total ?? 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[5, 10, 25]}
          />
        )}
      >
        {rows.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className={`${COL_CELL} max-w-[280px]`}>
              <div className="flex items-center gap-3">
                <InitialBadge label={item.name} />
                <span className="text-sm font-semibold text-gray-800 truncate" title={item.name}>
                  {item.name}
                </span>
              </div>
            </td>
            <td className={`${COL_CELL} max-w-[320px] text-gray-500`}>
              <span className="line-clamp-2" title={item.description || '-'}>
                {item.description || '-'}
              </span>
            </td>
            <td className={`${COL_CELL} text-right font-medium`}>
              {item.abstracts_count ?? 0} Abstract
            </td>
            <td className={`${COL_CELL} text-center`}>
              <StatusBadge label={item.is_active ? 'Active' : 'Inactive'} />
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelected(item);
                    setForm({
                      name: item.name || '',
                      description: item.description || '',
                      is_active: Boolean(item.is_active),
                    });
                    setFormErrors({ name: '' });
                    setView('edit');
                  }}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Edit"
                >
                  <IconEdit size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmRow(item)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                >
                  <IconTrash size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <ConfirmDialog
        open={Boolean(confirmRow)}
        title="Delete Presentation Type"
        message={
          confirmRow?.abstracts_count > 0
            ? `Presentation type "${confirmRow?.name}" is currently used by ${confirmRow?.abstracts_count} abstract(s). Deleting this type is not recommended.`
            : `Are you sure you want to delete presentation type "${confirmRow?.name}"?`
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onConfirm={handleDelete}
        onClose={() => setConfirmRow(null)}
      />

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </AdminPageLayout>
  );
}
