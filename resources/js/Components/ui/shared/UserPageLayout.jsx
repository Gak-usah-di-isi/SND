import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import IcasveSidebar from '../../../Pages/layout/IcasveSidebar';
import IcasveTopbar from '../../../Pages/layout/IcasveTopbar';
import SidebarContentUser from '../../../Pages/layout/SidebarItemsUser';

const PRESENTER_ROLES = ['presenter', 'indonesia-presenter', 'foreign-presenter'];

function Layout({ currentPath, children }) {
  const { dark } = useTheme();
  const { authRoles, canAccessFinalPaper, isArchiveMode, viewingYear, activeYear, conferenceAbbreviation } = usePage().props;
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const showAbstract = (authRoles ?? []).some(role => PRESENTER_ROLES.includes(role));

  const backToActiveYear = () => {
    if (activeYear?.year) router.post('/viewing-year', { year: activeYear.year }, { preserveScroll: true });
  };

  return (
    <div
      className="flex w-full h-screen overflow-hidden"
      style={{ background: dark ? '#0F172A' : '#F4F7FB' }}
    >
      <IcasveSidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        onStandByMode={() => {}}
        currentPath={currentPath}
        items={SidebarContentUser(showAbstract, canAccessFinalPaper)}
      />
      <div className="flex flex-col flex-1 w-full h-screen overflow-hidden">
        <IcasveTopbar onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />
        <div
          className="flex-1 overflow-y-auto"
          style={{ background: dark ? '#0F172A' : '#F4F7FB' }}
        >
          <div className="p-4 lg:p-6">
            {isArchiveMode && (
              <div
                className="flex items-center justify-between flex-wrap gap-3 mb-4"
                style={{
                  background: 'rgba(255,174,31,0.1)', border: '1px solid rgba(217,119,6,0.3)',
                  borderRadius: 10, padding: '12px 16px', fontFamily: 'Manrope,sans-serif',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Icon icon="solar:archive-outline" width={20} style={{ color: '#D97706' }} />
                  <span style={{ fontSize: 13.5, color: '#92400E' }}>
                    You are viewing the <strong>{conferenceAbbreviation || 'SND'} {viewingYear}</strong> archive. Data is read-only —
                    to submit an abstract or upload files, please return to the active year.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={backToActiveYear}
                  style={{
                    height: 32, padding: '0 14px', borderRadius: 8,
                    fontSize: 12.5, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
                    color: '#fff', background: '#D97706', border: 'none', cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Return to {activeYear?.year}
                </button>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserPageLayout({ currentPath, children }) {
  return (
    <ThemeProvider>
      <Layout currentPath={currentPath}>{children}</Layout>
    </ThemeProvider>
  );
}
