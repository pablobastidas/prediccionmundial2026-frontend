"use client";
import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const WORLD_CUP_DATE = new Date('2026-06-11T18:00:00Z');

function calcTimeLeft(): TimeLeft {
  const diff = WORLD_CUP_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function WorldCupCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft);
  const [localStartDateStr, setLocalStartDateStr] = useState('11 de Junio, 2026');

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(calcTimeLeft());
    }, 1000);

    try {
      const formatted = WORLD_CUP_DATE.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      setLocalStartDateStr(formatted);
    } catch (e) {
      console.error("Error formatting local date:", e);
    }

    return () => clearInterval(id);
  }, []);

  const hasStarted =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .wcc-card {
          background: var(--accent, #FF3D00);
          color: #ffffff;
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          box-shadow: 0 4px 15px rgba(255, 61, 0, 0.15);
          margin-bottom: 1.75rem;
          font-family: inherit;
        }
        .wcc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .wcc-title {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .wcc-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ffffff;
          display: inline-block;
          animation: wcc-fade 1.5s infinite ease-in-out;
        }
        @keyframes wcc-fade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .wcc-badge {
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
          padding: 0.25rem 0.6rem;
          border-radius: 99px;
        }
        .wcc-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .wcc-unit-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 60px;
        }
        .wcc-val {
          font-size: clamp(2rem, 5vw, 2.5rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .wcc-lbl {
          font-size: 0.55rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 0.35rem;
          color: rgba(255, 255, 255, 0.75);
        }
        .wcc-divider {
          font-size: 1.5rem;
          font-weight: 800;
          opacity: 0.4;
          margin-bottom: 0.8rem;
        }
        .wcc-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          padding-top: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.65rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.85);
        }
        .wcc-footer-left {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
      `}} />

      <div className="wcc-card">
        <div className="wcc-header">
          <div className="wcc-title">
            <span className="wcc-live-dot" />
            <span>Faltan para el pitazo inicial</span>
          </div>
          <span className="wcc-badge">🏆 MUNDIAL 2026</span>
        </div>

        {hasStarted ? (
          <div style={{ textAlign: 'center', padding: '1.25rem 0' }}>
            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>⚽🏆🔥</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ¡EL MUNDIAL HA COMENZADO!
            </div>
          </div>
        ) : (
          <div className="wcc-display">
            <div className="wcc-unit-box">
              <span className="wcc-val">{pad(timeLeft.days)}</span>
              <span className="wcc-lbl">Días</span>
            </div>
            <span className="wcc-divider">:</span>
            <div className="wcc-unit-box">
              <span className="wcc-val">{pad(timeLeft.hours)}</span>
              <span className="wcc-lbl">Horas</span>
            </div>
            <span className="wcc-divider">:</span>
            <div className="wcc-unit-box">
              <span className="wcc-val">{pad(timeLeft.minutes)}</span>
              <span className="wcc-lbl">Minutos</span>
            </div>
            <span className="wcc-divider">:</span>
            <div className="wcc-unit-box">
              <span className="wcc-val">{pad(timeLeft.seconds)}</span>
              <span className="wcc-lbl">Segs</span>
            </div>
          </div>
        )}

        <div className="wcc-footer">
          <div className="wcc-footer-left">
            <span>🇲🇽 🇺🇸 🇨🇦</span>
            <span>México · USA · Canadá</span>
          </div>
          <div>{localStartDateStr}</div>
        </div>
      </div>
    </>
  );
}
