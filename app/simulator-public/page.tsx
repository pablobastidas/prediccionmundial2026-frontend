"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const GROUP_A = [
  { name: 'México', flag: 'mx' },
  { name: 'Sudáfrica', flag: 'za' },
  { name: 'Corea del Sur', flag: 'kr' },
  { name: 'Chequia', flag: 'cz' }
];

const GROUP_B = [
  { name: 'Canadá', flag: 'ca' },
  { name: 'Bosnia y Herzegovina', flag: 'ba' },
  { name: 'Qatar', flag: 'qa' },
  { name: 'Suiza', flag: 'ch' }
];

export default function SimulatorPublic() {
  const [selectedA, setSelectedA] = useState<string[]>([]);
  const [selectedB, setSelectedB] = useState<string[]>([]);

  const handleSelect = (teamName: string, selected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selected.includes(teamName)) {
      setSelected(selected.filter(t => t !== teamName));
    } else {
      if (selected.length >= 2) return;
      setSelected([...selected, teamName]);
    }
  };

  const getPositionClass = (teamName: string, selected: string[]) => {
    const idx = selected.indexOf(teamName);
    if (idx === 0) return 'pos-1';
    if (idx === 1) return 'pos-2';
    return '';
  };

  const getPositionText = (teamName: string, selected: string[]) => {
    const idx = selected.indexOf(teamName);
    if (idx === 0) return '1°';
    if (idx === 1) return '2°';
    return '';
  };

  return (
    <>
      <style>{`
        body { background: var(--bg, #F4F6F9); padding: 1.5rem; }
        .sim-header { margin-bottom: 2rem; border-bottom: 1px solid var(--border, rgba(0,0,0,0.08)); padding-bottom: 1.5rem; }
        .group-box { background: var(--surface, #FFFFFF); border-radius: 16px; padding: 1.5rem; border: 1px solid var(--border, rgba(0,0,0,0.08)); margin-bottom: 1.5rem; box-shadow: var(--shadow-sm); }
        .team-item { background: var(--bg, #F4F6F9); padding: 0.75rem 1rem; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border: 2px solid transparent; margin-bottom: 0.5rem; font-weight: 700; font-size: 0.9rem; transition: all 0.2s; }
        .team-item:hover { border-color: var(--primary-soft, rgba(0,102,204,0.1)); }
        .team-item.pos-1 { border-color: var(--success, #00d26a); background: rgba(0,210,106,0.06); }
        .team-item.pos-2 { border-color: var(--primary, #0066cc); background: rgba(0,102,204,0.06); }
        .locked-card { background: var(--surface, #FFFFFF); padding: 2rem; border-radius: 16px; border: 1px solid var(--border, rgba(0,0,0,0.08)); text-align: center; margin-top: 2rem; box-shadow: var(--shadow-md); }
        .flag-img { width: 28px; height: 18px; border-radius: 3px; border: 1px solid var(--border, rgba(0,0,0,0.08)); object-fit: cover; }
      `}</style>
      <div style={{ maxWidth: '800px', margin: '0 auto', minHeight: '100vh', padding: '1rem' }}>
        <div className="sim-header">
          <div className="badge-slant" style={{ marginBottom: '1rem' }}><span>PRUEBA GRATIS</span></div>
          <h2>SIMULADOR <span className="text-accent">LIMITADO</span></h2>
          <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.5rem' }}>Simula los primeros grupos y desbloquea el mundial completo registrándote.</p>
        </div>

        <div className="auto-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="group-box">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, fontStyle: 'italic', color: 'var(--accent)', marginBottom: '1.25rem', textTransform: 'uppercase' }}>GRUPO A</h3>
            {GROUP_A.map(team => (
              <div key={team.name} className={`team-item ${getPositionClass(team.name, selectedA)}`} onClick={() => handleSelect(team.name, selectedA, setSelectedA)}>
                <div className="flex" style={{ gap: '0.75rem', alignItems: 'center' }}>
                  <img src={`https://flagcdn.com/w40/${team.flag}.png`} className="flag-img" alt={team.name} />
                  <span>{team.name}</span>
                </div>
                <span className="p-n" style={{ fontWeight: 900, color: 'var(--primary)' }}>{getPositionText(team.name, selectedA)}</span>
              </div>
            ))}
          </div>

          <div className="group-box">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, fontStyle: 'italic', color: 'var(--accent)', marginBottom: '1.25rem', textTransform: 'uppercase' }}>GRUPO B</h3>
            {GROUP_B.map(team => (
              <div key={team.name} className={`team-item ${getPositionClass(team.name, selectedB)}`} onClick={() => handleSelect(team.name, selectedB, setSelectedB)}>
                <div className="flex" style={{ gap: '0.75rem', alignItems: 'center' }}>
                  <img src={`https://flagcdn.com/w40/${team.flag}.png`} className="flag-img" alt={team.name} />
                  <span>{team.name}</span>
                </div>
                <span className="p-n" style={{ fontWeight: 900, color: 'var(--primary)' }}>{getPositionText(team.name, selectedB)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="locked-card">
          <h3 style={{ marginBottom: '1rem', fontWeight: 900 }}>¿QUIERES EL CUADRO COMPLETO?</h3>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Regístrate para acceder a los 12 grupos y las fases de eliminación directa de la Copa Mundial 2026.</p>
          <Link href="/register" className="btn-primary" style={{ display: 'block', width: '100%', maxWidth: '300px', margin: '0 auto', textAlign: 'center' }}>CREAR CUENTA GRATIS</Link>
        </div>
      </div>
    </>
  );
}
