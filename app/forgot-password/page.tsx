"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      setError(error.message);
    } else {
      setMessage('Te hemos enviado un correo con el enlace para restablecer tu contraseña. Por favor revisa tu bandeja de entrada o spam.');
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
            RECUPERAR <span className="text-accent">CONTRASEÑA</span>
          </h2>
          <p className="text-muted" style={{ fontWeight: 700, marginBottom: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
            Ingresa tu correo y te enviaremos instrucciones.
          </p>

          {message ? (
            <div style={{ textAlign: 'center' }}>
              <div className="p-4 mb-6 bg-green-50 border border-green-300 text-green-800 rounded-xl text-sm font-bold">
                {message}
              </div>
              <Link href="/login" className="btn-secondary" style={{ width: '100%' }}>
                Volver al Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} noValidate>
              {error && (
                <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm font-bold">
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="email" style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input-modern"
                  placeholder="pablo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading || !email}>
                {loading ? 'ENVIANDO...' : 'ENVIAR ENLACE'}
              </button>
            </form>
          )}

          <div style={{ marginTop: '2rem', textAlign: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
            <Link href="/login" className="text-accent hover:underline">Volver al inicio de sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
