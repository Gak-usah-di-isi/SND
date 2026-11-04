import { useState } from 'react';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';
import { Icon } from '@iconify/react';
import HumasPageLayout from '../../../Components/ui/shared/HumasPageLayout';

const CARD = { background: '#fff', borderRadius: 12, boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)', padding: 24 };
const CARD_TITLE = { fontSize: 18, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 };
const CARD_SUB = { fontSize: 13, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', margin: '2px 0 0' };

/* ---------- Mini stat (untuk Participants Details) ---------- */
function MiniStat({ label, value, desc }) {
  return (
    <div style={{ padding: '14px 16px', background: '#F8FAFC', borderRadius: 8 }}>
      <div style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Manrope,sans-serif', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#0152EA', fontFamily: 'Manrope,sans-serif', lineHeight: 1.1 }}>{value}</div>
      {desc && <div style={{ fontSize: 11, fontWeight: 600, color: '#0152EA', opacity: 0.4, fontFamily: 'Manrope,sans-serif', marginTop: 3 }}>{desc}</div>}
    </div>
  );
}

/* ---------- Participants Details ---------- */
function ParticipantsDetails({ stats, attendance }) {
  return (
    <div style={CARD}>
      <p style={CARD_TITLE}>Participants Details</p>
      <p style={CARD_SUB}>Overview of participant engagement by role & attendance</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
        <MiniStat label="Indonesia Presenter"   value={stats?.indoPresenter ?? 0}     desc="domestic presenter" />
        <MiniStat label="Foreign Presenter"     value={stats?.foreignPresenter ?? 0}   desc="international presenter" />
        <MiniStat label="Onsite"                value={attendance?.onsite ?? 0}        desc="onsite attendance" />
        <MiniStat label="Indonesia Participant" value={stats?.indoParticipant ?? 0}   desc="domestic participant" />
        <MiniStat label="Foreign Participant"   value={stats?.foreignParticipant ?? 0} desc="international participant" />
        <MiniStat label="Online"                value={attendance?.online ?? 0}        desc="online attendance" />
      </div>
    </div>
  );
}

/* ---------- Payment Details (donut) ---------- */
function PaymentDetails({ payment }) {
  const data = [
    { name: 'Proof Uploaded', value: payment?.proof ?? 0,      color: '#0B5FFF' },
    { name: 'Verified',       value: payment?.verified ?? 0,   color: '#24D39A' },
    { name: 'Unverified',     value: payment?.unverified ?? 0, color: '#FFB33A' },
  ];
  const allZero = data.every(d => d.value === 0);
  return (
    <div style={{ ...CARD, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <p style={CARD_TITLE}>Payment Details</p>
      <p style={CARD_SUB}>Participant payment status</p>

      {/* Donut di tengah */}
      <div className="flex justify-center" style={{ marginTop: 16, flex: 1, alignItems: 'center' }}>
        <PieChart width={170} height={170}>
          <Pie data={allZero ? [{ value: 1 }] : data} cx={80} cy={80} innerRadius={55} outerRadius={78} dataKey="value" paddingAngle={allZero ? 0 : 2}>
            {(allZero ? [{ color: '#E5E7EB' }] : data).map((item, i) => <Cell key={i} fill={item.color} />)}
          </Pie>
        </PieChart>
      </div>

      {/* Legend horizontal 3 kolom sejajar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
        {data.map(item => (
          <div key={item.name} style={{ textAlign: 'center' }}>
            <div className="flex items-center justify-center gap-1.5" style={{ marginBottom: 4 }}>
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span style={{ fontSize: 11.5, color: '#6B7280', fontFamily: 'Manrope,sans-serif', whiteSpace: 'nowrap' }}>{item.name}</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Abstract Details (tabel gaya Jadwal Klinik) ---------- */
const BADGE = {
  blue:   { bg: 'rgba(1,82,234,0.1)',   color: '#0152EA' },
  purple: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' },
  cyan:   { bg: 'rgba(73,190,255,0.12)', color: '#0EA5E9' },
  amber:  { bg: 'rgba(255,174,31,0.1)', color: '#F59E0B' },
  green:  { bg: 'rgba(19,222,185,0.1)', color: '#10B981' },
  red:    { bg: 'rgba(239,68,68,0.1)',  color: '#EF4444' },
  gray:   { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' },
};

function AbstractDetails({ abstract }) {
  const rows = [
    { category: 'Abstract',   label: 'Accepted for Oral',     value: abstract?.oral ?? 0,        detail: `${abstract?.oralPaid ?? 0} paid`,   badge: 'blue' },
    { category: 'Abstract',   label: 'Accepted for Poster',   value: abstract?.poster ?? 0,      detail: `${abstract?.posterPaid ?? 0} paid`, badge: 'purple' },
    { category: 'Full Paper', label: 'Submitted',             value: abstract?.fpSubmitted ?? 0,    detail: 'total upload',  badge: 'cyan' },
    { category: 'Full Paper', label: 'Under Review',          value: abstract?.fpUnderReview ?? 0,  detail: 'sedang direview', badge: 'amber' },
    { category: 'Full Paper', label: 'In Revision',           value: abstract?.fpRevision ?? 0,     detail: 'perlu revisi',  badge: 'amber' },
    { category: 'Full Paper', label: 'Accepted',              value: abstract?.fpAccepted ?? 0,     detail: 'diterima',      badge: 'green' },
    { category: 'Full Paper', label: 'Rejected',              value: abstract?.fpRejected ?? 0,     detail: 'ditolak',       badge: 'red' },
  ];

  return (
    <div className="bg-white p-6 flex flex-col h-full" style={{ borderRadius: 12, boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
      <div className="mb-4">
        <div className="text-lg font-semibold text-gray-800">Abstract &amp; Full Paper</div>
        <div className="text-sm text-gray-400 mt-0.5">Status abstract dan full paper</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm border-y border-gray-200">
              <th className="py-4 font-medium text-gray-500 w-28">Kategori</th>
              <th className="py-4 font-medium text-gray-500">Status</th>
              <th className="py-4 font-medium text-gray-500">Detail</th>
              <th className="py-4 font-medium text-gray-500 w-24 text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const b = BADGE[r.badge] ?? BADGE.gray;
              return (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-5 text-sm text-gray-600">{r.category}</td>
                  <td className="py-5">
                    <div className="font-semibold text-gray-800 text-sm">{r.label}</div>
                  </td>
                  <td className="py-5 text-sm text-gray-600">{r.detail}</td>
                  <td className="py-5 text-right">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: b.bg, color: b.color }}>{r.value}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Country Reports (list gaya Dokter card) ---------- */
function CountryReports({ countries }) {
  return (
    <div className="bg-white p-6 flex flex-col h-full" style={{ borderRadius: 12, boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-lg font-semibold text-gray-800">Country Reports</div>
          <div className="text-sm text-gray-400 mt-0.5">Participant distribution by country</div>
        </div>
      </div>

      <div className="border-t border-gray-100 flex-1 min-h-0">
        <div className="h-full overflow-y-auto">
          {(countries ?? []).map((c, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Icon icon="solar:map-point-outline" width={18} className="text-gray-600" />
                </div>
                <div className="font-semibold text-gray-800 text-sm">{c.country ?? '-'}</div>
              </div>
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: 'rgba(73,190,255,0.12)', color: '#0EA5E9' }}>{c.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Symposiums Breakdown (tabs + table) ---------- */
function SymposiumsBreakdown({ byType, byPublication, byAttendance }) {
  const [tab, setTab] = useState('type');
  const TABS = [
    { key: 'type',        label: 'Presentation Type' },
    { key: 'publication', label: 'Publication' },
    { key: 'attendance',  label: 'Attendance' },
  ];

  const config = {
    type:        { data: byType,        cols: ['Oral', 'Poster'],        keys: ['oral', 'poster'] },
    publication: { data: byPublication, cols: ['Journal', 'Proceedings'], keys: ['journal', 'proceedings'] },
    attendance:  { data: byAttendance,  cols: ['Onsite', 'Online'],      keys: ['onsite', 'online'] },
  };
  const { data, cols, keys } = config[tab];

  return (
    <div style={CARD}>
      <p style={CARD_TITLE}>Symposiums Breakdown</p>
      <p style={CARD_SUB}>Rincian abstract per symposium</p>

      {/* Tabs */}
      <div style={{ display: 'inline-flex', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden', marginTop: 16, marginBottom: 8 }}>
        {TABS.map((t, i) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            style={{
              padding: '7px 16px', fontSize: 13, fontFamily: 'Manrope,sans-serif',
              fontWeight: tab === t.key ? 600 : 400,
              border: 'none', borderLeft: i > 0 ? '1px solid #E2E8F0' : 'none',
              background: tab === t.key ? 'rgba(1,82,234,0.08)' : '#fff',
              color: tab === t.key ? '#0152EA' : '#6B7280', cursor: 'pointer',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      <table className="w-full text-left" style={{ marginTop: 8 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
            <th style={{ padding: '10px 0', fontSize: 12.5, fontWeight: 600, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>Symposium</th>
            <th style={{ padding: '10px 0', fontSize: 12.5, fontWeight: 600, color: '#6B7280', fontFamily: 'Manrope,sans-serif', textAlign: 'center' }}>Total</th>
            {cols.map(c => <th key={c} style={{ padding: '10px 0', fontSize: 12.5, fontWeight: 600, color: '#6B7280', fontFamily: 'Manrope,sans-serif', textAlign: 'center' }}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((s, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '12px 0', fontSize: 13, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>{s.name}</td>
              <td style={{ padding: '12px 0', fontSize: 13, fontWeight: 700, color: '#0152EA', fontFamily: 'Manrope,sans-serif', textAlign: 'center' }}>{s.total}</td>
              {keys.map(k => <td key={k} style={{ padding: '12px 0', fontSize: 13, color: '#6B7280', fontFamily: 'Manrope,sans-serif', textAlign: 'center' }}>{s[k]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Date Pill (bulan + lonceng, persis template business) ---------- */
const iconBtnBase = {
  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: '1px solid #e0e6eb', borderRadius: 8, backgroundColor: '#fff',
  cursor: 'pointer', transition: 'background-color 0.15s, color 0.15s', color: '#5A6A85', flexShrink: 0,
};

function IconBtn({ onClick, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...iconBtnBase, backgroundColor: hovered ? 'rgba(1,82,234,0.08)' : '#fff', color: hovered ? '#0152EA' : '#5A6A85' }}
    >
      {children}
    </button>
  );
}

function DatePill({ date, onPrev, onNext }) {
  const label = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
  return (
    <div className="flex items-center gap-2">
      <IconBtn onClick={onPrev}><ChevronLeft size={16} /></IconBtn>
      <div
        className="flex items-center justify-center text-sm font-medium"
        style={{ minWidth: 160, height: 36, border: '1px solid #e0e6eb', borderRadius: 8, backgroundColor: '#fff', color: 'rgba(42,53,71,0.85)', padding: '0 12px', fontFamily: 'Manrope,sans-serif' }}
      >
        {label}
      </div>
      <IconBtn onClick={onNext}><ChevronRight size={16} /></IconBtn>
      <IconBtn><Bell size={16} /></IconBtn>
    </div>
  );
}

/* ---------- Person Stat Card (sama dengan Participant) ---------- */
function PersonCard({ label, value, color, bg, img, imgFilter }) {
  return (
    <div className="flex items-center p-5 w-full" style={{ backgroundColor: bg, height: 132, borderRadius: 8 }}>
      <div className="flex items-center gap-4">
        <img alt={label} className="w-16 h-16 object-contain shrink-0" src={img} style={imgFilter ? { filter: imgFilter } : undefined} />
        <div>
          <p className="font-bold" style={{ fontSize: 14.5, color, fontFamily: 'Manrope,sans-serif', margin: 0, lineHeight: 1.3 }}>{label}</p>
          <p className="font-bold mt-1" style={{ fontSize: 30, color, lineHeight: 1.2, fontFamily: 'Manrope,sans-serif', margin: 0 }}>{value}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Summary Box — sama dengan StatCard di Abstract ---------- */
function SummaryBox({ label, value, description }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 8,
      boxShadow: '0px 4px 12px rgba(0,0,0,0.04)',
      padding: '16px 16px 24px 16px',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12,
      fontFamily: 'Manrope,sans-serif',
    }}>
      <span style={{ fontWeight: 700, fontSize: 18, color: 'rgba(42,53,71,0.8)' }}>{label}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 24, color: '#0152EA' }}>{value}</div>
        {description && (
          <div style={{ fontWeight: 700, fontSize: 12, marginTop: 4, color: '#0152EA', opacity: 0.4 }}>{description}</div>
        )}
      </div>
    </div>
  );
}

export default function HumasSummaryIndex({ stats, attendance, payment, abstract, symposiumsByType, symposiumsByPublication, symposiumsByAttendance, countryParticipants }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

  return (
    <HumasPageLayout currentPath="/humas/summary">
      {/* Date Pill */}
      <div className="flex justify-end" style={{ marginBottom: 20 }}>
        <DatePill date={currentDate} onPrev={prevMonth} onNext={nextMonth} />
      </div>

      {/* Person Stat Cards (4) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <PersonCard label="Indonesia Participant" value={stats?.indoParticipant ?? 0}   bg="rgba(255,174,31,0.1)" color="#F59E0B" img="/images/person-orange.png" />
        <PersonCard label="Indonesia Presenter"   value={stats?.indoPresenter ?? 0}     bg="rgba(255,174,31,0.1)" color="#F59E0B" img="/images/person-orange.png" />
        <PersonCard label="Foreign Participant"   value={stats?.foreignParticipant ?? 0} bg="rgba(139,92,246,0.1)" color="#8B5CF6" img="/images/person-blue.png" imgFilter="hue-rotate(40deg) saturate(1.1)" />
        <PersonCard label="Foreign Presenter"     value={stats?.foreignPresenter ?? 0}   bg="rgba(139,92,246,0.1)" color="#8B5CF6" img="/images/person-blue.png" imgFilter="hue-rotate(40deg) saturate(1.1)" />
      </div>

      {/* Summary Boxes (4) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <SummaryBox label="Total Participants"       value={stats?.totalUsers ?? 0}            description="Participants registered this year" />
        <SummaryBox label="Total Payments Verified"  value={rupiah(stats?.totalAmountPayment)} description="Verified payments" />
        <SummaryBox label="Total Abstracts Accepted" value={stats?.totalAbstracts ?? 0}        description="Accepted abstracts" />
        <SummaryBox label="Total Symposiums"         value={stats?.totalSymposiums ?? 0}       description="Active symposiums" />
      </div>

      {/* Row: Participants Details + Payment Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, marginTop: 16 }}>
        <ParticipantsDetails stats={stats} attendance={attendance} />
        <PaymentDetails payment={payment} />
      </div>

      {/* Row: Abstract + Country (grid 2:1, tinggi sama) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginTop: 16, alignItems: 'stretch' }}>
        <AbstractDetails abstract={abstract} />
        <CountryReports countries={countryParticipants} />
      </div>

      {/* Symposiums Breakdown — full width */}
      <div style={{ marginTop: 16 }}>
        <SymposiumsBreakdown
          byType={symposiumsByType}
          byPublication={symposiumsByPublication}
          byAttendance={symposiumsByAttendance}
        />
      </div>
    </HumasPageLayout>
  );
}
