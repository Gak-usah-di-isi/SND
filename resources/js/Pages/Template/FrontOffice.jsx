import { useState } from 'react';
import IcasveSidebar from '../layout/IcasveSidebar';
import IcasveTopbar from '../layout/IcasveTopbar';
import CountingCard from './front-office/CountingCard';
import OmzetCard from './front-office/OmzetCard';
import ScheduleTable from './front-office/ScheduleTable';
import DoctorScheduleCard from './front-office/DoctorScheduleCard';
import TransactionCard from './front-office/TransactionCard';
import PaymentMethodCard from './front-office/PaymentMethodCard';
import PatientGrowthCard from './front-office/PatientGrowthCard';

export default function FrontOfficePage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const currentPath = '/template/front-office';

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
            {/* Counting Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CountingCard value={20} label="Belum Datang"    color="blue"   className="w-full" />
              <CountingCard value={2}  label="Dalam Perawatan" color="green"  className="w-full" />
              <CountingCard value={12} label="Selesai"         color="orange" className="w-full" />
            </div>

            {/* Omzet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <OmzetCard value="Rp 25.000.000"  description="Naik 10% dibanding kemarin"  label="Omzet Hari Ini"    className="w-full" />
              <OmzetCard value="Rp 325.000.000" description="Naik 12% dibanding Agustus"  label="Omzet Bulan Ini"   className="w-full" />
              <OmzetCard value="3 Items"         description="Naik 12% dibanding Agustus"  label="Inventory Alerts"  className="w-full" />
            </div>

            {/* Schedule + Doctor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 items-stretch">
              <div className="col-span-1 md:col-span-2">
                <ScheduleTable />
              </div>
              <div className="col-span-1">
                <DoctorScheduleCard />
              </div>
            </div>

            {/* Transaction + Payment + Growth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-stretch">
              <div className="flex flex-col gap-4">
                <TransactionCard />
                <PaymentMethodCard />
              </div>
              <PatientGrowthCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
