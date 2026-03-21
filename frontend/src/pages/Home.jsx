import { Link } from 'react-router-dom';
import './Home.css';

const FEATURES = [
  {
    icon: '🌾',
    title: 'Crop Recommendation',
    desc: 'AI-powered crop suggestions based on soil NPK, pH, temperature, and rainfall data.',
    link: '/crop',
    color: '#1B5E20',
  },
  {
    icon: '🌤️',
    title: 'Weather Intelligence',
    desc: 'Real-time weather updates with farming-specific insights for better planning.',
    link: '/weather',
    color: '#0277BD',
  },
  {
    icon: '🔬',
    title: 'Disease Detection',
    desc: 'Upload plant photos for instant AI-based disease identification and treatment advice.',
    link: '/disease',
    color: '#558B2F',
  },
  {
    icon: '🤖',
    title: 'AI Farm Assistant',
    desc: 'Conversational AI expert for fertilizer, pest control, and seasonal farming guidance.',
    link: '/chatbot',
    color: '#4527A0',
  },
  {
    icon: '⚠️',
    title: 'Pest Alerts',
    desc: 'Weather-based pest and disease alerts for your specific location and crop.',
    link: '/pest-alerts',
    color: '#E65100',
  },
  {
    icon: '📬',
    title: 'Contact & Support',
    desc: 'Reach out for expert support, partnership inquiries, or custom farming solutions.',
    link: '/contact',
    color: '#00695C',
  },
];

const STATS = [
  { value: '22+',   label: 'Crop Types' },
  { value: '95%',   label: 'Prediction Accuracy' },
  { value: '500+',  label: 'Farmers Helped' },
  { value: '24/7',  label: 'AI Support' },
];

export default function Home() {
  return (
    <div className="home">
      {/* ── Hero ─────────────────────────────────── */}
      <section className="hero">
        <div className="hero-particles" aria-hidden="true">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="particle" style={{
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`,
              '--d': `${2 + Math.random() * 4}s`,
              '--s': `${4 + Math.random() * 12}px`,
            }} />
          ))}
        </div>
        <div className="hero-overlay" />
        <div className="hero-content container">
          <div className="hero-badge animate-fade-up">🌿 Smart Farming Platform</div>
          <h1 className="hero-title animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Grow Smarter
            <br />
            <span>with AI-Powered</span>
            <br />
            Agriculture
          </h1>
          <p className="hero-desc animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Harness the power of artificial intelligence for crop recommendations,
            disease detection, weather intelligence, and expert farming guidance — all in one place.
          </p>
          <div className="hero-actions animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/crop" className="btn btn-white">
              🌾 Get Crop Advice
            </Link>
            <Link to="/disease" className="btn btn-outline-white">
              🔬 Detect Disease
            </Link>
          </div>
        </div>

        {/* Floating card */}
        <div className="hero-card animate-float">
          <div className="hero-card-header">🌱 Today's Insights</div>
          <div className="hero-card-row"><span>Recommended</span><strong>Wheat · Rice · Maize</strong></div>
          <div className="hero-card-row"><span>Health Score</span><strong>✅ Excellent</strong></div>
          <div className="hero-card-row"><span>AI Confidence</span><strong>94.5%</strong></div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────── */}
      <section className="stats-strip container">
        {STATS.map(s => (
          <div key={s.label} className="stat-item">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Features ─────────────────────────────── */}
      <section className="section features-section container">
        <div className="text-center" style={{ marginBottom: 56 }}>
          <div className="badge badge-green" style={{ marginBottom: 12 }}>All-in-One Platform</div>
          <h2 className="section-title">Everything a <span className="gradient-text">Modern Farmer</span> Needs</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            From soil analysis to pest alerts — Agrizone puts expert-level agricultural intelligence in your hands.
          </p>
        </div>
        <div className="features-grid">
          {FEATURES.map(f => (
            <Link key={f.title} to={f.link} className="feature-card card" style={{ '--accent-c': f.color }}>
              <div className="feature-icon" style={{ background: `${f.color}18`, color: f.color }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="feature-link">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-inner container">
          <h2>Ready to transform your farm?</h2>
          <p>Join thousands of farmers who make smarter decisions with Agrizone AI.</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 32 }}>
            <Link to="/crop" className="btn btn-white">Start for Free</Link>
            <Link to="/chatbot" className="btn btn-outline-white">Talk to AI →</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="footer">
        <div className="container">
          <p>© 2024 Agrizone · Built with ❤️ for farmers worldwide</p>
        </div>
      </footer>
    </div>
  );
}
