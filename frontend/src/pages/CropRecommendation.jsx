import { useState } from 'react';
import API_BASE from '../api/config';

const FIELDS = [
  { name: 'Nitrogen',   label: 'Nitrogen (N)',   unit: 'mg/kg', min: 0, max: 140, placeholder: '0–140' },
  { name: 'Phosphorus', label: 'Phosphorus (P)', unit: 'mg/kg', min: 0, max: 145, placeholder: '5–145' },
  { name: 'Potassium',  label: 'Potassium (K)',  unit: 'mg/kg', min: 0, max: 205, placeholder: '5–205' },
  { name: 'Temperature',label: 'Temperature',    unit: '°C',    min: 0, max: 50,  placeholder: '8–45' },
  { name: 'Humidity',   label: 'Humidity',       unit: '%',     min: 0, max: 100, placeholder: '14–100' },
  { name: 'pH',         label: 'Soil pH',        unit: '',      min: 0, max: 14,  placeholder: '3.5–9.9' },
  { name: 'Rainfall',   label: 'Rainfall',       unit: 'mm',    min: 0, max: 300, placeholder: '20–300' },
];

const INITIAL = { Nitrogen:'', Phosphorus:'', Potassium:'', Temperature:'', Humidity:'', pH:'', Rainfall:'' };

export default function CropRecommendation() {
  const [form, setForm]     = useState(INITIAL);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const res  = await fetch(`${API_BASE}/predict/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) setResult(data);
      else setError(data.error || 'Prediction failed. Please check your values.');
    } catch {
      setError('Could not reach the server. Make sure Django is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container">
      <div style={{ padding: '60px 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '12px' }}>Crop <span style={{ color: 'var(--primary)' }}>Advisor</span></h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '48px' }}>
          Input your soil parameters to receive a high-precision AI crop recommendation.
        </p>

        <div className="grid-2">
          {/* Input Panel */}
          <div className="card-glass">
            <h3 style={{ marginBottom: '24px' }}>Soil & Climate Parameters</h3>
            <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {FIELDS.map(f => (
                <div key={f.name} style={{ gridColumn: f.name === 'Rainfall' ? 'span 2' : 'auto' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)' }}>
                    {f.label} ({f.unit})
                  </label>
                  <input
                    type="number"
                    name={f.name}
                    className="form-input"
                    value={form[f.name]}
                    onChange={handle}
                    placeholder={f.placeholder}
                    required
                  />
                </div>
              ))}
              <div style={{ gridColumn: 'span 2', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Analyzing...' : 'Run Prediction Engine'}
                </button>
              </div>
            </form>
            {error && <p style={{ color: 'var(--error)', marginTop: '16px', fontWeight: '600' }}>{error}</p>}
          </div>

          {/* Result Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card-glass" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              {!result && !loading && (
                <div style={{ textAlign: 'center', opacity: 0.5 }}>
                  <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🧪</div>
                  <p style={{ fontWeight: '600' }}>Waiting for Data Input</p>
                </div>
              )}

              {loading && (
                <div style={{ textAlign: 'center' }}>
                  <div className="spinner" style={{ margin: '0 auto 20px' }} />
                  <p style={{ fontWeight: '600', animation: 'pulse 1.5s infinite' }}>Processing AI Model...</p>
                </div>
              )}

              {result && (
                <div className="animate-up" style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', padding: '12px 24px', background: 'var(--primary-light)', color: 'white', borderRadius: '50px', fontWeight: '800', fontSize: '0.8rem', marginBottom: '20px' }}>
                    OPTIMAL MATCH FOUND
                  </div>
                  <h2 style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '12px' }}>{result.crop}</h2>
                  <p className="text-muted" style={{ fontSize: '1.2rem' }}>This crop has the highest success probability for your soil conditions.</p>
                  
                  <div className="grid-3" style={{ marginTop: '40px' }}>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '1.5rem' }}>🌡️</div>
                      <p style={{ fontSize: '0.75rem', fontWeight: '700' }}>Climate Fit</p>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '1.5rem' }}>🧪</div>
                      <p style={{ fontSize: '0.75rem', fontWeight: '700' }}>Nutrient Match</p>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '1.5rem' }}>💧</div>
                      <p style={{ fontSize: '0.75rem', fontWeight: '700' }}>Rain Sensor</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="card-glass" style={{ background: 'var(--primary)', color: 'white' }}>
               <h4 style={{ color: 'white', marginBottom: '8px' }}>Pro Tip</h4>
               <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>For best results, take soil samples from at least 3 different points in your field and use the average values.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
