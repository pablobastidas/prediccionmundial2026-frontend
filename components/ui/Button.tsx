import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
};

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-wc-sky/20 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed tracking-tight";
  
  const variants = {
    primary: "bg-wc-red text-wc-white hover:bg-wc-red/85 shadow-glow-red hover:shadow-card-hover",
    secondary: "bg-wc-sky text-wc-white hover:bg-wc-sky/90 shadow-soft",
    danger: "bg-wc-red text-wc-white hover:bg-wc-red/90 shadow-soft",
    outline: "border-2 border-wc-border text-wc-white hover:bg-wc-card",
    ghost: "bg-transparent text-wc-white/70 hover:text-wc-white hover:bg-wc-card/50"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? (
        <div className="mr-2 h-4 w-4 border-2 border-wc-white/30 border-t-wc-white rounded-full animate-spin"></div>
      ) : null}
      {children}
    </button>
  );
};
