import React from 'react';

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-slate-900/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[2rem] shadow-elevated w-full max-w-md overflow-hidden border border-brand-slate-100">
        <div className="px-8 py-6 border-b border-brand-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-black uppercase tracking-tighter text-brand-slate-900">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl bg-brand-slate-50 text-brand-slate-400 hover:text-brand-slate-900 transition-colors">✕</button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};
