import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, AlertTriangle } from 'lucide-react';
import PageLayout from "../../../Components/ui/shared/PageLayout.jsx";
import NexTable from '../../../Components/ui/shared/NexTable';

const STATUS_STYLE = {
  scheduled:                { label: 'Dijadwalkan',   bg: 'rgba(19,222,185,0.1)',  color: '#10B981' },
  arrived:                  { label: 'Tiba',           bg: 'rgba(255,174,31,0.1)',  color: '#F59E0B' },
  in_progress:              { label: 'Berlangsung',    bg: 'rgba(1,82,234,0.1)',    color: '#0152EA' },
  in_progress_consultation: { label: 'Konsultasi',     bg: 'rgba(1,82,234,0.1)',    color: '#0152EA' },
  awaiting_payment:         { label: 'Menunggu Bayar', bg: 'rgba(168,85,247,0.1)', color: '#7C3AED' },
  paid:                     { label: 'Lunas',          bg: 'rgba(19,222,185,0.1)',  color: '#10B981' },
  done:                     { label: 'Selesai',        bg: 'rgba(100,116,139,0.1)', color: '#64748B' },
  cancelled:                { label: 'Dibatalkan',     bg: 'rgba(239,68,68,0.1)',   color: '#EF4444' },
};

const SAMPLE_APPOINTMENTS = [
  { id: '1', booking_id: 'BK-001', schedule: '08:00 - 09:00', patient_name: 'Chris Evans',  patient_phone: '083672834764', service: 'Facial, Botox',    status: 'arrived',          branch_name: 'Klinik Pusat', branch_address: 'Jl. Sudirman No. 1' },
  { id: '2', booking_id: 'BK-002', schedule: '09:00 - 10:00', patient_name: 'Evelyn Pope',  patient_phone: '081234567890', service: 'Treatment Botox',  status: 'scheduled',        branch_name: 'Klinik Pusat', branch_address: 'Jl. Sudirman No. 1' },
  { id: '3', booking_id: 'BK-003', schedule: '10:00 - 11:00', patient_name: 'Michael Doe',  patient_phone: '082345678901', service: 'Tanam Benang',      status: 'in_progress',      branch_name: 'Klinik Pusat', branch_address: 'Jl. Sudirman No. 1' },
  { id: '4', booking_id: 'BK-004', schedule: '11:00 - 12:00', patient_name: 'Melinda',      patient_phone: '089876543210', service: 'Facial',            status: 'awaiting_payment', branch_name: 'Klinik Pusat', branch_address: 'Jl. Sudirman No. 1' },
  { id: '5', booking_id: 'BK-005', schedule: '13:00 - 14:00', patient_name: 'Yuvraj Sheth', patient_phone: '087654321098', service: 'Konsultasi',        status: 'done',             branch_name: 'Klinik Pusat', branch_address: 'Jl. Sudirman No. 1' },
];

const CANCEL_REASONS = [
  'Sakit / Emergency',
  'Kegiatan Lain (operasi, meeting, seminar)',
  'Cuti / Libur',
  'Lainnya',
];

function DatePillNav({ date, view, onPrev, onNext }) {
  const fmt = () => {
    if (view === 'month') return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
    if (view === 'week') {
      const d = new Date(date);
      const diff = (d.getDay() + 6) % 7;
      const start = new Date(d); start.setDate(d.getDate() - diff);
      const end = new Date(start); end.setDate(start.getDate() + 6);
      return `${start.getDate()} - ${end.getDate()} ${new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(start)} ${start.getFullYear()}`;
    }
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };
  return (
    <div className="flex items-center gap-2">
      <button onClick={onPrev} className="flex items-center justify-center border border-gray-200 bg-white rounded-md hover:bg-blue-50 hover:border-blue-200 transition-colors" style={{ width: 36, height: 36 }}>
        <ChevronLeft size={16} className="text-gray-500" />
      </button>
      <div className="px-4 py-1.5 border border-gray-200 bg-white rounded-md text-sm font-medium text-gray-700" style={{ minWidth: 160, textAlign: 'center' }}>
        {fmt()}
      </div>
      <button onClick={onNext} className="flex items-center justify-center border border-gray-200 bg-white rounded-md hover:bg-blue-50 hover:border-blue-200 transition-colors" style={{ width: 36, height: 36 }}>
        <ChevronRight size={16} className="text-gray-500" />
      </button>
    </div>
  );
}

function CancelDialog({ open, appointment, onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  const [detail, setDetail] = useState('');
  const [sendNotif, setSendNotif] = useState(false);

  const handleClose = () => {
    setReason(''); setDetail(''); setSendNotif(false);
    onClose();
  };
  const handleConfirm = () => {
    if (!reason) return;
    if (reason === 'Lainnya' && !detail) return;
    onConfirm({ reason: reason === 'Lainnya' ? `Lainnya: ${detail}` : reason });
    handleClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-[12px] w-full max-w-lg mx-4 shadow-xl">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Konfirmasi Pembatalan Jadwal</h2>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="text-sm text-gray-700 font-medium">Apakah anda yakin ingin membatalkan jadwal ini?</p>

          {/* Appointment info grid */}
          <div className="bg-gray-100 p-4 grid grid-cols-2 gap-4 rounded-md text-sm">
            <div>
              <p className="font-bold text-gray-800">Nama Pasien</p>
              <p className="text-gray-600">{appointment?.patient_name || '-'}</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">Treatment</p>
              <p className="text-gray-600">{appointment?.service || '-'}</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">Tanggal & Jam</p>
              <p className="text-gray-600">{appointment?.schedule || '-'}</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">Lokasi</p>
              <p className="text-gray-600">{appointment?.branch_name || '-'} - {appointment?.branch_address || '-'}</p>
            </div>
          </div>

          {/* Reason */}
          <div>
            <p className="text-sm font-bold text-gray-800 mb-2">Alasan Pembatalan</p>
            <div className="flex flex-col gap-2">
              {CANCEL_REASONS.map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input type="radio" name="cancel-reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="accent-blue-600" />
                  {r}
                </label>
              ))}
            </div>
          </div>

          {reason === 'Lainnya' && (
            <div>
              <p className="text-sm font-bold text-gray-800 mb-1">Jelaskan Alasan Pembatalan</p>
              <textarea
                value={detail}
                onChange={e => setDetail(e.target.value)}
                placeholder="Masukkan alasan pembatalan Anda di sini..."
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-400 resize-none"
              />
            </div>
          )}

          {/* Warning */}
          <div className="bg-orange-50 rounded-md p-4 border border-orange-300 flex items-center gap-2 text-sm text-orange-800">
            <AlertTriangle size={16} className="flex-shrink-0" />
            <span>Pasien akan menerima notifikasi pembatalan secara otomatis</span>
          </div>

          {/* Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" checked={sendNotif} onChange={e => setSendNotif(e.target.checked)} className="accent-blue-600 w-4 h-4" />
            Kirim notifikasi pembatalan kepada pasien
          </label>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 bg-white rounded-md hover:bg-gray-50 transition-colors" style={{ borderRadius: '9px' }}>
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason || !sendNotif || (reason === 'Lainnya' && !detail)}
            className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#EF4444', borderRadius: '9px' }}
          >
            Batalkan Jadwal
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JadwalSayaPage() {
  const [range, setRange] = useState('hari');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [search, setSearch] = useState('');
  const [cancelDialog, setCancelDialog] = useState({ open: false, row: null });

  const prev = () => {
    const d = new Date(currentDate);
    if (range === 'bulan') d.setMonth(d.getMonth() - 1);
    else if (range === 'minggu') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };
  const next = () => {
    const d = new Date(currentDate);
    if (range === 'bulan') d.setMonth(d.getMonth() + 1);
    else if (range === 'minggu') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const filtered = SAMPLE_APPOINTMENTS.filter(a =>
    a.patient_name.toLowerCase().includes(search.toLowerCase()) ||
    a.booking_id.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { id: 'booking_id', header: 'ID Transaksi', render: (r) => <span className="text-sm font-medium text-gray-800">{r.booking_id}</span> },
    { id: 'schedule',   header: 'Jam',          render: (r) => <span className="text-sm text-gray-600">{r.schedule}</span> },
    { id: 'patient',    header: 'Pasien',        render: (r) => {
      const initials = r.patient_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">{initials}</div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{r.patient_name}</p>
            <p className="text-xs text-gray-500">{r.patient_phone}</p>
          </div>
        </div>
      );
    }},
    { id: 'service', header: 'Layanan', render: (r) => <span className="text-sm text-gray-600">{r.service}</span> },
    { id: 'status',  header: 'Status',  render: (r) => {
      const s = STATUS_STYLE[r.status] ?? STATUS_STYLE.scheduled;
      return <span className="inline-block px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>;
    }},
  ];

  const getActions = (row) => {
    const restricted = ['in_progress', 'in_progress_consultation'];
    const canRescheduleOrCancel = !restricted.includes(row.status);
    const acts = [];

    if (row.status !== 'scheduled') {
      acts.push({ label: 'Lihat Detail', onClick: () => {} });
    }
    acts.push({
      label: row.status === 'in_progress_consultation' ? 'Lanjutkan Konsultasi' : 'Mulai Konsul',
      needsConfirmation: row.status !== 'in_progress_consultation',
      confirmationTitle: 'Mulai Konsultasi',
      confirmationType: 'primary',
      confirmationMessage: () => 'Status akan dirubah menjadi Berlangsung. Lanjutkan?',
      onClick: () => {},
    });
    if (canRescheduleOrCancel) {
      acts.push({ label: 'Reschedule', onClick: () => {} });
      acts.push({ label: 'Cancel', onClick: () => setCancelDialog({ open: true, row }) });
    }
    return acts;
  };

  return (
    <PageLayout currentPath="/template/jadwal/saya">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <h1 className="font-bold text-gray-800" style={{ fontSize: 22 }}>Jadwal Saya</h1>
        <div className="flex items-center justify-center text-xs font-bold rounded-full" style={{ width: 30, height: 30, backgroundColor: 'rgba(73,190,255,0.1)', color: '#49BEFF', fontSize: 16 }}>
          {filtered.length}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-white border border-gray-200 rounded-md overflow-hidden text-sm">
            {['hari', 'minggu', 'bulan'].map((r) => (
              <button key={r} onClick={() => setRange(r)}
                className="px-4 py-2 transition-colors"
                style={range === r ? { backgroundColor: 'rgba(1,82,234,0.1)', color: '#0152EA', fontWeight: 600 } : { color: '#374151' }}>
                {r === 'hari' ? 'Hari Ini' : r === 'minggu' ? 'Minggu Ini' : 'Bulan Ini'}
              </button>
            ))}
          </div>
          <DatePillNav date={currentDate} view={range === 'bulan' ? 'month' : range === 'minggu' ? 'week' : 'date'} onPrev={prev} onNext={next} />
        </div>
        <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-md px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari Pasien"
            className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            style={{ width: 160 }}
          />
        </div>
      </div>

      <NexTable
        columns={columns}
        data={filtered}
        actions={getActions}
        actionType="dropdown"
        emptyTitle="Tidak ada jadwal"
        emptyDesc="Belum ada jadwal pada tanggal ini."
      />

      <CancelDialog
        open={cancelDialog.open}
        appointment={cancelDialog.row}
        onClose={() => setCancelDialog({ open: false, row: null })}
        onConfirm={() => setCancelDialog({ open: false, row: null })}
      />
    </PageLayout>
  );
}
