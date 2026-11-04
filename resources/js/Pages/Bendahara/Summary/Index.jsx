import { useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { Icon } from '@iconify/react';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import BendaharaPageLayout from '../../../Components/ui/shared/BendaharaPageLayout';
import StatusBadge from '../../../Components/ui/StatusBadge';

const CARD = {
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)',
  padding: 24,
};
const CARD_TITLE = { fontSize: 18, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 };
const CARD_SUB   = { fontSize: 13, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', margin: '2px 0 0' };

const ROLE_LABEL = {
  'indonesia-participants': 'ID Participant',
  'indonesia-presenter':    'ID Presenter',
  'foreign-participants':   'Foreign Participant',
  'foreign-presenter':      'Foreign Presenter',
  reviewer:                 'Reviewer',
};

const iconBtnBase = {
  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: '1px solid #e0e6eb', borderRadius: 8, backgroundColor: '#fff',
  cursor: 'pointer', transition: 'background-color 0.15s', color: '#5A6A85', flexShrink: 0,
};

function IconBtn({ onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ ...iconBtnBase, backgroundColor: hov ? 'rgba(1,82,234,0.08)' : '#fff', color: hov ? '#0152EA' : '#5A6A85' }}
    >
      {children}
    </button>
  );
}

function DatePill({ date, onPrev, onNext }) {
  const label = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <IconBtn onClick={onPrev}><ChevronLeft size={16} /></IconBtn>
      <div style={{ minWidth: 160, height: 36, border: '1px solid #e0e6eb', borderRadius: 8, backgroundColor: '#fff', color: 'rgba(42,53,71,0.85)', padding: '0 12px', fontFamily: 'Manrope,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500 }}>
        {label}
      </div>
      <IconBtn onClick={onNext}><ChevronRight size={16} /></IconBtn>
      <IconBtn><Bell size={16} /></IconBtn>
    </div>
  );
}

function IncomeCard({ total }) {
  const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');
  return (
    <div style={{ ...CARD, background: 'linear-gradient(135deg, #0152EA 0%, #3B82F6 100%)', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon icon="solar:bill-list-outline" width={26} style={{ color: '#fff' }} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, fontFamily: 'Manrope,sans-serif', opacity: 0.8 }}>Total Income (Verified)</p>
          <p style={{ margin: 0, fontSize: 26, fontWeight: 800, fontFamily: 'Manrope,sans-serif', lineHeight: 1.2 }}>{rupiah(total)}</p>
          <p style={{ margin: 0, fontSize: 12, fontFamily: 'Manrope,sans-serif', opacity: 0.65, marginTop: 2 }}>Semua pembayaran terverifikasi tahun ini</p>
        </div>
      </div>
    </div>
  );
}

function PaymentStatCard({ icon, label, value, iconBg, textColor, cardBg }) {
  return (
    <div style={{ ...CARD, background: cardBg }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon icon={icon} width={22} style={{ color: '#fff' }} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, fontFamily: 'Manrope,sans-serif', color: textColor }}>{label}</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 800, fontFamily: 'Manrope,sans-serif', color: textColor, lineHeight: 1.2 }}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function PaymentDonut({ total, verified, pending }) {
  const data = [
    { name: 'Verified', value: verified, color: '#10B981' },
    { name: 'Pending',  value: pending,  color: '#F59E0B' },
  ];
  const allZero = data.every(d => d.value === 0);
  return (
    <div style={CARD}>
      <p style={CARD_TITLE}>Payment Status</p>
      <p style={CARD_SUB}>Distribusi status pembayaran</p>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <PieChart width={170} height={170}>
          <Pie data={allZero ? [{ value: 1 }] : data} cx={80} cy={80} innerRadius={55} outerRadius={78} dataKey="value" paddingAngle={allZero ? 0 : 3}>
            {(allZero ? [{ color: '#E5E7EB' }] : data).map((item, i) => <Cell key={i} fill={item.color} />)}
          </Pie>
        </PieChart>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
        {[{ name: 'Total', value: total, color: '#0152EA' }, { name: 'Verified', value: verified, color: '#10B981' }, { name: 'Pending', value: pending, color: '#F59E0B' }].map(item => (
          <div key={item.name} style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11.5, color: '#6B7280', fontFamily: 'Manrope,sans-serif', whiteSpace: 'nowrap' }}>{item.name}</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentPayments({ payments }) {
  return (
    <div style={CARD}>
      <p style={CARD_TITLE}>Recent Transactions</p>
      <p style={CARD_SUB}>8 transaksi pembayaran terbaru</p>
      <div style={{ marginTop: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              {['Participant', 'Type', 'Amount', 'Date', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 12px 10px 0', fontSize: 12, fontWeight: 600, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(payments ?? []).map((pay, i) => {
              const role = pay.user?.roles?.[0]?.name ?? '';
              const initials = (pay.user?.name ?? '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
              const date = pay.created_at ? new Date(pay.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
              const amount = pay.currency === 'USD' ? `$ ${pay.amount}` : `Rp ${Number(pay.amount).toLocaleString('id-ID')}`;
              return (
                <tr key={i} style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <td style={{ padding: '12px 12px 12px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0152EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'Manrope,sans-serif' }}>{initials}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>{pay.user?.name ?? '-'}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>{pay.user?.email ?? '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 12px 12px 0', fontSize: 12, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>{ROLE_LABEL[role] ?? role}</td>
                  <td style={{ padding: '12px 12px 12px 0', fontSize: 13, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', whiteSpace: 'nowrap' }}>{amount}</td>
                  <td style={{ padding: '12px 12px 12px 0', fontSize: 12, color: '#6B7280', fontFamily: 'Manrope,sans-serif', whiteSpace: 'nowrap' }}>{date}</td>
                  <td style={{ padding: '12px 0' }}><StatusBadge label={pay.status === 'verified' ? 'Verified' : 'Pending'} /></td>
                </tr>
              );
            })}
            {(payments ?? []).length === 0 && (
              <tr><td colSpan={5} style={{ padding: '24px 0', textAlign: 'center', color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', fontSize: 13 }}>Belum ada transaksi</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function BendaharaSummaryPage({ stats, recentPayments, activeYear }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const yearLabel = typeof activeYear === 'object' && activeYear !== null ? activeYear.year : activeYear;

  return (
    <BendaharaPageLayout currentPath="/bendahara/summary">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
          Financial Summary
          {yearLabel && <span style={{ fontSize: 16, fontWeight: 500, color: '#9CA3AF', marginLeft: 10 }}>({yearLabel})</span>}
        </h1>
        <DatePill date={currentDate} onPrev={prevMonth} onNext={nextMonth} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <IncomeCard total={stats?.totalIncomeIdr} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
        <PaymentStatCard icon="solar:bill-list-outline" label="Total Transactions" value={stats?.totalPayments ?? 0} iconBg="rgb(59,130,246)" cardBg="rgba(93,135,255,0.1)" textColor="#0152EA" />
        <PaymentStatCard icon="solar:check-circle-outline" label="Verified Transactions" value={stats?.verifiedPayments ?? 0} iconBg="rgb(16,185,129)" cardBg="rgba(19,222,185,0.1)" textColor="rgb(5,150,105)" />
        <PaymentStatCard icon="solar:clock-circle-outline" label="Pending Transactions" value={stats?.pendingPayments ?? 0} iconBg="rgb(245,158,11)" cardBg="rgba(255,174,31,0.1)" textColor="rgb(245,158,11)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: 16 }}>
        <PaymentDonut total={stats?.totalPayments ?? 0} verified={stats?.verifiedPayments ?? 0} pending={stats?.pendingPayments ?? 0} />
        <RecentPayments payments={recentPayments} />
      </div>
    </BendaharaPageLayout>
  );
}
