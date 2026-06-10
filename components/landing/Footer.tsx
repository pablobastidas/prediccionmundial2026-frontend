"use client";
import { Trophy, Github, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-wc-dark border-t border-wc-border py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href={isAuthenticated ? "/leagues" : "/"} className="flex items-center gap-2 mb-6 group">
              <span className="bg-gold-gradient p-2 rounded-lg shadow-glow-gold group-hover:scale-110 transition-transform">
                <Trophy size={20} className="text-wc-dark" />
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-display font-800 text-wc-white text-lg tracking-wide uppercase">DESAFÍO MUNDIAL</span>
                <span className="font-display text-wc-gold text-xs tracking-[0.2em] font-600">UNITED 2026</span>
              </div>
            </Link>
            <p className="text-wc-white/40 text-sm leading-relaxed font-medium">
              Vive la emoción del Mundial 2026 prediciendo resultados y compitiendo con tus amigos en ligas privadas de élite.
            </p>
          </div>

          <div>
            <h4 className="font-display font-700 text-wc-white text-sm uppercase tracking-widest mb-6">Plataforma</h4>
            <ul className="space-y-4">
              <li><Link href={isAuthenticated ? "/leagues" : "/auth"} className="text-wc-white/40 hover:text-wc-sky transition-colors text-sm font-semibold">Jugar Ahora</Link></li>
              <li><Link href={isAuthenticated ? "/leagues" : "/"} className="text-wc-white/40 hover:text-wc-sky transition-colors text-sm font-semibold">Mis Ligas</Link></li>
              <li><Link href={isAuthenticated ? "/matches" : "/"} className="text-wc-white/40 hover:text-wc-sky transition-colors text-sm font-semibold">Predicciones</Link></li>
              <li><Link href={isAuthenticated ? "/results" : "/"} className="text-wc-white/40 hover:text-wc-sky transition-colors text-sm font-semibold">Ranking Global</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-700 text-wc-white text-sm uppercase tracking-widest mb-6">Mundial 2026</h4>
            <ul className="space-y-4">
              <li>
                {isAuthenticated ? (
                  <Link href="/groups" className="text-wc-white/40 hover:text-wc-sky transition-colors text-sm font-semibold">Fase de Grupos</Link>
                ) : (
                  <a href="/#groups" className="text-wc-white/40 hover:text-wc-sky transition-colors text-sm font-semibold">Fase de Grupos</a>
                )}
              </li>
              <li>
                {isAuthenticated ? (
                  <Link href="/matches" className="text-wc-white/40 hover:text-wc-sky transition-colors text-sm font-semibold">Calendario</Link>
                ) : (
                  <a href="/#matches" className="text-wc-white/40 hover:text-wc-sky transition-colors text-sm font-semibold">Calendario</a>
                )}
              </li>
              <li>
                {isAuthenticated ? (
                  <Link href="/teams" className="text-wc-white/40 hover:text-wc-sky transition-colors text-sm font-semibold">Selecciones</Link>
                ) : (
                  <a href="/#teams" className="text-wc-white/40 hover:text-wc-sky transition-colors text-sm font-semibold">Selecciones</a>
                )}
              </li>
              <li>
                {isAuthenticated ? (
                  <Link href="/leagues" className="text-wc-white/40 hover:text-wc-sky transition-colors text-sm font-semibold">Sedes Oficiales</Link>
                ) : (
                  <a href="/#venues" className="text-wc-white/40 hover:text-wc-sky transition-colors text-sm font-semibold">Sedes Oficiales</a>
                )}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-700 text-wc-white text-sm uppercase tracking-widest mb-6">Síguenos</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-wc-card border border-wc-border flex items-center justify-center text-wc-white/60 hover:text-wc-sky hover:border-wc-sky/40 transition-all"><Twitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-xl bg-wc-card border border-wc-border flex items-center justify-center text-wc-white/60 hover:text-wc-sky hover:border-wc-sky/40 transition-all"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-xl bg-wc-card border border-wc-border flex items-center justify-center text-wc-white/60 hover:text-wc-sky hover:border-wc-sky/40 transition-all"><Github size={18} /></a>
            </div>
            <div className="mt-8 pt-8 border-t border-wc-border">
              <span className="text-[10px] font-black uppercase text-wc-gold tracking-[0.4em]">Experiencia Premium</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-wc-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-wc-white/20 text-xs font-semibold uppercase tracking-widest">
            © 2026 Desafío Mundial. No oficial. Sin relación con FIFA.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-wc-white/20 hover:text-wc-white/40 text-[10px] font-black uppercase tracking-widest transition-colors">Privacidad</Link>
            <Link href="/terms" className="text-wc-white/20 hover:text-wc-white/40 text-[10px] font-black uppercase tracking-widest transition-colors">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
