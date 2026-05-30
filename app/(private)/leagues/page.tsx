"use client";
import React, { useState, useEffect } from 'react';
import { getMyLeagues, createLeague } from '@/services/leagueService';
import { League } from '@/types';
import Link from 'next/link';
import { Trophy, Plus, ChevronRight, Users, Calendar, Star, Sparkles, LayoutGrid, ArrowRight, X } from 'lucide-react';
import { MatchCarousel } from '@/components/tournament/MatchCarousel';
import { FeaturedMatch } from '@/components/match/FeaturedMatch';

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLeagueName, setNewLeagueName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const data = await getMyLeagues();
      setLeagues(data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newLeagueName.trim()) return;
    setCreating(true);
    try {
      await createLeague(newLeagueName);
      setNewLeagueName('');
      setIsModalOpen(false);
      fetchLeagues();
    } catch (error) {
      console.error('Error creating league:', error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-wc-sky/20 border-t-wc-sky rounded-full animate-spin"></div>
      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-wc-sky">Sincronizando Ligas...</p>
    </div>
  );

  return (
    <div className="animate-fade-up -mt-8 pb-20">
      <MatchCarousel />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FeaturedMatch />

        {/* Header Section Premium */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 opacity-0 animate-reveal" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-wc-sky/10 border border-wc-sky/20 rounded-full">
              <LayoutGrid size={14} className="text-wc-sky" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wc-sky">Arena de Competencia</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-800 text-wc-white uppercase tracking-tighter leading-none">Ligas Activas</h1>
            <p className="text-wc-white/40 font-medium text-lg max-w-xl">Únete o crea comunidades para competir por la gloria del Mundial 48.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative overflow-hidden bg-wc-white/5 hover:bg-wc-white/10 border border-wc-white/10 text-wc-white px-8 py-5 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-2xl"
          >
            <Plus size={20} className="text-wc-gold group-hover:rotate-90 transition-transform" />
            <span className="font-black text-[10px] tracking-[0.3em] uppercase">Nueva Competencia</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Columna Principal: Listado de Ligas */}
          <div className="lg:col-span-8">
            {leagues.length === 0 ? (
              <div className="opacity-0 animate-reveal" style={{ animationDelay: '0.2s' }}>
                <div className="relative p-12 md:p-20 text-center bg-wc-white/[0.02] border border-dashed border-wc-white/10 rounded-[3rem] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-wc-gold/5 to-transparent pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-gold-gradient rounded-[2rem] flex items-center justify-center shadow-glow-gold mb-10 transform -rotate-6">
                      <Trophy size={48} className="text-wc-dark" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-800 text-wc-white uppercase tracking-tighter mb-6">Comienza tu Legado</h2>
                    <p className="text-wc-white/40 text-lg md:text-xl max-w-md mx-auto mb-12 leading-relaxed">
                      No eres parte de ninguna liga todavía. Funda tu propia competencia e invita a tus amigos.
                    </p>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="group relative overflow-hidden bg-wc-red hover:bg-wc-red/90 text-wc-white px-10 py-5 rounded-2xl font-black text-xs tracking-[0.4em] shadow-glow-red transition-all flex items-center gap-4"
                    >
                      <div className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-[30deg] -translate-x-[200%] group-hover:animate-shine" />
                      <Plus size={22} /> CREAR MI PRIMERA LIGA
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {leagues.map((league, i) => (
                  <Link 
                    href={`/leagues/${league.id}`} 
                    key={league.id} 
                    className="group opacity-0 animate-reveal"
                    style={{ animationDelay: `${0.2 + (i * 0.1)}s` }}
                  >
                    <div className="h-full bg-wc-white/[0.03] backdrop-blur-xl border border-wc-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between hover:bg-wc-white/[0.07] hover:border-wc-sky/40 transition-all duration-500 shadow-xl group-hover:-translate-y-2">
                      <div className="space-y-8">
                        <div className="flex justify-between items-start">
                          <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-wc-dark/50 border border-wc-white/5 rounded-xl">
                              <span className="text-[10px] font-bold text-wc-sky tracking-widest uppercase">ID #{league.id}</span>
                            </div>
                            <div className="flex items-center gap-2 text-wc-white/30 ml-1">
                              <Users size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{league.members_count || 1} Jugadores</span>
                            </div>
                          </div>
                          <div className="w-14 h-14 bg-gold-gradient rounded-2xl flex items-center justify-center shadow-glow-gold group-hover:scale-110 transition-transform duration-500">
                            <Trophy size={26} className="text-wc-dark" />
                          </div>
                        </div>
                        <h3 className="text-3xl font-display font-800 text-wc-white uppercase tracking-tighter leading-[0.9] group-hover:text-wc-sky transition-colors">
                          {league.name}
                        </h3>
                      </div>
                      
                      <div className="mt-12 pt-8 border-t border-wc-white/5 flex justify-between items-center group-hover:border-wc-sky/20 transition-colors">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-wc-white/30 group-hover:text-wc-white transition-colors">Ver Clasificación</span>
                        <div className="w-10 h-10 bg-wc-white/5 rounded-full flex items-center justify-center group-hover:bg-wc-sky group-hover:text-wc-dark transition-all">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-8 opacity-0 animate-reveal" style={{ animationDelay: '0.4s' }}>
            <div className="bg-wc-white/[0.03] backdrop-blur-xl border border-wc-white/10 rounded-[2.5rem] p-8 shadow-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-wc-white/30 mb-8 flex items-center justify-between">
                Sistemas <Calendar size={14} className="text-wc-red" />
              </h3>
              <div className="space-y-4">
                <Link href="/matches" className="group block p-6 rounded-[1.5rem] bg-wc-white/[0.02] hover:bg-wc-white/[0.05] border border-wc-white/5 transition-all">
                  <span className="block text-[10px] font-bold text-wc-red uppercase tracking-widest mb-2">Sección</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-display font-800 text-wc-white uppercase tracking-tight">Calendario</span>
                    <ArrowRight size={18} className="text-wc-white/20 group-hover:text-wc-red group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
                <Link href="/results" className="group block p-6 rounded-[1.5rem] bg-wc-white/[0.02] hover:bg-wc-white/[0.05] border border-wc-white/5 transition-all">
                  <span className="block text-[10px] font-bold text-wc-sky uppercase tracking-widest mb-2">Sección</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-display font-800 text-wc-white uppercase tracking-tight">Resultados</span>
                    <ArrowRight size={18} className="text-wc-white/20 group-hover:text-wc-sky group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-wc-gold/10 to-transparent rounded-[2rem] p-8 border border-wc-gold/20 relative overflow-hidden">
              <Sparkles size={48} className="absolute -right-4 -bottom-4 text-wc-gold/10 rotate-12" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-wc-gold mb-4">Tip de Maestro</h3>
              <p className="text-sm text-wc-white/60 font-medium leading-relaxed">
                ¡Los puntos se actualizan en tiempo real! Asegúrate de tener tus pronósticos listos 15 minutos antes de cada pitazo inicial.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Creación "Deep Glass" */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-wc-dark/90 backdrop-blur-md px-4 p-4">
          <div className="bg-wc-white/[0.03] backdrop-blur-3xl rounded-[3rem] w-full max-w-lg overflow-hidden border border-wc-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-reveal">
            <div className="px-10 py-8 border-b border-wc-white/5 flex justify-between items-center bg-wc-white/[0.02]">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-wc-gold uppercase tracking-[0.4em]">Crear</span>
                <h3 className="text-3xl font-display font-800 uppercase tracking-tight text-wc-white leading-none">Nueva Liga</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-10 h-10 rounded-full bg-wc-white/5 flex items-center justify-center text-wc-white/40 hover:text-wc-white hover:bg-wc-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-10 space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-wc-white/30 ml-2">Nombre de la Competencia</label>
                <input 
                  type="text"
                  value={newLeagueName} 
                  onChange={(e) => setNewLeagueName(e.target.value)} 
                  placeholder="Ej: Los Expertos del Fútbol"
                  className="w-full p-6 bg-wc-dark/40 border border-wc-white/10 rounded-2xl text-xl font-bold text-wc-white focus:outline-none focus:border-wc-sky/50 focus:ring-4 focus:ring-wc-sky/5 transition-all placeholder:text-wc-white/10"
                />
              </div>
              
              <div className="bg-wc-sky/10 p-6 rounded-2xl border border-wc-sky/20 flex gap-5 items-center">
                <div className="w-12 h-12 rounded-xl bg-wc-sky/20 flex items-center justify-center shrink-0">
                  <Users size={24} className="text-wc-sky" />
                </div>
                <p className="text-sm text-wc-white/70 font-medium leading-snug">
                  Al fundar esta liga, podrás invitar a tus amigos mediante un código único de acceso.
                </p>
              </div>

              <div className="pt-4 flex flex-col gap-6">
                <button 
                  onClick={handleCreate} 
                  disabled={creating || !newLeagueName.trim()}
                  className="relative overflow-hidden w-full bg-wc-red hover:bg-wc-red/90 text-wc-white py-6 rounded-2xl font-black text-xs tracking-[0.4em] shadow-glow-red transition-all flex items-center justify-center gap-4 group"
                >
                  <div className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-[30deg] -translate-x-[200%] group-hover:animate-shine" />
                  <Trophy size={20} />
                  {creating ? 'FUNDANDO LIGA...' : 'FUNDAR MI LIGA'}
                </button>
                
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-[10px] font-black uppercase tracking-[0.4em] text-wc-white/20 hover:text-wc-white transition-colors py-2"
                >
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
