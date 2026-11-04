import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Calendar, CreditCard, Camera, CheckCircle, Trash2, NotebookPen, X, AlertCircle } from 'lucide-react';
import PageLayout from '../../../Components/ui/shared/PageLayout';
import NexTable from '../../../Components/ui/shared/NexTable';
import { FloatInput } from '../../../Components/ui/FloatInput';
import { FloatSelect } from '../../../Components/ui/FloatSelect';

const SAMPLE_DOCTORS = [
  { doctor_id: '1', doctor_name: 'Dr. Sunil Joshi', profession: 'Kecantikan', upcoming_appointments: 5, today_appointments: 12 },
  { doctor_id: '2', doctor_name: 'Dr. John Doe',    profession: 'Ahli Bedah',  upcoming_appointments: 3, today_appointments: 8  },
  { doctor_id: '3', doctor_name: 'Dr. Nirav Joshi', profession: 'Kecantikan', upcoming_appointments: 7, today_appointments: 15 },
];

const SAMPLE_PATIENTS = [
  { id: '1', name: 'Chris Evans',   phone: '083672834764' },
  { id: '2', name: 'Evelyn Pope',   phone: '081234567890' },
  { id: '3', name: 'Michael Doe',   phone: '082345678901' },
  { id: '4', name: 'Melinda Tan',   phone: '089876543210' },
  { id: '5', name: 'Yuvraj Sheth',  phone: '087654321098' },
];

const SAMPLE_TREATMENTS = [
  { id: '1', name: 'Facial' },
  { id: '2', name: 'Botox' },
  { id: '3', name: 'Tanam Benang' },
  { id: '4', name: 'Konsultasi' },
  { id: '5', name: 'Treatment Laser' },
];

const TIME_SLOTS = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'];

const STATUS_STYLE = {
  scheduled:        { label: 'Dijadwalkan',   bg: 'rgba(19,222,185,0.1)',  color: '#10B981' },
  arrived:          { label: 'Tiba',          bg: 'rgba(255,174,31,0.1)',  color: '#F59E0B' },
  in_progress:      { label: 'Berlangsung',   bg: 'rgba(1,82,234,0.1)',    color: '#0152EA' },
  awaiting_payment: { label: 'Menunggu Bayar',bg: 'rgba(168,85,247,0.1)', color: '#7C3AED' },
  paid:             { label: 'Lunas',         bg: 'rgba(19,222,185,0.1)',  color: '#10B981' },
  done:             { label: 'Selesai',       bg: 'rgba(100,116,139,0.1)', color: '#64748B' },
  cancelled:        { label: 'Dibatalkan',    bg: 'rgba(239,68,68,0.1)',   color: '#EF4444' },
};

const SAMPLE_APPOINTMENTS = [
  { id: '1', booking_id: 'BK-001', schedule: '08:00 - 09:00', patient_name: 'Chris Evans',  patient_phone: '083672834764', service: 'Facial, Botox',    reservation_via: 'WHATSAPP',        status: 'arrived',          doctor_name: 'Dr. Sunil Joshi' },
  { id: '2', booking_id: 'BK-002', schedule: '09:00 - 10:00', patient_name: 'Evelyn Pope',  patient_phone: '081234567890', service: 'Treatment Botox',  reservation_via: 'APP',             status: 'scheduled',        doctor_name: 'Dr. John Doe'    },
  { id: '3', booking_id: 'BK-003', schedule: '10:00 - 11:00', patient_name: 'Michael Doe',  patient_phone: '082345678901', service: 'Tanam Benang',      reservation_via: 'DATANG_LANGSUNG', status: 'in_progress',      doctor_name: 'Dr. Nirav Joshi' },
  { id: '4', booking_id: 'BK-004', schedule: '11:00 - 12:00', patient_name: 'Melinda',      patient_phone: '089876543210', service: 'Facial',            reservation_via: 'TELEPHONE',       status: 'awaiting_payment', doctor_name: 'Dr. Sunil Joshi' },
  { id: '5', booking_id: 'BK-005', schedule: '13:00 - 14:00', patient_name: 'Yuvraj Sheth', patient_phone: '087654321098', service: 'Konsultasi',        reservation_via: 'WHATSAPP',        status: 'done',             doctor_name: 'Dr. John Doe'    },
];

function reservasiLabel(via) {
  const m = { APP: 'App', DATANG_LANGSUNG: 'Datang Langsung', TELEPHONE: 'Telepon', WHATSAPP: 'WhatsApp' };
  return m[via] ?? via;
}

/* ---- DatePill Nav ---- */
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

/* ---- Toggle Group (MUI ToggleButtonGroup style, auto-width per button) ---- */
function ToggleGroup({ options, labels, value, onChange }) {
  return (
    <div style={{
      display: 'flex',
      width: 'fit-content',
      border: '1px solid #E2E8F0',
      borderRadius: '8px',
      overflow: 'hidden',
      height: 40,
    }}>
      {options.map((opt, i) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          style={{
            padding: '0 15px',
            height: '100%',
            fontSize: '0.875rem',
            fontFamily: 'Manrope, sans-serif',
            fontWeight: value === opt ? 600 : 400,
            color: value === opt ? '#0152EA' : '#1F2A3D',
            backgroundColor: value === opt ? 'rgba(1,82,234,0.1)' : 'transparent',
            border: 'none',
            borderLeft: i > 0 ? '1px solid #E2E8F0' : 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms, color 150ms',
            whiteSpace: 'nowrap',
          }}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

/* ---- Date Input with calendar icon, no floating label ---- */
function DateInput({ id, value, onChange, disabled = false }) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const borderColor = focused ? '#0152EA' : 'rgba(0,0,0,0.23)';

  const displayValue = value ? value.split('-').reverse().join('/') : '';

  return (
    <div style={{
      position: 'relative', display: 'flex', alignItems: 'center',
      width: '100%', borderRadius: '8px', boxSizing: 'border-box',
      border: `1px solid ${borderColor}`,
      transition: 'border-color 200ms',
      cursor: disabled ? 'not-allowed' : 'pointer',
      backgroundColor: disabled ? '#F8FAFC' : '#fff',
    }}>
      {/* Calendar icon */}
      <div style={{ padding: '10px 8px 10px 14px', color: '#94A3B8', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <Calendar size={16} />
      </div>
      {/* Overlay input + display */}
      <div style={{ flex: 1, position: 'relative' }}>
        <input
          ref={inputRef}
          id={id}
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            position: 'absolute', inset: 0, opacity: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
            width: '100%', height: '100%',
          }}
        />
        <span style={{
          display: 'block',
          fontFamily: 'Manrope, sans-serif',
          fontSize: '0.875rem', fontWeight: 400,
          color: value ? '#1F2A3D' : '#94A3B8',
          padding: '10px 14px 10px 0',
          lineHeight: 1.4375,
          pointerEvents: 'none',
        }}>
          {value ? displayValue : 'DD/MM/YYYY'}
        </span>
      </div>
    </div>
  );
}

/* ---- Buat Janji Drawer ---- */
function BuatJanjiDrawer({ open, onClose }) {
  const [form, setForm] = useState({
    patient_id: '', phone: '', reservation: 'WHATSAPP', service: 'MEDIS',
    doctor_id: '', date: '', schedule: '', treatment_id: '', complaints: '', notes: '',
  });

  const set = (key, val) => setForm(prev => {
    const next = { ...prev, [key]: val };
    if (key === 'patient_id') {
      const p = SAMPLE_PATIENTS.find(p => p.id === val);
      next.phone = p ? p.phone : '';
    }
    return next;
  });

  const handleClose = () => {
    setForm({ patient_id:'', phone:'', reservation:'WHATSAPP', service:'MEDIS', doctor_id:'', date:'', schedule:'', treatment_id:'', complaints:'', notes:'' });
    onClose();
  };

  const reservasiOptions = ['TELEPHONE','APP','WHATSAPP','DATANG_LANGSUNG'];
  const reservasiLabels  = { TELEPHONE:'Telephone', APP:'APP', WHATSAPP:'Whatsapp', DATANG_LANGSUNG:'Datang Langsung' };
  const serviceOptions   = ['MEDIS','NON_MEDIS'];
  const serviceLabels    = { MEDIS:'Medis', NON_MEDIS:'Non Medis' };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        onClick={handleClose}
      />
      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-50 bg-white flex flex-col transition-transform duration-300"
        style={{
          width: '75vw',
          maxWidth: '75vw',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: '-4px 0 32px rgba(0,0,0,0.14)',
          borderRadius: '16px 0 0 16px',
        }}
      >
        {/* Sticky header */}
        <div className="flex items-center justify-between px-10 pt-8 pb-5 flex-shrink-0 bg-white" style={{ borderRadius: '16px 0 0 0' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>Buat Janji</h2>
          <button onClick={handleClose} className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="px-10 flex-shrink-0"><div className="border-t border-gray-200 mb-1" /></div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-10 py-6">
          <div className="grid grid-cols-2 gap-5">

            {/* Pasien */}
            <FloatSelect
              id="slct-patient"
              label="Pasien"
              options={SAMPLE_PATIENTS.map(p => ({ value: p.id, label: p.name }))}
              value={form.patient_id}
              onChange={v => set('patient_id', v)}
            />

            {/* No HP */}
            <FloatInput
              id="phone"
              label="No Handphone"
              value={form.phone}
              disabled
              placeholder="Otomatis terisi"
            />

            {/* Reservasi Via */}
            <div className="flex flex-col gap-1.5">
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F2A3D', margin: 0 }}>Reservasi Via</p>
              <ToggleGroup
                options={reservasiOptions}
                labels={reservasiLabels}
                value={form.reservation}
                onChange={v => set('reservation', v)}
              />
            </div>

            {/* Jenis Pelayanan */}
            <div className="flex flex-col gap-1.5">
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F2A3D', margin: 0 }}>Jenis Pelayanan</p>
              <ToggleGroup
                options={serviceOptions}
                labels={serviceLabels}
                value={form.service}
                onChange={v => set('service', v)}
              />
            </div>

            {/* Pilih Dokter — full width */}
            <div className="col-span-2">
              <FloatSelect
                id="slct-doctor"
                label="Pilih Dokter"
                options={SAMPLE_DOCTORS.map(d => ({ value: d.doctor_id, label: d.doctor_name }))}
                value={form.doctor_id}
                onChange={v => set('doctor_id', v)}
              />
            </div>

            {/* Tanggal — full width */}
            <div className="col-span-2">
              <DateInput
                id="date"
                value={form.date}
                onChange={v => set('date', v)}
                disabled={!form.doctor_id}
              />
            </div>

            {/* Jam Konsultasi — full width */}
            <div className="col-span-2 flex flex-col gap-2">
              <p className="text-sm text-gray-400 font-medium">Pilih jam konsultasi</p>
              {!form.date || !form.doctor_id ? (
                <div className="border border-dashed border-gray-200 rounded-md p-4 text-center text-sm text-gray-400 bg-gray-50">
                  Silakan pilih tanggal terlebih dahulu
                </div>
              ) : (
                <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
                  {TIME_SLOTS.map(slot => (
                    <button key={slot} type="button" onClick={() => set('schedule', slot)}
                      className="py-2 text-sm border rounded-md transition-colors font-medium"
                      style={form.schedule === slot
                        ? { borderColor: '#0152EA', backgroundColor: 'rgba(1,82,234,0.08)', color: '#0152EA', borderRadius: 8 }
                        : { borderColor: '#E5E7EB', color: '#374151', borderRadius: 8 }}>
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Treatment — full width */}
            <div className="col-span-2">
              <FloatSelect
                id="slct-treatment"
                label="Treatment"
                options={SAMPLE_TREATMENTS.map(t => ({ value: t.id, label: t.name }))}
                value={form.treatment_id}
                onChange={v => set('treatment_id', v)}
              />
            </div>

            {/* Complaints */}
            <FloatInput
              id="complaints"
              label="Complaints"
              value={form.complaints}
              onChange={e => set('complaints', e.target.value)}
              multiline
              rows={4}
              placeholder="Masukkan keluhan pasien..."
            />

            {/* Notes */}
            <FloatInput
              id="notes"
              label="Notes"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              multiline
              rows={4}
              placeholder="Catatan tambahan..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-5 border-t border-gray-200 flex items-center gap-3 flex-shrink-0 bg-white" style={{ borderRadius: '0 0 0 16px' }}>
          <button onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            style={{ borderRadius: '9px' }}>
            Batalkan
          </button>
          <button
            className="px-5 py-2.5 text-sm font-medium text-white rounded-md transition-colors"
            style={{ backgroundColor: '#0152EA', borderRadius: '9px' }}>
            Buat Jadwal
          </button>
        </div>
      </div>
    </>
  );
}

/* ---- Main Page ---- */
export default function JadwalKlinikPage() {
  const [range, setRange] = useState('hari');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    { id: 'booking_id', header: 'Booking ID',   render: (r) => <span className="text-sm font-medium text-gray-800">{r.booking_id}</span> },
    { id: 'schedule',   header: 'Jam',           render: (r) => <span className="text-sm text-gray-600">{r.schedule}</span> },
    { id: 'patient',    header: 'Pasien',         render: (r) => (
      <div>
        <p className="text-sm font-semibold text-gray-800">{r.patient_name}</p>
        <p className="text-xs text-gray-500">{r.patient_phone}</p>
      </div>
    )},
    { id: 'service',    header: 'Layanan',        render: (r) => <span className="text-sm text-gray-600">{r.service}</span> },
    { id: 'via',        header: 'Reservasi Via',  render: (r) => <span className="text-sm text-gray-600">{reservasiLabel(r.reservation_via)}</span> },
    { id: 'status',     header: 'Status',         render: (r) => {
      const s = STATUS_STYLE[r.status] ?? STATUS_STYLE.scheduled;
      return <span className="inline-block px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>;
    }},
    { id: 'doctor',     header: 'Dokter',         render: (r) => <span className="text-sm text-gray-600">{r.doctor_name}</span> },
  ];

  const getActions = (row) => {
    const acts = [];
    if (row.status === 'scheduled') {
      acts.push({ icon: <Calendar size={16} />, title: 'Reschedule', onClick: () => {} });
      acts.push({ icon: <CheckCircle size={16} />, title: 'Tandai Tiba', onClick: () => {}, needsConfirmation: true, confirmationTitle: 'Konfirmasi', confirmationMessage: (r) => `Tandai ${r.patient_name} sudah tiba?` });
      acts.push({ icon: <Trash2 size={16} />, title: 'Hapus', onClick: () => {}, needsConfirmation: true, confirmationType: 'danger', confirmationTitle: 'Hapus Jadwal', confirmationMessage: (r) => `Hapus jadwal ${r.patient_name}?` });
    }
    if (row.status === 'awaiting_payment' || row.status === 'paid') {
      acts.push({ icon: <CreditCard size={16} />, title: 'Pembayaran', onClick: () => {} });
    }
    if (['arrived','in_progress','in_progress_consultation'].includes(row.status)) {
      acts.push({ icon: <Camera size={16} />, title: 'Atur Foto', onClick: () => {} });
    }
    return acts;
  };

  return (
    <PageLayout currentPath="/template/jadwal/klinik">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-bold text-gray-800" style={{ fontSize: 22 }}>Jadwal Klinik</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 bg-white rounded-md text-gray-600 hover:bg-gray-50 transition-colors">
            Registrasi
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-white rounded-md transition-colors"
            style={{ backgroundColor: '#0152EA', borderRadius: '9px' }}>
            <NotebookPen size={16} />
            Buat Janji
          </button>
        </div>
      </div>

      {/* Doctor Summary Cards */}
      <div className="flex gap-4 overflow-x-auto pb-2 mb-6">
        {SAMPLE_DOCTORS.map((doc) => (
          <div key={doc.doctor_id} className="bg-white p-5 flex-shrink-0" style={{ borderRadius: '12px', width: 240, boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#0152EA' }}>
                {doc.doctor_name.split(' ').slice(-1)[0][0]}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{doc.doctor_name}</p>
                <p className="text-xs text-gray-500">{doc.profession}</p>
              </div>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Upcoming Pasien</p>
            <p className="font-bold text-gray-800 mb-1" style={{ fontSize: 40, lineHeight: 1.1 }}>{doc.upcoming_appointments}</p>
            <p className="text-xs text-gray-500 mb-4"><b>{doc.today_appointments}</b> Total Pasien Hari Ini</p>
            <button className="w-full py-2 text-sm font-medium border rounded-md transition-colors"
              style={{ borderColor: '#0152EA', color: '#0152EA', borderRadius: '9px' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
              Tampilkan Jadwal
            </button>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-white border border-gray-200 rounded-md overflow-hidden text-sm">
            {['hari','minggu','bulan'].map((r) => (
              <button key={r} onClick={() => setRange(r)}
                className="px-4 py-2 transition-colors"
                style={range === r ? { backgroundColor: 'rgba(1,82,234,0.1)', color: '#0152EA', fontWeight: 600 } : { color: '#374151' }}
                onMouseEnter={e => { if (range !== r) e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.06)'; }}
                onMouseLeave={e => { if (range !== r) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                {r === 'hari' ? 'Hari Ini' : r === 'minggu' ? 'Minggu Ini' : 'Bulan Ini'}
              </button>
            ))}
          </div>
          <DatePillNav date={currentDate} view={range === 'bulan' ? 'month' : range === 'minggu' ? 'week' : 'date'} onPrev={prev} onNext={next} />
        </div>
        <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-md px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari Pasien"
            className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent" style={{ width: 160 }} />
        </div>
      </div>

      <NexTable columns={columns} data={filtered} actions={getActions} emptyTitle="Tidak ada jadwal" emptyDesc="Belum ada jadwal pada tanggal ini." />

      <BuatJanjiDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </PageLayout>
  );
}
