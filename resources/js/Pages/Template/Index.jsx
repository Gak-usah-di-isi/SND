import { useState } from 'react';
import { RotateCcw, UserPlus, Users } from 'lucide-react';
import IcasveSidebar from '../layout/IcasveSidebar';
import IcasveTopbar from '../layout/IcasveTopbar';
import MetricCard from './components/MetricCard';
import MySchedule from './components/MySchedule';
import MyConsultationTime from './components/MyConsultationTime';
import MyFeedback from './components/MyFeedback';

export default function TemplatePage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const currentPath = '/template/doctor';

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
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                value={20}
                label="Jumlah Pasien Hari Ini"
                color="blue"
                icon={<Users className="w-6 h-6 text-white" />}
              />
              <MetricCard
                value={30}
                label="Pasien Baru Bulan Ini"
                color="green"
                icon={<UserPlus className="w-6 h-6 text-white" />}
              />
              <MetricCard
                value={50}
                label="Pasien Repeat Bulan Ini"
                color="purple"
                icon={<RotateCcw className="w-6 h-6 text-white" />}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="col-span-1 md:col-span-2">
                <MySchedule />
              </div>
              <div className="col-span-1 flex flex-col gap-4">
                <MyConsultationTime />
                <MyFeedback />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
