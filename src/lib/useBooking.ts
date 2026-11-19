import { useContext } from 'react';
import { BookingContext } from './bookingContext';

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking precisa estar dentro de BookingProvider');
  return ctx;
}
