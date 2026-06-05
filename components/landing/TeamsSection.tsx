"use client";
import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import TeamCard, { Team } from './TeamCard';
import apiClient from '@/lib/apiClient';

const confederations = ['Todos', 'UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'];

export default function TeamsSection() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState('');
  const [confFilter, setConfFilter] = useState('Todos');
  const [selected, setSelected] = useState<Team | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/tournaments/current/teams')
      .then(res => {
        if (Array.isArray(res.data)) setTeams(res.data);
        else setTeams([]);
      })
      .catch(err => console.error("Error fetching teams:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = teams.filter((t) => {
    const matchSearch = (t.name || '').toLowerCase().includes(search.toLowerCase());
    const matchConf = confFilter === 'Todos' || t.confederation === confFilter;
    return matchSearch && matchConf;
  });

  if (loading && teams.length === 0) return null;

  return (
    <section id="teams" className="py-24 bg-wc-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-wc-sky text-xs font-black tracking-[0.3em] uppercase mb-3">Participantes del Sueño</p>
            <h2 className="font-display font-800 text-wc-white text-4xl sm:text-6xl leading-tight">
              Selecciones <span className="text-transparent bg-clip-text bg-gold-gradient">2026</span>
            </h2>
          </div>

          {/* Search + filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-80">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-wc-white/40" />
              <input
                type="text"
                placeholder="Buscar selección..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-wc-card border border-wc-border text-wc-white placeholder:text-wc-white/30 pl-11 pr-11 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-wc-sky transition-all shadow-inner"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-wc-white/40 hover:text-wc-white">
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border text-sm font-black uppercase tracking-widest transition-all ${
                showFilters ? 'bg-wc-sky text-wc-dark border-wc-sky shadow-glow-sky' : 'bg-wc-card border-wc-border text-wc-white/70 hover:border-wc-sky/50'
              }`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>
        </div>

        {/* Confederation filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 mb-10 animate-fade-up">
            {confederations.map((conf) => (
              <button
                key={conf}
                onClick={() => setConfFilter(conf)}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
                  confFilter === conf
                    ? 'bg-wc-sky text-wc-dark border-wc-sky'
                    : 'bg-wc-card border-wc-border text-wc-white/60 hover:border-wc-sky/40 hover:text-wc-white'
                }`}
              >
                {conf}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-wc-white/40 font-display text-2xl">
            No se encontraron equipos para "{search}".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                selected={selected?.id === team.id}
                onSelect={(t) => setSelected(selected?.id === t.id ? null : t)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
