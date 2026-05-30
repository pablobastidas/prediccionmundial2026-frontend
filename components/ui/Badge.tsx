import React from 'react';

export const Badge: React.FC<{ children: React.ReactNode, variant?: 'primary' | 'success' | 'danger' | 'secondary' }> = ({ children, variant = 'primary' }) => {
  const variants = {
    primary: "bg-brand-vibrant/10 text-brand-vibrant",
    success: "bg-brand-success/10 text-brand-success",
    danger: "bg-brand-danger/10 text-brand-danger",
    secondary: "bg-brand-slate-100 text-brand-slate-600"
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${variants[variant]}`}>
      {children}
    </span>
  );
};
