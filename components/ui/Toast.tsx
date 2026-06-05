"use client";
import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

let toastListeners: ((toast: ToastMessage) => void)[] = [];
let toastId = 0;

export const showToast = (message: string, type: ToastType = 'success') => {
  const toast = { id: ++toastId, message, type };
  toastListeners.forEach(l => l(toast));
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (toast: ToastMessage) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 3500);
    };
    toastListeners.push(listener);
    return () => { toastListeners = toastListeners.filter(l => l !== listener); };
  }, []);

  const colorClasses: Record<ToastType, string> = {
    success: 'bg-wc-green/10 text-wc-green border-wc-green/30 border',
    error: 'bg-wc-red/10 text-wc-red border-wc-red/30 border',
    info: 'bg-wc-sky/10 text-wc-sky border-wc-sky/30 border'
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: 'fixed', bottom: '6rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {toasts.map(t => (
        <div key={t.id} className={`${colorClasses[t.type]} rounded-2xl px-5 py-3 font-extrabold text-sm shadow-2xl animate-[slideIn_0.3s_ease] max-w-[320px] backdrop-blur-md`}>
          {t.message}
        </div>
      ))}
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}
