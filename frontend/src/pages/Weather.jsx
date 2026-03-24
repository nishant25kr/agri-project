import { useState } from 'react';
import API_BASE from '../api/config';

const WEATHER_ICONS = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '🌥️',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '10d': '🌦️', '11d': '⛈️', '13d': '❄️', '50d': '🌫️',
};

const QUICK_CITIES = ['Mumbai', 'Delhi', 'Pune', 'Bengaluru', 'Chennai', 'Hyderabad'];

function getFarmingAlerts(w) {
  const alerts = [];
  if (w.humidity > 80)
    alerts.push({ icon: '🍄', level: 'warn', title: 'Fungal Disease Risk', desc: 'High humidity detected. Monitor crops closely and avoid morning watering to reduce fungal spread.', bg: 'bg-amber-50', border: 'border-amber-200', title_color: 'text-amber-800', desc_color: 'text-amber-700' });
  if (w.temperature > 38)
    alerts.push({ icon: '🌡️', level: 'danger', title: 'Heat Stress Warning', desc: 'Extreme heat. Crops may dehydrate rapidly — plan extra irrigation and shade nets for sensitive plants.', bg: 'bg-rose-50', border: 'border-rose-200', title_color: 'text-rose-800', desc_color: 'text-rose-700' });
  if (w.wind_speed > 10)
    alerts.push({ icon: '🌬️', level: 'warn', title: 'High Wind Advisory', desc: 'Strong winds may damage tall crops. Avoid spraying pesticides — they will drift off target.', bg: 'bg-sky-50', border: 'border-sky-200', title_color: 'text-sky-800', desc_color: 'text-sky-700' });
  if (w.temperature >= 20 && w.temperature <= 35 && w.humidity <= 80)
    alerts.push({ icon: '✅', level: 'good', title: 'Ideal Field Conditions', desc: 'Temperature and humidity are in the optimal range. Great time for sowing, spraying, and general field work.', bg: 'bg-emerald-50', border: 'border-emerald-200', title_color: 'text-emerald-800', desc_color: 'text-emerald-700' });
  if (alerts.length === 0)
    alerts.push({ icon: '🌾', level: 'neutral', title: 'Moderate Conditions', desc: 'Conditions are acceptable. Proceed with caution based on individual crop sensitivities.', bg: 'bg-stone-50', border: 'border-stone-200', title_color: 'text-stone-700', desc_color: 'text-stone-600' });
  return alerts;
}

function TempGauge({ temp }) {
  const clamped = Math.min(Math.max(temp, -10), 50);
  const pct = ((clamped + 10) / 60) * 100;
  const color = temp < 10 ? '#60a5fa' : temp < 25 ? '#34d399' : temp < 35 ? '#fbbf24' : '#f87171';
  return (
    <div className="flex items-end gap-2 mt-1">
      <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs text-white/50 flex-shrink-0 font-mono">{temp}°C</span>
    </div>
  );
}

export default function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName) => {
    const target = cityName ?? city;
    if (!target.trim()) return;
    setLoading(true); setError(''); setWeather(null);
    try {
      const res = await fetch(`${API_BASE}/weather/get-weather/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: target }),
      });
      const data = await res.json();
      if (data.success) { setWeather(data); setCity(target); }
      else setError(data.error || 'Could not get weather data.');
    } catch {
      setError('Server unreachable. Make sure Django is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = e => { e.preventDefault(); fetchWeather(); };
  const icon = weather ? (WEATHER_ICONS[weather.icon] || '🌤️') : '';
  const alerts = weather ? getFarmingAlerts(weather) : [];

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .w-font  { font-family: 'DM Sans', sans-serif; }
        .w-serif { font-family: 'Lora', Georgia, serif; }
        .leaf-bg {
          background-image:
            radial-gradient(circle at 15% 30%, rgba(134,192,107,0.07) 0%, transparent 50%),
            radial-gradient(circle at 85% 70%, rgba(96,165,250,0.06) 0%, transparent 45%);
        }
        .search-input {
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.25s ease;
        }
        .search-input:focus { border-color: #3d8b37; box-shadow: 0 0 0 4px rgba(61,139,55,0.1); }
        .fetch-btn {
          background: linear-gradient(135deg, #3d8b37 0%, #5aab54 100%);
          box-shadow: 0 6px 18px rgba(61,139,55,0.35);
          transition: all 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .fetch-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(61,139,55,0.42); }
        .fetch-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .weather-card-enter { animation: cardIn 0.6s cubic-bezier(0.16,1,0.3,1); }
        @keyframes cardIn { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .city-pill { transition: all 0.2s ease; }
        .city-pill:hover { transform: translateY(-2px); }
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="w-font leaf-bg pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">

          {/* ── Header ── */}
          <div className="mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#3d8b37] mb-4">
              Real-Time · Hyper-Local
            </span>
            <h1 className="w-serif text-5xl md:text-6xl font-bold text-stone-900 leading-[1.08] mb-4">
              Weather <span className="italic text-[#3d8b37]">Intelligence</span>
            </h1>
            <p className="text-stone-500 text-lg font-light max-w-xl leading-relaxed">
              Live weather data with smart farming alerts tailored to your field conditions.
            </p>
          </div>

          {/* ── Search Box ── */}
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm shadow-black/4 p-4 mb-6 max-w-2xl">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 text-lg pointer-events-none">📍</span>
                <input
                  className="search-input w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-stone-200 text-stone-800 text-sm bg-stone-50 placeholder-stone-300 font-medium"
                  placeholder="Enter city name (e.g. Mumbai, Berlin…)"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="fetch-btn text-white font-semibold text-sm px-7 py-3.5 rounded-xl border-0 cursor-pointer flex items-center gap-2 flex-shrink-0"
              >
                {loading
                  ? <><svg className="spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Fetching…</>
                  : <><span>🌤️</span> Get Weather</>
                }
              </button>
            </form>

            {error && (
              <div className="mt-3 flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                <span className="text-rose-500">⚠️</span>
                <p className="text-rose-700 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* ── Quick city pills ── */}
          <div className="flex flex-wrap gap-2 mb-12">
            <span className="text-xs text-stone-400 font-medium self-center mr-1">Quick select:</span>
            {QUICK_CITIES.map(c => (
              <button
                key={c}
                onClick={() => { setCity(c); fetchWeather(c); }}
                className="city-pill bg-white border border-stone-200 hover:border-[#3d8b37]/40 hover:text-[#3d8b37] text-stone-600 text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-colors"
              >
                {c}
              </button>
            ))}
          </div>

          {/* ── Empty state ── */}
          {!weather && !loading && (
            <div className="weather-card-enter max-w-md mx-auto text-center py-16">
              <div className="w-24 h-24 rounded-3xl bg-stone-50 border-2 border-dashed border-stone-200 flex items-center justify-center text-5xl mx-auto mb-6">
                🌍
              </div>
              <h3 className="w-serif text-xl font-bold text-stone-400 mb-2">Select Your Location</h3>
              <p className="text-stone-300 text-sm leading-relaxed max-w-xs mx-auto">
                Enter a city above or pick from the quick select list to fetch live weather data.
              </p>
            </div>
          )}

          {/* ── Weather Result ── */}
          {weather && !loading && (
            <div className="weather-card-enter grid md:grid-cols-[1fr_1fr] gap-6">

              {/* Main weather card — dark */}
              <div className="bg-[#1a3d19] rounded-3xl overflow-hidden relative grain">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#3d8b37]/20 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#86c06b]/10 rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

                <div className="relative z-10 p-8 flex flex-col h-full">
                  {/* City + icon */}
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h2 className="w-serif text-3xl font-bold text-white leading-tight">{weather.city}</h2>
                      <p className="text-white/50 text-sm mt-0.5">{weather.country}</p>
                      <span className="inline-block mt-3 text-xs font-bold tracking-widest uppercase text-[#86c06b] bg-[#3d8b37]/30 px-3 py-1 rounded-full">
                        {weather.description}
                      </span>
                    </div>
                    <div className="text-6xl flex-shrink-0 ml-4">{icon}</div>
                  </div>

                  {/* Big temperature */}
                  <div className="mb-2">
                    <div className="w-serif text-8xl font-bold text-white leading-none">
                      {weather.temperature}°
                    </div>
                    <div className="text-white/40 text-sm font-medium mt-1">Celsius</div>
                  </div>
                  <TempGauge temp={weather.temperature} />

                  {/* Metrics row */}
                  <div className="grid grid-cols-3 gap-3 mt-8">
                    {[
                      { icon: '💧', label: 'Humidity', val: `${weather.humidity}%` },
                      { icon: '🌬️', label: 'Wind', val: `${weather.wind_speed} m/s` },
                      { icon: '📊', label: 'Pressure', val: `${weather.pressure}` },
                    ].map(m => (
                      <div key={m.label} className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-3.5 text-center" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div className="text-2xl mb-1.5">{m.icon}</div>
                        <div className="text-white font-bold text-sm">{m.val}</div>
                        <div className="text-white/40 text-xs mt-0.5">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Source note */}
                  <p className="text-white/25 text-xs mt-6 font-medium">
                    📡 OpenWeather Systems · Updated in real-time
                  </p>
                </div>
              </div>

              {/* Farming Strategy card */}
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-3xl border border-stone-100 shadow-sm shadow-black/4 p-7 flex-1">
                  <h3 className="w-serif text-xl font-bold text-stone-900 mb-5">
                    Farming Strategy
                  </h3>

                  <div className="flex flex-col gap-3">
                    {alerts.map((a, i) => (
                      <div key={i} className={`${a.bg} border ${a.border} rounded-2xl p-4 flex items-start gap-3`}>
                        <span className="text-xl flex-shrink-0 mt-0.5">{a.icon}</span>
                        <div>
                          <div className={`text-sm font-bold ${a.title_color} mb-0.5`}>{a.title}</div>
                          <p className={`text-xs leading-relaxed ${a.desc_color}`}>{a.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feel-like + extra metrics */}
                <div className="bg-white rounded-3xl border border-stone-100 shadow-sm shadow-black/4 p-6">
                  <h4 className="w-serif text-sm font-bold text-stone-700 mb-4">Condition Snapshot</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Temperature', val: `${weather.temperature}°C`, icon: '🌡️', sub: weather.temperature < 20 ? 'Cool' : weather.temperature < 35 ? 'Warm' : 'Hot' },
                      { label: 'Humidity', val: `${weather.humidity}%`, icon: '💧', sub: weather.humidity < 40 ? 'Dry' : weather.humidity < 70 ? 'Moderate' : 'High' },
                      { label: 'Wind Speed', val: `${weather.wind_speed} m/s`, icon: '🌬️', sub: weather.wind_speed < 5 ? 'Calm' : weather.wind_speed < 10 ? 'Breezy' : 'Strong' },
                      { label: 'Pressure', val: `${weather.pressure} hPa`, icon: '📊', sub: weather.pressure < 1000 ? 'Low' : 'Normal' },
                    ].map(m => (
                      <div key={m.label} className="bg-stone-50 rounded-2xl p-3.5 border border-stone-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-stone-400 font-medium">{m.label}</span>
                          <span className="text-base">{m.icon}</span>
                        </div>
                        <div className="text-stone-900 font-bold text-sm">{m.val}</div>
                        <div className="text-xs text-[#3d8b37] font-semibold mt-0.5">{m.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="/chatbot"
                  className="bg-[#1a3d19] hover:bg-[#243f23] transition-colors text-white rounded-3xl p-5 flex items-center justify-between no-underline group"
                >
                  <div>
                    <div className="text-xs font-bold tracking-widest uppercase text-[#86c06b] mb-1">Ask the AI</div>
                    <div className="w-serif text-base font-bold">Get crop advice for {weather.city} →</div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#3d8b37] flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    🤖
                  </div>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}