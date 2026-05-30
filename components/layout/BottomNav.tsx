"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Calendar, Users, BarChart3 } from 'lucide-react';

export const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Ligas', icon: Trophy, href: '/leagues' },
    { label: 'Partidos', icon: Calendar, href: '/matches' },
    { label: 'Resultados', icon: BarChart3, href: '/results' },
    { label: 'Grupos', icon: Users, href: '/groups' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-wc-dark/95 backdrop-blur-xl border-t border-wc-border flex justify-around items-center h-20 px-2 z-[60] pb-safe shadow-card">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`flex flex-col items-center justify-center flex-1 transition-all duration-300 ${
              isActive ? 'text-wc-sky' : 'text-wc-white/50 hover:text-wc-white/80'
            }`}
          >
            <div className={`p-2 rounded-2xl transition-all ${isActive ? 'bg-wc-sky/10' : ''}`}>
              <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};
