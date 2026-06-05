"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { createLeague } from '@/services/leagueService';
import AppLayout from '@/components/layout/AppLayout';
import { Spinner } from '@/components/ui/Spinner';
import { showToast } from '@/components/ui/Toast';

export default function CreateLeaguePage() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    description: '',
    is_public: false,
    max_members: 20,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'El nombre de la liga es obligatorio.';
    if (form.name.trim().length < 3) newErrors.name = 'El nombre debe tener al menos 3 caracteres.';
    if (form.max_members < 2 || form.max_members > 100)
      newErrors.max_members = 'El máximo de miembros debe estar entre 2 y 100.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await createLeague({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        is_public: form.is_public,
        max_members: form.max_members,
      });
      showToast('¡Liga creada exitosamente! 🏆', 'success');
      router.push('/leagues');
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Error al crear la liga. Intenta nuevamente.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Spinner />
      </div>
    );
  }

  return (
    <AppLayout activeRoute="/leagues">
      {/* Page Header */}
      <header className="page-header">
        <div>
          <div className="badge-slant" style={{ marginBottom: '0.5rem' }}><span>Manager</span></div>
          <h1>CREAR <span className="text-accent">NUEVA LIGA</span></h1>
        </div>
        <Link href="/leagues" className="btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.8rem' }}>
          CANCELAR
        </Link>
      </header>

      {/* Form Card */}
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="auto-grid" style={{ marginBottom: '1.5rem' }}>
            {/* League Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.6 }}>
                Nombre de la Liga *
              </label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Ej: Amigos FC"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                maxLength={60}
                required
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.name}</p>
              )}
            </div>

            {/* Type of Access */}
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.6 }}>
                Tipo de Acceso
              </label>
              <select
                className="form-control"
                value={form.is_public ? 'public' : 'private'}
                onChange={e => setForm(f => ({ ...f, is_public: e.target.value === 'public' }))}
              >
                <option value="private">Privada (Con Código)</option>
                <option value="public">Pública (Abierta)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.6 }}>
              Descripción / Premios
            </label>
            <textarea
              className="form-control resize-none"
              rows={4}
              placeholder="Describe los premios o reglas de tu liga..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              maxLength={200}
            />
            <p className="mt-1 text-right text-xs text-wc-white/30">{form.description.length}/200</p>
          </div>

          {/* Max Members */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.6 }}>
              Máximo de Participantes
            </label>
            <input
              type="number"
              min={2}
              max={100}
              className={`form-control ${errors.max_members ? 'border-red-500' : ''}`}
              value={form.max_members}
              onChange={e => setForm(f => ({ ...f, max_members: parseInt(e.target.value) || 20 }))}
              required
            />
            {errors.max_members && (
              <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.max_members}</p>
            )}
            <p className="mt-1.5 text-xs text-wc-white/40">Entre 2 y 100 participantes.</p>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%' }}
            disabled={submitting}
          >
            {submitting ? 'CREANDO...' : 'CREAR MI LIGA AHORA'}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
