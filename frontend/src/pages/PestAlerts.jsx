import { useState } from 'react';
import API_BASE from '../api/config';
import './PageCommon.css';
import './PestAlerts.css';

const CROPS = ['Rice', 'Wheat', 'Tomato', 'Cotton', 'Maize', 'Sugarcane', 'Potato', 'Onion'];

const SEVERITY_MAP = { High: 'red', Medium: 'orange', Low: 'green' };

export default function PestAlerts() {
  const [crop,     setCrop]     = useState('');
  const [location, setLocation] = useState('');
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const fetch_ = async e => {
    e.preventDefault();
    setLoading(true); setError(''); setData(null);
    try {
      const res  = await fetch(`${API_BASE}/alerts/get-alerts/?crop=${encodeURIComponent(crop)}&location=${encodeURIComponent(location)}`);
      const json = await res.json();
      if (json.success) setData(json);
      else setError(json.error || 'Failed to fetch alerts.');
    } catch {
      setError('Server unreachable. Make sure Django is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #E65100, #FF8F00)' }}>
        <div className="container">
          <div className="page-hero-icon">⚠️</div>
          <h1>Pest & Disease Alerts</h1>
          <p>Weather-based alerts for pests and diseases affecting your specific crop and region.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px' }}>
        {/* Search form */}
        <form onSubmit={fetch_} className="alerts-form card">
          <div>
            <label className="form-label">Select Crop</label>
            <select className="form-control" value={crop} onChange={e => setCrop(e.target.value)} required>
              <option value="">-- Choose a crop --</option>
              {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Location / City</label>
            <input
              className="form-control"
              placeholder="e.g. Punjab, Nashik, Haryana"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <><span className="mini-spinner" /> Checking…</> : '🔍 Get Alerts'}
          </button>
        </form>

        {error && <div className="alert alert-danger" style={{ maxWidth: 800, margin: '16px auto' }}>{error}</div>}

        {/* Results */}
        {data && (
          <div className="alerts-results animate-fade-up">
            {/* Weather summary */}
            {data.weather && (
              <div className="weather-summary card">
                <h3>🌤️ Current Conditions — {location}</h3>
                <div className="weather-pills">
                  <div className="w-pill"><span>🌡️</span>{data.weather.temp}°C</div>
                  <div className="w-pill"><span>💧</span>{data.weather.humidity}% humidity</div>
                  <div className="w-pill"><span>🌥️</span>{data.weather.description}</div>
                </div>
              </div>
            )}

            {/* Alerts */}
            {data.alerts.length === 0 ? (
              <div className="no-alerts card">
                <div style={{ fontSize: '3rem' }}>✅</div>
                <h3>No active alerts</h3>
                <p>Current weather conditions are safe for <strong>{crop}</strong> cultivation. Keep monitoring regularly.</p>
              </div>
            ) : (
              <>
                <div className="alerts-header">
                  <h2>🚨 {data.alerts.length} Alert{data.alerts.length !== 1 ? 's' : ''} Found for {crop}</h2>
                </div>
                <div className="alerts-grid">
                  {data.alerts.map((a, i) => (
                    <div key={i} className={`alert-card card severity-${(SEVERITY_MAP[a.severity] || 'orange')}`}>
                      <div className="alert-card-header">
                        <div>
                          {a.pest_name && <h3>{a.pest_name}</h3>}
                          {a.disease_name && <span className="alert-disease">{a.disease_name}</span>}
                        </div>
                        <span className={`badge badge-${SEVERITY_MAP[a.severity] || 'orange'}`}>
                          {a.severity || 'Medium'} Risk
                        </span>
                      </div>
                      {a.symptoms && (
                        <div className="alert-section">
                          <strong>🔍 Symptoms</strong>
                          <p>{a.symptoms}</p>
                        </div>
                      )}
                      {a.prevention && (
                        <div className="alert-section">
                          <strong>🛡️ Prevention</strong>
                          <p>{a.prevention}</p>
                        </div>
                      )}
                      {a.treatment && (
                        <div className="alert-section">
                          <strong>💊 Treatment</strong>
                          <p>{a.treatment}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {!data && !loading && !error && (
          <div className="empty-state card" style={{ maxWidth: 500, margin: '0 auto' }}>
            <div style={{ fontSize: '4rem' }}>⚠️</div>
            <h3>Select a crop and location</h3>
            <p>We'll check current weather conditions and match them against known pest and disease risk patterns.</p>
          </div>
        )}
      </div>
    </div>
  );
}
