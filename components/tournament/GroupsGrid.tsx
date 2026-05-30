import React from 'react';
import { Team } from '@/types';

export const GroupsGrid: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {data.map((groupData) => (
        <div key={groupData.id} className="bg-white rounded-[2rem] shadow-soft border-2 border-[#F1F5F9] overflow-hidden">
          <div className="bg-[#6366F1] text-white font-black uppercase tracking-widest py-4 px-8 text-[11px]">
            Grupo {groupData.name}
          </div>
          <ul className="divide-y divide-[#F1F5F9]">
            {groupData.teams.map((t: Team, idx: number) => (
              <li key={t.id} className="flex items-center px-8 py-5 hover:bg-[#F8FAFC] transition-colors">
                <span className="w-8 text-[#94A3B8] font-black text-xs">0{idx + 1}</span>
                <span className="text-3xl mr-5 filter drop-shadow-sm">{t.flag_emoji}</span>
                <span className="font-black uppercase tracking-tight text-[#0F172A] text-base">{t.name}</span>
                <span className="ml-auto text-[11px] font-black text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-lg">{t.code}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
