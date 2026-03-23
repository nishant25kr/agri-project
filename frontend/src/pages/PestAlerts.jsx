import { useState } from 'react';
import API_BASE from '../api/config';

const CROPS = ['Rice', 'Wheat', 'Tomato', 'Cotton', 'Maize', 'Sugarcane', 'Potato', 'Onion'];

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
      setError('Server unreachable. Ensure Django is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container" style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '60px 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '12px' }}>Pest <span style={{ color: 'var(--primary)' }}>Alerts</span></h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '48px' }}>
          Real-time hyper-local risk assessment based on environmental conditions.
        </p>

        {/* Command Bar */}
        <div className="card-glass" style={{ marginBottom: '60px' }}>
           <form onSubmit={fetch_} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)' }}>Target Crop</label>
                <select className="form-input" value={crop} onChange={e => setCrop(e.target.value)} required>
                   <option value="">Select Crop</option>
                   {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-muted)' }}>Location</label>
                <input className="form-input" placeholder="e.g. Punjab, Haryana" value={location} onChange={e => setLocation(e.target.value)} required />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ height: '56px' }}>
                 {loading ? 'Scanning Region...' : 'Fetch Risk Report'}
              </button>
           </form>
           {error && <p style={{ color: 'var(--error)', marginTop: '16px', fontWeight: '600' }}>{error}</p>}
        </div>

        {data && (
          <div className="animate-up">
            {/* Field Status */}
            {data.weather && (
              <div className="card-glass" style={{ background: 'var(--secondary)', color: 'white', marginBottom: '40px' }}>
                 <div className="flex-between">
                    <div>
                       <h3 style={{ color: 'white', marginBottom: '4px' }}>Field Environmental Status</h3>
                       <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Analyzed data for {location}</p>
                    </div>
                    <div className="flex-between" style={{ gap: '32px' }}>
                       <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{data.weather.temp}°C</div><p style={{ fontSize: '0.7rem', opacity: 0.6 }}>TEMP</p></div>
                       <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{data.weather.humidity}%</div><p style={{ fontSize: '0.7rem', opacity: 0.6 }}>HUMIDITY</p></div>
                    </div>
                 </div>
              </div>
            )}

            {/* Alerts Grid */}
            {data.alerts.length === 0 ? (
              <div className="card-glass" style={{ textAlign: 'center', padding: '60px' }}>
                 <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                 <h2 style={{ marginBottom: '12px' }}>No Active Threats</h2>
                 <p className="text-muted">Current ecosystem conditions are optimal for <strong>{crop}</strong>. No immediate action required.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                 <h2 style={{ fontSize: '2rem' }}>⚠️ {data.alerts.length} Active High-Risk Threats</h2>
                 <div className="grid-2">
                    {data.alerts.map((a, i) => (
                      <div key={i} className="card-glass" style={{ borderLeft: '6px solid var(--error)' }}>
                         <div className="flex-between" style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '1.5rem' }}>{a.pest_name || a.disease_name}</h3>
                            <span style={{ padding: '6px 14px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '50px', fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                               {a.severity} RISK
                            </span>
                         </div>
                         
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                               <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Symptoms</label>
                               <p style={{ fontSize: '0.95rem', marginTop: '4px' }}>{a.symptoms}</p>
                            </div>
                            <div>
                               <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Treatment</label>
                               <p style={{ fontSize: '0.95rem', marginTop: '4px', color: 'var(--primary-dark)', fontWeight: '600' }}>{a.treatment}</p>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        )}

        {!data && !loading && (
           <div className="card-glass" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', opacity: 0.6 }}>
              <div style={{ fontSize: '5rem', marginBottom: '24px' }}>📍</div>
              <h3>Select Crop & Region</h3>
              <p className="text-muted">Select your target crop and location to deploy the pest surveillance engine.</p>
           </div>
        )}
      </div>
    </div>
  );
}
