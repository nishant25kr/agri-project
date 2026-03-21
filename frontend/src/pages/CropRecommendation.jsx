import { useState } from 'react';
import API_BASE from '../api/config';
import './PageCommon.css';
import './CropRecommendation.css';

const FIELDS = [
  { name: 'Nitrogen',   label: 'Nitrogen (N)',   unit: 'mg/kg', min: 0, max: 140, placeholder: '0–140' },
  { name: 'Phosphorus', label: 'Phosphorus (P)', unit: 'mg/kg', min: 0, max: 145, placeholder: '5–145' },
  { name: 'Potassium',  label: 'Potassium (K)',  unit: 'mg/kg', min: 0, max: 205, placeholder: '5–205' },
  { name: 'Temperature',label: 'Temperature',    unit: '°C',    min: 0, max: 50,  placeholder: '8–45' },
  { name: 'Humidity',   label: 'Humidity',       unit: '%',     min: 0, max: 100, placeholder: '14–100' },
  { name: 'pH',         label: 'Soil pH',        unit: '',      min: 0, max: 14,  placeholder: '3.5–9.9', step: '0.1' },
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
      setError('Could not reach the server. Make sure Django is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setForm(INITIAL); setResult(null); setError(''); };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1B5E20, #4CAF50)' }}>
        <div className="container">
          <div className="page-hero-icon">🌾</div>
          <h1>Crop Recommendation</h1>
          <p>Enter your soil and climate parameters to receive an AI-powered crop suggestion.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px' }}>
        <div className="crop-layout">
          {/* Form */}
          <div className="card crop-form-card">
            <h2 className="card-title">Soil & Climate Parameters</h2>
            <form onSubmit={submit}>
              <div className="crop-grid">
                {FIELDS.map(f => (
                  <div className="form-group" key={f.name}>
                    <label className="form-label">
                      {f.label}
                      {f.unit && <span className="unit-badge">{f.unit}</span>}
                    </label>
                    <input
                      type="number"
                      name={f.name}
                      className="form-control"
                      value={form[f.name]}
                      onChange={handle}
                      placeholder={f.placeholder}
                      min={f.min}
                      max={f.max}
                      step={f.step || '1'}
                      required
                    />
                  </div>
                ))}
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                  {loading ? <><span className="mini-spinner" /> Analysing…</> : '🔍 Get Recommendation'}
                </button>
                {result && (
                  <button type="button" className="btn btn-outline" onClick={reset}>
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Result */}
          <div className="crop-result-area">
            {!result && !loading && (
              <div className="empty-state card">
                <div style={{ fontSize: '4rem' }}>🌱</div>
                <h3>Enter soil data to begin</h3>
                <p>The AI model analyses 7 parameters to recommend the optimal crop for your field.</p>
              </div>
            )}

            {loading && (
              <div className="empty-state card">
                <div className="spinner" style={{ margin: '0 auto 16px' }} />
                <h3>Analysing your data…</h3>
              </div>
            )}

            {result && (
              <div className="result-card card animate-fade-up">
                <div className="result-check">✅</div>
                <div className="result-badge">Best crop for your soil</div>
                <div className="result-crop">{result.crop}</div>
                <div className="result-tips">
                  <div className="tip-item"><span>🌡️</span> Temperature-tolerant</div>
                  <div className="tip-item"><span>💧</span> Matches your rainfall</div>
                  <div className="tip-item"><span>🧪</span> Ideal soil chemistry</div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 20 }} onClick={reset}>
                  Try Another Analysis
                </button>
              </div>
            )}

            {/* Info panels */}
            <div className="info-cards">
              {[
                { icon: '🧪', title: 'Soil Analysis', desc: 'NPK ratio determines nutrient availability for different crops.' },
                { icon: '🌡️', title: 'Climate Match', desc: 'Temperature and humidity must align with the crop growth cycle.' },
                { icon: '🌧️', title: 'Rainfall Data', desc: 'Rainfall requirements vary significantly across crop categories.' },
              ].map(c => (
                <div key={c.title} className="info-card card">
                  <span>{c.icon}</span>
                  <div>
                    <strong>{c.title}</strong>
                    <p>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
