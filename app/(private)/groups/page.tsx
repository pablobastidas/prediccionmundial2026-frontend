"use client";
import React, { useEffect, useState } from 'react';
import { getGroupsWithTeams } from '@/services/tournamentService';
import { GroupsGrid } from '@/components/tournament/GroupsGrid';
import { Spinner } from '@/components/ui/Spinner';

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGroupsWithTeams().then(data => {
      setGroups(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Fase de Grupos</h1>
      <GroupsGrid data={groups} />
    </div>
  );
}
