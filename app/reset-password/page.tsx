"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    
    if (error) {
      setError(error.message);
    } else {
      setMessage('¡Tu contraseña ha sido actualizada con éxito!');
      setTimeout(() => {
        router.push('/leagues');
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg)]">
      <div className="login-box" style={{ maxWidth: '600px' }}>
        <div className="login-left" style={{ padding: '3rem' }}>
          <Link href="/" className="logo" style={{ marginBottom: '2rem', display: 'block', textAlign: 'center' }}>
            DESAFÍO<span>MUNDIAL</span>
          </Link>
          
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', textAlign: 'center' }}>
            NUEVA <span className="text-accent">CONTRASEÑA</span>
          </h2>
          <p className="text-muted" style={{ fontWeight: 700, marginBottom: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
            Ingresa tu nueva contraseña para tu cuenta.
          </p>

          {message ? (
            <div style={{ textAlign: 'center' }}>
              <div className="p-4 mb-4 bg-green-50 border border-green-300 text-green-800 rounded-xl text-sm font-bold">
                {message}
              </div>
              <p className="text-muted" style={{ fontWeight: 700, marginTop: '1rem' }}>Redirigiendo a tus ligas...</p>
            </div>
          ) : (
            <form onSubmit={handleUpdate} noValidate>
              {error && (
                <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm font-bold">
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="password" style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>
                  Nueva Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-input-modern"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="confirmPassword" style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="form-input-modern"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading || !password || !confirmPassword}>
                {loading ? 'ACTUALIZANDO...' : 'CAMBIAR CONTRASEÑA'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
