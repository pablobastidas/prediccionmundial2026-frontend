"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { joinLeagueByToken } from '@/services/leagueService';
import AppLayout from '@/components/layout/AppLayout';

export default function JoinLeague() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleJoin = async () => {
    if (!token || token.length !== 6) {
      setError('El código debe tener exactamente 6 caracteres.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      await joinLeagueByToken(token.toUpperCase());
      setSuccess('¡Te has unido exitosamente!');
      setTimeout(() => {
        router.push('/leagues');
      }, 1500);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr.response?.data?.detail || 'Código inválido o ya estás en esta liga.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout activeRoute="/leagues">
      {/* Page Header */}
      <header className="page-header">
        <div>
          <div className="badge-slant" style={{ marginBottom: '0.5rem' }}><span>Invitación</span></div>
          <h1>UNIRSE A <span className="text-accent">UNA LIGA</span></h1>
        </div>
        <Link href="/leagues" className="btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.8rem' }}>
          VOLVER
        </Link>
      </header>

      {/* Main Content Form */}
      <div className="flex" style={{ justifyContent: 'center', paddingTop: '2rem' }}>
        <div className="card" style={{ maxWidth: '500px', textAlign: 'center', padding: '4rem 2rem', width: '100%' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '2rem' }}>🔑</span>
          
          <h2 style={{ marginBottom: '1rem' }}>Código de Acceso</h2>
          <p className="text-muted" style={{ fontWeight: 700, marginBottom: '3rem', fontSize: '0.9rem' }}>
            Ingresa el código de 6 dígitos que te enviaron para unirte a la liga privada.
          </p>

          {error && (
            <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm font-bold">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 mb-4 bg-green-50 border border-green-300 text-green-800 rounded-xl text-sm font-bold">
              {success}
            </div>
          )}

          <input 
            type="text" 
            className="card"
            style={{
              width: '100%',
              padding: '1.5rem',
              background: 'var(--bg)',
              border: '2px solid var(--border)',
              fontSize: '2rem',
              fontWeight: 900,
              textAlign: 'center',
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              marginBottom: '2rem'
            }}
            placeholder="------" 
            maxLength={6} 
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={loading || !!success}
          />

          <button 
            className="btn-primary" 
            style={{ width: '100%' }}
            onClick={handleJoin}
            disabled={loading || !!success || token.length !== 6}
          >
            {loading ? 'VALIDANDO...' : 'VALIDAR Y ENTRAR'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
