import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { usePage, router } from '@inertiajs/react';
import SidebarContent from './SidebarItems';

// same palette language as the BADGE map in Pages/Admin/Summary/Index.jsx
const BADGE_TONES = {
  red:   { bg: 'rgba(239,68,68,0.1)',  color: '#EF4444' },
  green: { bg: 'rgba(19,222,185,0.1)', color: '#10B981' },
  amber: { bg: 'rgba(255,174,31,0.1)', color: '#F59E0B' },
  cyan:  { bg: 'rgba(73,190,255,0.12)', color: '#0EA5E9' },
  blue:  { bg: 'rgba(1,82,234,0.1)',   color: '#0152EA' },
  gray:  { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' },
};

function SidebarBadge({ badge }) {
  if (!badge) return null;
  const { count = 0, tone = 'gray' } = badge;
  const { bg, color } = BADGE_TONES[tone] ?? BADGE_TONES.gray;
  return (
    <span
      className="shrink-0 text-xs font-semibold rounded-full px-2 py-0.5"
      style={{ background: bg, color, fontFamily: 'Manrope,sans-serif' }}
    >
      {count}
    </span>
  );
}
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '../../Components/ui/dropdown-menu';
import { useTheme } from "../../Components/ui/shared/ThemeContext";
import StandbyScreen from '../../Components/ui/StandbyScreen';

export default function IcasveSidebar({
  isMobileOpen = false,
  onMobileClose,
  onStandByMode,
  currentPath,
  items,
}) {
  const { dark } = useTheme();
  const { activeYear, logoPath, viewingYear, availableYears = [], isArchiveMode } = usePage().props;
  const activeYearValue = typeof activeYear === 'object' ? activeYear?.year : activeYear;
  // Pemilih tahun hanya dikirim backend untuk role peserta; role lain
  // tetap melihat label tahun aktif saja.
  const canSwitchYear = availableYears.length > 1;
  const shownYear = viewingYear ?? (activeYearValue ? String(activeYearValue) : null);

  const handleYearChange = (year) => {
    if (year === viewingYear) return;
    router.post('/viewing-year', { year }, { preserveScroll: true });
  };
  const menuItems = items ?? SidebarContent;
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [isStandby, setIsStandby] = useState(false);

  const handleStandby = () => {
    setIsStandby(true);
    onStandByMode?.();
  };

  // Auto-expand section yang berisi route aktif, fallback ke DASHBOARD
  useEffect(() => {
    let activeHeading = null;
    menuItems.forEach((section) => {
      section.items?.forEach((item) => {
        const hasActiveChild = item.children?.some((child) => child.url === currentPath);
        if (hasActiveChild && item.heading) activeHeading = item.heading;
      });
    });
    setExpandedSections(new Set([activeHeading ?? 'DASHBOARD']));
  }, [currentPath, menuItems]);

  const handleSectionToggle = (heading) => {
    setExpandedSections((prev) => {
      const next = new Set();
      if (!prev.has(heading)) next.add(heading);
      return next;
    });
  };

  const handleItemClick = () => {
    if (isMobileOpen && onMobileClose) onMobileClose();
  };

  // theme tokens
  const bg    = dark ? '#1E293B' : '#ffffff';
  const bord  = dark ? '#334155' : '#e5e7eb';
  const text  = dark ? '#CBD5E1' : '#374151';
  const sub   = dark ? '#64748B' : '#6B7280';
  const hover = dark ? 'rgba(255,255,255,0.06)' : '#F9FAFB';
  const activeBg   = dark ? 'rgba(1,82,234,0.18)' : '#EFF3FF';
  const activeText = '#0152EA';
  const clinicBg   = dark ? '#0F172A' : '#ffffff';
  const clinicBord = dark ? '#334155' : '#e5e7eb';

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-16 px-6 flex items-center justify-center" style={{ borderBottom: `1px solid ${bord}` }}>
        <img src={logoPath || '/images/logo.png'} alt="ICASVE" className="h-9 w-auto object-contain" />
      </div>

      {/* Clinic Selector */}
      <div className="px-4 pt-4 pb-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-full rounded-md p-3 py-2.5 transition-colors"
              style={{ background: clinicBg, border: `1px solid ${clinicBord}` }}
              onMouseEnter={e => e.currentTarget.style.background = hover}
              onMouseLeave={e => e.currentTarget.style.background = clinicBg}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: isArchiveMode ? '#D97706' : '#0152EA' }}
                  >
                    <Icon icon="solar:calendar-mark-line-duotone" className="text-white" width={14} />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium" style={{ color: text }}>
                      {shownYear ? `ICASVE ${shownYear}` : 'No Active Year'}
                    </span>
                    <span className="text-xs" style={{ color: isArchiveMode ? '#D97706' : sub }}>
                      {!shownYear
                        ? 'Please set active year'
                        : isArchiveMode
                          ? 'Archive — view only'
                          : 'Active year'}
                    </span>
                  </div>
                </div>
                <Icon icon="solar:alt-arrow-down-line-duotone" width={16} style={{ color: sub }} />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-55.75" sideOffset={8}>
            {canSwitchYear ? (
              <div className="py-1">
                <div className="px-3 pt-1 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Select year
                </div>
                {availableYears.map((year) => {
                  const isCurrent = year === viewingYear;
                  const isActive = year === activeYearValue;
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearChange(year)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm transition-colors"
                      style={{
                        background: isCurrent ? 'rgba(1,82,234,0.08)' : 'transparent',
                        color: isCurrent ? '#0152EA' : '#374151',
                        fontWeight: isCurrent ? 600 : 400,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = '#F0F5FF'; }}
                      onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span>ICASVE {year}</span>
                      <span className="text-xs" style={{ color: isActive ? '#10B981' : '#9CA3AF' }}>
                        {isActive ? 'active' : 'archive'}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 text-sm text-gray-500">
                {activeYearValue ? `Active year ${activeYearValue}` : 'No active year yet'}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto pb-4 pt-2">
        {menuItems.map((section) => (
          <div key={section.id}>
            {section.items?.map((item) => {
              const heading = item.heading;
              if (!heading || !item.children?.length) return null;
              const isExpanded = expandedSections.has(heading);

              return (
                <div key={heading} className="px-4 mb-2 pl-5 pr-4">
                  <button
                    onClick={() => handleSectionToggle(heading)}
                    className="w-full flex items-center justify-between py-3 rounded-lg px-2 -mx-2 transition-colors pr-1.5 cursor-pointer"
                    onMouseEnter={e => e.currentTarget.style.background = hover}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <h3 className="font-bold uppercase tracking-wide text-xs" style={{ color: sub }}>
                      {heading}
                    </h3>
                    <Icon
                      icon={isExpanded ? 'solar:alt-arrow-down-line-duotone' : 'solar:alt-arrow-right-line-duotone'}
                      width={16} style={{ color: sub }}
                    />
                  </button>

                  {isExpanded && (
                    <div className="space-y-1 mt-2">
                      {item.children.map((child) => {
                        const isActive = currentPath === child.url;
                        return (
                          <a
                            key={child.id}
                            href={child.url}
                            onClick={handleItemClick}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors cursor-pointer"
                            style={{
                              background: isActive ? activeBg : 'transparent',
                              color: isActive ? activeText : text,
                              fontWeight: isActive ? 600 : 400,
                            }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = hover; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                          >
                            {child.icon && (
                              <Icon
                                icon={child.icon}
                                width={20}
                                className="shrink-0"
                                style={{ color: isActive ? activeText : text }}
                              />
                            )}
                            <span className="flex-1" style={{ color: isActive ? activeText : text }}>
                              {child.name}
                            </span>
                            <SidebarBadge badge={child.badge} />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Standby Mode & Logout */}
      <div className="p-4 pb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={handleStandby}
          className="flex-1 flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-md transition-colors cursor-pointer"
          style={{ color: text, border: `1px solid ${bord}`, background: 'transparent' }}
          onMouseEnter={e => e.currentTarget.style.background = hover}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Icon icon="solar:power-line-duotone" width={18} style={{ color: sub }} />
          <span className="font-medium text-xs sm:text-sm">Standby mode</span>
        </button>

        <button
          type="button"
          title="Logout"
          aria-label="Logout"
          onClick={() => router.post('/logout')}
          className="flex-shrink-0 flex items-center justify-center w-[42px] h-[42px] rounded-md transition-all cursor-pointer active:scale-95"
          style={{
            background: dark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)',
            color: '#EF4444',
            border: `1px solid ${dark ? 'rgba(239,68,68,0.28)' : 'rgba(239,68,68,0.2)'}`,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = dark ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.18)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = dark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)';
          }}
        >
          <Icon icon="solar:logout-2-outline" width={18} />
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <div
        className="hidden lg:flex w-63.75 flex-col h-full"
        style={{ background: bg, borderRight: `1px solid ${bord}` }}
      >
        {sidebarContent}
      </div>

      {/* Mobile */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={onMobileClose} />
          <div
            className="relative flex flex-col w-80 max-w-xs h-full overflow-y-auto"
            style={{ background: bg, borderRight: `1px solid ${bord}` }}
          >
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${bord}` }}>
              <img src={logoPath || '/images/logo.png'} alt="ICASVE" className="h-8 w-auto object-contain" />
              <button
                onClick={onMobileClose}
                className="p-1 rounded"
                style={{ color: sub }}
                onMouseEnter={e => e.currentTarget.style.background = hover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Icon icon="solar:close-circle-line-duotone" width={20} />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Standby Lock Screen Overlay */}
      <StandbyScreen isOpen={isStandby} onClose={() => setIsStandby(false)} />
    </>
  );
}
