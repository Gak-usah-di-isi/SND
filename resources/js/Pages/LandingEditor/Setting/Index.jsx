import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import LandingEditorPageLayout from '../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import { Icon } from '@iconify/react';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';

export default function Index() {
  const { years } = usePage().props;
  const toast = useToast();

  const [newYear, setNewYear] = useState('');
  const [yearError, setYearError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [confirmItem, setConfirmItem] = useState(null);

  // --- Add New Year ---
  const handleAddYear = (e) => {
    e.preventDefault();
    setYearError('');

    if (!newYear) {
      setYearError('Year is required.');
      return;
    }
    const yr = parseInt(newYear);
    if (isNaN(yr) || yr < 2000 || yr > 2100) {
      setYearError('Invalid year (2000–2100).');
      return;
    }

    setProcessing(true);
    router.post('/landing/setting', { year: yr }, {
      onSuccess: () => {
        setProcessing(false);
        setNewYear('');
        toast.success(`Year ${yr} added successfully.`);
      },
      onError: (err) => {
        setProcessing(false);
        setYearError(err.year ?? 'Year already exists or is invalid.');
      },
    });
  };

  // --- Set Active ---
  const handleSetActive = () => {
    if (!confirmItem) return;
    router.post(`/landing/setting/${confirmItem.id}/set-active`, {}, {
      onSuccess: () => {
        toast.success(`Year ${confirmItem.year} is now the active year.`);
        setConfirmItem(null);
      },
      onError: () => {
        toast.error('Failed to change active year.');
        setConfirmItem(null);
      },
      preserveScroll: true,
    });
  };

  return (
    <LandingEditorPageLayout currentPath="/landing/setting">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', marginBottom: 24 }}>
        Active Year Setting
      </h1>

      {/* --- Add New Year Form --- */}
      <div style={{
        background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0',
        padding: '20px 24px', marginBottom: 24,
      }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', marginBottom: 12 }}>
          Add New Year
        </p>
        <form onSubmit={handleAddYear} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <input
              type="number"
              placeholder="e.g. 2026"
              value={newYear}
              onChange={(e) => { setNewYear(e.target.value); setYearError(''); }}
              disabled={processing}
              style={{
                width: '100%', height: 40, padding: '0 14px',
                border: yearError ? '1px solid #EF4444' : '1px solid #E2E8F0',
                borderRadius: 8, fontSize: 13,
                fontFamily: 'Manrope,sans-serif', color: '#1F2A3D',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
            {yearError && (
              <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4, fontFamily: 'Manrope,sans-serif' }}>
                {yearError}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={processing}
            style={{
              height: 40, padding: '0 18px', borderRadius: 8,
              background: processing ? '#93C5FD' : '#0152EA',
              color: '#fff', border: 'none',
              fontSize: 13, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              cursor: processing ? 'not-allowed' : 'pointer',
              flexShrink: 0,
            }}
          >
            <Icon icon="lucide:plus" width={16} />
            Add
          </button>
        </form>
      </div>

      {/* --- Years Table --- */}
      <DataTable
        columns={[
          { key: 'year',   label: 'Year' },
          { key: 'status', label: 'Status' },
          { key: 'action', label: 'Actions' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-6">
            <Icon icon="solar:calendar-outline" width={48} style={{ color: '#D1D5DB' }} />
            <p style={{ color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>No years added yet</p>
          </div>
        )}
      >
        {(years || []).map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-100">
            {/* Year */}
            <td className="px-4 py-4">
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
                {item.year}
              </span>
            </td>

            {/* Status Badge */}
            <td className="px-4 py-4">
              {item.is_active ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: '#D1FAE5', color: '#065F46',
                  padding: '3px 10px', borderRadius: 99,
                  fontSize: 12, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
                }}>
                  <Icon icon="solar:check-circle-bold" width={13} />
                  Active
                </span>
              ) : (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: '#F1F5F9', color: '#64748B',
                  padding: '3px 10px', borderRadius: 99,
                  fontSize: 12, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
                }}>
                  Inactive
                </span>
              )}
            </td>

            {/* Set Active Button */}
            <td className="px-4 py-4">
              {!item.is_active && (
                <button
                  type="button"
                  onClick={() => setConfirmItem(item)}
                  style={{
                    height: 32, padding: '0 14px', borderRadius: 8,
                    background: '#fff', color: '#0152EA',
                    border: '1px solid #0152EA',
                    fontSize: 12, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    cursor: 'pointer',
                  }}
                >
                  <Icon icon="solar:star-bold" width={13} />
                  Set as Active
                </button>
              )}
            </td>
          </tr>
        ))}
      </DataTable>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <ConfirmDialog
        open={Boolean(confirmItem)}
        title="Set as Active Year"
        message={
          confirmItem
            ? `Are you sure you want to set year ${confirmItem.year} as the active year? The currently active year will automatically be deactivated and the public landing page will update.`
            : ''
        }
        cancelText="Cancel"
        confirmText="Yes, Set as Active"
        onClose={() => setConfirmItem(null)}
        onConfirm={handleSetActive}
      />
    </LandingEditorPageLayout>
  );
}
