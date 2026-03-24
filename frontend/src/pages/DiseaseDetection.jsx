import { useState, useRef } from 'react';
import API_BASE from '../api/config';

const TIPS = [
  { icon: '💡', text: 'Ensure the leaf is well-lit and fills at least 70% of the frame.' },
  { icon: '📐', text: 'Lay the leaf flat on a neutral surface for clearest results.' },
  { icon: '🔍', text: 'Capture both healthy and affected areas in the same shot.' },
];

const SEVERITY_CONFIG = {
  healthy: { label: 'Healthy', bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-500', text: 'text-emerald-800', icon: '✅' },
  mild: { label: 'Mild', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-500', text: 'text-amber-800', icon: '⚠️' },
  moderate: { label: 'Moderate', bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-500', text: 'text-orange-800', icon: '🔶' },
  severe: { label: 'Severe', bg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-500', text: 'text-rose-800', icon: '🚨' },
};

function getSeverity(disease, confidence) {
  if (!disease) return SEVERITY_CONFIG.mild;
  const d = disease.toLowerCase();
  if (d.includes('healthy')) return SEVERITY_CONFIG.healthy;
  if (confidence >= 90) return SEVERITY_CONFIG.severe;
  if (confidence >= 75) return SEVERITY_CONFIG.moderate;
  return SEVERITY_CONFIG.mild;
}

export default function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);
  const [confAnim, setConfAnim] = useState(0);
  const inputRef = useRef();

  const processFile = file => {
    if (!file || !file.type.startsWith('image/')) return;
    setImage(file); setPreview(URL.createObjectURL(file));
    setResult(null); setError('');
  };

  const onDrop = e => { e.preventDefault(); setDrag(false); processFile(e.dataTransfer.files[0]); };

  const submit = async () => {
    if (!image) return;
    setLoading(true); setError(''); setResult(null); setConfAnim(0);
    const fd = new FormData();
    fd.append('image', image);
    try {
      const res = await fetch(`${API_BASE}/disease/api/upload/`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setResult(data);
        // animate confidence bar
        setTimeout(() => setConfAnim(data.confidence), 100);
      } else setError(data.error || 'Detection failed.');
    } catch {
      setError('Server unreachable. Make sure Django is running.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setImage(null); setPreview(null); setResult(null); setError(''); setConfAnim(0); };

  const severity = result ? getSeverity(result.disease, result.confidence) : null;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .d-font  { font-family: 'DM Sans', sans-serif; }
        .d-serif { font-family: 'Lora', Georgia, serif; }
        .leaf-bg {
          background-image:
            radial-gradient(circle at 10% 30%, rgba(134,192,107,0.07) 0%, transparent 50%),
            radial-gradient(circle at 90% 70%, rgba(251,191,36,0.05) 0%, transparent 45%);
        }
        .drop-zone {
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .drop-zone:hover { transform: scale(1.01); }
        .drop-zone.dragging { border-color: #3d8b37 !important; background: rgba(61,139,55,0.04); transform: scale(1.02); }
        .scan-btn {
          background: linear-gradient(135deg, #3d8b37 0%, #5aab54 100%);
          box-shadow: 0 8px 24px rgba(61,139,55,0.35);
          transition: all 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .scan-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(61,139,55,0.45); }
        .scan-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .result-enter { animation: resultIn 0.65s cubic-bezier(0.16,1,0.3,1); }
        @keyframes resultIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .conf-bar { transition: width 1.2s cubic-bezier(0.16,1,0.3,1); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .scan-line {
          animation: scanDown 2s ease-in-out infinite;
        }
        @keyframes scanDown {
          0%   { top: 0%; opacity: 1; }
          90%  { top: 95%; opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
        }
        .img-enter { animation: imgIn 0.5s cubic-bezier(0.16,1,0.3,1); }
        @keyframes imgIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }
      `}</style>

      <div className="d-font leaf-bg pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">

          {/* ── Header ── */}
          <div className="mb-12">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#3d8b37] mb-4">
              Vision AI · Plant Pathology
            </span>
            <h1 className="d-serif text-5xl md:text-6xl font-bold text-stone-900 leading-[1.08] mb-4">
              Disease <span className="italic text-[#3d8b37]">Detection</span>
            </h1>
            <p className="text-stone-500 text-lg font-light max-w-xl leading-relaxed">
              Upload a photo of your plant leaf and get an instant AI-powered diagnosis with a treatment plan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">

            {/* ── Left: Upload Panel ── */}
            <div className="flex flex-col gap-5">
              <div className="bg-white rounded-3xl border border-stone-100 shadow-sm shadow-black/4 overflow-hidden">
                {/* Panel header */}
                <div className="px-7 py-5 border-b border-stone-100">
                  <h2 className="d-serif text-xl font-bold text-stone-900">Upload Leaf Image</h2>
                  <p className="text-stone-400 text-sm mt-0.5">JPG, PNG or WEBP · Max 10 MB</p>
                </div>

                <div className="p-6">
                  {/* Drop zone — empty */}
                  {!preview && (
                    <div
                      className={`drop-zone ${drag ? 'dragging' : ''} border-2 border-dashed border-stone-200 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer bg-stone-50 hover:border-[#3d8b37]/40 hover:bg-emerald-50/20`}
                      onDrop={onDrop}
                      onDragOver={e => { e.preventDefault(); setDrag(true); }}
                      onDragLeave={() => setDrag(false)}
                      onClick={() => inputRef.current?.click()}
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-4 transition-all duration-300 ${drag ? 'bg-[#3d8b37]/10 scale-110' : 'bg-stone-100'}`}>
                        🍃
                      </div>
                      <p className="text-sm font-semibold text-stone-600 mb-1">
                        {drag ? 'Release to upload' : 'Drop leaf image here'}
                      </p>
                      <p className="text-xs text-stone-400">or click to browse files</p>
                      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => processFile(e.target.files[0])} />
                    </div>
                  )}

                  {/* Preview */}
                  {preview && (
                    <div className="img-enter">
                      <div className="relative rounded-2xl overflow-hidden h-64 bg-stone-900">
                        <img src={preview} alt="Leaf preview" className="w-full h-full object-cover" />
                        {/* Scan animation overlay when loading */}
                        {loading && (
                          <div className="absolute inset-0 bg-[#1a3d19]/60 flex items-center justify-center">
                            <div className="scan-line absolute left-0 right-0 h-0.5 bg-[#86c06b]/80" style={{ boxShadow: '0 0 12px rgba(134,192,107,0.8)' }} />
                            <div className="text-center z-10">
                              <svg className="spin w-8 h-8 text-[#86c06b] mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                              </svg>
                              <p className="text-white font-semibold text-sm">Scanning leaf patterns…</p>
                              <p className="text-white/50 text-xs mt-1">Running pathology model</p>
                            </div>
                          </div>
                        )}
                        {/* Corner badge */}
                        {!loading && (
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-600 shadow-sm">
                            {image?.name?.length > 20 ? image.name.slice(0, 20) + '…' : image?.name}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={submit}
                          disabled={loading}
                          className="scan-btn flex-1 text-white font-semibold text-sm py-3.5 rounded-xl border-0 cursor-pointer flex items-center justify-center gap-2"
                        >
                          {loading
                            ? <><svg className="spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Analyzing…</>
                            : <><span className="text-base">🔬</span> Run Diagnosis</>
                          }
                        </button>
                        <button
                          onClick={reset}
                          className="bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold text-sm px-5 py-3.5 rounded-xl border-0 cursor-pointer transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4">
                      <span className="text-lg flex-shrink-0">⚠️</span>
                      <p className="text-rose-700 text-sm font-medium leading-relaxed">{error}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips card */}
              <div className="bg-[#1a3d19] rounded-3xl p-6 grain relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3d8b37]/20 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">📸</span>
                    <span className="text-xs font-bold tracking-widest uppercase text-[#86c06b]">Photo Tips</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {TIPS.map((t, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-base flex-shrink-0">{t.icon}</span>
                        <p className="text-white/70 text-xs leading-relaxed">{t.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Result Panel ── */}
            <div className="flex flex-col gap-5 md:sticky md:top-28">
              <div className="bg-white rounded-3xl border border-stone-100 shadow-sm shadow-black/4 overflow-hidden min-h-[420px] flex flex-col">

                {/* Empty state */}
                {!result && !loading && (
                  <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 flex items-center justify-center text-4xl mb-5">
                      🔬
                    </div>
                    <p className="d-serif text-lg font-semibold text-stone-400 mb-2">Awaiting Image</p>
                    <p className="text-stone-300 text-sm max-w-[230px] leading-relaxed">
                      Upload a leaf photo and run the diagnosis to see results here.
                    </p>
                    {/* Feature hints */}
                    <div className="mt-8 grid grid-cols-2 gap-3 w-full">
                      {[
                        { icon: '🦠', label: '400+ diseases identified' },
                        { icon: '⚡', label: 'Results in under 3s' },
                        { icon: '💊', label: 'Treatment plans included' },
                        { icon: '🌿', label: '50+ plant species' },
                      ].map((f, i) => (
                        <div key={i} className="bg-stone-50 border border-stone-100 rounded-2xl p-3 flex items-center gap-2.5">
                          <span className="text-xl">{f.icon}</span>
                          <span className="text-xs text-stone-500 font-medium leading-tight">{f.label}</span>
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
                      <div className="absolute inset-0 rounded-full border-4 border-t-[#3d8b37] border-r-transparent border-b-transparent border-l-transparent spin" />
                      <div className="absolute inset-3 flex items-center justify-center text-2xl">🌿</div>
                    </div>
                    <p className="d-serif text-lg font-semibold text-stone-700 mb-1">Analyzing Leaf…</p>
                    <p className="text-stone-400 text-sm mb-7">Running plant pathology model</p>
                    <div className="flex flex-col gap-2.5 w-full">
                      {['Extracting visual features', 'Matching disease patterns', 'Generating treatment plan'].map((s, i) => (
                        <div key={i} className="flex items-center gap-3 bg-stone-50 rounded-xl px-4 py-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#3d8b37] flex-shrink-0" />
                          <span className="text-xs text-stone-500 font-medium">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Result state */}
                {result && !loading && severity && (
                  <div className="result-enter flex-1 flex flex-col">
                    {/* Status banner */}
                    <div className={`${severity.bg} border-b ${severity.border} px-7 py-5 flex items-center gap-4`}>
                      <div className={`w-10 h-10 ${severity.badge} rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0`}>
                        {severity.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-0.5">Diagnosis Complete</div>
                        <div className={`d-serif text-xl font-bold ${severity.text}`}>{result.disease}</div>
                      </div>
                    </div>

                    <div className="p-7 flex flex-col gap-5 flex-1">
                      {/* Confidence bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Detection Confidence</span>
                          <span className="text-base font-bold text-[#3d8b37]">{result.confidence}%</span>
                        </div>
                        <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="conf-bar h-full rounded-full bg-gradient-to-r from-[#3d8b37] to-[#86c06b]"
                            style={{ width: `${confAnim}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1.5 text-xs text-stone-300">
                          <span>0%</span><span>50%</span><span>100%</span>
                        </div>
                      </div>

                      {/* Treatment plan */}
                      <div className="bg-stone-50 border border-stone-100 rounded-2xl p-5 flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">💊</span>
                          <span className="text-xs font-bold tracking-widest uppercase text-stone-500">Suggested Action Plan</span>
                        </div>
                        <p className="text-stone-700 text-sm leading-relaxed">{result.treatment}</p>
                      </div>

                      {/* CTA row */}
                      <div className="flex flex-col gap-3">
                        <a
                          href="/chatbot"
                          className="flex items-center justify-between bg-[#1a3d19] hover:bg-[#243f23] transition-colors text-white rounded-2xl px-5 py-4 no-underline group"
                        >
                          <div>
                            <div className="text-xs font-bold tracking-widest uppercase text-[#86c06b] mb-0.5">Ask AI</div>
                            <div className="text-sm font-semibold">Get detailed care instructions →</div>
                          </div>
                          <span className="text-2xl group-hover:scale-110 transition-transform">🤖</span>
                        </a>
                        <button
                          onClick={reset}
                          className="w-full text-center text-sm font-semibold text-stone-400 hover:text-stone-600 py-3 bg-stone-50 hover:bg-stone-100 rounded-2xl border border-stone-100 transition-colors cursor-pointer"
                        >
                          🔄 Scan Another Plant
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}