import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { usePage, router } from '@inertiajs/react';

export default function StandbyScreen({ isOpen, onClose }) {
  const { authUser, authRoles, logoPath, activeYear, conferenceAbbreviation } = usePage().props;
  const [time, setTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Lock scroll and listen for keypress to wake up
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      // Wake up on ESC, Space, Enter, or any alphanumeric key
      if (['Escape', 'Enter', ' ', 'Space'].includes(e.key) || e.key.length === 1) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const timeString = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateString = time.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const roleLabel = authRoles?.[0]
    ? authRoles[0].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'User';

  const userInitial = (authUser?.name ?? 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      id="standby-screen-overlay"
      className="fixed inset-0 z-[99999] flex flex-col justify-between items-center select-none overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.45)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        fontFamily: 'Manrope, sans-serif',
      }}
      onClick={onClose}
    >
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-8 py-6 z-10">
        <div className="flex items-center gap-3">
          <img
            src={logoPath || '/images/logo.png'}
            alt={conferenceAbbreviation || 'SND'}
            className="h-10 w-auto object-contain max-w-[200px] drop-shadow-sm"
            onError={(e) => {
              if (!e.currentTarget.src.endsWith('/images/logo.png')) {
                e.currentTarget.src = '/images/logo.png';
              }
            }}
          />
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/80 border border-slate-300/80 text-slate-700 shadow-sm backdrop-blur-md">
            {activeYear ? `${conferenceAbbreviation || 'SND'} ${typeof activeYear === 'object' && activeYear !== null ? activeYear.year : activeYear}` : (conferenceAbbreviation || 'SND')}
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-emerald-300/80 text-emerald-700 text-xs font-semibold shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span>Standby Mode</span>
        </div>
      </div>

      {/* Center Clock & Profile */}
      <div className="flex flex-col items-center justify-center text-center z-10 px-4 my-auto">
        {/* Digital Clock */}
        <h1
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight text-slate-900 mb-2 font-mono"
          style={{
            letterSpacing: '0.04em',
            textShadow: '0 2px 24px rgba(255, 255, 255, 0.9), 0 1px 3px rgba(15, 23, 42, 0.15)',
          }}
        >
          {timeString}
        </h1>

        {/* Date */}
        <p
          className="text-base md:text-lg font-semibold text-slate-700 mb-8"
          style={{ textShadow: '0 1px 12px rgba(255, 255, 255, 0.9)' }}
        >
          {dateString}
        </p>

        {/* User Card Badge */}
        <div
          className="flex items-center gap-3.5 px-5 py-3 rounded-2xl border transition-all shadow-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            borderColor: 'rgba(203, 213, 225, 0.85)',
            backdropFilter: 'blur(16px)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
            style={{ background: 'linear-gradient(135deg, #0152EA 0%, #141A63 100%)' }}
          >
            {userInitial}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800 leading-tight">
              {authUser?.name ?? 'User'}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {roleLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-col items-center gap-3 pb-10 z-10">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="group flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all cursor-pointer shadow-xl active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #0152EA 0%, #1E40AF 100%)',
              boxShadow: '0 8px 24px -4px rgba(1, 82, 234, 0.45)',
            }}
          >
            <Icon icon="solar:lock-unlocked-bold" width={18} className="group-hover:rotate-12 transition-transform" />
            <span>Resume Session</span>
          </button>

          <button
            type="button"
            title="Logout"
            aria-label="Logout"
            onClick={(e) => {
              e.stopPropagation();
              router.post('/logout');
            }}
            className="flex items-center justify-center w-[46px] h-[46px] rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#EF4444',
              border: '1px solid rgba(239, 68, 68, 0.28)',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
            }}
          >
            <Icon icon="solar:logout-2-outline" width={18} />
          </button>
        </div>

        <p
          className="text-xs text-slate-600 font-semibold"
          style={{ textShadow: '0 1px 8px rgba(255, 255, 255, 0.9)' }}
        >
          Click anywhere or press <kbd className="px-1.5 py-0.5 rounded bg-white/90 border border-slate-300 text-slate-800 font-mono text-[10px] shadow-xs">ESC</kbd> to unlock
        </p>
      </div>
    </div>
  );
}
