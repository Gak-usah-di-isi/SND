import { Icon } from '@iconify/react';
import { usePage, router, Link } from '@inertiajs/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../../Components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '../../Components/ui/avatar';
import { useTheme } from '../../Components/ui/shared/ThemeContext';

const PARTICIPANT_ROLES = ['indonesia-presenter', 'foreign-presenter', 'indonesia-participants', 'foreign-participants'];

export default function IcasveTopbar({ onMobileMenuClick }) {
  const { dark, toggle } = useTheme();
  const { authUser, authRoles, userNotifications = [] } = usePage().props;

  const userName    = authUser?.name ?? 'User';
  const userEmail   = authUser?.email ?? '';
  const userInitial = userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const userRole    = authRoles?.[0]
    ? authRoles[0].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Guest';
  const isParticipant = (authRoles ?? []).some(r => PARTICIPANT_ROLES.includes(r));

  const bar  = dark ? '#1E293B' : '#ffffff';
  const bord = dark ? '#334155' : '#e5e7eb';
  const text  = dark ? '#E2E8F0' : '#374151';
  const sub   = dark ? '#94A3B8' : '#6B7280';
  const hover = dark ? 'rgba(255,255,255,0.06)' : '#F9FAFB';

  return (
    <div
      className="h-[64px] flex items-center justify-between px-6 flex-shrink-0"
      style={{ background: bar, borderBottom: `1px solid ${bord}` }}
    >
      {/* Left — mobile hamburger + view selector */}
      <div className="flex items-center gap-6">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden h-10 w-10 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: text }}
          onMouseEnter={e => e.currentTarget.style.background = hover}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Icon icon="solar:hamburger-menu-line-duotone" height={24} />
        </button>

        {/* View label (static, no dropdown) */}
        <div className="hidden lg:flex items-center gap-2 rounded-lg px-2 py-1.5" style={{ color: sub }}>
          <Icon icon="solar:compass-outline" width={20} style={{ color: sub }} />
          <span className="text-sm" style={{ color: text }}>Dashboard View</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">

        {/* Dark / Light toggle */}
        {!isParticipant && (
          <button
            onClick={toggle}
            title={dark ? 'Switch to Light mode' : 'Switch to Dark mode'}
            className="h-9 w-9 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: dark ? '#FACC15' : '#6B7280' }}
            onMouseEnter={e => e.currentTarget.style.background = hover}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon
              icon={dark ? 'solar:sun-bold-duotone' : 'solar:moon-bold-duotone'}
              width={20}
            />
          </button>
        )}

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="h-9 w-9 flex items-center justify-center rounded-lg transition-colors relative cursor-pointer"
              style={{ color: sub }}
              onMouseEnter={e => e.currentTarget.style.background = hover}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              title="Notifications"
            >
              <Icon icon="solar:bell-outline" width={20} />
              {isParticipant && userNotifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isParticipant
                    ? (userNotifications.length > 0
                        ? `${userNotifications.length} update${userNotifications.length === 1 ? '' : 's'}`
                        : 'No new notifications')
                    : 'System updates'}
                </p>
              </div>
              {isParticipant && userNotifications.length > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                  {userNotifications.length}
                </span>
              )}
            </div>

            {isParticipant ? (
              userNotifications.length > 0 ? (
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {userNotifications.map((notif) => (
                    <DropdownMenuItem key={notif.id} asChild className="p-0 focus:bg-transparent">
                      <Link
                        href={notif.url}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors w-full cursor-pointer no-underline"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: notif.bg }}
                        >
                          <Icon icon={notif.icon} style={{ color: notif.color }} width={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 leading-tight">{notif.title}</p>
                          <p className="text-xs text-gray-600 mt-0.5 leading-snug">{notif.message}</p>
                          <span className="text-[10.5px] text-gray-400 mt-1 block">{notif.time}</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              ) : (
                <div className="py-8 px-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
                    <Icon icon="solar:bell-outline" width={20} />
                  </div>
                  <p className="text-xs font-medium text-gray-600">No notifications yet</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">We will notify you when status changes</p>
                </div>
              )
            ) : (
              <div className="py-8 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
                  <Icon icon="solar:bell-outline" width={20} />
                </div>
                <p className="text-xs font-medium text-gray-600">No new notifications</p>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        {!isParticipant && (
          <a
            href="/template/pengaturan"
            className="h-9 w-9 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: sub }}
            aria-label="Settings"
            onMouseEnter={e => e.currentTarget.style.background = hover}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon icon="solar:settings-outline" width={20} />
          </a>
        )}

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors ml-1 cursor-pointer"
              onMouseEnter={e => e.currentTarget.style.background = hover}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium" style={{ color: text }}>{userName}</div>
                <div className="text-xs" style={{ color: sub }}>{userRole}</div>
              </div>
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-blue-600 text-white text-sm">{userInitial}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 mt-0.5">{userRole}</p>
              {userEmail && <p className="text-xs text-gray-400 mt-0.5">{userEmail}</p>}
            </div>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.visit('/profile')}>
              <Icon icon="solar:user-outline" className="mr-2" width={16} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={() => router.post('/logout')}>
              <Icon icon="solar:logout-2-outline" className="mr-2" width={16} />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
