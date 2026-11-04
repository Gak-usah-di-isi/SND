import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

// Mirrors the old Blade behavior: show a toast whenever the backend flashes a session type+message.
export function useFlashToast(toast) {
  const { flash } = usePage().props;

  useEffect(() => {
    if (flash?.type && flash?.message) {
      toast[flash.type]?.(flash.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flash?.type, flash?.message]);
}
