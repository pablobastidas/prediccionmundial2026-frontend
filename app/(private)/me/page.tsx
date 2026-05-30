"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { User as UserIcon, Mail, Lock, CheckCircle2, AlertCircle, Save, Sparkles, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);
  
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [securityMessage, setSecurityMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.display_name || user.email?.split('@')[0] || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy') || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProfileMessage({ type: 'success', text: '¡Perfil actualizado con éxito (Modo Demo)!' });
      } else {
        const { error } = await supabase.auth.updateUser({
          email: email !== user?.email ? email : undefined,
          data: { display_name: displayName }
        });
        if (error) throw error;
        setProfileMessage({ type: 'success', text: '¡Perfil actualizado correctamente!' });
      }
    } catch (err: any) {
      console.error(err);
      setProfileMessage({ type: 'error', text: err.message || 'Error al actualizar el perfil.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setSecurityMessage({ type: 'error', text: 'La contraseña no puede estar vacía.' });
      return;
    }
    if (password !== confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    setSavingSecurity(true);
    setSecurityMessage(null);

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy') || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSecurityMessage({ type: 'success', text: '¡Contraseña cambiada con éxito (Modo Demo)!' });
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setSecurityMessage({ type: 'success', text: '¡Contraseña cambiada correctamente!' });
      }
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      setSecurityMessage({ type: 'error', text: err.message || 'Error al cambiar la contraseña.' });
    } finally {
      setSavingSecurity(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header Premium */}
      <div className="mb-12 space-y-4 opacity-0 animate-reveal" style={{ animationDelay: '0.1s' }}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-wc-sky/10 border border-wc-sky/20 rounded-full">
          <Sparkles size={14} className="text-wc-sky animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wc-sky">Panel de Jugador</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-800 text-wc-white uppercase tracking-tighter leading-none">Mi Perfil</h1>
        <p className="text-wc-white/40 font-medium text-lg max-w-2xl">Administra tu identidad en el torneo y configura la seguridad de tu cuenta.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Formulario: Datos de Perfil */}
        <div className="opacity-0 animate-reveal" style={{ animationDelay: '0.2s' }}>
          <div className="bg-wc-white/[0.03] backdrop-blur-xl border border-wc-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-wc-sky/10 rounded-full blur-[40px]"></div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-display font-800 text-wc-white uppercase tracking-tight flex items-center gap-3">
                  <UserIcon size={22} className="text-wc-sky" /> Información
                </h2>
              </div>

              {profileMessage && (
                <div className={`p-5 rounded-2xl flex gap-4 items-center text-sm font-bold animate-fade-up ${
                  profileMessage.type === 'success' 
                    ? 'bg-wc-green/10 border border-wc-green/20 text-wc-green' 
                    : 'bg-wc-red/10 border border-wc-red/20 text-wc-red'
                }`}>
                  {profileMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <span>{profileMessage.text}</span>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-wc-white/30 ml-2">Nombre de Jugador (Alias)</label>
                  <div className="relative group/input">
                    <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-wc-white/20 group-focus-within/input:text-wc-sky transition-colors" size={18} />
                    <input 
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-wc-dark/40 border border-wc-white/10 rounded-2xl pl-14 pr-6 py-5 text-md font-bold text-wc-white focus:outline-none focus:border-wc-sky/50 focus:ring-4 focus:ring-wc-sky/5 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-wc-white/30 ml-2">Correo de Notificaciones</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-wc-white/20 group-focus-within/input:text-wc-sky transition-colors" size={18} />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-wc-dark/40 border border-wc-white/10 rounded-2xl pl-14 pr-6 py-5 text-md font-bold text-wc-white focus:outline-none focus:border-wc-sky/50 focus:ring-4 focus:ring-wc-sky/5 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={savingProfile}
                className="relative overflow-hidden w-full bg-wc-white/5 hover:bg-wc-white/10 border border-wc-white/10 text-wc-white py-5 rounded-2xl font-black text-[10px] tracking-[0.4em] transition-all flex items-center justify-center gap-3 group"
              >
                <Save size={16} className="text-wc-sky group-hover:scale-110 transition-transform" />
                {savingProfile ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
              </button>
            </form>
          </div>
        </div>

        {/* Formulario: Seguridad */}
        <div className="opacity-0 animate-reveal" style={{ animationDelay: '0.3s' }}>
          <div className="bg-wc-white/[0.03] backdrop-blur-xl border border-wc-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group h-full">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-wc-red/10 rounded-full blur-[40px]"></div>
            
            <form onSubmit={handleUpdateSecurity} className="space-y-8">
              <h2 className="text-2xl font-display font-800 text-wc-white uppercase tracking-tight flex items-center gap-3">
                <ShieldCheck size={22} className="text-wc-red" /> Seguridad
              </h2>

              {securityMessage && (
                <div className={`p-5 rounded-2xl flex gap-4 items-center text-sm font-bold animate-fade-up ${
                  securityMessage.type === 'success' 
                    ? 'bg-wc-green/10 border border-wc-green/20 text-wc-green' 
                    : 'bg-wc-red/10 border border-wc-red/20 text-wc-red'
                }`}>
                  {securityMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <span>{securityMessage.text}</span>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-wc-white/30 ml-2">Nueva Contraseña</label>
                  <div className="relative group/input">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-wc-white/20 group-focus-within/input:text-wc-red transition-colors" size={18} />
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-wc-dark/40 border border-wc-white/10 rounded-2xl pl-14 pr-6 py-5 text-md font-bold text-wc-white focus:outline-none focus:border-wc-red/50 focus:ring-4 focus:ring-wc-red/5 transition-all placeholder:text-wc-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-wc-white/30 ml-2">Confirmar Contraseña</label>
                  <div className="relative group/input">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-wc-white/20 group-focus-within/input:text-wc-red transition-colors" size={18} />
                    <input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite la contraseña"
                      className="w-full bg-wc-dark/40 border border-wc-white/10 rounded-2xl pl-14 pr-6 py-5 text-md font-bold text-wc-white focus:outline-none focus:border-wc-red/50 focus:ring-4 focus:ring-wc-red/5 transition-all placeholder:text-wc-white/10"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={savingSecurity}
                className="relative overflow-hidden w-full bg-wc-red hover:bg-wc-red/90 text-wc-white py-5 rounded-2xl font-black text-[10px] tracking-[0.4em] shadow-glow-red transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-[30deg] -translate-x-[200%] group-hover:animate-shine" />
                <ShieldCheck size={16} />
                {savingSecurity ? 'ACTUALIZANDO...' : 'CAMBIAR CONTRASEÑA'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
