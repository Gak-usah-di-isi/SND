import { useState, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import IcasveSidebar from '../../../Pages/layout/IcasveSidebar';
import IcasveTopbar from '../../../Pages/layout/IcasveTopbar';
import { buildSidebarContentExecutive } from '../../../Pages/layout/SidebarItemsExecutive';

function Layout({ currentPath, children }) {
  const { dark } = useTheme();
  const { url, props } = usePage();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const path = currentPath || url.split('?')[0];
  const sidebarItems = useMemo(
    () => buildSidebarContentExecutive(props.badgeCounts ?? {}),
    [props.badgeCounts],
  );

  return (
    <div
      className="flex w-full h-screen overflow-hidden"
      style={{ background: dark ? '#0F172A' : '#F4F7FB' }}
    >
      <IcasveSidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        onStandByMode={() => {}}
        currentPath={path}
        items={sidebarItems}
      />
      <div className="flex flex-col flex-1 w-full h-screen overflow-hidden">
        <IcasveTopbar onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />
        <div
          className="flex-1 overflow-y-auto"
          style={{ background: dark ? '#0F172A' : '#F4F7FB' }}
        >
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExecutivePageLayout({ currentPath, children }) {
  return (
    <ThemeProvider>
      <Layout currentPath={currentPath}>{children}</Layout>
    </ThemeProvider>
  );
}

export const executiveLayout = (page) => <ExecutivePageLayout>{page}</ExecutivePageLayout>;
