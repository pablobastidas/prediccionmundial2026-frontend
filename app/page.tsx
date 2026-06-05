import React from 'react';

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Hero Section */
        .hero {
          padding: 4rem 0;
          text-align: center;
          background: radial-gradient(circle at top right, var(--primary-soft), transparent);
          position: relative;
        }
        .hero h1 {
          font-size: clamp(2.5rem, 10vw, 6rem);
          line-height: 0.9;
          margin-bottom: 2rem;
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
          padding: 4rem 1.5rem;
          border-radius: var(--radius-lg);
          text-align: center;
          margin: 4rem 0;
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
          .hero { padding: 8rem 0; }
          .section-header h2 { font-size: 3.5rem; }
          .venue-card { height: 350px; }
          .cta-banner { padding: 6rem 2rem; }
        }
      `}} />

      <div className="container">
        <nav className="navbar flex">
          <div className="logo">POLLA<span>MUNDIAL</span></div>
          <div className="nav-links flex" style={{ gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#grupos" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Grupos</a>
            <a href="#sedes" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Sedes</a>
            <a href="/simulator-public" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Simulador</a>
            <div className="flex" style={{ gap: '0.75rem' }}>
              <a href="/login" className="btn-secondary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.7rem', borderRadius: '99px' }}>Entrar</a>
              <a href="/register" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.7rem', borderRadius: '99px' }}>Unirse</a>
            </div>
          </div>
        </nav>

        <main>
          <section className="hero">
            <div className="badge-slant" style={{ marginBottom: '2rem' }}><span>PROYECTO OFICIAL 2026</span></div>
            <h1>LA COPA MÁS <br/><span className="text-accent">GRANDE</span> DE LA HISTORIA</h1>
            <p>Predice los resultados de los 48 equipos, crea ligas con tus amigos y compite por premios exclusivos en el Mundial de USA, México y Canadá.</p>
            <div className="flex" style={{ justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <a href="/" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>Empezar a Jugar</a>
              <a href="/simulator-public" className="btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>Probar Simulador</a>
            </div>
          </section>

          <section id="grupos" style={{ padding: '4rem 0' }}>
            <div className="section-header">
              <div className="pill accent" style={{ display: 'inline-block', marginBottom: '1rem' }}>Formato 48 Equipos</div>
              <h2>LOS <span className="text-accent">GRUPOS</span></h2>
              <p className="text-muted">Doce grupos de cuatro equipos cada uno. ¿Quiénes pasarán a los dieciseisavos?</p>
            </div>
            
            <div className="groups-grid">
              {/* Group A */}
              <div className="group-card">
                <div className="group-title">Grupo A</div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/mx.png" className="team-flag-small" alt="México" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>México</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>Anfitrión</span>
                </div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/nl.png" className="team-flag-small" alt="Holanda" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Holanda</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>FIFA #7</span>
                </div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/gh.png" className="team-flag-small" alt="Ghana" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Ghana</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>FIFA #60</span>
                </div>
              </div>

              {/* Group B */}
              <div className="group-card">
                <div className="group-title">Grupo B</div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/ca.png" className="team-flag-small" alt="Canadá" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Canadá</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>Anfitrión</span>
                </div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/be.png" className="team-flag-small" alt="Bélgica" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Bélgica</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>FIFA #4</span>
                </div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/kr.png" className="team-flag-small" alt="Corea del Sur" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Corea del Sur</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>FIFA #22</span>
                </div>
              </div>

              {/* Group C */}
              <div className="group-card">
                <div className="group-title">Grupo C</div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/us.png" className="team-flag-small" alt="USA" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>USA</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>Anfitrión</span>
                </div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/es.png" className="team-flag-small" alt="España" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>España</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>FIFA #8</span>
                </div>
                <div className="group-team">
                  <div className="flex" style={{ gap: '0.75rem' }}><img src="https://flagcdn.com/w20/jp.png" className="team-flag-small" alt="Japón" /> <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Japón</span></div>
                  <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 700 }}>FIFA #18</span>
                </div>
              </div>
            </div>
          </section>

          <section id="sedes" style={{ padding: '4rem 0' }}>
            <div className="section-header">
              <div className="pill purple" style={{ display: 'inline-block', marginBottom: '1rem' }}>16 Ciudades Anfitrionas</div>
              <h2>LAS <span className="text-accent">SEDES</span></h2>
              <p className="text-muted">La infraestructura más imponente del mundo.</p>
            </div>

            <div className="venues-grid">
              <div className="venue-card">
                <img src="https://images.unsplash.com/photo-1510133768164-a8f7e4d4e3dc?auto=format&fit=crop&q=80&w=800" className="venue-img" alt="Estadio Azteca" />
                <div className="venue-overlay">
                  <p className="venue-city">Ciudad de México</p>
                  <h3 className="venue-name">Estadio Azteca</h3>
                </div>
              </div>
              <div className="venue-card">
                <img src="https://images.unsplash.com/photo-1543351611-58f7a2b21231?auto=format&fit=crop&q=80&w=800" className="venue-img" alt="SoFi Stadium" />
                <div className="venue-overlay">
                  <p className="venue-city">Los Ángeles</p>
                  <h3 className="venue-name">SoFi Stadium</h3>
                </div>
              </div>
              <div className="venue-card">
                <img src="https://images.unsplash.com/photo-1522778119026-d1d0cf377fde?auto=format&fit=crop&q=80&w=800" className="venue-img" alt="MetLife Stadium" />
                <div className="venue-overlay">
                  <p className="venue-city">Nueva York / Nueva Jersey</p>
                  <h3 className="venue-name">MetLife Stadium</h3>
                </div>
              </div>
            </div>
          </section>

          <section id="simulador-promo" style={{ padding: '6rem 0', background: 'var(--bg)', borderRadius: 'var(--radius-lg)', marginTop: '4rem' }}>
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
            <h2 style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', marginBottom: '2rem' }}>¿LISTO PARA <span className="text-accent">GANAR</span>?</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '3rem', fontWeight: 700 }}>Únete a la comunidad de pronosticadores más grande.</p>
            <a href="/register" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: 'white', color: 'var(--fg)', width: '100%', maxWidth: '400px', display: 'inline-block' }}>Crear Mi Cuenta Ahora</a>
          </section>
        </main>
      </div>

      <footer className="main-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">POLLA<span>MUNDIAL</span></div>
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
                <li><a href="#">Calendario</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Comunidad</h4>
              <ul className="footer-links">
                <li><a href="/explore-leagues">Explorar Ligas</a></li>
                <li><a href="/leagues">Rankings Globales</a></li>
                <li><a href="/register">Crear Cuenta</a></li>
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
            <div className="copyright">© 2026 PollaMundial. Todos los derechos reservados.</div>
            <div className="footer-legal">
              <a href="#">Términos</a>
              <a href="#">Privacidad</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
