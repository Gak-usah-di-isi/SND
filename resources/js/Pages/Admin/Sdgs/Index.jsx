import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import AdminPageLayout from '../../../Components/ui/shared/AdminPageLayout.jsx';
import { FilterPopover } from '../../../Components/ui/FilterPopover';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
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

export default function SdgIndexPage({ sdgs, maxAbstracts = 0, search: initialSearch = '' }) {
  const [search, setSearch] = useState(initialSearch);
  const maxLimit = Math.max(maxAbstracts, 10);
  const [rangeVals, setRangeVals] = useState([0, maxLimit]);
  const [appliedRange, setAppliedRange] = useState([0, maxLimit]);
  const [page, setPage] = useState(Math.max((sdgs?.current_page ?? 1) - 1, 0));
  const [rowsPerPage, setRowsPerPage] = useState(sdgs?.per_page ?? 20);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    order: '',
    code: '',
    name_id: '',
    name_en: '',
    color: '#0152EA',
    icon: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [confirmRow, setConfirmRow] = useState(null);
  const toast = useToast();

  useEffect(() => {
    setPage(Math.max((sdgs?.current_page ?? 1) - 1, 0));
    setRowsPerPage(sdgs?.per_page ?? 20);
  }, [sdgs?.current_page, sdgs?.per_page]);

  const rows = sdgs?.data ?? [];
  const filtered = rows.filter((item) => {
    const total = item.abstracts_count ?? 0;
    if (total < appliedRange[0] || total > appliedRange[1]) return false;
    return true;
  });

  const resetForm = () => {
    setForm({
      order: '',
      code: '',
      name_id: '',
      name_en: '',
      color: '#0152EA',
      icon: '',
    });
    setFormErrors({});
    setSelected(null);
    setView('list');
  };

  const handleCreateSubmit = () => {
    const errors = {};
    if (!String(form.order).trim()) errors.order = 'Order is required.';
    if (!form.code.trim()) errors.code = 'Code is required.';
    if (!form.name_id.trim()) errors.name_id = 'Indonesian Name is required.';
    if (!form.name_en.trim()) errors.name_en = 'English Name is required.';
    if (!form.color.trim()) errors.color = 'Color is required.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    router.post('/admin/sdgs', {
      order: parseInt(form.order, 10),
      code: form.code.trim(),
      name_id: form.name_id.trim(),
      name_en: form.name_en.trim(),
      color: form.color.trim(),
      icon: form.icon.trim() || null,
    }, {
      onError: (errs) => {
        setFormErrors(errs || {});
        toast.error('Failed to save SDG. Please check the form.');
      },
      onSuccess: () => {
        resetForm();
        toast.success('SDG created successfully.');
      },
    });
  };

  const handleEditSubmit = () => {
    if (!selected) return;

    const errors = {};
    if (!String(form.order).trim()) errors.order = 'Order is required.';
    if (!form.code.trim()) errors.code = 'Code is required.';
    if (!form.name_id.trim()) errors.name_id = 'Indonesian Name is required.';
    if (!form.name_en.trim()) errors.name_en = 'English Name is required.';
    if (!form.color.trim()) errors.color = 'Color is required.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    router.put(`/admin/sdgs/${selected.id}`, {
      order: parseInt(form.order, 10),
      code: form.code.trim(),
      name_id: form.name_id.trim(),
      name_en: form.name_en.trim(),
      color: form.color.trim(),
      icon: form.icon.trim() || null,
    }, {
      onError: (errs) => {
        setFormErrors(errs || {});
        toast.error('Failed to update SDG.');
      },
      onSuccess: () => {
        resetForm();
        toast.success('SDG updated successfully.');
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!confirmRow) return;

    if (confirmRow.abstracts_count > 0) {
      toast.error(`SDG ${confirmRow.code} is currently linked to ${confirmRow.abstracts_count} abstracts.`);
      setConfirmRow(null);
      return;
    }

    router.delete(`/admin/sdgs/${confirmRow.id}`, {
      onSuccess: () => {
        toast.success('SDG deleted successfully.');
        setConfirmRow(null);
      },
      onError: () => {
        toast.error('Failed to delete SDG.');
        setConfirmRow(null);
      },
    });
  };

  const handleSearch = (value) => {
    setSearch(value);
    router.get(
      '/admin/sdgs',
      { page: 1, per_page: rowsPerPage, search: value },
      { preserveScroll: true, preserveState: true }
    );
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 0) return;
    router.get(
      '/admin/sdgs',
      { page: nextPage + 1, per_page: rowsPerPage, search },
      { preserveScroll: true, preserveState: true }
    );
  };

  const handleRowsChange = (nextRows) => {
    router.get(
      '/admin/sdgs',
      { page: 1, per_page: nextRows, search },
      { preserveScroll: true, preserveState: true }
    );
  };

  if (view === 'create' || view === 'edit') {
    return (
      <AdminPageLayout currentPath="/admin/sdgs">
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <BackButton onClick={resetForm} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
            {view === 'create' ? 'Add SDG' : 'Edit SDG'}
          </h1>
        </div>

        <Card>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
            SDG Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatInput
              id="sdg-order"
              label="Order Number *"
              type="number"
              value={form.order}
              onChange={(e) => {
                setForm(prev => ({ ...prev, order: e.target.value }));
                if (formErrors.order) setFormErrors(prev => ({ ...prev, order: '' }));
              }}
              placeholder="e.g. 1"
              error={Boolean(formErrors.order)}
              helperText={formErrors.order || undefined}
            />

            <FloatInput
              id="sdg-code"
              label="Code *"
              value={form.code}
              onChange={(e) => {
                setForm(prev => ({ ...prev, code: e.target.value }));
                if (formErrors.code) setFormErrors(prev => ({ ...prev, code: '' }));
              }}
              placeholder="e.g. SDG-1"
              error={Boolean(formErrors.code)}
              helperText={formErrors.code || undefined}
            />

            <FloatInput
              id="sdg-name-id"
              label="Indonesian Name *"
              value={form.name_id}
              onChange={(e) => {
                setForm(prev => ({ ...prev, name_id: e.target.value }));
                if (formErrors.name_id) setFormErrors(prev => ({ ...prev, name_id: '' }));
              }}
              placeholder="Enter Indonesian Name"
              error={Boolean(formErrors.name_id)}
              helperText={formErrors.name_id || undefined}
            />

            <FloatInput
              id="sdg-name-en"
              label="English Name *"
              value={form.name_en}
              onChange={(e) => {
                setForm(prev => ({ ...prev, name_en: e.target.value }));
                if (formErrors.name_en) setFormErrors(prev => ({ ...prev, name_en: '' }));
              }}
              placeholder="Enter English Name"
              error={Boolean(formErrors.name_en)}
              helperText={formErrors.name_en || undefined}
            />

            <div>
              <FloatInput
                id="sdg-color"
                label="Badge Color (Hex) *"
                value={form.color}
                onChange={(e) => {
                  setForm(prev => ({ ...prev, color: e.target.value }));
                  if (formErrors.color) setFormErrors(prev => ({ ...prev, color: '' }));
                }}
                placeholder="#E5243B"
                error={Boolean(formErrors.color)}
                helperText={formErrors.color || undefined}
              />
            </div>

            <FloatInput
              id="sdg-icon"
              label="Icon Path (Optional)"
              value={form.icon}
              onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="/images/sdgs/SDG-1.svg"
            />
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Badge Preview:</span>
            <span
              className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold text-white"
              style={{ backgroundColor: form.color || '#0152EA' }}
            >
              {form.code || 'SDG-X'}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {form.name_id || 'SDG Name Preview'}
            </span>
          </div>
        </Card>

        <div className="mt-6">
          <FormActions
            id="sdg-form"
            cancelText="Cancel"
            submitText="Save"
            onCancel={resetForm}
            onSubmit={view === 'create' ? handleCreateSubmit : handleEditSubmit}
          />
        </div>

        <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout currentPath="/admin/sdgs">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Tema SDGs
      </h1>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <FilterPopover
          filters={[]}
          rangeLabel="Total Abstract"
          maxSpent={maxLimit}
          rangeValue={rangeVals}
          onRangeChange={setRangeVals}
          formatRange={(v) => String(v)}
          rangeStep={1}
          onApply={() => {
            setAppliedRange([...rangeVals]);
            setPage(0);
          }}
          onClear={() => {
            const initial = [0, maxLimit];
            setRangeVals(initial);
            setAppliedRange(initial);
            setPage(0);
          }}
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setForm({
                order: (sdgs?.total ?? rows.length) + 1,
                code: `SDG-${(sdgs?.total ?? rows.length) + 1}`,
                name_id: '',
                name_en: '',
                color: '#0152EA',
                icon: '',
              });
              setFormErrors({});
              setSelected(null);
              setView('create');
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Add SDG
          </button>

          <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2" style={{ borderRadius: 8 }}>
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search SDGs"
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              style={{ width: 170 }}
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'code', label: 'Code' },
          { key: 'name_id', label: 'SDG Name' },
          { key: 'name_en', label: 'English Name' },
          { key: 'badge', label: 'Badge' },
          { key: 'abstract', label: 'Abstract', align: 'right' },
          { key: 'action', label: '', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-8">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            </svg>
            <p className="font-medium text-gray-500">No SDGs found</p>
            <p className="text-sm text-gray-400">Click the "Add SDG" button to add one.</p>
          </div>
        )}
        footer={(
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={sdgs?.total ?? 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[10, 17, 20, 50]}
          />
        )}
      >
        {filtered.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className={COL_CELL}>
              <span className="font-semibold text-gray-800">{item.code}</span>
            </td>
            <td className={`${COL_CELL} max-w-[280px]`}>
              <div className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: item.color || '#0152EA' }}
                >
                  {item.order}
                </span>
                <span className="text-sm font-semibold text-gray-800" title={item.name_id}>
                  {item.name_id}
                </span>
              </div>
            </td>
            <td className={`${COL_CELL} max-w-[260px] text-gray-500 italic`}>
              {item.name_en}
            </td>
            <td className={COL_CELL}>
              <span
                className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold text-white"
                style={{ backgroundColor: item.color || '#0152EA' }}
              >
                {item.code}
              </span>
            </td>
            <td className={`${COL_CELL} text-right font-medium w-[140px]`}>
              {item.abstracts_count ?? 0} Abstracts
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelected(item);
                    setForm({
                      order: item.order,
                      code: item.code || '',
                      name_id: item.name_id || '',
                      name_en: item.name_en || '',
                      color: item.color || '#0152EA',
                      icon: item.icon || '',
                    });
                    setFormErrors({});
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
        title="Delete SDG"
        message={
          confirmRow?.abstracts_count > 0
            ? `SDG "${confirmRow?.code}: ${confirmRow?.name_id}" is currently used by ${confirmRow?.abstracts_count} abstract(s). Deleting this SDG is not allowed.`
            : `Are you sure you want to delete SDG "${confirmRow?.code}: ${confirmRow?.name_id}"?`
        }
        confirmText={confirmRow?.abstracts_count > 0 ? "Understood" : "Delete"}
        cancelText="Cancel"
        onConfirm={confirmRow?.abstracts_count > 0 ? () => setConfirmRow(null) : handleConfirmDelete}
        onClose={() => setConfirmRow(null)}
      />

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </AdminPageLayout>
  );
}
