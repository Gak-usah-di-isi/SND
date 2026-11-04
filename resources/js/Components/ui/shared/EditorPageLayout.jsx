import { useState, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import IcasveSidebar from '../../../Pages/layout/IcasveSidebar';
import IcasveTopbar from '../../../Pages/layout/IcasveTopbar';
import { buildSidebarContentEditor } from '../../../Pages/layout/SidebarItemsEditor';

function Layout({ children }) {
  const { dark } = useTheme();
  const { url, props } = usePage();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Dipakai sebagai persistent layout: currentPath & badgeCounts diambil dari
  // usePage() (bukan props per-halaman) supaya layout tetap ter-mount saat
  // berpindah halaman — kalau di-unmount, sidebar & tema dibangun ulang dan
  // terlihat seperti halaman reload.
  const currentPath = url.split('?')[0];
  // Reviewer biasa tidak melihat grup menu "EDITOR:" (lihat SidebarItemsEditor).
  const isEditor = (props.authRoles ?? []).some(r => r === 'editor' || r === 'chief-editor');
  const sidebarItems = useMemo(
    () => buildSidebarContentEditor(props.badgeCounts ?? {}, isEditor),
    [props.badgeCounts, isEditor],
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
        currentPath={currentPath}
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

export default function EditorPageLayout({ children }) {
  return (
    <ThemeProvider>
      <Layout>{children}</Layout>
    </ThemeProvider>
  );
}

/**
 * Dipasang ke tiap halaman Editor sebagai `Page.layout`, sehingga Inertia
 * mempertahankan layout ini antar-navigasi (tidak remount).
 */
export const editorLayout = (page) => <EditorPageLayout>{page}</EditorPageLayout>;
