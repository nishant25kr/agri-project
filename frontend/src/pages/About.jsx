export default function About() {
  return (
    <div className="page-wrapper container" style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '100px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '24px' }}>Innovation in <br /><span style={{ color: 'var(--primary)' }}>Agri-Tech</span>.</h1>
        <p className="text-muted" style={{ fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto' }}>
          AgriZone is a high-performance intelligence platform designed to empower farmers with real-time AI insights, hyper-local data, and sustainable agricultural strategies.
        </p>
      </div>

      <div className="grid-3">
        <div className="card-glass">
          <div style={{ fontSize: '3rem', marginBottom: '24px' }}>🌍</div>
          <h3>Global Mission</h3>
          <p className="text-muted">Driving food security through data-driven precision farming for every corner of the planet.</p>
        </div>
        <div className="card-glass">
          <div style={{ fontSize: '3rem', marginBottom: '24px' }}>🤖</div>
          <h3>AI First</h3>
          <p className="text-muted">Leveraging advanced neural networks to predict crop success and identify plant pathologies.</p>
        </div>
        <div className="card-glass">
          <div style={{ fontSize: '3rem', marginBottom: '24px' }}>⚡</div>
          <h3>Real-time Data</h3>
          <p className="text-muted">Hyper-local sensors and satellite connectivity for sub-meter accurate weather and pest tracking.</p>
        </div>
      </div>
      
      <div className="card-glass" style={{ marginTop: '60px', background: 'var(--secondary)', color: 'white', display: 'flex', alignItems: 'center', gap: '40px', padding: '60px' }}>
         <div style={{ fontSize: '6rem' }}>🌱</div>
         <div>
            <h2 style={{ color: 'white', marginBottom: '16px' }}>Sustainable Growth</h2>
            <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>We believe in a future where technology and nature exist in perfect harmony to preserve the earth for future generations.</p>
         </div>
      </div>
    </div>
  );
}
