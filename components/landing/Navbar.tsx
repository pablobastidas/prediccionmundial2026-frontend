"use client";
import { useState, useEffect } from 'react';
import { Menu, X, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { label: 'Grupos', href: '#groups' },
  { label: 'Partidos', href: '#matches' },
  { label: 'Equipos', href: '#teams' },
  { label: 'Sedes', href: '#venues' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-wc-dark/95 backdrop-blur-md shadow-card' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href={isAuthenticated ? "/leagues" : "/"} className="flex items-center gap-2 group">
          <span className="bg-gold-gradient p-2 rounded-lg shadow-glow-gold group-hover:scale-110 transition-transform">
            <Trophy size={20} className="text-wc-dark" />
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-display font-800 text-wc-white text-lg tracking-wide">DESAFÍO MUNDIAL</span>
            <span className="font-display text-wc-gold text-xs tracking-[0.2em] font-600">UNITED 2026</span>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-4 py-2 rounded-lg text-wc-white/80 hover:text-wc-white hover:bg-wc-muted font-medium text-sm tracking-wide transition-all duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#matches"
            className="inline-flex items-center gap-2 text-wc-white/80 hover:text-wc-white font-semibold text-sm px-4 py-2 transition-all duration-200"
          >
            Calendario
          </a>
          <Link
            href={isAuthenticated ? "/leagues" : "/auth"}
            className="inline-flex items-center gap-2 bg-wc-red hover:bg-wc-red/80 text-wc-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all duration-200 shadow-glow-red hover:shadow-card-hover"
          >
            {isAuthenticated ? "Ir a Predicciones" : "Jugar Ahora"}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg text-wc-white hover:bg-wc-muted transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-wc-dark/98 backdrop-blur-md ${
          open ? 'max-h-80 border-t border-wc-border' : 'max-h-0'
        }`}
      >
        <ul className="px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-lg text-wc-white/80 hover:text-wc-white hover:bg-wc-muted font-medium tracking-wide transition-all duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-4">
            <Link
              href={isAuthenticated ? "/leagues" : "/auth"}
              onClick={() => setOpen(false)}
              className="block text-center bg-wc-red hover:bg-wc-red/80 text-wc-white font-semibold px-5 py-4 rounded-xl transition-all duration-200"
            >
              {isAuthenticated ? "Ir al Desafío" : "Jugar Ahora"}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
