import { useState } from 'react';
import API_BASE from '../api/config';

const FIELDS = [
  { name: 'Nitrogen', label: 'Nitrogen', abbr: 'N', unit: 'mg/kg', min: 0, max: 140, placeholder: '0–140', icon: '🌿', color: 'emerald' },
  { name: 'Phosphorus', label: 'Phosphorus', abbr: 'P', unit: 'mg/kg', min: 0, max: 145, placeholder: '5–145', icon: '🔴', color: 'rose' },
  { name: 'Potassium', label: 'Potassium', abbr: 'K', unit: 'mg/kg', min: 0, max: 205, placeholder: '5–205', icon: '🟡', color: 'amber' },
  { name: 'Temperature', label: 'Temperature', abbr: '°C', unit: '°C', min: 0, max: 50, placeholder: '8–45', icon: '🌡️', color: 'orange' },
  { name: 'Humidity', label: 'Humidity', abbr: '%', unit: '%', min: 0, max: 100, placeholder: '14–100', icon: '💧', color: 'sky' },
  { name: 'pH', label: 'Soil pH', abbr: 'pH', unit: '', min: 0, max: 14, placeholder: '3.5–9.9', icon: '🧪', color: 'violet' },
  { name: 'Rainfall', label: 'Rainfall', abbr: 'mm', unit: 'mm', min: 0, max: 300, placeholder: '20–300', icon: '🌧️', color: 'blue', full: true },
];

const INITIAL = { Nitrogen: '', Phosphorus: '', Potassium: '', Temperature: '', Humidity: '', pH: '', Rainfall: '' };

const CROP_ICONS = {
  rice: '🌾', wheat: '🌾', maize: '🌽', cotton: '🤍', sugarcane: '🎋',
  mango: '🥭', banana: '🍌', apple: '🍎', orange: '🍊', grapes: '🍇',
  watermelon: '🍉', muskmelon: '🍈', papaya: '🍈', coconut: '🥥',
  jute: '🪢', coffee: '☕', chickpea: '🫘', kidneybeans: '🫘', pigeonpeas: '🫘',
  mothbeans: '🫘', mungbean: '🫘', blackgram: '🫘', lentil: '🫘', pomegranate: '🍎',
};

function getCropIcon(crop) {
  return CROP_ICONS[crop?.toLowerCase()] ?? '🌱';
}

export default function CropRecommendation() {
  const [form, setForm] = useState(INITIAL);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(null);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/predict/`, {
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

  const allFilled = Object.values(form).every(v => v !== '');
  const filledCount = Object.values(form).filter(v => v !== '').length;
  const progress = Math.round((filledCount / FIELDS.length) * 100);

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .crop-font { font-family: 'DM Sans', sans-serif; }
        .crop-serif { font-family: 'Lora', Georgia, serif; }
        .leaf-bg {
          background-image:
            radial-gradient(circle at 15% 40%, rgba(134,192,107,0.07) 0%, transparent 50%),
            radial-gradient(circle at 85% 70%, rgba(251,191,36,0.06) 0%, transparent 45%);
        }
        .field-input {
          font-family: 'DM Sans', sans-serif;
          transition: all 0.25s ease;
          outline: none;
        }
        .field-input:focus {
          border-color: #3d8b37;
          box-shadow: 0 0 0 4px rgba(61,139,55,0.1);
        }
        .field-input:hover:not(:focus) {
          border-color: #a7f3d0;
        }
        .submit-btn {
          background: linear-gradient(135deg, #3d8b37 0%, #5aab54 100%);
          box-shadow: 0 8px 24px rgba(61,139,55,0.35);
          transition: all 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(61,139,55,0.45);
        }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .result-enter {
          animation: resultIn 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes resultIn {
          from { opacity: 0; transform: scale(0.95) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .spin-leaf {
          animation: spin 1.2s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .progress-bar {
          transition: width 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .grain-light {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="crop-font leaf-bg pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* ── Page Header ── */}
          <div className="mb-12">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#3d8b37] mb-4">
              AI-Powered · Precision Agriculture
            </span>
            <h1 className="crop-serif text-5xl md:text-6xl font-bold text-stone-900 leading-[1.08] mb-4">
              Crop <span className="italic text-[#3d8b37]">Advisor</span>
            </h1>
            <p className="text-stone-500 text-lg font-light max-w-xl leading-relaxed">
              Enter your soil and climate parameters. Our model returns the optimal crop with the highest success probability for your conditions.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_420px] gap-7 items-start">

            {/* ── Left: Input Panel ── */}
            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm shadow-black/4 overflow-hidden">
              {/* Panel header */}
              <div className="px-8 py-6 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h2 className="crop-serif text-xl font-bold text-stone-900">Soil & Climate Parameters</h2>
                  <p className="text-stone-400 text-sm mt-0.5">Fill all 7 fields to run the prediction</p>
                </div>
                {/* Progress pill */}
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-xs font-semibold text-stone-500">{filledCount}/7 fields</span>
                  <div className="w-28 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="progress-bar h-full bg-[#3d8b37] rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={submit} className="p-8">
                <div className="grid grid-cols-2 gap-5">
                  {FIELDS.map(f => (
                    <div
                      key={f.name}
                      className={`${f.full ? 'col-span-2' : 'col-span-1'} group`}
                    >
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                        <span className="text-sm leading-none">{f.icon}</span>
                        {f.label}
                        {f.unit && <span className="text-stone-300 font-normal normal-case tracking-normal">· {f.unit}</span>}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name={f.name}
                          value={form[f.name]}
                          onChange={handle}
                          onFocus={() => setFocused(f.name)}
                          onBlur={() => setFocused(null)}
                          placeholder={f.placeholder}
                          min={f.min}
                          max={f.max}
                          step="any"
                          required
                          className={`field-input w-full px-4 py-3 rounded-xl border-2 text-stone-900 text-sm bg-stone-50
                            placeholder-stone-300 font-medium
                            ${form[f.name] ? 'border-[#3d8b37]/40 bg-emerald-50/30' : 'border-stone-200'}
                            ${focused === f.name ? 'border-[#3d8b37] bg-white' : ''}
                          `}
                        />
                        {form[f.name] && focused !== f.name && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#3d8b37] rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Error */}
                {error && (
                  <div className="mt-5 flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4">
                    <span className="text-lg flex-shrink-0">⚠️</span>
                    <p className="text-rose-700 text-sm font-medium leading-relaxed">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !allFilled}
                  className="submit-btn mt-7 w-full text-white font-semibold text-base py-4 rounded-2xl flex items-center justify-center gap-3 border-0 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="spin-leaf w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Analyzing Soil Conditions…
                    </>
                  ) : (
                    <>
                      <span className="text-lg">🧠</span>
                      Run Prediction Engine
                      <span className="text-white/60 text-sm ml-1">→</span>
                    </>
                  )}
                </button>

                {!allFilled && !loading && (
                  <p className="text-center text-xs text-stone-400 mt-3">
                    {7 - filledCount} more field{7 - filledCount !== 1 ? 's' : ''} required
                  </p>
                )}
              </form>
            </div>

            {/* ── Right: Result + Tip ── */}
            <div className="flex flex-col gap-5 lg:sticky lg:top-28">

              {/* Result Card */}
              <div className="bg-white rounded-3xl border border-stone-100 shadow-sm shadow-black/4 overflow-hidden min-h-[380px] flex flex-col">

                {/* Empty state */}
                {!result && !loading && (
                  <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 flex items-center justify-center text-4xl mb-5">
                      🧪
                    </div>
                    <p className="crop-serif text-lg font-semibold text-stone-400 mb-2">Awaiting Input</p>
                    <p className="text-stone-300 text-sm max-w-[220px] leading-relaxed">
                      Fill in your soil parameters and hit the prediction button.
                    </p>
                    {/* Mini parameter hints */}
                    <div className="mt-8 grid grid-cols-3 gap-2 w-full">
                      {FIELDS.slice(0, 6).map(f => (
                        <div key={f.name} className="bg-stone-50 rounded-xl p-2.5 text-center border border-stone-100">
                          <div className="text-xl mb-1">{f.icon}</div>
                          <div className="text-xs text-stone-400 font-medium">{f.abbr}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading state */}
                {loading && (
                  <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                    <div className="relative w-20 h-20 mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-stone-100" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-[#3d8b37] border-r-transparent border-b-transparent border-l-transparent spin-leaf" />
                      <div className="absolute inset-3 flex items-center justify-center text-2xl">🌿</div>
                    </div>
                    <p className="crop-serif text-lg font-semibold text-stone-700 mb-1">Analyzing…</p>
                    <p className="text-stone-400 text-sm">Running ML model on your data</p>
                    <div className="mt-6 flex flex-col gap-2 w-full">
                      {["Checking soil nutrients", "Matching climate patterns", "Computing yield probability"].map((s, i) => (
                        <div key={i} className="flex items-center gap-3 bg-stone-50 rounded-xl px-4 py-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#3d8b37] flex-shrink-0" style={{ animationDelay: `${i * 0.3}s` }} />
                          <span className="text-xs text-stone-500 font-medium">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Result state */}
                {result && !loading && (
                  <div className="result-enter flex-1 flex flex-col">
                    {/* Top banner */}
                    <div className="bg-gradient-to-br from-[#3d8b37] to-[#5aab54] px-8 py-7 relative overflow-hidden grain-light">
                      <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
                      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full" />
                      <div className="relative z-10">
                        <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/70 mb-3">
                          ✓ Optimal Match Found
                        </span>
                        <div className="flex items-center gap-4">
                          <div className="text-5xl">{getCropIcon(result.crop)}</div>
                          <div>
                            <h2 className="crop-serif text-3xl font-bold text-white capitalize leading-none mb-1">
                              {result.crop}
                            </h2>
                            <p className="text-white/70 text-sm">Best crop for your conditions</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detail chips */}
                    <div className="p-6 flex flex-col gap-4">
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { icon: '🌡️', label: 'Climate Fit', color: 'bg-orange-50 border-orange-100' },
                          { icon: '🧪', label: 'Nutrient Match', color: 'bg-violet-50 border-violet-100' },
                          { icon: '💧', label: 'Rain Suitability', color: 'bg-sky-50 border-sky-100' },
                        ].map(chip => (
                          <div key={chip.label} className={`${chip.color} border rounded-2xl p-3 text-center`}>
                            <div className="text-2xl mb-1">{chip.icon}</div>
                            <div className="text-xs font-semibold text-stone-600 leading-tight">{chip.label}</div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                        <span className="text-lg flex-shrink-0">💡</span>
                        <p className="text-emerald-800 text-sm leading-relaxed">
                          <span className="font-semibold capitalize">{result.crop}</span> has the highest success probability for your soil profile. Consult the AI Assistant for a detailed growing guide.
                        </p>
                      </div>

                      <a
                        href="/chatbot"
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-[#3d8b37] border-2 border-[#3d8b37]/20 hover:border-[#3d8b37]/50 py-3 rounded-xl no-underline transition-colors"
                      >
                        <span>🤖</span> Ask AI for Growing Tips →
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Pro Tip Card */}
              <div className="bg-[#1a3d19] rounded-3xl p-7 relative overflow-hidden grain-light">
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#3d8b37]/20 rounded-full -translate-y-1/3 translate-x-1/3" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">💡</span>
                    <span className="text-xs font-bold tracking-widest uppercase text-[#86c06b]">Pro Tip</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    For best results, take soil samples from <span className="text-[#86c06b] font-semibold">at least 3 different points</span> in your field and use the average values.
                  </p>
                </div>
              </div>

              {/* Quick guide */}
              <div className="bg-white rounded-3xl border border-stone-100 p-6">
                <h4 className="crop-serif text-sm font-bold text-stone-700 mb-4">Parameter Ranges</h4>
                <div className="flex flex-col gap-2.5">
                  {FIELDS.map(f => (
                    <div key={f.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-stone-600 font-medium">
                        <span>{f.icon}</span> {f.label}
                      </div>
                      <span className="text-stone-400 font-mono bg-stone-50 px-2 py-0.5 rounded-lg">
                        {f.placeholder} {f.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}