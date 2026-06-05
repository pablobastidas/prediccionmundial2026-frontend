"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
        // Filter by status codes: 'IN_PROGRESS' and 'PENDING'
        const liveOrUpcoming = matches
          .filter(m => m.status === 'IN_PROGRESS' || m.status === 'PENDING')
          .slice(0, 6);

        const items: TickerItem[] = liveOrUpcoming.map(m => {
          const home = m.home_team ? m.home_team.name : (m.home_placeholder || 'TBD');
          const away = m.away_team ? m.away_team.name : (m.away_placeholder || 'TBD');
          if (m.status === 'IN_PROGRESS') {
            const hg = m.result?.home_goals ?? 0;
            const ag = m.result?.away_goals ?? 0;
            return { live: true, text: `⚽ ${home.toUpperCase()} ${hg} - ${ag} ${away.toUpperCase()} ⚡ EN VIVO` };
          }
          const date = new Date(m.match_datetime);
          const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          const dateStr = date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
          return { live: false, text: `🏆 PRÓXIMO: ${home.toUpperCase()} VS ${away.toUpperCase()} (${dateStr} ${time})` };
        });

        setTickerItems(items.length > 0 ? items : [{ live: false, text: '🏆 MUNDIAL 2026 — PRONOSTICA TODOS LOS PARTIDOS AHORA' }]);
      } catch {
        setTickerItems([{ live: false, text: '🏆 MUNDIAL 2026 — PRONOSTICA TODOS LOS PARTIDOS AHORA' }]);
      }
    };

    fetchMatches();

    const intervalId = setInterval(fetchMatches, 60000);
    return () => clearInterval(intervalId);
  }, []);

  if (tickerItems.length === 0) return null;

  // Duplicate items to create seamless infinite loop
  const doubledItems = [...tickerItems, ...tickerItems];

  return (
    <Link href="/predictions" style={{ textDecoration: 'none', display: 'block' }}>
      <div className="ticker-wrap" style={{ cursor: 'pointer' }}>
        <div className="ticker">
          {doubledItems.map((item, i) => (
            <div key={i} className="ticker-item">
              {item.live && <span className="live-dot"></span>}
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
