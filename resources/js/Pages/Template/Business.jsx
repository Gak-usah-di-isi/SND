import { useState } from 'react';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import IcasveSidebar from '../layout/IcasveSidebar';
import IcasveTopbar from '../layout/IcasveTopbar';
import OmzetCard from './business/OmzetCard';
import OmzetTrendCard from './business/OmzetTrendCard';
import TopDoctor from './business/TopDoctor';
import MonthlyAppointment from './business/MonthlyAppointment';
import PopularTreatment from './business/PopularTreatment';
import GoogleAnalyticsCard from './business/GoogleAnalyticsCard';
import PopularProductsTable from './business/PopularProductsTable';

const iconBtnBase = {
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #e0e6eb',
  borderRadius: '8px',
  backgroundColor: '#fff',
  cursor: 'pointer',
  transition: 'background-color 0.15s, color 0.15s',
  color: '#5A6A85',
  flexShrink: 0,
};

function IconBtn({ onClick, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...iconBtnBase,
        backgroundColor: hovered ? 'rgba(1,82,234,0.08)' : '#fff',
        color: hovered ? '#0152EA' : '#5A6A85',
      }}
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
        style={{ minWidth: 160, height: 36, border: '1px solid #e0e6eb', borderRadius: '8px', backgroundColor: '#fff', color: 'rgba(42,53,71,0.85)', padding: '0 12px' }}
      >
        {label}
      </div>
      <IconBtn onClick={onNext}><ChevronRight size={16} /></IconBtn>
      <IconBtn><Bell size={16} /></IconBtn>
    </div>
  );
}

export default function BusinessPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const currentPath = '/template/business';

  const prevMonth = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F4F7FB]">
      <IcasveSidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        onStandByMode={() => {}}
        currentPath={currentPath}
      />

      <div className="flex flex-col flex-1 w-full h-screen overflow-hidden">
        <IcasveTopbar onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto bg-[#F4F7FB]">
          <div className="p-4 lg:p-6">
            {/* Date Pill */}
            <div className="flex justify-end mb-4">
              <DatePill date={currentDate} onPrev={prevMonth} onNext={nextMonth} />
            </div>

            {/* Omzet Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <OmzetCard label="Omzet Bulan Ini"       value="Rp 325.000.000" description="Naik 12% dibanding Agustus" />
              <OmzetCard label="Pasien Bulan Ini"       value="420"            description="180 baru | 240 repeat" />
              <OmzetCard label="Pertumbuhan Bulan Ini"  value="+15%"           description="Pasien naik dari bulan lalu 365 → 420" />
              <OmzetCard label="Angka Loyalitas"        value="68%"            description="Dari 240, 163 kembali bulan ini" />
            </div>

            {/* Omzet Trend + Top Dokter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 items-stretch">
              <div className="md:col-span-2">
                <OmzetTrendCard />
              </div>
              <div className="md:col-span-1">
                <TopDoctor />
              </div>
            </div>

            {/* Monthly Appointment + Popular Treatment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-stretch">
              <MonthlyAppointment />
              <PopularTreatment />
            </div>

            {/* Google Analytics + Popular Products */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 items-stretch">
              <div className="md:col-span-1">
                <GoogleAnalyticsCard />
              </div>
              <div className="md:col-span-2">
                <PopularProductsTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
