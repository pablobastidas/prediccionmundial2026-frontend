"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Hero Section */
        .hero {
          padding: 4rem 1.25rem;
          text-align: center;
          background: radial-gradient(circle at top right, var(--primary-soft), transparent);
          position: relative;
        }
        .hero h1 {
          font-size: clamp(2.2rem, 8vw, 5.5rem);
          line-height: 1.0;
          margin-bottom: 2rem;
          word-wrap: break-word;
        }
        .hero p {
          font-size: 1rem;
          max-width: 600px;
          margin: 0 auto 3rem;
          color: var(--fg-muted);
          font-weight: 500;
          padding: 0 1rem;
        }

        /* Info Sections */
        .section-header {
          margin-bottom: 4rem;
          text-align: center;
        }
        .section-header h2 { font-size: 2.5rem; margin-bottom: 1rem; }

        /* Groups Grid */
        .groups-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
        }
        .group-card {
          background: var(--surface);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
        }
        .group-title {
          font-size: 1.25rem;
          font-weight: 900;
          font-style: italic;
          color: var(--accent);
          margin-bottom: 1.5rem;
          border-bottom: 2px solid var(--accent-soft);
          padding-bottom: 0.5rem;
        }
        .group-team {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
        }
        .group-team:last-child { border-bottom: none; }
        .team-flag-small { width: 24px; height: 16px; border-radius: 2px; }

        /* Venues Section */
        .venues-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2.5rem;
          margin-top: 4rem;
        }
        .venue-card {
          position: relative;
          height: 250px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }
        .venue-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .venue-card:hover .venue-img { transform: scale(1.1); }
        .venue-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 2rem;
          color: white;
        }
        .venue-name { font-size: 1.25rem; font-weight: 800; font-style: italic; }
        .venue-city { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; opacity: 0.8; }

        /* CTA Section */
        .cta-banner {
          background: var(--fg);
          color: white;
          padding: 4rem 1rem;
          text-align: center;
          margin-top: 4rem;
          position: relative;
          overflow: hidden;
        }
        
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
          .hero { padding: 8rem 2rem; }
          .section-header h2 { font-size: 3.5rem; }
          .venue-card { height: 350px; }
          .cta-banner { padding: 6rem 2rem; }
        }
      `}} />

      <div style={{ width: '100%', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <nav className="navbar container flex">
          <div className="logo">DESAFÍO<span>MUNDIAL</span></div>
          <div className="nav-links flex" style={{ gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#grupos" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Grupos</a>
            <a href="#sedes" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Sedes</a>
            <a href="/simulator-public" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Simulador</a>
            <div className="flex" style={{ gap: '0.75rem' }}>
              {loading ? (
                <span style={{ fontSize: '0.7rem', color: 'var(--fg-muted)' }}>Cargando...</span>
              ) : isAuthenticated ? (
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

      <main style={{ width: '100%', overflow: 'hidden' }}>
        <section className="hero">
          <div className="container">
            <div className="badge-slant" style={{ marginBottom: '2rem' }}><span>PROYECTO OFICIAL 2026</span></div>
            <h1>LA COPA MÁS <br/><span className="text-accent">GRANDE</span> DE LA HISTORIA</h1>
            <p>Predice los resultados de los 48 equipos, crea ligas con tus amigos y compite por premios exclusivos en el Mundial de USA, México y Canadá.</p>
            <div className="flex" style={{ justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <a href="/" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>Empezar a Jugar</a>
              <a href="/simulator-public" className="btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>Probar Simulador</a>
            </div>
          </div>
        </section>

        <section id="grupos" style={{ padding: '4rem 0' }}>
          <div className="container">
            <div className="section-header">
              <div className="pill accent" style={{ display: 'inline-block', marginBottom: '1rem' }}>Formato 48 Equipos</div>
              <h2>LOS <span className="text-accent">GRUPOS</span></h2>
              <p className="text-muted">Doce grupos de cuatro equipos cada uno. ¿Quiénes pasarán a los dieciseisavos?</p>
            </div>
            
            <div className="groups-grid">
              {/* Group A */}
              <div className="group-card">
                <div className="group-title">Grupo A (México)</div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/mx.png" className="team-flag-small" alt="México" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>México</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>Anfitrión</span>
                </div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/za.png" className="team-flag-small" alt="Sudáfrica" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Sudáfrica</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>FIFA #59</span>
                </div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/kr.png" className="team-flag-small" alt="Corea del Sur" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Corea del Sur</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>FIFA #22</span>
                </div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/cz.png" className="team-flag-small" alt="Chequia" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Chequia</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>FIFA #34</span>
                </div>
              </div>

              {/* Group B */}
              <div className="group-card">
                <div className="group-title">Grupo B (Canadá)</div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/ca.png" className="team-flag-small" alt="Canadá" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Canadá</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>Anfitrión</span>
                </div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/ch.png" className="team-flag-small" alt="Suiza" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Suiza</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>FIFA #19</span>
                </div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/qa.png" className="team-flag-small" alt="Qatar" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Qatar</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>FIFA #37</span>
                </div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/ba.png" className="team-flag-small" alt="Bosnia y Herzegovina" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Bosnia y H.</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>FIFA #70</span>
                </div>
              </div>

              {/* Group D */}
              <div className="group-card">
                <div className="group-title">Grupo D (USA)</div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/us.png" className="team-flag-small" alt="USA" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>USA</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>Anfitrión</span>
                </div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/tr.png" className="team-flag-small" alt="Turquía" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Turquía</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>FIFA #26</span>
                </div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/au.png" className="team-flag-small" alt="Australia" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Australia</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>FIFA #23</span>
                </div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/py.png" className="team-flag-small" alt="Paraguay" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Paraguay</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>FIFA #56</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="sedes" style={{ padding: '4rem 0' }}>
          <div className="container">
            <div className="section-header">
              <div className="pill purple" style={{ display: 'inline-block', marginBottom: '1rem' }}>16 Ciudades Anfitrionas</div>
              <h2>LAS <span className="text-accent">SEDES</span></h2>
              <p className="text-muted">La infraestructura más imponente del mundo.</p>
            </div>

            <div className="venues-grid">
              <div className="venue-card">
                <img src="/images/estadio_azteca.png" className="venue-img" alt="Estadio Azteca" />
                <div className="venue-overlay">
                  <p className="venue-city">Ciudad de México 🇲🇽</p>
                  <h3 className="venue-name">Estadio Azteca</h3>
                </div>
              </div>
              <div className="venue-card">
                <img src="/images/sofi_stadium.png" className="venue-img" alt="SoFi Stadium" />
                <div className="venue-overlay">
                  <p className="venue-city">Los Ángeles 🇺🇸</p>
                  <h3 className="venue-name">SoFi Stadium</h3>
                </div>
              </div>
              <div className="venue-card">
                <img src="/images/metlife_stadium.png" className="venue-img" alt="MetLife Stadium" />
                <div className="venue-overlay">
                  <p className="venue-city">Nueva York / Nueva Jersey 🇺🇸</p>
                  <h3 className="venue-name">MetLife Stadium</h3>
                </div>
              </div>
              <div className="venue-card">
                <img src="/images/bc_place.png" className="venue-img" alt="BC Place" />
                <div className="venue-overlay">
                  <p className="venue-city">Vancouver 🇨🇦</p>
                  <h3 className="venue-name">BC Place</h3>
                </div>
              </div>
              <div className="venue-card">
                <img src="/images/bmo_field.png" className="venue-img" alt="BMO Field" />
                <div className="venue-overlay">
                  <p className="venue-city">Toronto 🇨🇦</p>
                  <h3 className="venue-name">BMO Field</h3>
                </div>
              </div>
              <div className="venue-card">
                <img src="/images/estadio_bbva.png" className="venue-img" alt="Estadio BBVA" />
                <div className="venue-overlay">
                  <p className="venue-city">Monterrey 🇲🇽</p>
                  <h3 className="venue-name">Estadio BBVA</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="simulador-promo" style={{ padding: '6rem 0', background: 'var(--bg)', marginTop: '4rem' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="badge-slant" style={{ marginBottom: '1.5rem' }}><span>Interactividad Total</span></div>
              <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>SIMULADOR <span className="text-accent">GRATUITO</span></h2>
              <p className="text-muted" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '2rem' }}>¿Quién será el campeón? Prueba nuestra versión limitada y descubre cómo avanzarían los primeros grupos del mundial.</p>
              <div className="flex" style={{ gap: '1rem' }}>
                <a href="/simulator-public" className="btn-primary" style={{ padding: '1rem 2rem' }}>Probar Ahora</a>
                <a href="/register" className="btn-secondary" style={{ padding: '1rem 2rem' }}>Ver Versión Completa</a>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
              <iframe src="/simulator-public" style={{ width: '100%', height: '500px', border: 'none', borderRadius: '12px' }}></iframe>
            </div>
          </div>
        </section>

        <section className="cta-banner">
          <div className="container">
            <h2 style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', marginBottom: '2rem' }}>¿LISTO PARA <span className="text-accent">GANAR</span>?</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '3rem', fontWeight: 700 }}>Únete a la comunidad de pronosticadores más grande.</p>
            <a href="/register" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: 'white', color: 'var(--fg)', width: '100%', maxWidth: '400px', display: 'inline-block' }}>Crear Mi Cuenta Ahora</a>
          </div>
        </section>
      </main>

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
                <li><a href="#grupos">Grupos</a></li>
                <li><a href="#sedes">Sedes y Estadios</a></li>
                <li><a href="/simulator-public">Simulador de Llaves</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Comunidad</h4>
              <ul className="footer-links">
                <li><a href="/explore-leagues">Explorar Ligas</a></li>
                <li><a href="/leagues">Rankings Globales</a></li>
                <li><a href="/register">Crear Cuenta</a></li>
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
