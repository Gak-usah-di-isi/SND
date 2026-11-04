import { Icon } from '@iconify/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../../Components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '../../Components/ui/avatar';
import { useTheme } from '../../Components/ui/shared/ThemeContext';

export default function IcasveTopbar({ onMobileMenuClick }) {
  const { dark, toggle } = useTheme();

  const bar  = dark ? '#1E293B' : '#ffffff';
  const bord = dark ? '#334155' : '#e5e7eb';
  const text  = dark ? '#E2E8F0' : '#374151';
  const sub   = dark ? '#94A3B8' : '#6B7280';
  const hover = dark ? 'rgba(255,255,255,0.06)' : '#F9FAFB';

  const HoverBtn = ({ children, ...props }) => (
    <button
      {...props}
      style={{ background: 'transparent', ...props.style }}
      onMouseEnter={e => e.currentTarget.style.background = hover}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {children}
    </button>
  );

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

        {/* View dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="hidden lg:flex items-center gap-2 transition-colors rounded-lg px-2 py-1.5"
              style={{ color: sub }}
              onMouseEnter={e => { e.currentTarget.style.background = hover; e.currentTarget.style.color = text; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = sub; }}
            >
              <Icon icon="solar:user-circle-outline" width={20} style={{ color: sub }} />
              <span className="text-sm" style={{ color: text }}>Super Admin View</span>
              <Icon icon="solar:alt-arrow-down-outline" width={16} style={{ color: sub }} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <Icon icon="solar:user-circle-outline" className="mr-2" width={16} />
              Super Admin View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon icon="solar:user-outline" className="mr-2" width={16} />
              Doctor View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon icon="solar:users-group-rounded-outline" className="mr-2" width={16} />
              Staff View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">

        {/* Dark / Light toggle */}
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

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="h-9 w-9 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: sub }}
              onMouseEnter={e => e.currentTarget.style.background = hover}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Icon icon="solar:bell-outline" width={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500 mt-0.5">You have 3 unread messages</p>
            </div>
            <DropdownMenuItem>
              <div className="flex gap-3 py-1">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Icon icon="solar:calendar-outline" className="text-blue-600" width={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New appointment</p>
                  <p className="text-xs text-gray-500">Patient scheduled for tomorrow</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex gap-3 py-1">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Icon icon="solar:check-circle-outline" className="text-green-600" width={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment received</p>
                  <p className="text-xs text-gray-500">Rp 500.000 from patient #123</p>
                </div>
              </div>
            </DropdownMenuItem>
            <div className="px-4 py-3 border-t border-gray-100">
              <button className="text-xs text-blue-600 hover:underline font-medium">
                View all notifications
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
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

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors ml-1"
              onMouseEnter={e => e.currentTarget.style.background = hover}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium" style={{ color: text }}>Anas Khalif Muttaqien</div>
                <div className="text-xs" style={{ color: sub }}>Super Admin</div>
              </div>
              <Avatar className="w-9 h-9">
                <AvatarImage src="https://picsum.photos/seed/admin/200" alt="Admin" />
                <AvatarFallback className="bg-blue-600 text-white text-sm">AK</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">Anas Khalif Muttaqien</p>
              <p className="text-xs text-gray-500 mt-0.5">Super Admin</p>
            </div>
            <DropdownMenuItem>
              <Icon icon="solar:user-outline" className="mr-2" width={16} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Icon icon="solar:logout-2-outline" className="mr-2" width={16} />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
