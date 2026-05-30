import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'flat';
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, variant = 'default' }) => {
  const baseStyles = "transition-all duration-500 overflow-hidden rounded-2xl";
  
  const variants = {
    default: "bg-wc-card/60 backdrop-blur-sm border border-wc-border shadow-soft hover:shadow-card hover:-translate-y-1",
    outline: "bg-transparent border-2 border-wc-border hover:border-wc-sky",
    flat: "bg-wc-card border-none shadow-none"
  };

  return (
    <div 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className}`}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};
