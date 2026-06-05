import React from 'react';

export const Badge: React.FC<{ children: React.ReactNode, variant?: 'primary' | 'success' | 'danger' | 'secondary' | 'gold' }> = ({ children, variant = 'primary' }) => {
  const variants = {
    primary: "bg-wc-sky/10 border border-wc-sky/30 text-wc-sky",
    success: "bg-wc-green/10 border border-wc-green/30 text-wc-green",
    danger: "bg-wc-red/10 border border-wc-red/30 text-wc-red",
    secondary: "bg-wc-border/50 border border-wc-border text-wc-white/70",
    gold: "bg-wc-gold/10 border border-wc-gold/30 text-wc-gold"
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${variants[variant]}`}>
      {children}
    </span>
  );
};
