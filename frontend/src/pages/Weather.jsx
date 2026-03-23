import { useState } from 'react';
import API_BASE from '../api/config';

const WEATHER_ICONS = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '🌥️',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '10d': '🌦️', '11d': '⛈️', '13d': '❄️', '50d': '🌫️',
};

export default function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async e => {
    e.preventDefault();
    if (!city.trim()) return;
    setLoading(true); setError(''); setWeather(null);
    try {
      const res = await fetch(`${API_BASE}/weather/get-weather/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city }),
      });
      const data = await res.json();
      if (data.success) setWeather(data);
      else setError(data.error || 'Could not get weather data.');
    } catch {
      setError('Server unreachable. Make sure Django is running.');
    } finally {
      setLoading(false);
    }
  };

  const icon = weather ? (WEATHER_ICONS[weather.icon] || '🌤️') : '';

  return (
    <div className="page-wrapper container" style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '60px 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '12px' }}>Weather <span style={{ color: 'var(--primary)' }}>Intelligence</span></h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '48px' }}>
          Real-time hyper-local weather alerts and farming strategies for any location.
        </p>

        {/* Floating Search */}
        <div className="card-glass" style={{ maxWidth: '700px', margin: '0 auto 60px', padding: '16px' }}>
          <form onSubmit={fetchWeather} style={{ display: 'flex', gap: '12px' }}>
            <input
              className="form-input"
              placeholder="Enter city name (e.g. Mumbai, Berlin...)"
              value={city}
              onChange={e => setCity(e.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ minWidth: '140px' }}>
              {loading ? 'Fetching...' : 'Get Data'}
            </button>
          </form>
          {error && <p style={{ color: 'var(--error)', marginTop: '12px', textAlign: 'center' }}>{error}</p>}
        </div>

        {weather && (
          <div className="grid-2 animate-up">
            {/* Main Weather */}
            <div className="card-glass" style={{ background: 'var(--secondary)', color: 'white' }}>
              <div className="flex-between" style={{ marginBottom: '40px' }}>
                <div>
                  <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '4px' }}>{weather.city}</h2>
                  <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>{weather.country}</p>
                  <p style={{ color: 'var(--primary-light)', fontWeight: '700', textTransform: 'uppercase', marginTop: '12px' }}>{weather.description}</p>
                </div>
                <div style={{ fontSize: '5rem' }}>{icon}</div>
              </div>

              <div style={{ fontSize: '6rem', fontWeight: '800', lineHeight: 1, marginBottom: '40px' }}>{weather.temperature}°C</div>

              <div className="grid-3">
                {[
                  { icon: '💧', label: 'Humidity', val: `${weather.humidity}%` },
                  { icon: '🌬️', label: 'Wind', val: `${weather.wind_speed} m/s` },
                  { icon: '📊', label: 'Pressure', val: `${weather.pressure} hPa` },
                ].map(m => (
                  <div key={m.label} style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{m.icon}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{m.val}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Farming Strategy */}
            <div className="card-glass">
              <h3 style={{ marginBottom: '24px' }}>Farming Strategy</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {weather.humidity > 80 && (
                  <div style={{ padding: '20px', background: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', color: '#92400e', marginBottom: '4px' }}>⚠️ Fungal Disease Risk</strong>
                    <p style={{ fontSize: '0.9rem', color: '#b45309' }}>Humidity is very high. Monitor for pests and avoid morning watering.</p>
                  </div>
                )}
                {weather.temperature > 38 && (
                  <div style={{ padding: '20px', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', color: '#991b1b', marginBottom: '4px' }}>🌡️ Heat Stress Warning</strong>
                    <p style={{ fontSize: '0.9rem', color: '#b91c1c' }}>Crops may suffer from dehydration. Plan for additional irrigation.</p>
                  </div>
                )}
                <div style={{ padding: '20px', background: '#f0fdf4', borderLeft: '4px solid #10b981', borderRadius: '8px' }}>
                  <strong style={{ display: 'block', color: '#065f46', marginBottom: '4px' }}>✅ General Condition</strong>
                  <p style={{ fontSize: '0.9rem', color: '#047857' }}>
                    {weather.temperature >= 20 && weather.temperature <= 35
                      ? 'Optimal conditions for field work and spraying.'
                      : 'Proceed with caution based on individual crop sensitivities.'}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '32px', padding: '24px', background: '#f1f5f9', borderRadius: '16px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Data provided by OpenWeather Sytems. Updated in real-time.
                </p>
              </div>
            </div>
          </div>
        )}

        {!weather && !loading && (
          <div className="card-glass" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', opacity: 0.6 }}>
            <div style={{ fontSize: '5rem', marginBottom: '24px' }}>📍</div>
            <h3>Select your location</h3>
            <p className="text-muted">Enter a city name above to deploy high-precision weather sensors for your farm.</p>
          </div>
        )}
      </div>
    </div>
  );
}
