"use client";
import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-wc-dark min-h-screen text-wc-white selection:bg-wc-sky selection:text-wc-dark">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-wc-white/40 hover:text-wc-sky mb-12 transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Volver al Inicio</span>
        </Link>

        <header className="mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-wc-card/50 border border-wc-border rounded-2xl text-wc-gold font-bold uppercase tracking-[0.2em] text-[11px] mb-6">
            <Shield size={16} />
            <span>Transparencia y Seguridad</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-800 tracking-tight leading-none uppercase mb-8">
            Política de <br/>
            <span className="text-transparent bg-clip-text bg-gold-gradient">Privacidad</span>
          </h1>
          <p className="text-wc-white/50 text-lg font-medium">
            Última actualización: 17 de mayo de 2026. Conforme a la Ley N° 19.628 y sus actualizaciones en la República de Chile.
          </p>
        </header>

        <div className="space-y-12 text-wc-white/80 leading-relaxed font-medium">
          {/* Section 1 */}
          <section className="bg-wc-card/30 border border-wc-border p-8 md:p-12 rounded-[2.5rem]">
            <div className="flex items-center gap-4 mb-6">
              <Eye className="text-wc-sky" size={24} />
              <h2 className="text-2xl font-display font-800 uppercase tracking-wide text-wc-white">1. Información que Recolectamos</h2>
            </div>
            <p className="mb-4">
              En <strong>Mundial 48</strong>, la privacidad de nuestros usuarios es fundamental. Recolectamos los datos mínimos necesarios para el funcionamiento de la plataforma de pronósticos:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-wc-white/60">
              <li><strong>Correo Electrónico:</strong> Utilizado exclusivamente para la autenticación sin contraseña (Magic Link) y comunicaciones críticas del sistema.</li>
              <li><strong>Nombre de Usuario:</strong> Un identificador elegido por usted para su perfil y tablas de posiciones.</li>
              <li><strong>Datos de Juego:</strong> Sus predicciones y participaciones en ligas.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="p-4 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <FileText className="text-wc-red" size={24} />
              <h2 className="text-2xl font-display font-800 uppercase tracking-wide text-wc-white">2. Finalidad del Tratamiento</h2>
            </div>
            <p>
              Sus datos personales son tratados con el fin de gestionar su participación en el juego, calcular puntuaciones de ligas privadas y asegurar la integridad de la competición. No realizamos perfiles comerciales ni vendemos su información a terceros.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-wc-card/30 border border-wc-border p-8 md:p-12 rounded-[2.5rem]">
            <div className="flex items-center gap-4 mb-6">
              <Lock className="text-wc-gold" size={24} />
              <h2 className="text-2xl font-display font-800 uppercase tracking-wide text-wc-white">3. Seguridad y Almacenamiento</h2>
            </div>
            <p className="mb-4">
              Utilizamos infraestructuras de clase mundial (Supabase y PostgreSQL) para el almacenamiento de datos. Implementamos medidas de seguridad técnicas y organizativas para proteger su información contra acceso no autorizado, pérdida o alteración.
            </p>
            <div className="p-4 bg-wc-blue/20 rounded-xl border border-wc-sky/20 text-sm text-wc-sky italic">
              Nota: En cumplimiento con la legislación chilena, sus datos se almacenan de forma segura y se conservarán únicamente mientras mantenga su cuenta activa o sea necesario para el propósito de la plataforma.
            </div>
          </section>

          {/* Section 4 */}
          <section className="p-4 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="text-wc-green" size={24} />
              <h2 className="text-2xl font-display font-800 uppercase tracking-wide text-wc-white">4. Derechos del Titular (Derechos ARCO)</h2>
            </div>
            <p className="mb-6">
              Usted tiene derecho a ejercer sus facultades consagradas en la Ley 19.628:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-wc-dark border border-wc-border rounded-2xl">
                <span className="block text-wc-gold font-bold mb-1">Acceso</span>
                <span className="text-xs text-wc-white/40">Conocer qué datos tenemos sobre usted.</span>
              </div>
              <div className="p-5 bg-wc-dark border border-wc-border rounded-2xl">
                <span className="block text-wc-gold font-bold mb-1">Rectificación</span>
                <span className="text-xs text-wc-white/40">Corregir datos inexactos o desactualizados.</span>
              </div>
              <div className="p-5 bg-wc-dark border border-wc-border rounded-2xl">
                <span className="block text-wc-gold font-bold mb-1">Cancelación</span>
                <span className="text-xs text-wc-white/40">Solicitar la eliminación de sus datos.</span>
              </div>
              <div className="p-5 bg-wc-dark border border-wc-border rounded-2xl">
                <span className="block text-wc-gold font-bold mb-1">Oposición</span>
                <span className="text-xs text-wc-white/40">Negarse al uso de sus datos para fines específicos.</span>
              </div>
            </div>
            <p className="mt-8">
              Para ejercer estos derechos, puede contactarnos a través de los canales oficiales de soporte de la plataforma.
            </p>
          </section>

          {/* Contact Section */}
          <section className="text-center pt-10 border-t border-wc-border/40">
            <p className="text-wc-white/40 text-sm mb-6 uppercase tracking-widest font-black">¿Dudas sobre su privacidad?</p>
            <p className="text-wc-white/60">
              Esta política es parte de nuestro compromiso con la transparencia en <strong>Mundial 48</strong>. Al utilizar nuestra plataforma, usted acepta el tratamiento de sus datos bajo estos términos.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
