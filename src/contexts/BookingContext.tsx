import { createContext, useContext, useState, useCallback } from 'react';
import type { WYLI_Service, CartItem, BookingDraft, BookingContextValue } from '@/lib/services';

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

const initialDraft: BookingDraft = {
  items: [],
  category: 'All',
  date: '',
  time: '',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  notes: '',
};

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<BookingDraft>(initialDraft);

  const addService = useCallback((service: WYLI_Service) => {
    setDraft((prev: BookingDraft) => {
      const existing = prev.items.find((i: CartItem) => i.service.id === service.id);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i: CartItem) =>
            i.service.id === service.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        };
      }
      return { ...prev, items: [...prev.items, { service, quantity: 1 }] };
    });
  }, []);

  const removeService = useCallback((serviceId: string) => {
    setDraft((prev: BookingDraft) => ({
      ...prev,
      items: prev.items.filter((i: CartItem) => i.service.id !== serviceId),
    }));
  }, []);

  const updateQuantity = useCallback((serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      setDraft((prev: BookingDraft) => ({
        ...prev,
        items: prev.items.filter((i: CartItem) => i.service.id !== serviceId),
      }));
      return;
    }
    setDraft((prev: BookingDraft) => ({
      ...prev,
      items: prev.items.map((i: CartItem) =>
        i.service.id === serviceId ? { ...i, quantity } : i,
      ),
    }));
  }, []);

  const setDate = useCallback((date: string) => setDraft((prev: BookingDraft) => ({ ...prev, date })), []);
  const setTime = useCallback((time: string) => setDraft((prev: BookingDraft) => ({ ...prev, time })), []);
  const setCustomerName = useCallback((name: string) => setDraft((prev: BookingDraft) => ({ ...prev, customerName: name })), []);
  const setCustomerPhone = useCallback((phone: string) => setDraft((prev: BookingDraft) => ({ ...prev, customerPhone: phone })), []);
  const setCustomerEmail = useCallback((email: string) => setDraft((prev: BookingDraft) => ({ ...prev, customerEmail: email })), []);
  const setNotes = useCallback((notes: string) => setDraft((prev: BookingDraft) => ({ ...prev, notes })), []);

  const totalPrice = draft.items.reduce((sum: number, i: CartItem) => sum + i.service.price * i.quantity, 0);
  const totalDuration = draft.items.reduce((sum: number, i: CartItem) => sum + i.service.duration * i.quantity, 0);
  const itemCount = draft.items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0);

  const clearCart = useCallback(() => setDraft(initialDraft), []);

  const value: BookingContextValue = {
    draft,
    addService,
    removeService,
    updateQuantity,
    setDate,
    setTime,
    setCustomerName,
    setCustomerPhone,
    setCustomerEmail,
    setNotes,
    totalPrice,
    totalDuration,
    itemCount,
    clearCart,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within a BookingProvider');
  return ctx;
}
