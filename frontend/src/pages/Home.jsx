import { Link } from 'react-router-dom';
import heroImg from '../assets/hero_ultra.png';

const FEATURES = [
  { icon: '🌾', title: 'Crop Advisor', desc: 'Predict best crops using NPK, pH & local weather data.', link: '/crop' },
  { icon: '🌤️', title: 'Smart Weather', desc: 'Real-time hyper-local weather insights for planned farming.', link: '/weather' },
  { icon: '🔬', title: 'Disease Scan', desc: 'AI-powered image analysis for instant plant health diagnostics.', link: '/disease' },
  { icon: '🤖', title: 'AI Assistant', desc: 'Your 24/7 personal farming consultant powered by LLMs.', link: '/chatbot' },
  { icon: '⚠️', title: 'Risk Alerts', desc: 'Automated pest and outbreak warnings for your specific region.', link: '/pest-alerts' },
  { icon: '📞', title: 'Support', desc: 'Expert assistance for hardware and setup.', link: '/contact' },
];

export default function Home() {
  return (
    <div className="page-wrapper" style={{ paddingTop: 0 }}>
      {/* ── Hero ─────────────────────────────────── */}
      <section className="hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 0 80px' }}>
        <img src={heroImg} className="hero-bg" alt="Cinematic Sustainable Farm" style={{ opacity: 0.25 }} />
        <div className="hero-overlay" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 60%, transparent 100%)' }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
          <div className="animate-up" style={{ maxWidth: '900px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(16, 185, 129, 0.12)', padding: '10px 20px', borderRadius: '100px', border: '1px solid rgba(16, 185, 129, 0.25)', marginBottom: '32px', backdropFilter: 'blur(12px)' }}>
              <span className="pulse-dot"></span>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--primary-light)' }}>Agri-Intelligence • v4.0 Active</span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(3.5rem, 10vw, 6rem)', lineHeight: '1.05', fontWeight: '900', marginBottom: '32px', letterSpacing: '-0.04em', color: 'white' }}>
              Cultivating the <br />
              <span style={{ 
                background: 'linear-gradient(to right, var(--primary-light), var(--primary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.3))'
              }}>Digital Frontier.</span>
            </h1>
            
            <p style={{ fontSize: '1.5rem', lineHeight: '1.6', color: '#cbd5e1', marginBottom: '56px', maxWidth: '650px', fontWeight: '400' }}>
              Experience the convergence of AI, IoT, and precision agronomy to redefine global food security with data-driven resilience.
            </p>
            
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <Link to="/crop" className="btn btn-primary" style={{ padding: '22px 56px', fontSize: '1.1rem', borderRadius: '100px' }}>
                Launch Command Center
                <span style={{ fontSize: '1.2rem' }}>→</span>
              </Link>
              <Link to="/chatbot" className="btn btn-glass" style={{ padding: '22px 56px', fontSize: '1.1rem', borderRadius: '100px' }}>
                Consult AI Agent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Ecosystem (Bento Style) ──────── */}
      <section className="section" style={{ background: '#f8fafc', position: 'relative', zIndex: 1, marginTop: '-40px', borderRadius: '40px 40px 0 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '20px', letterSpacing: '-0.03em' }}>Our <span style={{ color: 'var(--primary)' }}>Digital</span> Ecosystem</h2>
            <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
              Quantum-grade tools designed for the next generation of precision agriculture.
            </p>
          </div>

          <div className="grid-bento animate-up">
            {FEATURES.map((f, i) => (
              <Link key={f.title} to={f.link} className={`bento-card card-size-${i % 3}`} style={{ textDecoration: 'none' }}>
                <div className="bento-icon">{f.icon}</div>
                <div className="bento-content">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <div className="bento-footer">
                    <span>Deploy Module</span>
                    <span className="arrow">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Precision Dashboard Metrics ─────────── */}
      <section className="section" style={{ background: 'var(--secondary)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle at 70% 30%, var(--primary), transparent 70%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="flex-between" style={{ gap: '100px' }}>
            <div style={{ maxWidth: '500px' }}>
              <h2 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '24px', lineHeight: '1.1' }}>
                Empirical <br /><span style={{ color: 'var(--primary-light)' }}>Precision</span>.
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1.25rem' }}>
                Eliminate guesswork with real-time telemetry and predictive modeling updated every 12 seconds.
              </p>
            </div>
            
            <div className="metrics-grid">
              {[
                { val: '98.4%', label: 'Prediction Accuracy' },
                { val: '1.2ms', label: 'Average Latency' },
                { val: '24/7', label: 'Edge Availability' }
              ].map(stat => (
                <div key={stat.label} className="metric-item">
                  <div className="metric-value">{stat.val}</div>
                  <div className="metric-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: '80px 0', textAlign: 'center', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
         <p className="text-muted" style={{ fontWeight: '500' }}>© 2026 AgriZone Systems International · Pioneering the Future of Food.</p>
      </footer>
    </div>
  );
}
