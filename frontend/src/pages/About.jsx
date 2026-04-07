export default function About() {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .about-font  { font-family: 'DM Sans', sans-serif; }
        .about-serif { font-family: 'Lora', Georgia, serif; }
        .leaf-bg {
          background-image:
            radial-gradient(circle at 10% 30%, rgba(134,192,107,0.07) 0%, transparent 50%),
            radial-gradient(circle at 90% 70%, rgba(251,191,36,0.05) 0%, transparent 45%);
        }
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="about-font leaf-bg pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* ── Header ── */}
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#3d8b37] mb-4">
              Our Vision
            </span>
            <h1 className="about-serif text-5xl md:text-6xl font-bold text-stone-900 leading-[1.08] mb-6">
              Innovation in <br />
              <span className="italic text-[#3d8b37]">Agri-Tech.</span>
            </h1>
            <p className="text-stone-500 text-lg font-light max-w-2xl mx-auto leading-relaxed">
              AgriZone is a high-performance intelligence platform designed to empower farmers with real-time AI insights, hyper-local data, and sustainable agricultural strategies.
            </p>
          </div>

          {/* ── Cards Grid ── */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-3xl border border-stone-100 p-8 shadow-sm shadow-black/4">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-2xl mb-5">
                🌍
              </div>
              <h3 className="about-serif text-xl font-bold text-stone-900 mb-3">Global Mission</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Driving food security through data-driven precision farming for every corner of the planet.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl border border-stone-100 p-8 shadow-sm shadow-black/4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl mb-5">
                🤖
              </div>
              <h3 className="about-serif text-xl font-bold text-stone-900 mb-3">AI First</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Leveraging advanced neural networks to predict crop success and identify plant pathologies.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl border border-stone-100 p-8 shadow-sm shadow-black/4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl mb-5">
                ⚡
              </div>
              <h3 className="about-serif text-xl font-bold text-stone-900 mb-3">Real-time Data</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Hyper-local sensors and satellite connectivity for sub-meter accurate weather and pest tracking.
              </p>
            </div>
          </div>

          {/* ── Sustainable Growth Hero ── */}
          <div className="bg-[#1a3d19] rounded-3xl p-10 md:p-14 relative overflow-hidden grain shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#3d8b37]/20 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#86c06b]/10 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-5xl flex-shrink-0">
                🌱
              </div>
              <div>
                <h2 className="about-serif text-3xl md:text-4xl font-bold text-white mb-4">
                  Sustainable Growth
                </h2>
                <p className="text-white/70 text-lg leading-relaxed max-w-2xl font-light">
                  We believe in a future where technology and nature exist in perfect harmony to preserve the earth for future generations.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
