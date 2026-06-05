"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { getUserStats, getMyBadges, updateUserProfile, UserStats, Badge } from '@/services/userService';
import AppLayout from '@/components/layout/AppLayout';
import { Spinner } from '@/components/ui/Spinner';
import { showToast } from '@/components/ui/Toast';

export default function ProfilePage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // State
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [fetchingStats, setFetchingStats] = useState(true);
  
  // UI View State
  const [isEditing, setIsEditing] = useState(false);

  // Profile form state
  const [displayName, setDisplayName] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Security form state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      setDisplayName(user?.user_metadata?.display_name || user?.user_metadata?.full_name || '');
      
      const loadProfileData = async () => {
        try {
          const [fetchedStats, fetchedBadges] = await Promise.all([
            getUserStats(),
            getMyBadges()
          ]);
          setStats(fetchedStats);
          setBadges(fetchedBadges);
        } catch (err) {
          console.error("Error loading profile data:", err);
        } finally {
          setFetchingStats(false);
        }
      };
      loadProfileData();
    }
  }, [isAuthenticated, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      showToast('El alias no puede estar vacío.', 'error');
      return;
    }
    setUpdatingProfile(true);
    try {
      await updateUserProfile({ display_name: displayName.trim() });
      
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName.trim() }
      });
      if (error) throw error;
      
      showToast('¡Perfil actualizado con éxito! 👤', 'success');
      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error al actualizar el perfil.', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      showToast('Ingresa una nueva contraseña.', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Las contraseñas no coinciden.', 'error');
      return;
    }
    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      showToast('¡Contraseña actualizada con éxito! 🔑', 'success');
      setPassword('');
      setConfirmPassword('');
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error al actualizar la contraseña.', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Spinner />
      </div>
    );
  }

  const profileName = displayName || user?.email?.split('@')[0] || 'Usuario';

  return (
    <AppLayout activeRoute="/profile">
      {/* Dynamic Header */}
      {!isEditing ? (
        <header className="page-header">
          <div>
            <div className="badge-slant" style={{ marginBottom: '0.5rem' }}><span>Mi Cuenta</span></div>
            <h1>MI <span className="text-accent">PERFIL</span></h1>
          </div>
          <button 
            onClick={() => setIsEditing(true)} 
            className="btn-secondary" 
            style={{ fontSize: '0.7rem', padding: '0.75rem 1.5rem' }}
          >
            EDITAR PERFIL
          </button>
        </header>
      ) : (
        <header className="page-header">
          <div>
            <div className="badge-slant" style={{ marginBottom: '0.5rem' }}><span>Configuración</span></div>
            <h1>EDITAR <span className="text-accent">PERFIL</span></h1>
          </div>
        </header>
      )}

      {/* Main Body */}
      {fetchingStats ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : !isEditing ? (
        /* ─── Profile View Mode (profile.html) ─── */
        <>
          <div className="profile-hero">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-wc-sky text-white flex items-center justify-center font-black text-4xl border-4 border-accent shadow-lg">
                {profileName.charAt(0).toUpperCase()}
              </div>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900 }}>{profileName}</h2>
            <p className="text-muted" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem', marginTop: '0.5rem' }}>
              PRO USER · {user?.email}
            </p>
            
            {/* Badges */}
            <div className="badge-grid">
              {badges.length === 0 ? (
                <div className="col-span-full text-center text-xs text-wc-white/40 font-semibold py-4">
                  Aún no tienes insignias desbloqueadas.
                </div>
              ) : (
                badges.map(b => (
                  <div key={b.id} className={`badge-item ${b.unlocked ? 'unlocked' : ''}`}>
                    <div className="badge-icon">{b.icon || '🎖️'}</div>
                    <span>{b.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="dashboard-columns" style={{ gridTemplateColumns: '1fr' }}>
            <div className="left-col" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Estadísticas de <span className="text-accent">Juego</span></h3>
              <div className="auto-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Aciertos Parciales</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>
                    {stats?.correct_predictions ?? 0}
                  </div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Aciertos Exactos</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--success)' }}>
                    {stats?.exact_predictions ?? 0}
                  </div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Puntos Totales</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent)' }}>
                    {stats?.total_points ?? 0}
                  </div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Efectividad</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>
                    {stats?.effectiveness ?? 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ─── Profile Edit Mode (edit-profile.html) ─── */
        <div className="edit-form-card">
          {/* General Profile Fields */}
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Alias / Nombre de Usuario</label>
              <input 
                type="text" 
                className="form-control" 
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                disabled={updatingProfile}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                className="form-control" 
                value={user?.email || ''} 
                disabled 
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={updatingProfile}
            >
              {updatingProfile ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </form>

          {/* Password update Fields */}
          <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Cambiar Contraseña</h3>
            <form onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label>Nueva Contraseña</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={updatingPassword}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirmar Nueva Contraseña</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={updatingPassword}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '1rem', background: 'var(--primary)' }}
                disabled={updatingPassword || !password || password !== confirmPassword}
              >
                {updatingPassword ? 'ACTUALIZANDO...' : 'ACTUALIZAR CONTRASEÑA'}
              </button>
            </form>
          </div>

          <button 
            type="button"
            onClick={() => setIsEditing(false)} 
            className="btn-secondary" 
            style={{ width: '100%', marginTop: '1.5rem', border: 'none' }}
          >
            CANCELAR
          </button>
        </div>
      )}
    </AppLayout>
  );
}
