"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
  const { isAuthenticated, signOut, user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="h-20 flex items-center px-4 md:px-8 bg-wc-dark/90 backdrop-blur-md border-b border-wc-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <Link href={isAuthenticated ? "/leagues" : "/"} className="flex items-center gap-2 group">
          <div className="bg-wc-sky px-2.5 py-1 rounded-lg text-[11px] font-black text-wc-dark italic tracking-tighter transition-all group-hover:-rotate-6 shadow-md">MUNDIAL</div>
          <span className="text-2xl font-black tracking-tighter text-wc-white">48</span>
        </Link>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link href="/me" className="hidden md:flex flex-col items-end group mr-2">
                <span className="text-[10px] font-bold text-wc-white/40 uppercase tracking-widest leading-none mb-1 group-hover:text-wc-sky transition-colors">Conectado como</span>
                <span className="text-sm font-bold text-wc-white truncate max-w-[150px] group-hover:text-wc-sky transition-colors">
                  {user?.user_metadata?.display_name || user?.email?.split('@')[0]}
                </span>
              </Link>
              <Link 
                href="/me"
                className="p-3 rounded-2xl bg-wc-card text-wc-white/70 hover:bg-wc-sky/20 hover:text-wc-sky transition-all border border-wc-border"
                title="Mi Perfil"
              >
                <UserIcon size={20} />
              </Link>
              <button 
                onClick={handleSignOut}
                className="p-3 rounded-2xl bg-wc-card text-wc-white/70 hover:bg-wc-red/20 hover:text-wc-red transition-all border border-wc-border"
                title="Cerrar Sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link href="/auth" className="text-xs font-bold uppercase tracking-widest bg-wc-red text-wc-white px-6 py-3 rounded-2xl hover:bg-wc-red/85 transition-all shadow-glow-red hover:shadow-card-hover">
              Acceder
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
