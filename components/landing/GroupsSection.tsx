"use client";
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

interface TeamInfo {
  id: number;
  name: string;
  code: string;
  flag_emoji: string;
  ranking: number;
  is_star: boolean;
}

interface GroupInfo {
  id: number;
  name: string;
  teams: TeamInfo[];
}

export default function GroupsSection() {
  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get('/tournaments/current/groups')
      .then(res => {
        if (Array.isArray(res.data)) {
          setGroups(res.data);
        } else {
          setGroups([]);
        }
      })
      .catch(err => {
        console.error("Error fetching groups:", err);
        setError("No se pudieron cargar los grupos.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="py-20 text-center bg-wc-dark">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wc-gold mx-auto"></div>
    </div>
  );

  if (error) return (
    <div className="py-20 text-center bg-wc-dark text-wc-white/60">
      <p>{error}</p>
    </div>
  );

  return (
    <section id="groups" className="py-24 bg-gradient-to-b from-wc-dark to-wc-dark/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-wc-sky text-xs font-black tracking-[0.3em] uppercase mb-3">La Gran Clasificación</p>
          <h2 className="font-display font-800 text-wc-white text-4xl sm:text-6xl leading-tight">
            Los <span className="text-transparent bg-clip-text bg-gold-gradient">Grupos</span>
          </h2>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-10 text-wc-white/20 italic">
            No hay grupos configurados para este torneo aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groups.map((group) => (
              <div key={group.id} className="bg-card-gradient border border-wc-border rounded-[1.5rem] overflow-hidden hover:border-wc-gold/30 transition-all duration-500 hover:shadow-card group">
                <div className="bg-wc-blue px-6 py-4 flex items-center justify-between border-b border-wc-border/50">
                  <span className="font-display font-800 text-wc-white text-2xl tracking-tight">
                    {group.name}
                  </span>
                  <span className="text-[10px] bg-wc-white/10 text-wc-white/60 px-2 py-1 rounded-md font-bold uppercase tracking-tighter">
                    {group.teams.length} Selecciones
                  </span>
                </div>

                <div className="divide-y divide-wc-border/30">
                  {group.teams.map((team, i) => (
                    <div key={team.id} className="flex items-center gap-4 px-6 py-4 hover:bg-wc-muted/20 transition-colors">
                      <span className="text-wc-white/20 text-xs w-4 font-black">{i + 1}</span>
                      <span className="text-3xl">{team.flag_emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-wc-white text-base truncate tracking-tight">{team.name}</div>
                        <div className="text-wc-white/40 text-[10px] font-bold uppercase tracking-widest">Ranking #{team.ranking}</div>
                      </div>
                      {team.is_star && (
                        <div className="w-2 h-2 rounded-full bg-wc-gold shadow-glow-gold" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
