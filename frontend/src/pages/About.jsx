import './PageCommon.css';
import './About.css';

const TEAM = [
  { name: 'Nishant Kumar',   role: 'Full-Stack Developer',     emoji: '👨‍💻' },
  { name: 'AI Team',         role: 'ML & Agriculture Expert',  emoji: '🤖' },
  { name: 'Farming Community', role: 'Domain Knowledge',       emoji: '🌾' },
];

const TECH = [
  { name: 'Django REST',  icon: '🐍', color: '#092E20' },
  { name: 'React + Vite', icon: '⚛️', color: '#087EA4' },
  { name: 'Google Gemini',icon: '✨', color: '#4285F4' },
  { name: 'Scikit-learn', icon: '🧠', color: '#F7931E' },
  { name: 'WeatherAPI',   icon: '🌤️', color: '#0277BD' },
  { name: 'SQLite',       icon: '🗃️', color: '#003B57' },
];

export default function About() {
  return (
    <div className="page">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1B5E20, #4CAF50)' }}>
        <div className="container">
          <div className="page-hero-icon">🌱</div>
          <h1>About Agrizone</h1>
          <p>An AI-powered platform built to empower farmers with intelligent, data-driven insights.</p>
        </div>
      </div>

      <div className="container about-container">
        {/* Mission */}
        <section className="about-section">
          <div className="about-text card">
            <h2>🎯 Our Mission</h2>
            <p>
              Agriculture is the backbone of civilization, yet many farmers still lack access to timely, expert
              guidance. Agrizone bridges this gap by combining cutting-edge AI with deep agricultural expertise —
              making smart farming accessible to everyone, from smallholder farmers to commercial operations.
            </p>
            <p>
              We believe that technology, when properly applied, can dramatically improve crop yields, reduce
              losses from disease and pests, and help farmers make more sustainable decisions in the face of
              climate change.
            </p>
          </div>
        </section>

        {/* Features overview */}
        <section className="about-section">
          <h2 className="section-title">What We Offer</h2>
          <div className="about-features">
            {[
              { icon: '🌾', title: 'Crop Recommendation', desc: 'ML model trained on 22 crops using 7 soil and climate parameters to suggest the optimal crop for your field.' },
              { icon: '🔬', title: 'Disease Detection', desc: 'Computer vision AI that identifies plant diseases from uploaded leaf images and suggests treatment protocols.' },
              { icon: '🌤️', title: 'Weather Intelligence', desc: 'Integrates with WeatherAPI to provide real-time weather data with agriculture-specific advisory notes.' },
              { icon: '🤖', title: 'AI Chat Assistant', desc: 'Powered by Google Gemini, our chatbot provides expert advice on fertilization, pest management, and seasonal farming.' },
              { icon: '⚠️', title: 'Pest Alerts', desc: 'Weather-based pest risk analysis that cross-references conditions with known pest and disease outbreak patterns.' },
            ].map(f => (
              <div key={f.title} className="about-feature-item card">
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section className="about-section">
          <h2 className="section-title">Technology Stack</h2>
          <div className="tech-grid">
            {TECH.map(t => (
              <div key={t.name} className="tech-card card" style={{ '--tc': t.color }}>
                <span className="tech-icon">{t.icon}</span>
                <span>{t.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="about-section">
          <h2 className="section-title">Made With ❤️ By</h2>
          <div className="team-grid">
            {TEAM.map(m => (
              <div key={m.name} className="team-card card">
                <div className="team-emoji">{m.emoji}</div>
                <h3>{m.name}</h3>
                <p>{m.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
