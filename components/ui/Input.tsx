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
        <label className="mb-2 text-xs font-bold uppercase tracking-widest text-[#0F172A]">
          {label}
        </label>
      )}
      <input
        className={`bg-white border-2 rounded-2xl px-5 py-4 text-base text-brand-slate-900 placeholder:text-[#94A3B8] focus:outline-none focus:border-brand-vibrant focus:ring-4 focus:ring-brand-vibrant/10 transition-all ${
          error ? 'border-brand-danger' : 'border-brand-slate-100'
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-2 text-xs font-semibold text-brand-danger">{error}</span>}
    </div>
  );
};
