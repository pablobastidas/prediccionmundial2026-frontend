import React from 'react';
import { Team } from '@/types';

export const TeamCard: React.FC<{ team: Team }> = ({ team }) => {
  return (
    <div className="bg-white flex flex-col items-center p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <span className="text-5xl mb-3">{team.flag_emoji}</span>
      <h3 className="font-bold text-gray-900 text-center">{team.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{team.code}</p>
    </div>
  );
};
