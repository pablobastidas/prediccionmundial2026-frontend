"use client";
import React, { useEffect, useState } from 'react';
import { getAllMatches } from '@/services/matchService';

interface TickerItem {
  live: boolean;
  text: string;
}

export default function LiveTicker() {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matches = await getAllMatches();
        // Filter by the actual uppercase status codes from backend: 'IN_PROGRESS' and 'PENDING'
        const liveOrUpcoming = matches
          .filter(m => m.status === 'IN_PROGRESS' || m.status === 'PENDING')
          .slice(0, 6);

        const items: TickerItem[] = liveOrUpcoming.map(m => {
          const home = m.home_team ? m.home_team.name : (m.home_placeholder || 'TBD');
          const away = m.away_team ? m.away_team.name : (m.away_placeholder || 'TBD');
          if (m.status === 'IN_PROGRESS') {
            const hg = m.result?.home_goals ?? 0;
            const ag = m.result?.away_goals ?? 0;
            return { live: true, text: `${home.toUpperCase()} ${hg} - ${ag} ${away.toUpperCase()}` };
          }
          const date = new Date(m.match_datetime);
          const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          return { live: false, text: `PRÓXIMO: ${home.toUpperCase()} VS ${away.toUpperCase()} (${time})` };
        });

        setTickerItems(items.length > 0 ? items : [{ live: false, text: 'MUNDIAL 2026 — PARTIDOS PRÓXIMAMENTE' }]);
      } catch {
        setTickerItems([{ live: false, text: 'MUNDIAL 2026 — PARTIDOS PRÓXIMAMENTE' }]);
      }
    };
    fetchMatches();
  }, []);

  if (tickerItems.length === 0) return null;

  // Duplicate items to create seamless infinite loop
  const doubledItems = [...tickerItems, ...tickerItems];

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {doubledItems.map((item, i) => (
          <div key={i} className="ticker-item">
            {item.live && <span className="live-dot"></span>}
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}
