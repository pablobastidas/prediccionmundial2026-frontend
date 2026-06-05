"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function SimulatorPublic() {
  const [selectedA, setSelectedA] = useState<string[]>([]);
  const [selectedB, setSelectedB] = useState<string[]>([]);

  const handleSelect = (team: string, group: string, selected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selected.includes(team)) {
      setSelected(selected.filter(t => t !== team));
    } else {
      if (selected.length >= 2) return;
      setSelected([...selected, team]);
    }
  };

  const getPositionClass = (team: string, selected: string[]) => {
    const idx = selected.indexOf(team);
    if (idx === 0) return 'pos-1';
    if (idx === 1) return 'pos-2';
    return '';
  };

  const getPositionText = (team: string, selected: string[]) => {
    const idx = selected.indexOf(team);
    if (idx === 0) return '1°';
    if (idx === 1) return '2°';
    return '';
  };

  return (
    <>
      <style>{`
        body { background: white; padding: 1rem; }
        .sim-header { margin-bottom: 2rem; border-bottom: 2px solid var(--border); padding-bottom: 1.5rem; }
        .group-box { background: var(--bg); border-radius: var(--radius-lg); padding: 1.5rem; border: 1px solid var(--border); margin-bottom: 1.5rem; }
        .team-item { background: white; padding: 0.75rem 1rem; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between; cursor: pointer; border: 2px solid transparent; margin-bottom: 0.5rem; font-weight: 700; font-size: 0.9rem; }
        .team-item:hover { border-color: var(--accent-soft); }
        .team-item.pos-1 { border-color: var(--success); background: oklch(95% 0.05 150); }
        .team-item.pos-2 { border-color: var(--primary); background: oklch(95% 0.05 250); }
        .locked-card { background: var(--fg); color: white; padding: 2rem; border-radius: var(--radius-lg); text-align: center; margin-top: 2rem; }
      `}</style>
      <div style={{ background: 'white', padding: '1rem', minHeight: '100vh' }}>
      <div className="sim-header">
        <div className="badge-slant" style={{ marginBottom: '1rem' }}><span>PRUEBA GRATIS</span></div>
        <h2>SIMULADOR <span className="text-accent">LIMITADO</span></h2>
        <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '0.5rem' }}>Simula los primeros grupos y desbloquea el mundial completo registrándote.</p>
      </div>

      <div className="auto-grid">
        <div className="group-box">
          <h3 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '1rem' }}>GRUPO A</h3>
          {['MÉXICO', 'HOLANDA', 'GHANA'].map(team => (
            <div key={team} className={`team-item ${getPositionClass(team, selectedA)}`} onClick={() => handleSelect(team, 'A', selectedA, setSelectedA)}>
              <span>{team}</span> <span className="p-n">{getPositionText(team, selectedA)}</span>
            </div>
          ))}
        </div>
        <div className="group-box">
          <h3 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '1rem' }}>GRUPO B</h3>
          {['CANADÁ', 'BÉLGICA', 'COREA SUR'].map(team => (
            <div key={team} className={`team-item ${getPositionClass(team, selectedB)}`} onClick={() => handleSelect(team, 'B', selectedB, setSelectedB)}>
              <span>{team}</span> <span className="p-n">{getPositionText(team, selectedB)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="locked-card">
        <h3 style={{ marginBottom: '1rem' }}>¿QUIERES EL CUADRO COMPLETO?</h3>
        <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '1.5rem' }}>Regístrate para acceder a los 12 grupos y las fases de eliminación directa.</p>
        <Link href="/register" className="btn-primary" style={{ background: 'var(--accent)', color: 'white', width: '100%', display: 'inline-block' }}>CREAR CUENTA GRATIS</Link>
      </div>
      </div>
    </>
  );
}
