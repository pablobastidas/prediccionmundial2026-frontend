"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronRight, Trophy, ArrowLeft, Calendar, Users, Star, Clock, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';

interface Match {
  id: number;
  home_team?: { name: string; code: string; flag_emoji: string };
  away_team?: { name: string; code: string; flag_emoji: string };
  match_datetime: string;
}

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/leagues');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${apiUrl}/api/matches`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUpcomingMatches(data.slice(0, 3));
        }
      })
      .catch(err => console.error("Error loading matches for login:", err));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage('Error al enviar el acceso.');
    else {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')) {
        setMessage('¡Modo Demo: Sesión iniciada para ' + email + '!');
      } else {
        setMessage('¡Revisa tu bandeja de entrada!');
      }
    }
    setLoading(false);
  };

  const handleQuickAccess = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: 'demo@desafiomundial.com' });
      if (error) {
        setMessage('Error al ingresar en modo demo.');
      } else {
        router.push('/leagues');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error al ingresar en modo demo.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-wc-dark flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wc-dark text-wc-white relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8">
      {/* Textura de Ruido Táctil */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Acentos de Fondo */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-wc-blue/15 rounded-full blur-[140px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-wc-red/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
        
        {/* Columna Izquierda: Información del Torneo */}
        <div className="lg:col-span-7 flex flex-col space-y-10">
          <div className="opacity-0 animate-reveal" style={{ animationDelay: '0.1s' }}>
            <Link href="/" className="inline-flex items-center gap-3 text-wc-white/40 hover:text-wc-sky transition-all group w-fit bg-wc-white/5 px-4 py-2 rounded-xl border border-wc-white/5">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Volver al Inicio</span>
            </Link>
          </div>

          <div className="opacity-0 animate-reveal" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-wc-gold/10 border border-wc-gold/20 rounded-2xl text-wc-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-8">
              <Sparkles size={14} className="animate-pulse" />
              <span>Experiencia Mundialista 2026</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display font-800 tracking-tighter leading-[0.85] uppercase mb-8">
              PREDICE EL<br/>
              <span className="text-transparent bg-clip-text bg-gold-gradient">DESAFÍO MUNDIAL</span>
            </h1>
            <p className="text-wc-white/40 text-xl md:text-2xl max-w-xl font-medium leading-relaxed">
              Únete a la mayor plataforma social de predicciones. Crea ligas, compite con amigos y sube en el ranking global.
            </p>
          </div>

          {/* Match Feed Estilizado */}
          <div className="space-y-6 opacity-0 animate-reveal" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-wc-sky flex items-center gap-3 ml-2">
              <div className="w-8 h-[1px] bg-wc-sky/30"></div> Próximos Partidos
            </h3>
            <div className="grid gap-4">
              {upcomingMatches.map((match) => (
                <div key={match.id} className="group bg-wc-white/[0.03] backdrop-blur-md border border-wc-white/5 rounded-[1.5rem] p-5 flex items-center justify-between hover:bg-wc-white/[0.08] transition-all duration-300">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{match.home_team?.flag_emoji}</span>
                      <span className="font-display font-700 text-sm uppercase tracking-widest">{match.home_team?.code}</span>
                    </div>
                    <span className="text-wc-white/10 font-black italic text-xs">VS</span>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{match.away_team?.flag_emoji}</span>
                      <span className="font-display font-700 text-sm uppercase tracking-widest">{match.away_team?.code}</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-wc-white/5 rounded-xl border border-wc-white/5 group-hover:border-wc-gold/30 transition-colors">
                    <span className="text-wc-gold text-[10px] font-bold tracking-widest uppercase">
                      {new Date(match.match_datetime).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: El Formulario */}
        <div className="lg:col-span-5 w-full max-w-lg mx-auto opacity-0 animate-reveal" style={{ animationDelay: '0.4s' }}>
          <div className="bg-wc-white/[0.03] backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] shadow-2xl border border-wc-white/10 relative overflow-hidden">
            {/* Resplandor decorativo interno */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-wc-gold/10 rounded-full blur-[60px]"></div>

            <div className="mb-12">
              <div className="w-14 h-14 bg-gold-gradient p-3 rounded-2xl shadow-glow-gold mb-8 flex items-center justify-center">
                <Users size={28} className="text-wc-dark" />
              </div>
              <h2 className="text-4xl font-display font-800 text-wc-white uppercase tracking-tight leading-none mb-4">
                Entrar como<br/> <span className="text-wc-gold">Jugador</span>
              </h2>
              <p className="text-wc-white/30 text-sm font-medium tracking-wide">Inicia sesión con tu correo para empezar.</p>
            </div>
            
            {message ? (
              <div className="bg-wc-sky/10 border border-wc-sky/20 text-wc-sky p-10 rounded-[2.5rem] text-center animate-fade-up shadow-inner">
                <div className="w-20 h-20 bg-wc-sky/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail size={32} className="text-wc-sky animate-pulse" />
                </div>
                <p className="font-display text-lg font-bold mb-8">{message}</p>
                <Link href="/leagues" className="w-full inline-flex items-center justify-center gap-3 bg-wc-sky text-wc-dark px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-wc-white transition-all shadow-glow-sky">
                  Ir al Tablero <ChevronRight size={18} />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-wc-white/30 ml-2 flex items-center gap-2">
                    Correo Electrónico
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-wc-white/20 group-focus-within:text-wc-sky transition-colors" size={20} />
                    <input 
                      type="email" 
                      placeholder="ej: messi@mundial2026.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      className="w-full bg-wc-dark/40 border border-wc-white/10 rounded-2xl pl-16 pr-8 py-6 text-lg font-medium text-wc-white focus:outline-none focus:border-wc-sky/50 focus:bg-wc-dark/60 focus:ring-4 focus:ring-wc-sky/5 transition-all placeholder:text-wc-white/10"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="relative overflow-hidden w-full bg-wc-red hover:bg-wc-red/80 text-wc-white py-6 rounded-2xl font-black text-xs tracking-[0.4em] shadow-glow-red hover:shadow-card-hover transition-all flex items-center justify-center gap-4 group active:scale-[0.98]"
                >
                  <div className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-[30deg] -translate-x-[200%] group-hover:animate-shine" />
                  {loading ? 'CONECTANDO...' : 'RECLAMAR ACCESO'} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                {process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy') && (
                  <div className="pt-8 border-t border-wc-white/5 text-center">
                    <button 
                      type="button" 
                      onClick={handleQuickAccess}
                      disabled={loading}
                      className="group inline-flex flex-col items-center gap-2 bg-transparent border-0 outline-none cursor-pointer w-full"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-wc-sky/60 group-hover:text-wc-sky transition-colors">
                        Acceso Rápido (Modo Demo)
                      </span>
                      <div className="h-[1px] w-8 bg-wc-sky/20 group-hover:w-full transition-all duration-500"></div>
                    </button>
                  </div>
                )}
                
                <p className="text-center text-[10px] text-wc-white/20 font-bold leading-relaxed uppercase tracking-widest">
                  Acceso seguro via Magic Link
                </p>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
