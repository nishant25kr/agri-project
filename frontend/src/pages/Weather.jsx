import { useState } from 'react';
import API_BASE from '../api/config';
import './PageCommon.css';
import './Weather.css';

const WEATHER_ICONS = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '🌥️',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '10d': '🌦️', '11d': '⛈️', '13d': '❄️', '50d': '🌫️',
};

export default function Weather() {
  const [city,    setCity]    = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const fetchWeather = async e => {
    e.preventDefault();
    if (!city.trim()) return;
    setLoading(true); setError(''); setWeather(null);
    try {
      const res  = await fetch(`${API_BASE}/weather/get-weather/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city }),
      });
      const data = await res.json();
      if (data.success) setWeather(data);
      else setError(data.error || 'Could not get weather data.');
    } catch {
      setError('Server unreachable. Make sure Django is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const icon = weather ? (WEATHER_ICONS[weather.icon] || '🌤️') : '';

  return (
    <div className="page">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #0277BD, #29B6F6)' }}>
        <div className="container">
          <div className="page-hero-icon">🌤️</div>
          <h1>Weather Intelligence</h1>
          <p>Get real-time weather data with agriculture-focused insights for any city.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px' }}>
        {/* Search */}
        <form onSubmit={fetchWeather} className="weather-search glass" style={{ maxWidth: 600, margin: '0 auto 40px' }}>
          <input
            className="form-control"
            placeholder="Enter city name (e.g. Mumbai, Delhi, London…)"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <><span className="mini-spinner" /> Fetching…</> : '🔍 Search'}
          </button>
        </form>

        {error && <div className="alert alert-danger" style={{ maxWidth: 600, margin: '0 auto 24px' }}>{error}</div>}

        {weather && (
          <div className="weather-grid animate-fade-up">
            {/* Main card */}
            <div className="weather-main card">
              {weather.demo && (
                <div className="demo-notice">⚠️ Demo data — add a real WeatherAPI key in `.env`</div>
              )}
              <div className="weather-header">
                <div>
                  <div className="weather-city">{weather.city}</div>
                  <div className="weather-country">{weather.country}</div>
                  <div className="weather-desc">{weather.description}</div>
                </div>
                <div className="weather-big-icon">{icon}</div>
              </div>
              <div className="weather-temp">{weather.temperature}°C</div>
              {weather.feels_like && (
                <div className="weather-feels">Feels like {weather.feels_like}°C</div>
              )}

              <div className="weather-metrics">
                {[
                  { icon: '💧', label: 'Humidity', val: `${weather.humidity}%` },
                  { icon: '🌬️', label: 'Wind', val: `${weather.wind_speed} m/s` },
                  { icon: '👁️', label: 'Visibility', val: `${weather.visibility ?? '—'} km` },
                  { icon: '📊', label: 'Pressure', val: `${weather.pressure} hPa` },
                ].map(m => (
                  <div key={m.label} className="metric-pill">
                    <span>{m.icon}</span>
                    <div>
                      <div className="metric-val">{m.val}</div>
                      <div className="metric-label">{m.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Farming advice */}
            <div className="weather-advice card">
              <h3>🌾 Farming Advice</h3>
              <div className="advice-list">
                {weather.humidity > 80 && (
                  <div className="advice-item alert-warning">
                    <strong>⚠️ High Humidity</strong>
                    <p>Watch for fungal diseases. Consider preventive fungicide application.</p>
                  </div>
                )}
                {weather.temperature > 38 && (
                  <div className="advice-item alert-danger">
                    <strong>🌡️ Heat Stress Risk</strong>
                    <p>Irrigate early morning/evening to reduce crop heat stress.</p>
                  </div>
                )}
                {weather.temperature < 10 && (
                  <div className="advice-item alert-info">
                    <strong>❄️ Cold Alert</strong>
                    <p>Protect sensitive crops with mulching or row covers.</p>
                  </div>
                )}
                {weather.wind_speed > 10 && (
                  <div className="advice-item alert-warning">
                    <strong>💨 Strong Winds</strong>
                    <p>Avoid pesticide spraying — it will drift. Provide staking support.</p>
                  </div>
                )}
                <div className="advice-item alert-success">
                  <strong>✅ General Tip</strong>
                  <p>
                    {weather.temperature >= 20 && weather.temperature <= 35
                      ? 'Conditions look good for most field activities today.'
                      : 'Monitor conditions closely before starting field work.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="empty-state card" style={{ maxWidth: 500, margin: '0 auto' }}>
            <div style={{ fontSize: '4rem' }}>🌤️</div>
            <h3>Search for a city above</h3>
            <p>Weather data includes temperature, humidity, wind speed, and personalized farming recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
