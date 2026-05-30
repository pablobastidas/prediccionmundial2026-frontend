"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import apiClient from '@/lib/api';
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
        if (!data.valid) setError('Token inválido o expirado.');
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

  if (loading) return <Spinner />;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow">
      <h1 className="text-2xl font-bold text-center mb-6">Unirse a {leagueName}</h1>
      {step === 1 && <EmailInput onSubmit={handleEmailSubmit} />}
      {step === 2 && <OTPForm email={email} onSubmit={handleOtpSubmit} />}
      {step === 3 && <NameInput onSubmit={handleNameSubmit} />}
    </div>
  );
}
