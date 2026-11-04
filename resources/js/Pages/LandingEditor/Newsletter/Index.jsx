import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import LandingEditorPageLayout from '../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import BackButton from '../../../Components/ui/BackButton';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import FormActions from '../../../Components/ui/FormActions';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';

function IconTrash({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
}

function IconExport({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

const COL_CELL = 'px-6 py-4 text-sm text-gray-700';

export default function NewsletterIndex({ newsletters }) {
  const [view, setView] = useState('list');
  const [form, setForm] = useState({ email: '' });
  const [formErrors, setFormErrors] = useState({});
  const [confirmRow, setConfirmRow] = useState(null);
  const [page, setPage] = useState(Math.max((newsletters?.current_page ?? 1) - 1, 0));
  const [rowsPerPage, setRowsPerPage] = useState(newsletters?.per_page ?? 10);

  const toast = useToast();

  useEffect(() => {
    setPage(Math.max((newsletters?.current_page ?? 1) - 1, 0));
    setRowsPerPage(newsletters?.per_page ?? 10);
  }, [newsletters?.current_page, newsletters?.per_page]);

  const handleCreateSubmit = () => {
    const errors = {};
    if (!form.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Invalid email format.';
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    router.post('/landing/newsletters', { email: form.email.trim() }, {
      onError: (errs) => setFormErrors(errs),
      onSuccess: () => {
        setForm({ email: '' });
        setFormErrors({});
        setView('list');
        toast.success('Subscriber added successfully.');
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!confirmRow) return;
    router.delete(`/landing/newsletters/${confirmRow.id}`, {
      onSuccess: () => {
        toast.success('Subscriber deleted successfully.');
        setConfirmRow(null);
      },
      onError: () => toast.error('Failed to delete subscriber.'),
    });
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 0) return;
    router.get(
      '/landing/newsletters',
      { page: nextPage + 1, per_page: rowsPerPage },
      { preserveScroll: true, preserveState: true }
    );
  };

  const handleRowsChange = (nextRows) => {
    router.get(
      '/landing/newsletters',
      { page: 1, per_page: nextRows },
      { preserveScroll: true, preserveState: true }
    );
  };

  // ─── Create View ─────────────────────────────────────────────────────────────
  if (view === 'create') {
    return (
      <LandingEditorPageLayout currentPath="/landing/newsletters">
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <BackButton onClick={() => {
            setForm({ email: '' });
            setFormErrors({});
            setView('list');
          }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
            Add Subscriber
          </h1>
        </div>

        <Card>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
            Subscriber Information
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <FloatInput
              id="email"
              label="Email *"
              type="email"
              value={form.email}
              onChange={(e) => {
                setForm(prev => ({ ...prev, email: e.target.value }));
                if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
              }}
              error={Boolean(formErrors.email)}
              helperText={formErrors.email || undefined}
            />
          </div>
        </Card>

        <div className="mt-6">
          <FormActions
            id="newsletter-form"
            cancelText="Cancel"
            submitText="Save"
            onCancel={() => {
              setForm({ email: '' });
              setFormErrors({});
              setView('list');
            }}
            onSubmit={handleCreateSubmit}
            submitDisabled={!form.email.trim()}
          />
        </div>

        <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
      </LandingEditorPageLayout>
    );
  }

  // ─── List View ────────────────────────────────────────────────────────────────
  const rows = newsletters?.data ?? [];

  return (
    <LandingEditorPageLayout currentPath="/landing/newsletters">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Newsletter Subscribers
      </h1>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 14, color: '#64748B', fontFamily: 'Manrope, sans-serif' }}>
            Total: <strong style={{ color: '#1F2A3D' }}>{newsletters?.total ?? 0}</strong> subscribers
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Export CSV */}
          <a
            href="/landing/newsletters/export"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              color: '#374151',
              fontSize: 14,
              fontWeight: 500,
              fontFamily: 'Manrope, sans-serif',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'background 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
            onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
          >
            <IconExport />
            Export CSV
          </a>

          {/* Add subscriber */}
          <button
            type="button"
            onClick={() => {
              setForm({ email: '' });
              setFormErrors({});
              setView('create');
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Add Subscriber
          </button>
        </div>
      </div>

      {/* Tabel */}
      <DataTable
        columns={[
          { key: 'no',     label: '#',    align: 'center' },
          { key: 'email',  label: 'Email' },
          { key: 'action', label: '',     align: 'right'  },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-8">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="font-medium text-gray-500">No subscribers yet</p>
            <p className="text-sm text-gray-400">Click "Add Subscriber" to add the first email.</p>
          </div>
        )}
        footer={(
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={newsletters?.total ?? 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        )}
      >
        {rows.map((item, index) => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className={`${COL_CELL} text-center w-12`}>
              {page * rowsPerPage + index + 1}
            </td>
            <td className={COL_CELL}>{item.email}</td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => setConfirmRow(item)}
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
        title="Delete Subscriber"
        message={confirmRow ? `Are you sure you want to remove "${confirmRow.email}" from subscriber list?` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        onClose={() => setConfirmRow(null)}
        onConfirm={handleConfirmDelete}
      />
    </LandingEditorPageLayout>
  );
}
