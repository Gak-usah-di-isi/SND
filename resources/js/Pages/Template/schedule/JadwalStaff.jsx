import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Trash2, ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight } from 'lucide-react';
import PageLayout from '../../../Components/ui/shared/PageLayout';
import NexTable from '../../../Components/ui/shared/NexTable';
import { FloatSelect } from '../../../Components/ui/FloatSelect';

const DAYS = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];
const DAY_INITIAL = { Senin: 'S', Selasa: 'S', Rabu: 'R', Kamis: 'K', Jumat: 'J', Sabtu: 'S', Minggu: 'M' };

const SAMPLE_EMPLOYEES = [
  {
    id: '1',
    first_name: 'Budi',
    last_name: 'Santoso',
    phone_number: '081234567890',
    email: 'budi@klinik.com',
    photo: null,
    schedules: [
      { day: 'Senin',  is_active: true,  start_at: '08:00:00', end_at: '17:00:00' },
      { day: 'Selasa', is_active: true,  start_at: '08:00:00', end_at: '17:00:00' },
      { day: 'Rabu',   is_active: true,  start_at: '08:00:00', end_at: '17:00:00' },
      { day: 'Kamis',  is_active: true,  start_at: '08:00:00', end_at: '17:00:00' },
      { day: 'Jumat',  is_active: true,  start_at: '08:00:00', end_at: '15:00:00' },
      { day: 'Sabtu',  is_active: false, start_at: null,       end_at: null        },
      { day: 'Minggu', is_active: false, start_at: null,       end_at: null        },
    ],
  },
  {
    id: '2',
    first_name: 'Sari',
    last_name: 'Dewi',
    phone_number: '089876543210',
    email: 'sari@klinik.com',
    photo: null,
    schedules: [
      { day: 'Senin',  is_active: true,  start_at: '09:00:00', end_at: '18:00:00' },
      { day: 'Selasa', is_active: false, start_at: null,       end_at: null        },
      { day: 'Rabu',   is_active: true,  start_at: '09:00:00', end_at: '18:00:00' },
      { day: 'Kamis',  is_active: false, start_at: null,       end_at: null        },
      { day: 'Jumat',  is_active: true,  start_at: '09:00:00', end_at: '18:00:00' },
      { day: 'Sabtu',  is_active: true,  start_at: '09:00:00', end_at: '14:00:00' },
      { day: 'Minggu', is_active: false, start_at: null,       end_at: null        },
    ],
  },
  {
    id: '3',
    first_name: 'Andi',
    last_name: 'Pratama',
    phone_number: '082345678901',
    email: 'andi@klinik.com',
    photo: null,
    schedules: DAYS.map(d => ({ day: d, is_active: true, start_at: '07:00:00', end_at: '16:00:00' })),
  },
];

const DAY_ORDER = { Senin: 0, Selasa: 1, Rabu: 2, Kamis: 3, Jumat: 4, Sabtu: 5, Minggu: 6 };

function WorkHourExpand({ employee }) {
  const active = (employee.schedules || [])
    .filter(s => s.is_active && s.day)
    .sort((a, b) => (DAY_ORDER[a.day] ?? 99) - (DAY_ORDER[b.day] ?? 99));

  return (
    <div>
      <p className="text-sm font-bold text-gray-800 mb-3">Jam Kerja</p>
      {active.length > 0 ? (
        <div className={`grid gap-2 ${active.length > 4 ? 'grid-cols-2' : 'grid-cols-1'}`} style={{ maxWidth: 400 }}>
          {active.map(s => (
            <div key={s.day} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {s.day[0]}
              </div>
              <span className="text-sm text-gray-700">{s.day} : {s.start_at?.slice(0, 5)} – {s.end_at?.slice(0, 5)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">Tidak ada jadwal kerja aktif.</p>
      )}
    </div>
  );
}

/* ---- Simple Select — custom dropdown, no floating label ---- */
function SimpleSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const getPos = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return { top: 0, left: 0, width: 120 };
    return { top: rect.bottom + 4, left: rect.left, width: rect.width };
  };

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          border: `1px solid ${open ? '#0152EA' : '#E2E8F0'}`,
          borderRadius: 8,
          background: '#fff',
          fontSize: '0.875rem',
          color: '#1F2A3D',
          cursor: 'pointer',
          fontFamily: 'Manrope, sans-serif',
          transition: 'border-color 150ms',
        }}
      >
        <span>{selected?.label ?? value}</span>
        <ChevronDown size={14} style={{ color: '#94A3B8', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 150ms', flexShrink: 0 }} />
      </button>

      {open && createPortal(
        <div style={{
          position: 'fixed',
          zIndex: 99999,
          ...getPos(),
          background: '#fff',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          boxShadow: '0 8px 20px rgba(2,6,23,0.12)',
          overflow: 'hidden',
        }}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onMouseDown={e => { e.preventDefault(); onChange(opt.value); setOpen(false); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '9px 14px',
                fontSize: '0.875rem',
                fontFamily: 'Manrope, sans-serif',
                fontWeight: opt.value === value ? 500 : 400,
                color: opt.value === value ? '#0152EA' : '#1F2A3D',
                background: opt.value === value ? 'rgba(1,82,234,0.06)' : '#fff',
                border: 'none', cursor: 'pointer',
              }}
              onMouseEnter={e => { if (opt.value !== value) e.currentTarget.style.background = '#F0F5FF'; }}
              onMouseLeave={e => { if (opt.value !== value) e.currentTarget.style.background = '#fff'; }}
            >
              {opt.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

function ScheduleDialog({ open, mode, employee, onClose }) {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [workDays, setWorkDays] = useState(
    DAYS.map(d => ({ day: d, enabled: false, slots: [{ id: 1, startTime: '08:00', endTime: '17:00' }] }))
  );
  const [specialDates, setSpecialDates] = useState([{ id: 1, from: '', to: '', status: 'Tutup', notes: '' }]);

  const toggleDay = (i) => setWorkDays(prev => prev.map((d, idx) => idx === i ? { ...d, enabled: !d.enabled } : d));
  const updateTime = (di, si, key, val) => setWorkDays(prev => prev.map((d, idx) => {
    if (idx !== di) return d;
    return { ...d, slots: d.slots.map((s, sIdx) => sIdx === si ? { ...s, [key]: val } : s) };
  }));
  const addSlot = (di) => setWorkDays(prev => prev.map((d, idx) =>
    idx === di ? { ...d, slots: [...d.slots, { id: Date.now(), startTime: '08:00', endTime: '17:00' }] } : d
  ));
  const removeSlot = (di, si) => setWorkDays(prev => prev.map((d, idx) =>
    idx === di ? { ...d, slots: d.slots.filter((_, sIdx) => sIdx !== si) } : d
  ));
  const updateSpecial = (i, key, val) => setSpecialDates(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  const removeSpecial = (i) => setSpecialDates(prev => prev.filter((_, idx) => idx !== i));
  const addSpecial = () => setSpecialDates(prev => [...prev, { id: Date.now(), from: '', to: '', status: 'Tutup', notes: '' }]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-[12px] w-full mx-4 shadow-xl flex flex-col" style={{ maxHeight: '90vh', width: '90vw', maxWidth: 1200 }}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {mode === 'create' ? 'Create New Employee Schedule' : 'Edit Employee Schedule'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {mode === 'create' ? 'Add a new employee schedule to the system' : 'Update employee schedule information'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Staff select */}
          <div className="mb-6">
            <FloatSelect
              id="employee-schedule-form-employee-id-input"
              label="Nama Staff"
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              options={SAMPLE_EMPLOYEES.map(emp => ({ value: emp.id, label: `${emp.first_name} ${emp.last_name}` }))}
            />
          </div>

          {/* Work days grid */}
          <div className="mb-6">
            <div className="grid gap-3 mb-3 pb-2 border-b border-gray-100" style={{ gridTemplateColumns: '1fr 160px 160px 120px' }}>
              <p className="text-xs font-semibold text-gray-500 uppercase">Hari</p>
              <p className="text-xs font-semibold text-gray-500 uppercase">Jam Buka</p>
              <p className="text-xs font-semibold text-gray-500 uppercase">Jam Tutup</p>
              <div />
            </div>
            {workDays.map((wd, di) => (
              <div key={wd.day} className="mb-2">
                {wd.slots.map((slot, si) => (
                  <div key={slot.id} className="grid gap-3 mb-1.5 items-center" style={{ gridTemplateColumns: '1fr 160px 160px 120px' }}>
                    {si === 0 ? (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={wd.enabled}
                          onChange={() => toggleDay(di)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{wd.day}</span>
                      </label>
                    ) : <div />}
                    <input type="time" value={slot.startTime} disabled={!wd.enabled}
                      onChange={e => updateTime(di, si, 'startTime', e.target.value)}
                      className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-300 w-full"
                      style={{ colorScheme: 'light' }} />
                    <input type="time" value={slot.endTime} disabled={!wd.enabled}
                      onChange={e => updateTime(di, si, 'endTime', e.target.value)}
                      className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-300 w-full"
                      style={{ colorScheme: 'light' }} />
                    <div className="flex items-center gap-1">
                      {si === 0 && (
                        <button onClick={() => addSlot(di)} disabled={!wd.enabled}
                          className="px-2 py-1.5 text-xs border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors whitespace-nowrap">
                          + Time Slot
                        </button>
                      )}
                      {wd.slots.length > 1 && (
                        <button onClick={() => removeSlot(di, si)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-50 text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Special dates */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-3">Atur Tanggal Tertentu</p>
            <div className="grid gap-3 mb-2 pb-2 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 40px' }}>
              <span>Dari</span><span>Sampai</span><span>Status</span><span>Catatan</span><div />
            </div>
            {specialDates.map((sd, i) => (
              <div key={sd.id} className="grid gap-3 mb-2 items-center" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 40px' }}>
                <input type="date" value={sd.from} onChange={e => updateSpecial(i, 'from', e.target.value)}
                  className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 w-full" />
                <input type="date" value={sd.to} onChange={e => updateSpecial(i, 'to', e.target.value)}
                  className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 w-full" />
                <SimpleSelect
                  value={sd.status}
                  onChange={v => updateSpecial(i, 'status', v)}
                  options={[{ value: 'Tutup', label: 'Tutup' }, { value: 'Buka', label: 'Buka' }]}
                />
                <input placeholder="Alasan" value={sd.notes} onChange={e => updateSpecial(i, 'notes', e.target.value)}
                  className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 w-full" />
                <button onClick={() => removeSpecial(i)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button onClick={addSpecial}
              className="w-full py-2 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 transition-colors mt-2">
              + Tambah Baris
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 bg-white rounded-md hover:bg-gray-50 transition-colors" style={{ borderRadius: '9px' }}>
            Batalkan
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors" style={{ backgroundColor: '#0152EA', borderRadius: '9px' }}>
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Tabler-style pencil-square edit icon ---- */
function IconEdit({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
      <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415z" />
    </svg>
  );
}

/* ---- Tabler-style trash icon ---- */
function IconTrash({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12" />
      <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
}

export default function JadwalStaffPage() {
  const [employees] = useState(SAMPLE_EMPLOYEES);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [dialog, setDialog] = useState({ open: false, mode: 'create', employee: null });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmState, setConfirmState] = useState(null);

  const toggleExpand = (id) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const totalRows = employees.length;
  const from = page * rowsPerPage + 1;
  const to = Math.min((page + 1) * rowsPerPage, totalRows);
  const paged = employees.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <PageLayout currentPath="/template/jadwal/staff">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-bold text-gray-800" style={{ fontSize: 22 }}>Jadwal Staff</h1>
          <p className="text-sm text-gray-500 mt-0.5">Staff schedule management</p>
        </div>
        <button
          onClick={() => setDialog({ open: true, mode: 'create', employee: null })}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
          style={{ backgroundColor: '#0152EA', borderRadius: '9px' }}>
          <Plus size={18} />
          Buat Jadwal
        </button>
      </div>

      {/* Table */}
      <div className="bg-white" style={{ borderRadius: '12px', boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)', overflow: 'hidden' }}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {/* expand chevron col */}
              <th style={{ width: 48 }} />
              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Kontak</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Hari Kerja</th>
              <th className="px-5 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-16 text-center text-sm text-gray-400">Tidak ada data</td></tr>
            ) : paged.map(emp => (
              <>
                <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  {/* Chevron expand — leftmost */}
                  <td className="pl-3 pr-0 py-4" style={{ width: 48 }}>
                    <button onClick={() => toggleExpand(emp.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors text-gray-500">
                      {expandedRows.has(emp.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </td>
                  {/* Nama */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
                        {`${emp.first_name[0]}${emp.last_name[0]}`.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{emp.first_name} {emp.last_name}</p>
                      </div>
                    </div>
                  </td>
                  {/* Kontak */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-700">{emp.phone_number}</p>
                    <p className="text-sm text-gray-500">{emp.email}</p>
                  </td>
                  {/* Hari Kerja */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {DAYS.map(day => {
                        const sched = (emp.schedules || []).find(s => s.day === day);
                        const active = sched?.is_active ?? false;
                        return (
                          <div key={day} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: active ? '#0152EA' : '#E5E7EB', color: active ? '#fff' : '#9CA3AF' }}>
                            {DAY_INITIAL[day]}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setDialog({ open: true, mode: 'edit', employee: emp })}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors text-gray-500"
                        title="Edit">
                        <IconEdit size={18} />
                      </button>
                      <button
                        onClick={() => setConfirmState(emp)}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 transition-colors text-red-400"
                        title="Hapus">
                        <IconTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRows.has(emp.id) && (
                  <tr key={`${emp.id}-expand`} className="bg-gray-50 border-b border-gray-100">
                    {/* empty cells to align with chevron + Nama + Kontak */}
                    <td />
                    <td />
                    <td />
                    {/* content starts at Hari Kerja column */}
                    <td colSpan={2} className="px-5 py-4">
                      <WorkHourExpand employee={emp} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {/* MUI-style pagination */}
        <div className="flex items-center justify-end px-4 py-2 border-t border-gray-100 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
              style={{ border: 'none', outline: 'none', fontSize: '0.875rem', color: '#374151', background: 'transparent', cursor: 'pointer' }}>
              {[5, 10, 25].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <span>{from}–{to} of {totalRows}</span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-30 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={to >= totalRows}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-30 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirm delete dialog */}
      {confirmState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl mx-4">
            <p className="font-semibold text-gray-800 text-base mb-2">Hapus Jadwal</p>
            <p className="text-sm text-gray-500 mb-6">
              Yakin ingin menghapus jadwal {confirmState.first_name} {confirmState.last_name}? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmState(null)}
                className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">
                Batal
              </button>
              <button onClick={() => setConfirmState(null)}
                className="px-4 py-2 text-sm rounded-md text-white bg-red-500 hover:bg-red-600">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <ScheduleDialog
        open={dialog.open}
        mode={dialog.mode}
        employee={dialog.employee}
        onClose={() => setDialog({ open: false, mode: 'create', employee: null })}
      />
    </PageLayout>
  );
}
