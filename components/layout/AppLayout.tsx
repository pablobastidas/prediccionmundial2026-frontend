"use client";
import React from 'react';
import Link from 'next/link';
import LiveTicker from '@/components/LiveTicker';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
  activeRoute: string;
}

export default function AppLayout({ children, activeRoute }: AppLayoutProps) {
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <>
      <LiveTicker />
      <div className="app-layout">
        <aside className="sidebar">
          <Link href="/" className="logo">POLLA<span>MUNDIAL</span></Link>
          <nav className="sidebar-nav">
            <Link href="/home" className={activeRoute === '/home' ? 'active' : ''}><span>🏠</span> Inicio</Link>
            <Link href="/predictions" className={activeRoute === '/predictions' ? 'active' : ''}><span>🎯</span> Pronósticos</Link>
            <Link href="/simulator" className={activeRoute === '/simulator' ? 'active' : ''}><span>📊</span> Simulador</Link>
            <Link href="/leagues" className={activeRoute === '/leagues' ? 'active' : ''}><span>🏆</span> Ligas</Link>
            <Link href="/me" className={activeRoute === '/profile' || activeRoute === '/me' ? 'active' : ''}><span>👤</span> Perfil</Link>
            <a href="#" onClick={handleLogout} className="btn-logout"><span>🚪</span> SALIR</a>
          </nav>
        </aside>

        <main className="main-content">
          {children}

          <footer className="main-footer">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="logo">POLLA<span>MUNDIAL</span></div>
                <p>Tu plataforma Pro para el Mundial 2026. Compite, predice y gana con amigos y colegas de todo el mundo.</p>
              </div>
              <div className="footer-column">
                <h4>App</h4>
                <ul className="footer-links">
                  <li><Link href="/home">Dashboard</Link></li>
                  <li><Link href="/predictions">Mis Pronósticos</Link></li>
                  <li><Link href="/simulator">Simulador Mundial</Link></li>
                  <li><Link href="/leagues">Mis Ligas</Link></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Soporte</h4>
                <ul className="footer-links">
                  <li><Link href="/me">Mi Perfil</Link></li>
                  <li><Link href="/privacy">Privacidad</Link></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <div className="copyright">© 2026 PollaMundial Pro.</div>
            </div>
          </footer>
        </main>

        <nav className="mobile-nav-bar">
          <Link href="/home" className={activeRoute === '/home' ? 'active' : ''}>
            <span>🏠</span>
            <span>INICIO</span>        
          </Link>
          <Link href="/predictions" className={activeRoute === '/predictions' ? 'active' : ''}>
            <span>🎯</span>
            <span>POLLA</span>
          </Link>
          <Link href="/simulator" className={activeRoute === '/simulator' ? 'active' : ''}>
            <span>📊</span>
            <span>SIM</span>
          </Link>
          <Link href="/leagues" className={activeRoute === '/leagues' ? 'active' : ''}>
            <span>🏆</span>
            <span>LIGAS</span>
          </Link>
          <Link href="/me" className={activeRoute === '/profile' || activeRoute === '/me' ? 'active' : ''}>
            <span>👤</span>
            <span>PERFIL</span>        
          </Link>
        </nav>
      </div>
    </>
  );
}
