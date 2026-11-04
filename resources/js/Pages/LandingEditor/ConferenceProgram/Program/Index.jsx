import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import LandingEditorPageLayout from '../../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../../Components/ui/DataTable';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';
import ConfirmDialog from '../../../../Components/ui/ConfirmDialog';
import BackButton from '../../../../Components/ui/BackButton';
import ProgramForm from './ProgramForm';

const CURRENT_PATH = '/landing/conference-program';
const CELL = 'px-6 py-4 text-sm text-gray-700';
const SELECT_CLASS = 'border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none';
const SELECT_STYLE = { borderRadius: 8, fontFamily: 'Manrope, sans-serif' };

// Kolom start_time/end_time bertipe TIME, MySQL mengembalikan "HH:MM:SS" —
// <input type="time"> hanya menerima "HH:MM".
const toTimeInput = (value = '') => String(value).slice(0, 5);

const emptyForm = () => ({
  year: new Date().getFullYear(),
  day_number: '1',
  date: '',
  start_time: '',
  end_time: '',
  program_name: '',
  pic: '',
});

// Kelompokkan per tahun + hari, urutan mengikuti urutan dari controller.
function groupByDay(programs) {
  const groups = [];
  const index = new Map();

  programs.forEach((item) => {
    const key = `${item.year}-${item.day_number}`;
    if (!index.has(key)) {
      const group = { key, year: item.year, day: item.day_number, date: item.date, rows: [] };
      index.set(key, group);
      groups.push(group);
    }
    index.get(key).rows.push(item);
  });

  return groups;
}

export default function ProgramIndex({ programs = [], years = [], selectedYear = 'all' }) {
  const toast = useToast();
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [filterYear, setFilterYear] = useState(selectedYear || 'all');
  const [form, setForm] = useState(emptyForm());
  const [formErrors, setFormErrors] = useState({});
  const [confirmRow, setConfirmRow] = useState(null);

  const groups = groupByDay(programs);

  // Day options: all existing days, plus one new day after (minimum 1–5).
  const maxDay = programs.reduce((max, p) => Math.max(max, Number(p.day_number) || 0), 0);
  const dayOptions = Array.from({ length: Math.max(5, maxDay + 1) }, (_, i) => ({
    value: String(i + 1),
    label: `Day ${i + 1}`,
  }));

  const validate = () => {
    const errors = {};
    if (!form.year) errors.year = 'Year is required';
    if (!form.day_number) errors.day_number = 'Day is required';
    if (!form.date) errors.date = 'Date is required';
    if (!form.start_time) errors.start_time = 'Start time is required';
    if (!form.end_time) errors.end_time = 'End time is required';
    if (!form.program_name) errors.program_name = 'Program name is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // The `pic` column is not nullable; controller uses '-' as default.
  const payload = () => ({ ...form, pic: form.pic || '-' });

  const handleCreateSubmit = () => {
    if (!validate()) return;
    router.post(CURRENT_PATH, payload(), {
      onError: (errs) => setFormErrors(errs),
      onSuccess: () => {
        setView('list');
        toast.success('Program added successfully.');
      },
    });
  };

  const handleEditSubmit = () => {
    if (!selected || !validate()) return;
    router.put(`${CURRENT_PATH}/${selected.id}`, payload(), {
      onError: (errs) => setFormErrors(errs),
      onSuccess: () => {
        setSelected(null);
        setView('list');
        toast.success('Program updated successfully.');
      },
    });
  };

  const handleDelete = () => {
    if (!confirmRow) return;
    router.delete(`${CURRENT_PATH}/${confirmRow.id}`, {
      preserveScroll: true,
      onSuccess: () => { toast.success('Program deleted successfully.'); setConfirmRow(null); },
      onError: () => { toast.error('Failed to delete program.'); setConfirmRow(null); },
    });
  };

  const handleYearFilter = (event) => {
    const value = event.target.value;
    setFilterYear(value);
    router.get(CURRENT_PATH, value === 'all' ? {} : { year: value }, { preserveState: true, preserveScroll: true });
  };

  const openEdit = (item) => {
    setSelected(item);
    setForm({
      year: item.year ?? new Date().getFullYear(),
      day_number: String(item.day_number ?? '1'),
      date: item.date ?? '',
      start_time: toTimeInput(item.start_time),
      end_time: toTimeInput(item.end_time),
      program_name: item.program_name ?? '',
      pic: item.pic === '-' ? '' : (item.pic ?? ''),
    });
    setFormErrors({});
    setView('edit');
  };

  if (view === 'create' || view === 'edit') {
    return (
      <LandingEditorPageLayout currentPath={CURRENT_PATH}>
        <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
          <BackButton onClick={() => { setView('list'); setSelected(null); }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
            {view === 'create' ? 'Add Program' : 'Edit Program'}
          </h1>
        </div>
        <ProgramForm
          form={form}
          setForm={setForm}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          dayOptions={dayOptions}
          onCancel={() => { setView('list'); setSelected(null); }}
          onSubmit={view === 'create' ? handleCreateSubmit : handleEditSubmit}
        />
        <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
      </LandingEditorPageLayout>
    );
  }

  return (
    <LandingEditorPageLayout currentPath={CURRENT_PATH}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope,sans-serif' }}>
        Conference Program
      </h1>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <select value={filterYear} onChange={handleYearFilter} className={SELECT_CLASS} style={SELECT_STYLE}>
          <option value="all">All Years</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => {
            setForm(emptyForm());
            setFormErrors({});
            setView('create');
          }}
          style={{
            height: 36, padding: '0 16px', borderRadius: 8,
            background: '#0152EA', color: '#fff', border: 'none',
            fontSize: 13, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
            display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          }}
        >
          <Icon icon="lucide:plus" width={16} />
          Add Program
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'time', label: 'Time' },
          { key: 'program_name', label: 'Program Name' },
          { key: 'pic', label: 'PIC' },
          { key: 'year', label: 'Year' },
          { key: 'action', label: '', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-6">
            <Icon icon="solar:calendar-outline" width={48} style={{ color: '#D1D5DB' }} />
            <p style={{ color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>No programs found</p>
          </div>
        )}
      >
        {groups.flatMap((group) => ([
          <tr key={`head-${group.key}`} style={{ background: '#F8FAFC' }}>
            <td colSpan={5} className="px-6 py-2">
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0152EA', fontFamily: 'Manrope,sans-serif' }}>
                Day {group.day}
              </span>
              <span style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Manrope,sans-serif', marginLeft: 8 }}>
                {group.date} · {group.year}
              </span>
            </td>
          </tr>,
          ...group.rows.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className={CELL}>{toTimeInput(item.start_time)} – {toTimeInput(item.end_time)}</td>
              <td className={CELL}>{item.program_name}</td>
              <td className={CELL}>{item.pic || '-'}</td>
              <td className={CELL}>{item.year}</td>
              <td className="px-6 py-4">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    title="Edit"
                    className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    <Icon icon="solar:pen-2-outline" width={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmRow(item)}
                    title="Delete"
                    className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Icon icon="solar:trash-bin-minimalistic-outline" width={16} />
                  </button>
                </div>
              </td>
            </tr>
          )),
        ]))}
      </DataTable>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <ConfirmDialog
        open={Boolean(confirmRow)}
        title="Delete Program"
        message={confirmRow ? `Delete program "${confirmRow.program_name}"? This action cannot be undone.` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        onClose={() => setConfirmRow(null)}
        onConfirm={handleDelete}
      />
    </LandingEditorPageLayout>
  );
}
