"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layout/AppLayout';
import { Spinner } from '@/components/ui/Spinner';

export default function TermsPage() {
  const { isAuthenticated, loading } = useAuth();

  const termsContent = (
    <div className="privacy-container">
      <header className="privacy-header">
        <div className="badge-slant" style={{ marginBottom: '1.5rem' }}><span>Condiciones</span></div>
        <h1>TÉRMINOS Y <span className="text-accent">CONDICIONES</span></h1>
        <p style={{ marginTop: '1rem' }}>Última actualización: 6 de junio de 2026. Conforme a las leyes de la República de Chile.</p>
      </header>

      <section className="privacy-section">
        <h2>1. Aceptación de los Términos</h2>
        <p>
          Al registrarse, acceder o utilizar la plataforma <strong>Desafío Mundial 2026</strong>, usted manifiesta su consentimiento y aceptación expresa de los presentes Términos y Condiciones de Uso. Si no está de acuerdo con estas condiciones, deberá abstenerse de interactuar con el sitio y solicitar la eliminación de su cuenta.
        </p>
      </section>

      <section className="privacy-section">
        <h2>2. Naturaleza Recreativa (Sin Apuestas Reales)</h2>
        <p>
          Esta plataforma es de carácter estrictamente <strong>recreativo, lúdico y de simulación deportiva</strong>. 
        </p>
        <p>
          Desafío Mundial no es una casa de apuestas online, no recauda dinero para apuestas, ni gestiona transacciones de azar. Todo el sistema de puntuaciones y rankings virtuales es meramente simulado. Cualquier acuerdo de premios, dinero o transacciones de valor realizado de forma externa en ligas privadas es de exclusiva responsabilidad de los organizadores y participantes de dicha liga, quedando la administración de Desafío Mundial totalmente al margen de ello.
        </p>
      </section>

      <section className="privacy-section">
        <h2>3. Registro de Cuentas y Elegibilidad</h2>
        <p>
          Para registrarse, el usuario debe ingresar un correo electrónico válido a través del sistema Magic Link. Cada persona natural tiene permitido registrar una única cuenta. El uso de múltiples cuentas para alterar el ranking global o la competitividad dentro de las ligas dará lugar a la descalificación inmediata y eliminación de los perfiles asociados sin previo aviso.
        </p>
      </section>

      <section className="privacy-section">
        <h2>4. Reglas del Juego y Cierre de Pronósticos</h2>
        <p>
          Los pronósticos de resultados están sujetos a las siguientes restricciones:
        </p>
        <ul>
          <li><strong>Cierre de Pronósticos:</strong> El ingreso o modificación de marcadores para cualquier partido se bloquea automáticamente al inicio oficial del respectivo encuentro.</li>
          <li><strong>Cierre de Grupos:</strong> La selección de clasificados a fases eliminatorias se bloquea al inicio del primer partido de la última fecha de la fase de grupos.</li>
          <li><strong>Resultado Válido:</strong> Las predicciones de marcadores se calculan en base al resultado oficial tras los 90 minutos reglamentarios de juego más el tiempo de descuento (tiempo agregado por el árbitro). No se consideran prórrogas (tiempos extras) ni definiciones por penales para el cálculo de puntajes en partidos específicos de eliminación directa, a menos que la plataforma indique explícitamente lo contrario.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>5. Propiedad Intelectual y Exención de Relación Oficial</h2>
        <p>
          La plataforma Desafío Mundial es un sitio independiente desarrollado para fanáticos del fútbol. Los nombres de selecciones nacionales, banderas, estadios y marcas registradas de la FIFA o del Mundial United 2026 son propiedad de sus respectivos owners y se mencionan exclusivamente con fines ilustrativos y referenciales. Este sitio no está afiliado, patrocinado, respaldado ni asociado oficialmente de ninguna manera con la FIFA ni con las federaciones nacionales de fútbol.
        </p>
      </section>

      <section className="privacy-section">
        <h2>6. Limitación de Responsabilidad</h2>
        <p>
          La administración de la plataforma realiza sus mejores esfuerzos para garantizar la estabilidad técnica del servicio. Sin embargo, no nos hacemos responsables por fallas en la conexión, caídas de servidor fortuitas o de fuerza mayor, errores de sincronización con la API de resultados, ni por la pérdida de datos de pronósticos debido a problemas técnicos externos. Asimismo, nos reservamos el derecho de suspender o descontinuar el servicio en cualquier momento.
        </p>
      </section>

      <section className="privacy-section">
        <h2>7. Ley Aplicable y Jurisdicción</h2>
        <p>
          Estos términos se rigen en su totalidad por las leyes vigentes de la República de Chile. Para cualquier controversia, reclamo o disputa legal derivada de la interpretación o ejecución de las presentes condiciones de uso, las partes fijan su domicilio en la ciudad de Santiago de Chile y se someten a la competencia de sus tribunales ordinarios de justicia.
        </p>
      </section>

      <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.5, fontSize: '0.8rem', fontWeight: 600 }}>
        <p>Términos de Servicio Desafío Mundial Pro 2026</p>
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
        {termsContent}
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
              </ul>
            </div>

            <div className="footer-column">
              <h4>Comunidad</h4>
              <ul className="footer-links">
                <li><Link href="/explore-leagues">Explorar Ligas</Link></li>
                <li><Link href="/leagues">Rankings Globales</Link></li>
                <li><Link href="/register">Crear Cuenta</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="copyright">© 2026 Desafío Mundial. Todos los derechos reservados.</div>
            <div className="footer-legal">
              <Link href="/terms">Términos</Link>
              <Link href="/privacy">Privacidad</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
