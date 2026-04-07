import { useState } from 'react';
import API_BASE from '../api/config';

const CROPS = [
  { label: 'Rice', icon: '🌾' },
  { label: 'Wheat', icon: '🌾' },
  { label: 'Tomato', icon: '🍅' },
  { label: 'Cotton', icon: '🤍' },
  { label: 'Maize', icon: '🌽' },
  { label: 'Sugarcane', icon: '🎋' },
  { label: 'Potato', icon: '🥔' },
  { label: 'Onion', icon: '🧅' },
];

const RISK_STYLE = {
  High:   { bg: 'bg-rose-50',   border: 'border-rose-200',   badge: 'bg-rose-500',   text: 'text-rose-700',   dot: '#f43f5e' },
  Medium: { bg: 'bg-amber-50',  border: 'border-amber-200',  badge: 'bg-amber-500',  text: 'text-amber-700',  dot: '#f59e0b' },
  Low:    { bg: 'bg-sky-50',    border: 'border-sky-200',    badge: 'bg-sky-500',    text: 'text-sky-700',    dot: '#0ea5e9' },
};

function getRisk(severity) {
  const s = (severity || '').toLowerCase();
  if (s.includes('high'))   return RISK_STYLE.High;
  if (s.includes('medium') || s.includes('moderate')) return RISK_STYLE.Medium;
  return RISK_STYLE.Low;
}

export default function PestAlerts() {
  const [crop,     setCrop]     = useState('');
  const [location, setLocation] = useState('');
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const fetchAlerts = async e => {
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

  const selectedCropIcon = CROPS.find(c => c.label === crop)?.icon ?? '🌱';

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .pa-font  { font-family: 'DM Sans', sans-serif; }
        .pa-serif { font-family: 'Lora', Georgia, serif; }
        .leaf-bg {
          background-image:
            radial-gradient(circle at 12% 35%, rgba(134,192,107,0.07) 0%, transparent 50%),
            radial-gradient(circle at 88% 65%, rgba(251,191,36,0.06) 0%, transparent 45%);
        }
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
        }
        .pa-input {
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.25s ease;
        }
        .pa-input:focus {
          border-color: #3d8b37;
          box-shadow: 0 0 0 4px rgba(61,139,55,0.1);
        }
        .fetch-btn {
          background: linear-gradient(135deg, #3d8b37 0%, #5aab54 100%);
          box-shadow: 0 8px 24px rgba(61,139,55,0.35);
          transition: all 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .fetch-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(61,139,55,0.45); }
        .fetch-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .alert-enter { animation: alertIn 0.55s cubic-bezier(0.16,1,0.3,1); }
        @keyframes alertIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .crop-chip {
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .crop-chip.selected, .crop-chip:hover {
          background: #3d8b37;
          color: white;
          border-color: #3d8b37;
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="pa-font leaf-bg pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">

          {/* ── Header ── */}
          <div className="mb-12">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#3d8b37] mb-4">
              Real-Time · Hyper-Local Risk Assessment
            </span>
            <h1 className="pa-serif text-5xl md:text-6xl font-bold text-stone-900 leading-[1.08] mb-4">
              Pest <span className="italic text-[#3d8b37]">Alerts</span>
            </h1>
            <p className="text-stone-500 text-lg font-light max-w-xl leading-relaxed">
              Select your crop and region to get AI-powered outbreak warnings before threats reach your fields.
            </p>
          </div>

          {/* ── Query Panel ── */}
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm shadow-black/4 overflow-hidden mb-8">
            <div className="px-8 py-6 border-b border-stone-100">
              <h2 className="pa-serif text-xl font-bold text-stone-900">Configure Alert Scan</h2>
              <p className="text-stone-400 text-sm mt-0.5">Choose your crop and enter your location to get a pest risk report</p>
            </div>

            <div className="p-8">
              {/* Crop chips */}
              <div className="mb-7">
                <label className="block text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">Select Crop</label>
                <div className="flex flex-wrap gap-2">
                  {CROPS.map(c => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => setCrop(c.label)}
                      className={`crop-chip flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 text-sm font-semibold ${crop === c.label ? 'selected' : ''}`}
                    >
                      <span>{c.icon}</span> {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location + Submit */}
              <form onSubmit={fetchAlerts} className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold tracking-widest uppercase text-stone-400 mb-2">📍 Location / District</label>
                  <input
                    className="pa-input w-full px-5 py-3.5 rounded-2xl border-2 border-stone-200 bg-stone-50 text-stone-900 text-sm placeholder-stone-400 font-medium"
                    placeholder="e.g. Punjab, Haryana, Maharashtra…"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !crop}
                  className="fetch-btn flex-shrink-0 text-white font-semibold text-sm px-8 py-3.5 rounded-2xl border-0 cursor-pointer flex items-center gap-2 whitespace-nowrap"
                >
                  {loading
                    ? <><svg className="spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Scanning Region…</>
                    : <><span>⚠️</span> Fetch Risk Report</>
                  }
                </button>
              </form>

              {error && (
                <div className="mt-5 flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4">
                  <span className="text-lg flex-shrink-0">⚠️</span>
                  <p className="text-rose-700 text-sm font-medium leading-relaxed">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Empty state ── */}
          {!data && !loading && (
            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 flex items-center justify-center text-4xl mx-auto mb-5">
                📍
              </div>
              <p className="pa-serif text-xl font-semibold text-stone-400 mb-2">Select Crop & Region</p>
              <p className="text-stone-300 text-sm max-w-xs mx-auto leading-relaxed">
                Choose your target crop and enter your location to deploy the pest surveillance engine.
              </p>
            </div>
          )}

          {/* ── Results ── */}
          {data && (
            <div className="alert-enter flex flex-col gap-6">

              {/* Weather status bar */}
              {data.weather && (
                <div className="bg-[#1a3d19] rounded-3xl px-8 py-6 grain relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#3d8b37]/20 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold tracking-widest uppercase text-[#86c06b]">Field Environmental Status</span>
                      </div>
                      <p className="text-white/60 text-sm">Analyzed conditions for <span className="text-white font-semibold">{location}</span> · <span className="text-white font-semibold">{selectedCropIcon} {crop}</span></p>
                    </div>
                    <div className="flex items-center gap-6 flex-shrink-0">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{data.weather.temp}°C</div>
                        <div className="text-xs text-white/50 font-semibold uppercase tracking-wide">Temp</div>
                      </div>
                      <div className="w-px h-10 bg-white/10" />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{data.weather.humidity}%</div>
                        <div className="text-xs text-white/50 font-semibold uppercase tracking-wide">Humidity</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* No threats */}
              {data.alerts.length === 0 && (
                <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-16 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-4xl mx-auto mb-5">
                    ✅
                  </div>
                  <p className="pa-serif text-2xl font-bold text-emerald-700 mb-2">No Active Threats</p>
                  <p className="text-stone-400 text-sm max-w-sm mx-auto leading-relaxed">
                    Current ecosystem conditions are optimal for <strong>{crop}</strong>. No immediate action required.
                  </p>
                </div>
              )}

              {/* Alerts grid */}
              {data.alerts.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-lg">⚠️</div>
                    <h2 className="pa-serif text-2xl font-bold text-stone-900">
                      {data.alerts.length} Active High-Risk {data.alerts.length === 1 ? 'Threat' : 'Threats'}
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {data.alerts.map((a, i) => {
                      const rs = getRisk(a.severity);
                      const name = a.pest_name || a.disease_name || 'Unknown Threat';
                      return (
                        <div key={i} className={`bg-white rounded-3xl border ${rs.border} shadow-sm shadow-black/4 overflow-hidden`}>
                          {/* Alert header */}
                          <div className={`${rs.bg} px-6 py-5 border-b ${rs.border}`}>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: rs.dot }} />
                                  <span className={`text-xs font-bold tracking-widest uppercase ${rs.text}`}>{a.severity} Risk</span>
                                </div>
                                <h3 className={`pa-serif text-xl font-bold ${rs.text}`}>{name}</h3>
                              </div>
                              <span className={`${rs.badge} text-white text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0`}>
                                {a.severity?.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* Alert body */}
                          <div className="p-6 flex flex-col gap-4">
                            {a.symptoms && (
                              <div>
                                <div className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-1.5">🔍 Symptoms</div>
                                <p className="text-stone-700 text-sm leading-relaxed">{a.symptoms}</p>
                              </div>
                            )}
                            <div className="h-px bg-stone-100" />
                            <div>
                              <div className="text-xs font-bold tracking-widest uppercase text-[#3d8b37] mb-1.5">💊 Treatment</div>
                              <p className="text-stone-800 text-sm leading-relaxed font-medium">{a.treatment}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom CTA */}
              <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="pa-serif text-base font-bold text-stone-800 mb-0.5">Want a deeper analysis?</div>
                  <p className="text-stone-400 text-sm">Ask the AI Assistant for tailored prevention strategies for your farm.</p>
                </div>
                <a
                  href="/chatbot"
                  className="flex-shrink-0 inline-flex items-center gap-2 bg-[#3d8b37] hover:bg-[#2f7229] text-white font-semibold text-sm px-6 py-3 rounded-xl no-underline transition-colors whitespace-nowrap"
                >
                  🤖 Ask AI Assistant →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
