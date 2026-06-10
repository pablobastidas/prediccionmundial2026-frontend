"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layout/AppLayout';
import { Spinner } from '@/components/ui/Spinner';

export default function PrivacyPolicyPage() {
  const { isAuthenticated, loading } = useAuth();

  const privacyContent = (
    <div className="privacy-container">
      <header className="privacy-header">
        <div className="badge-slant" style={{ marginBottom: '1.5rem' }}><span>Ley 19.628</span></div>
        <h1>POLÍTICA DE <span className="text-accent">PRIVACIDAD</span></h1>
        <p style={{ marginTop: '1rem' }}>Última actualización: 6 de junio de 2026. Conforme a la legislación de la República de Chile.</p>
      </header>

      <section className="privacy-section">
        <h2>1. Responsable del Tratamiento</h2>
        <p>
          <strong>Desafío Mundial</strong> es un simulador recreativo de pronósticos deportivos para el Mundial United 2026. El tratamiento de los datos personales recopilados es responsabilidad de la administración interna de la plataforma ("El Responsable"), con domicilio en Santiago de Chile y correo electrónico oficial de contacto: <a href="mailto:privacidad@desafiomundial.cl" style={{ color: 'var(--primary)', fontWeight: 800 }}>privacidad@desafiomundial.cl</a>.
        </p>
        <p>
          Nos comprometemos a velar por el correcto tratamiento de la información bajo los principios de legalidad, finalidad, proporcionalidad, seguridad y confidencialidad.
        </p>
      </section>

      <section className="privacy-section">
        <h2>2. Datos Recolectados</h2>
        <p>
          Para garantizar el correcto funcionamiento del simulador y mantener la transparencia competitiva, recolectamos el mínimo conjunto de datos personales necesarios:
        </p>
        <ul>
          <li><strong>Correo Electrónico:</strong> Requerido para la autenticación sin contraseña (Magic Link) y envío de notificaciones críticas del juego.</li>
          <li><strong>Nombre de Usuario o Pseudónimo:</strong> Nombre público de libre elección para identificarse en las tablas de posiciones y ránkings de ligas.</li>
          <li><strong>Datos de Juego:</strong> Predicciones de resultados de partidos, puntajes acumulados y asignaciones a ligas públicas o privadas.</li>
        </ul>
        <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', fontStyle: 'italic' }}>
          * Desafío Mundial no recopila datos sensibles, datos de pago ni información financiera.
        </p>
      </section>

      <section className="privacy-section">
        <h2>3. Finalidad y Bases de Legitimación</h2>
        <p>
          Los datos se tratan exclusivamente con la finalidad de gestionar la participación del usuario en el desafío mundialista, calcular y comparar puntajes en ligas y asegurar la integridad de la competencia.
        </p>
        <p>
          La base legal que legitima el tratamiento de sus datos es:
        </p>
        <ul>
          <li><strong>El Consentimiento Expreso:</strong> Otorgado de forma libre e informada por usted al crear su cuenta de usuario y validar su Magic Link.</li>
          <li><strong>Ejecución del Servicio:</strong> El procesamiento técnico indispensable para cumplir con la simulación del juego y las interacciones dentro de las ligas asociadas.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>4. Almacenamiento y Transferencia Internacional</h2>
        <p>
          La infraestructura de base de datos está implementada sobre el proveedor tecnológico <strong>Supabase</strong> (PostgreSQL), el cual opera bajo estrictos estándares globales de seguridad física y digital (certificaciones SOC 2 y encriptación de datos en tránsito y reposo).
        </p>
        <div className="alert-box">
          <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
          <p>
            <strong>Información sobre transferencia de datos:</strong> En cumplimiento del estándar legal chileno, le informamos que los servidores de alojamiento de Supabase pueden encontrarse fuera del territorio nacional (como en los Estados Unidos). Nos aseguramos de utilizar proveedores que mantengan niveles adecuados de seguridad para resguardar su privacidad de forma equivalente a la legislación chilena.
          </p>
        </div>
      </section>

      <section className="privacy-section">
        <h2>5. Derechos ARCO y Revocación</h2>
        <p>
          Conforme a la Ley N° 19.628, usted goza de todos los derechos de control sobre sus datos personales, conocidos como Derechos ARCO, además de la facultad de revocar el consentimiento previamente otorgado:
        </p>
        <div className="arco-grid">
          <div className="arco-card">
            <h3>Acceso</h3>
            <p>Conocer qué datos personales suyos están siendo tratados en la plataforma.</p>
          </div>
          <div className="arco-card">
            <h3>Rectificación</h3>
            <p>Solicitar la modificación o corrección de sus datos inexactos o desactualizados.</p>
          </div>
          <div className="arco-card">
            <h3>Cancelación</h3>
            <p>Solicitar la eliminación completa de su registro de usuario y de todos sus datos históricos de juego.</p>
          </div>
          <div className="arco-card">
            <h3>Oposición</h3>
            <p>Negarse al tratamiento de sus datos personales para fines informativos o complementarios.</p>
          </div>
        </div>
        <div className="alert-box" style={{ borderColor: 'var(--accent)', borderLeftColor: 'var(--accent)' }}>
          <span style={{ fontSize: '1.2rem' }}>🔄</span>
          <p>
            <strong>Revocación del Consentimiento:</strong> Tiene derecho a revocar su autorización en cualquier momento. La revocación implicará la eliminación de su cuenta y cese del servicio, sin efectos retroactivos respecto a procesamientos previamente validados.
          </p>
        </div>
      </section>

      <section className="privacy-section">
        <h2>6. Procedimiento, Retención y Contacto</h2>
        <p>
          <strong>Cómo ejercer sus derechos:</strong> Para solicitar su información, modificar su nickname, revocar su consentimiento o solicitar la eliminación total (derecho a la cancelación de datos), envíe una comunicación desde el correo registrado en su cuenta a <a href="mailto:privacidad@desafiomundial.cl" style={{ color: 'var(--primary)', fontWeight: 800 }}>privacidad@desafiomundial.cl</a> con el asunto "Derechos ARCO Ley 19.628". Atenderemos su requerimiento en un plazo máximo de 10 días hábiles.
        </p>
        <p>
          <strong>Tiempo de retención:</strong> Los datos se conservarán de forma segura mientras mantenga su perfil activo. Tras el término de las actividades asociadas al Mundial United 2026 y cierre definitivo de la plataforma (máximo 30 días después de la finalización del torneo), todas las bases de datos de juego y accesos de usuarios serán eliminadas o anonimizadas de forma definitiva y segura.
        </p>
      </section>

      <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.5, fontSize: '0.8rem', fontWeight: 600 }}>
        <p>Compromiso de Transparencia Desafío Mundial Pro 2026</p>
      </div>
    </div>
  );

  const styleBlock = (
    <style dangerouslySetInnerHTML={{ __html: `
      .navbar {
        flex-direction: column;
        gap: 1rem;
        padding: 1.5rem 0;
      }
      @media (min-width: 768px) {
        .navbar {
          flex-direction: row;
          justify-content: space-between;
        }
      }
      
      /* Privacy content styles */
      .privacy-container {
        padding: 4rem 1.5rem;
        max-width: 900px;
        margin: 0 auto;
      }
      
      .privacy-header {
        margin-bottom: 4rem;
        text-align: center;
      }
      
      .privacy-header h1 {
        font-size: clamp(2rem, 6vw, 4rem);
        line-height: 1.0;
        margin-bottom: 1.5rem;
      }
      
      .privacy-header p {
        color: var(--fg-muted);
        font-weight: 500;
      }
      
      .privacy-section {
        background: var(--surface);
        border-radius: var(--radius-md);
        padding: 2.5rem;
        margin-bottom: 2.5rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow-sm);
      }
      
      .privacy-section h2 {
        font-size: 1.5rem;
        color: var(--accent);
        margin-bottom: 1.5rem;
        border-bottom: 2px solid var(--accent-soft);
        padding-bottom: 0.5rem;
      }
      
      .privacy-section p {
        margin-bottom: 1.25rem;
        line-height: 1.6;
        color: var(--fg);
      }
      
      .privacy-section ul {
        margin-bottom: 1.25rem;
        padding-left: 1.5rem;
      }
      
      .privacy-section li {
        margin-bottom: 0.5rem;
        line-height: 1.5;
      }
      
      .arco-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
      }
      
      .arco-card {
        background: var(--bg);
        border: 1px solid var(--border);
        padding: 1.25rem;
        border-radius: var(--radius-sm);
      }
      
      .arco-card h3 {
        font-size: 1rem;
        color: var(--primary);
        margin-bottom: 0.5rem;
        font-style: normal;
      }
      
      .arco-card p {
        font-size: 0.8rem;
        color: var(--fg-muted);
        margin-bottom: 0;
        line-height: 1.4;
      }
      
      .alert-box {
        background: var(--primary-soft);
        border-left: 4px solid var(--primary);
        padding: 1.25rem;
        border-radius: var(--radius-sm);
        margin-top: 1.5rem;
        display: flex;
        gap: 1rem;
        align-items: flex-start;
      }
      
      .alert-box p {
        font-size: 0.85rem;
        margin-bottom: 0;
        color: var(--fg);
      }
    `}} />
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <Spinner />
      </div>
    );
  }

  // Public visitor layout
  return (
    <>
      {styleBlock}

      {/* Header / Navbar */}
      <div style={{ width: '100%', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <nav className="navbar container flex">
          <div className="logo">DESAFÍO<span>MUNDIAL</span></div>
          <div className="nav-links flex" style={{ gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/#grupos" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Grupos</Link>
            <Link href="/#sedes" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Sedes</Link>
            <Link href="/simulator-public" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Simulador</Link>
            <div className="flex" style={{ gap: '0.75rem' }}>
              {isAuthenticated ? (
                <Link href="/home" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.7rem', borderRadius: '99px' }}>Mi Panel</Link>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.7rem', borderRadius: '99px' }}>Entrar</Link>
                  <Link href="/register" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.7rem', borderRadius: '99px' }}>Unirse</Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main style={{ width: '100%', overflow: 'hidden', background: 'var(--bg)' }}>
        {privacyContent}
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">DESAFÍO<span>MUNDIAL</span></div>
              <p>La plataforma oficial de predicciones para el Mundial 2026. Vive la emoción del fútbol, compite con amigos y gana premios increíbles.</p>
              <div className="footer-socials">
                <a href="#" className="social-link">𝕏</a>
                <a href="#" className="social-link">IG</a>
                <a href="#" className="social-link">FB</a>
                <a href="#" className="social-link">YT</a>
              </div>
            </div>
            
            <div className="footer-column">
              <h4>Torneo</h4>
              <ul className="footer-links">
                <li><Link href="/#grupos">Grupos</Link></li>
                <li><Link href="/#sedes">Sedes y Estadios</Link></li>
                <li><Link href="/simulator-public">Simulador de Llaves</Link></li>
                <li><a href="#">Calendario</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Comunidad</h4>
              <ul className="footer-links">
                <li><Link href="/explore-leagues">Explorar Ligas</Link></li>
                <li><Link href="/leagues">Rankings Globales</Link></li>
                <li><Link href="/register">Crear Cuenta</Link></li>
                <li><a href="#">Ayuda y Soporte</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Sedes 2026</h4>
              <ul className="footer-links">
                <li><a href="#">México (Azteca, Monterrey)</a></li>
                <li><a href="#">USA (New York, LA, Miami)</a></li>
                <li><a href="#">Canadá (Toronto, Vancouver)</a></li>
                <li><a href="#">Guía del Viajero</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="copyright">© 2026 Desafío Mundial. Todos los derechos reservados.</div>
            <div className="footer-legal">
              <Link href="/terms">Términos</Link>
              <Link href="/privacy">Privacidad</Link>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
