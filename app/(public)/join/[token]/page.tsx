"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import apiClient from '@/lib/apiClient';
import { EmailInput } from '@/components/auth/EmailInput';
import { OTPForm } from '@/components/auth/OTPForm';
import { NameInput } from '@/components/auth/NameInput';
import { Spinner } from '@/components/ui/Spinner';

export default function JoinPage() {
  const { token } = useParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [leagueName, setLeagueName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const validateToken = async () => {
      try {
        const { data } = await apiClient.get(`/invites/${token}`);
        if (!data.valid) setError('Token de invitación inválido o expirado.');
        else setLeagueName(data.league_name);
      } catch {
        setError('Error al validar la invitación.');
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, [token]);

  const handleEmailSubmit = async (e: string) => {
    setEmail(e);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email: e });
    setLoading(false);
    if (!error) setStep(2);
  };

  const handleOtpSubmit = async (otp: string) => {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
    setLoading(false);
    if (!error && session) setStep(3);
  };

  const handleNameSubmit = async (name: string) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await apiClient.post('/auth/verify-otp', { email, supabase_uid: session?.user.id, display_name: name });
      const { data: league } = await apiClient.post(`/leagues/0/join`, { invite_token: token });
      router.push(`/leagues/${league.id}`);
    } catch (err) {
      setError('Error al unirse a la liga.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg)]">
      <div className="login-box" style={{ maxWidth: '600px' }}>
        <div className="login-left" style={{ padding: '3rem' }}>
          <Link href="/" className="logo" style={{ marginBottom: '2rem', display: 'block', textAlign: 'center' }}>
            POLLA<span>MUNDIAL</span>
          </Link>

          {error ? (
            <div style={{ textAlign: 'center' }}>
              <div className="p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm font-bold">
                {error}
              </div>
              <Link href="/" className="btn-secondary" style={{ width: '100%' }}>
                Ir al Inicio
              </Link>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                UNIRSE A <span className="text-accent">{leagueName.toUpperCase()}</span>
              </h2>
              <p className="text-muted" style={{ fontWeight: 700, marginBottom: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
                Completa los datos para acceder e ingresar a la liga.
              </p>

              <div className="space-y-4">
                {step === 1 && <EmailInput onSubmit={handleEmailSubmit} />}
                {step === 2 && <OTPForm email={email} onSubmit={handleOtpSubmit} />}
                {step === 3 && <NameInput onSubmit={handleNameSubmit} />}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
