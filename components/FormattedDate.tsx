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
    if (isNaN(date.getTime())) {
      return <span>{dateStr}</span>;
    }

    const options: Intl.DateTimeFormatOptions = {};
    
    if (format === 'time') {
      options.hour = '2-digit';
      options.minute = '2-digit';
    } else if (format === 'short') {
      options.month = 'short';
      options.day = 'numeric';
      options.hour = '2-digit';
      options.minute = '2-digit';
    } else {
      options.weekday = 'short';
      options.month = 'short';
      options.day = 'numeric';
      options.hour = '2-digit';
      options.minute = '2-digit';
    }

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      options.timeZone = tz;
    }

    return <span>{date.toLocaleString('es-ES', options)}</span>;
  } catch (e) {
    console.error("Error formatting date:", e);
    return <span>{dateStr}</span>;
  }
}
