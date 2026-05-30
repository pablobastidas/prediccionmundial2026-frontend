"use client";
import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/api';
import { TeamCard } from '@/components/tournament/TeamCard';
import { Team } from '@/types';
import { Spinner } from '@/components/ui/Spinner';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/tournaments/current/teams').then(({ data }) => {
      setTeams(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Selecciones</h1>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {teams.map(t => <TeamCard key={t.id} team={t} />)}
      </div>
    </div>
  );
}
