"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading: authLoading, isAuthenticated } = useAuth();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/home');
    }
  }, [authLoading, isAuthenticated, router]);

  // Read message from query params
  useEffect(() => {
    const msg = searchParams.get('message');
    if (msg === 'session_expired') {
      setError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/home');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg)]">
      <div className="login-box">
        {/* Left Side: Form */}
        <div className="login-left">
          <Link href="/" className="logo" style={{ marginBottom: '2rem' }}>
            DESAFÍO<span>MUNDIAL</span>
          </Link>
          
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            HOLA DE <span className="text-accent">NUEVO</span>
          </h2>
          <p className="text-muted" style={{ fontWeight: 700, marginBottom: '2rem' }}>
            Ingresa a la zona de juego oficial.
          </p>

          <form onSubmit={handleLogin} noValidate>
            {error && (
              <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm font-bold">
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
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

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="password" style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>
                  Contraseña
                </label>
                <Link href="/forgot-password" style={{ fontSize: '0.7rem', fontWeight: 700 }} className="text-accent hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
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

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'CONECTANDO...' : 'ENTRAR AL ESTADIO'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
            ¿No tienes cuenta? <Link href="/register" className="text-accent">Crea una aquí</Link>
          </div>
        </div>

        {/* Right Side: Branding */}
        <div className="login-right">
          <div className="badge-slant" style={{ marginBottom: '1.5rem', width: 'fit-content' }}>
            <span>World Cup 2026</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', lineHeight: 1, marginBottom: '1.5rem' }}>
            PREDICE EL <br />
            <span className="text-accent">FUTURO</span> DEL <br />
            FÚTBOL
          </h2>
          <p style={{ fontSize: '1rem', fontWeight: 600, opacity: 0.8, maxWidth: '400px' }}>
            Únete a la plataforma líder en pronósticos deportivos para el Mundial 2026.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Spinner />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
