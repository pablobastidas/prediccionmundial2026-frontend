import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col mb-6">
      {label && (
        <label className="mb-2 text-xs font-bold uppercase tracking-widest text-wc-white/80">
          {label}
        </label>
      )}
      <input
        className={`bg-wc-card border-2 rounded-2xl px-5 py-4 text-base text-wc-white placeholder:text-wc-white/40 focus:outline-none focus:border-wc-sky focus:ring-4 focus:ring-wc-sky/10 transition-all ${
          error ? 'border-wc-red' : 'border-wc-border'
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-2 text-xs font-semibold text-wc-red">{error}</span>}
    </div>
  );
};
