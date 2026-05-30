"use client";
import { Calendar, MapPin, ChevronDown, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-wc-dark">
      {/* Capa de Ruido Táctil */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Mesh Gradient Dinámico */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[70%] h-[70%] rounded-full bg-wc-red/20 blur-[120px] animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-wc-sky/15 blur-[100px] animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-wc-green/10 blur-[100px] animate-float" style={{ animationDelay: '-4s' }} />
      </div>

      {/* Imagen de fondo con overlay */}
      <div
        className="absolute inset-0 opacity-10 grayscale"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-wc-dark via-transparent to-wc-dark" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 text-center">
        
        {/* Badge */}
        <div className="opacity-0 animate-reveal" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 bg-wc-gold/10 backdrop-blur-md border border-wc-gold/20 text-wc-gold text-[10px] font-bold px-4 py-1.5 rounded-full mb-10 tracking-[0.3em] uppercase">
            <Sparkles size={12} />
            <span>Mundial United 2026</span>
          </div>
        </div>

        {/* Título Principal */}
        <div className="opacity-0 animate-reveal" style={{ animationDelay: '0.2s' }}>
          <h1 className="font-display font-900 text-wc-white text-7xl sm:text-9xl md:text-[11rem] leading-[0.8] tracking-tighter mb-6 drop-shadow-2xl">
            MUNDIAL
            <br />
            <span className="text-transparent bg-clip-text bg-gold-gradient">48</span>
          </h1>
        </div>

        {/* Subtítulo */}
        <div className="opacity-0 animate-reveal" style={{ animationDelay: '0.3s' }}>
          <p className="font-display text-wc-white/40 text-xl sm:text-2xl font-600 tracking-[0.6em] mb-14 uppercase">
            USA <span className="text-wc-sky">•</span> CANADA <span className="text-wc-sky">•</span> MEXICO
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-20 opacity-0 animate-reveal" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/auth"
            className="relative overflow-hidden group bg-wc-red text-wc-white font-900 px-10 py-5 rounded-2xl transition-all duration-500 shadow-[0_0_40px_rgba(200,16,46,0.2)] hover:shadow-[0_0_60px_rgba(200,16,46,0.4)] hover:scale-105 active:scale-95 text-lg flex items-center gap-3"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-[30deg] -translate-x-[200%] group-hover:animate-shine" />
            <Trophy size={22} className="group-hover:rotate-12 transition-transform duration-500" />
            <span className="tracking-tight uppercase">Jugar Ahora</span>
          </Link>
          
          <a
            href="#groups"
            className="relative overflow-hidden group bg-wc-white/5 hover:bg-wc-white/10 backdrop-blur-md border border-wc-white/10 text-wc-white/80 hover:text-wc-white font-bold px-10 py-5 rounded-2xl transition-all duration-300 text-lg flex items-center gap-3"
          >
            <span>Calendario</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Stats compactas */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto opacity-0 animate-reveal" style={{ animationDelay: '0.5s' }}>
          {[
            { value: '48', label: 'Equipos', accent: 'bg-wc-gold' },
            { value: '104', label: 'Partidos', accent: 'bg-wc-red' },
            { value: '16', label: 'Sedes', accent: 'bg-wc-sky' },
          ].map((stat) => (
            <div key={stat.label} className="relative group p-4 sm:p-6 text-center">
              <div className="font-display font-800 text-wc-white text-3xl sm:text-5xl mb-1">{stat.value}</div>
              <div className="text-wc-white/30 text-[10px] uppercase font-bold tracking-widest">{stat.label}</div>
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] ${stat.accent} group-hover:w-1/2 transition-all duration-500`} />
            </div>
          ))}
        </div>
      </div>

      {/* Botón de exploración hacia abajo */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center opacity-0 animate-reveal" style={{ animationDelay: '1s' }}>
        <a href="#groups" className="flex flex-col items-center gap-2 text-wc-white/20 hover:text-wc-gold transition-colors group">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Explorar</span>
          <ChevronDown size={20} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
}
