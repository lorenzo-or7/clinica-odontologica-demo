import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { BookingContext, type BookingPreset } from './bookingContext';

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [preset, setPreset] = useState<BookingPreset>({});

  const open = useCallback((p: BookingPreset = {}) => {
    setPreset(p);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ isOpen, preset, open, close }), [isOpen, preset, open, close]);
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
