import { createContext } from 'react';

export type BookingPreset = { treatment?: string; specialist?: string };

export type BookingCtx = {
  isOpen: boolean;
  preset: BookingPreset;
  open: (preset?: BookingPreset) => void;
  close: () => void;
};

export const BookingContext = createContext<BookingCtx | null>(null);
