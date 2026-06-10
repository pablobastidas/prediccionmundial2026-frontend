"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/home');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg)]">
      <div className="login-box">
        {/* Left Side: Form */}
        <div className="login-left">
          <Link href="/" className="logo" style={{ marginBottom: '2rem' }}>
            DESAFÍO<span>MUNDIAL</span>
          </Link>
          
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            CREA TU <span className="text-accent">CUENTA</span>
          </h2>
          <p className="text-muted" style={{ fontWeight: 700, marginBottom: '2rem' }}>
            Únete a la fiebre mundialista hoy mismo.
          </p>

          <form onSubmit={handleRegister} noValidate>
            {error && (
              <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm font-bold">
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="name" style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>
                Nombre Completo
              </label>
              <input
                id="name"
                type="text"
                className="form-input-modern"
                placeholder="Pablo Sánchez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

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
              <label htmlFor="password" style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>
                Contraseña
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

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'UNINEDOSE...' : 'UNIRSE AL MUNDIAL'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
            ¿Ya tienes cuenta? <Link href="/login" className="text-accent">Inicia sesión</Link>
          </div>
        </div>

        {/* Right Side: Branding */}
        <div className="login-right">
          <div className="badge-slant" style={{ marginBottom: '1.5rem', width: 'fit-content' }}>
            <span>World Cup 2026</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', lineHeight: 1, marginBottom: '1.5rem' }}>
            VIVE LA <br />
            <span className="text-accent">PASIÓN</span> DEL <br />
            FÚTBOL
          </h2>
          <p style={{ fontSize: '1rem', fontWeight: 600, opacity: 0.8, maxWidth: '400px' }}>
            Crea ligas privadas, compite con amigos y demuestra que eres el que más sabe de fútbol.
          </p>
        </div>
      </div>
    </div>
  );
}
