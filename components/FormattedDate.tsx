"use client";
import React, { useState, useEffect } from 'react';

interface FormattedDateProps {
  dateStr: string;
  format?: 'full' | 'short' | 'time';
}

export default function FormattedDate({ dateStr, format = 'full' }: FormattedDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span style={{ opacity: 0.5 }}>...</span>;
  }

  try {
    const date = new Date(dateStr);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    if (format === 'time') {
      return (
        <span>
          {date.toLocaleTimeString('es-ES', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      );
    }
    
    if (format === 'short') {
      const datePart = date.toLocaleDateString('es-ES', {
        timeZone: tz,
        month: 'short',
        day: 'numeric'
      });
      const timePart = date.toLocaleTimeString('es-ES', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit'
      });
      return <span>{datePart} · {timePart}</span>;
    }

    // Default full format
    return (
      <span>
        {date.toLocaleString('es-ES', {
          timeZone: tz,
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </span>
    );
  } catch (e) {
    return <span>{dateStr}</span>;
  }
}
