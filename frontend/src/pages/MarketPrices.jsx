import { useState, useEffect } from 'react';
import API_BASE from '../api/config';

const CATEGORIES = ['All', 'Cereal', 'Vegetable', 'Cash Crop', 'Oilseed', 'Pulse'];

const STATES = [
  'All India', 'Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh',
  'Madhya Pradesh', 'Rajasthan', 'Gujarat', 'Karnataka', 'Andhra Pradesh',
  'Telangana', 'West Bengal', 'Bihar', 'Tamil Nadu', 'Kerala',
];

const trendColor = (t) => t === 'up' ? '#22c55e' : t === 'down' ? '#f43f5e' : '#f59e0b';
const trendIcon = (t) => t === 'up' ? '▲' : t === 'down' ? '▼' : '→';

function Spinner({ size = 6, color = '#3d8b37' }) {
  return (
    <svg className={`spin w-${size} h-${size}`} style={{ color }} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

export default function MarketPrices() {
  const [commodities, setCommodities] = useState([]);
  const [selected, setSelected] = useState('');
  const [stateVal, setStateVal] = useState('All India');
  const [category, setCategory] = useState('All');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCom, setLoadingCom] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/market/commodities/`)
      .then(r => r.json())
      .then(j => { if (j.success) setCommodities(j.commodities); })
      .catch(() => { })
      .finally(() => setLoadingCom(false));
  }, []);

  const fetchPrices = async () => {
    if (!selected) return;
    setLoading(true); setError(''); setData(null);
    try {
      const st = stateVal === 'All India' ? '' : stateVal;
      console.log("Api base ", API_BASE)
      const res = await fetch(
        `${API_BASE}/market/prices/?commodity=${encodeURIComponent(selected)}&state=${encodeURIComponent(st)}`
      );
      const json = await res.json();
      console.log("Api response ", json)
      if (json.success) setData(json);
      else setError(json.error || 'Failed to fetch prices.');
    } catch {
      setError('Server unreachable. Please ensure Django is running.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = category === 'All' ? commodities : commodities.filter(c => c.category === category);
  const selectedObj = commodities.find(c => c.name === selected);

  const summaryCards = data ? [
    { label: 'Avg Modal Price', value: `₹${data.summary.avg_modal.toLocaleString('en-IN')}`, sub: data.summary.unit, icon: '📊', showTrend: true },
    { label: 'Highest Price', value: `₹${data.summary.highest.toLocaleString('en-IN')}`, sub: 'Best market', icon: '📈' },
    { label: 'Lowest Price', value: `₹${data.summary.lowest.toLocaleString('en-IN')}`, sub: 'Floor price', icon: '📉' },
    { label: 'Markets Tracked', value: String(data.summary.total_markets), sub: 'Mandis', icon: '🏪' },
  ] : [];

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .mp-font  { font-family: 'DM Sans', sans-serif; }
        .mp-serif { font-family: 'Lora', Georgia, serif; }
        .mp-leaf {
          background-image:
            radial-gradient(circle at 10% 30%, rgba(61,139,55,0.07) 0%, transparent 50%),
            radial-gradient(circle at 90% 70%, rgba(251,191,36,0.06) 0%, transparent 45%);
        }
        .mp-select {
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }
        .mp-select:focus { border-color: #3d8b37; box-shadow: 0 0 0 4px rgba(61,139,55,0.10); }
        .mp-btn {
          background: linear-gradient(135deg, #3d8b37 0%, #5aab54 100%);
          box-shadow: 0 8px 24px rgba(61,139,55,0.35);
          transition: transform 0.3s, box-shadow 0.3s;
          font-family: 'DM Sans', sans-serif;
        }
        .mp-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(61,139,55,0.45); }
        .mp-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .com-chip {
          font-family: 'DM Sans', sans-serif;
          transition: all 0.18s ease;
          cursor: pointer;
          border: 1.5px solid #e7e5e4;
          width: 100%;
          text-align: left;
        }
        .com-chip:hover  { border-color: #3d8b37; color: #3d8b37; background: #f0faf0; }
        .com-chip.active { background: #3d8b37; color: #fff; border-color: #3d8b37; }
        .cat-btn { font-family:'DM Sans',sans-serif; transition: all 0.18s; cursor:pointer; }
        .cat-btn.active { background:#3d8b37 !important; color:#fff !important; border-color:#3d8b37 !important; }
        .card-in { animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes cardIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .row-in  { animation: rowIn  0.4s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes rowIn  { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .ticker { animation: tick 28s linear infinite; }
        @keyframes tick { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .price-fill { transition: width 0.9s cubic-bezier(0.16,1,0.3,1); }
        .demo-strip { background: linear-gradient(90deg, #f59e0b, #f97316); font-family:'DM Sans',sans-serif; }
        .mp-table-row { display: grid; grid-template-columns: 1fr 90px 90px 110px 110px; gap: 8px; }
      `}</style>

      <div className="mp-font mp-leaf pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* ── Header ── */}
          <div className="mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#3d8b37] mb-4">
              Live · Mandi Price Intelligence
            </span>
            <h1 className="mp-serif text-5xl md:text-6xl font-bold text-stone-900 leading-[1.08] mb-4">
              Market <span className="italic text-[#3d8b37]">Prices</span>
            </h1>
            <p className="text-stone-500 text-lg font-light max-w-xl leading-relaxed">
              Real-time commodity prices from India's APMC mandis via Agmarknet. Know the best market to sell — before you load your truck.
            </p>
          </div>

          {/* ── Ticker bar ── */}
          {data && data.markets.length > 0 && (
            <div className="bg-[#1a3d19] rounded-2xl overflow-hidden mb-8 flex items-center h-10 card-in">
              <div className="flex-shrink-0 bg-[#3d8b37] text-white text-xs font-bold px-4 h-full flex items-center gap-1.5">
                <span>📈</span> LIVE
              </div>
              <div className="overflow-hidden flex-1">
                <div className="ticker flex gap-10 whitespace-nowrap text-xs text-white/80 font-medium px-6">
                  {[...data.markets, ...data.markets].map((m, i) => (
                    <span key={`tick-${i}`}>
                      {selectedObj?.icon} {m.market} —{' '}
                      <span className="text-[#86c06b] font-bold">₹{m.modal_price.toLocaleString('en-IN')}</span>/Qtl
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,340px) minmax(0,1fr)', gap: '24px', alignItems: 'start' }}
            className="flex flex-col lg:grid">

            {/* ── Left Panel ── */}
            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden" style={{ position: 'sticky', top: '96px' }}>
              <div className="px-6 py-5 border-b border-stone-100">
                <h2 className="mp-serif text-lg font-bold text-stone-900">Select Commodity</h2>
                <p className="text-stone-400 text-xs mt-0.5">Pick a crop to check mandi prices</p>
              </div>

              {/* Category filter */}
              <div className="px-5 pt-4 pb-2 flex flex-wrap gap-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`cat-btn text-xs font-semibold px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-600 ${category === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Commodity list */}
              <div className="p-3 flex flex-col gap-1" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                {loadingCom
                  ? <div className="flex justify-center py-8"><Spinner /></div>
                  : filtered.map(c => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelected(c.name)}
                      className={`com-chip flex items-center gap-3 px-4 py-3 rounded-2xl bg-stone-50 text-stone-700 text-sm font-medium ${selected === c.name ? 'active' : ''}`}
                    >
                      <span className="text-xl flex-shrink-0">{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{c.name}</div>
                        <div className="text-xs text-stone-400 font-normal">{c.category}</div>
                      </div>
                      {selected === c.name && <span className="text-xs opacity-80">✓</span>}
                    </button>
                  ))
                }
              </div>

              {/* State + Fetch button */}
              <div className="px-5 pb-5 pt-3 border-t border-stone-100">
                <label className="block text-xs font-bold tracking-widest uppercase text-stone-400 mb-2 mt-3">📍 State / Region</label>
                <select
                  className="mp-select w-full px-4 py-3 rounded-2xl border-2 border-stone-200 bg-stone-50 text-stone-900 text-sm font-medium mb-4"
                  value={stateVal}
                  onChange={e => setStateVal(e.target.value)}
                >
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <button
                  type="button"
                  onClick={fetchPrices}
                  disabled={!selected || loading}
                  className="mp-btn w-full text-white font-semibold text-sm py-3.5 rounded-2xl border-0 flex items-center justify-center gap-2"
                >
                  {loading
                    ? <><Spinner size={4} color="#fff" /> Fetching Prices…</>
                    : <><span>📊</span> Get Mandi Prices</>
                  }
                </button>

                {error && (
                  <div className="mt-3 flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-2xl p-3">
                    <span className="flex-shrink-0 text-sm">⚠️</span>
                    <p className="text-rose-700 text-xs font-medium leading-relaxed">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right Panel ── */}
            <div className="flex flex-col gap-5 min-w-0">

              {/* Empty state */}
              {!data && !loading && (
                <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-16 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 flex items-center justify-center text-4xl mx-auto mb-5">📊</div>
                  <p className="mp-serif text-xl font-semibold text-stone-400 mb-2">Select a Commodity</p>
                  <p className="text-stone-300 text-sm max-w-xs mx-auto leading-relaxed">
                    Choose any crop from the panel and click <strong>Get Mandi Prices</strong> to see live market rates.
                  </p>
                </div>
              )}

              {/* Loading state */}
              {loading && (
                <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-12 flex items-center justify-center gap-4">
                  <Spinner size={8} />
                  <div>
                    <p className="font-semibold text-stone-700">Fetching mandi prices…</p>
                    <p className="text-stone-400 text-sm">Connecting to Agmarknet data</p>
                  </div>
                </div>
              )}

              {data && (
                <>
                  {/* Demo badge */}
                  {data.is_demo && (
                    <div className="demo-strip text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 card-in">
                      <span>⚡</span>
                      Demo Mode — Realistic simulated prices (Agmarknet API unavailable). Real prices load automatically when connected.
                    </div>
                  )}

                  {/* Summary stat cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {summaryCards.map((s, i) => (
                      <div key={`stat-${i}`} className="card-in bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex flex-col gap-1" style={{ animationDelay: `${i * 0.07}s` }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xl">{s.icon}</span>
                          {s.showTrend && (
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-lg"
                              style={{ color: trendColor(data.summary.trend), background: `${trendColor(data.summary.trend)}22` }}
                            >
                              {trendIcon(data.summary.trend)} {data.summary.trend_pct}%
                            </span>
                          )}
                        </div>
                        <div className="text-2xl font-bold text-stone-900">{s.value}</div>
                        <div className="text-xs text-stone-400 font-semibold uppercase tracking-wide">{s.sub}</div>
                        <div className="text-xs text-stone-500 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Dark info bar */}
                  <div className="card-in bg-[#1a3d19] rounded-3xl px-8 py-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#3d8b37]/20 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold tracking-widest uppercase text-[#86c06b] mb-1">Price Intelligence Report</div>
                        <p className="text-white text-lg font-semibold">
                          {selectedObj?.icon} {data.commodity} · {data.state}
                        </p>
                        <p className="text-white/50 text-sm">Fetched {data.fetched_at}</p>
                      </div>
                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{ color: trendColor(data.summary.trend) }}>
                            {trendIcon(data.summary.trend)} {data.summary.trend_pct}%
                          </div>
                          <div className="text-xs text-white/50 uppercase tracking-wide font-semibold">vs. MSP</div>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{data.summary.total_markets}</div>
                          <div className="text-xs text-white/50 uppercase tracking-wide font-semibold">Mandis</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mandi price table */}
                  <div className="card-in bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-5 border-b border-stone-100 flex items-center justify-between gap-4">
                      <div>
                        <h2 className="mp-serif text-xl font-bold text-stone-900">Mandi-wise Prices</h2>
                        <p className="text-stone-400 text-sm mt-0.5">Sorted by modal price · highest first</p>
                      </div>
                      <span className="text-xs font-semibold bg-stone-100 text-stone-500 px-3 py-1.5 rounded-xl flex-shrink-0">₹ / Quintal</span>
                    </div>

                    {/* Header row */}
                    <div className="mp-table-row px-8 py-3 bg-stone-50 border-b border-stone-100 text-xs font-bold uppercase tracking-widest text-stone-400">
                      <span>Market / Mandi</span>
                      <span style={{ textAlign: 'right' }}>Min</span>
                      <span style={{ textAlign: 'right' }}>Max</span>
                      <span style={{ textAlign: 'right' }}>Modal</span>
                      <span style={{ textAlign: 'right' }}>Date</span>
                    </div>

                    {/* Data rows */}
                    <div>
                      {data.markets.map((m, i) => {
                        const pct = data.summary.highest > 0 ? (m.modal_price / data.summary.highest) * 100 : 0;
                        const isTop = i === 0;
                        return (
                          <div
                            key={`market-${i}`}
                            className={`mp-table-row row-in px-8 py-4 items-center border-b border-stone-50 hover:bg-stone-50 transition-colors ${isTop ? 'bg-[#f0faf0]' : 'bg-white'}`}
                            style={{ animationDelay: `${i * 0.04}s` }}
                          >
                            {/* Market name + bar */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                {isTop && (
                                  <span className="text-xs bg-[#3d8b37] text-white font-bold px-2 py-0.5 rounded-lg flex-shrink-0">BEST</span>
                                )}
                                <span className="font-semibold text-stone-800 text-sm truncate">{m.market}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="bg-stone-100 rounded-full overflow-hidden flex-1" style={{ maxWidth: '120px', height: '5px' }}>
                                  <div className="price-fill bg-[#3d8b37] h-full rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-xs text-stone-400">{m.state}</span>
                              </div>
                            </div>
                            <span className="text-sm text-stone-500 font-medium" style={{ textAlign: 'right' }}>₹{m.min_price.toLocaleString('en-IN')}</span>
                            <span className="text-sm text-stone-500 font-medium" style={{ textAlign: 'right' }}>₹{m.max_price.toLocaleString('en-IN')}</span>
                            <span className="text-base font-bold text-stone-900" style={{ textAlign: 'right' }}>₹{m.modal_price.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-stone-400 font-medium" style={{ textAlign: 'right' }}>{m.arrival_date}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom CTA */}
                  <div className="card-in bg-white rounded-3xl border border-stone-100 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="mp-serif text-base font-bold text-stone-800 mb-0.5">Need selling advice?</div>
                      <p className="text-stone-400 text-sm">Ask the AI Assistant about the best time to sell at current market rates.</p>
                    </div>
                    <a
                      href="/chatbot"
                      className="flex-shrink-0 inline-flex items-center gap-2 bg-[#3d8b37] hover:bg-[#2f7229] text-white font-semibold text-sm px-6 py-3 rounded-xl no-underline transition-colors whitespace-nowrap"
                    >
                      🤖 Ask AI Assistant →
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
