import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

type Props = {
  value: number;
  onChange: (val: number) => void;
  label: string;
  disabled?: boolean;
  compact?: boolean;
};

export const MatchScoreInput: React.FC<Props> = ({ value, onChange, label, disabled, compact }) => {
  const [manualInput, setManualInput] = useState(false);

  const decrement = () => {
    if (value > 0) onChange(value - 1);
  };

  const increment = () => {
    if (value < 15) onChange(value + 1);
  };

  return (
    <div className={`flex flex-col items-center ${compact ? 'gap-1' : 'gap-3'}`}>
      {label && (
        <label className="text-xs font-bold text-wc-white/60 uppercase tracking-widest">{label}</label>
      )}
      <div className={`flex items-center ${compact ? 'gap-1' : 'gap-3'}`}>
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || value <= 0}
          className={`${
            compact ? 'w-6 h-6' : 'w-10 h-10'
          } flex items-center justify-center rounded-full bg-wc-white/[0.04] border border-wc-white/10 text-wc-white hover:bg-wc-sky/25 hover:border-wc-sky/50 hover:text-wc-sky active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-all shadow-md`}
        >
          <Minus size={compact ? 10 : 16} />
        </button>
        <input 
          type="number" 
          inputMode={manualInput ? "numeric" : "none"}
          min={0} 
          max={15} 
          value={value} 
          onChange={(e) => {
            const val = parseInt(e.target.value);
            onChange(isNaN(val) ? 0 : Math.max(0, Math.min(15, val)));
          }}
          onDoubleClick={() => setManualInput(true)}
          onTouchStart={(e) => {
            if (e.detail === 2) {
              setManualInput(true);
            }
          }}
          onBlur={() => setManualInput(false)}
          disabled={disabled}
          className={`${
            compact ? 'w-8 h-8 text-sm rounded-lg' : 'w-16 h-16 text-3xl rounded-2xl'
          } text-center font-display font-800 bg-wc-dark/50 border border-wc-border focus:ring-1 focus:ring-wc-sky focus:border-wc-sky focus:outline-none disabled:bg-wc-card/30 disabled:text-wc-white/50 transition-all text-wc-white shadow-card [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        />
        <button
          type="button"
          onClick={increment}
          disabled={disabled || value >= 15}
          className={`${
            compact ? 'w-6 h-6' : 'w-10 h-10'
          } flex items-center justify-center rounded-full bg-wc-white/[0.04] border border-wc-white/10 text-wc-white hover:bg-wc-sky/25 hover:border-wc-sky/50 hover:text-wc-sky active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-all shadow-md`}
        >
          <Plus size={compact ? 10 : 16} />
        </button>
      </div>
    </div>
  );
};

