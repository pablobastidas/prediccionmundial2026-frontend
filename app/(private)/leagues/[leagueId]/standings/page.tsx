"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { LeagueStandings } from '@/components/league/LeagueStandings';

export default function StandingsPage() {
  const { leagueId } = useParams();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Posiciones</h1>
      <LeagueStandings leagueId={Number(leagueId)} />
    </div>
  );
}
