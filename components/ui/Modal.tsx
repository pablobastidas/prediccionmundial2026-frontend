import React from 'react';

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="card w-full max-w-md overflow-hidden relative">
        <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 className="font-display" style={{ fontSize: '1.5rem', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ fontSize: '1.5rem', opacity: 0.5 }}>✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
