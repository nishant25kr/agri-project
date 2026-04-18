import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

const NAV_LINKS = [
  { label: "Crop Advisor", href: "/crop" },
  { label: "Weather", href: "/weather" },
  { label: "Disease Scan", href: "/disease" },
  { label: "AI Assistant", href: "/chatbot" },
];

const FEATURES = [
  {
    icon: "🌾",
    tag: "PRECISION AI",
    title: "Crop Advisor",
    desc: "Input your soil's NPK, pH, and local microclimate data. Our model returns ranked crop recommendations with yield forecasts.",
    href: "/crop",
    size: "large",
    accent: "from-amber-50 to-yellow-100",
    border: "border-amber-200",
    tagColor: "text-amber-700 bg-amber-100",
  },
  {
    icon: "🔬",
    tag: "VISION MODEL",
    title: "Disease Scan",
    desc: "Photograph any leaf. Get a diagnosis in seconds powered by a fine-tuned plant pathology model.",
    href: "/disease",
    size: "small",
    accent: "from-emerald-50 to-green-100",
    border: "border-emerald-200",
    tagColor: "text-emerald-700 bg-emerald-100",
  },
  {
    icon: "🌤️",
    tag: "REAL-TIME",
    title: "Smart Weather",
    desc: "Hyper-local forecasts updated every 12 seconds, calibrated to your exact field coordinates.",
    href: "/weather",
    size: "small",
    accent: "from-sky-50 to-blue-100",
    border: "border-sky-200",
    tagColor: "text-sky-700 bg-sky-100",
  },
  {
    icon: "🤖",
    tag: "24/7 LLM",
    title: "AI Assistant",
    desc: "Ask anything. From pest control to market timing — your always-on agronomist.",
    href: "/chatbot",
    size: "small",
    accent: "from-violet-50 to-purple-100",
    border: "border-violet-200",
    tagColor: "text-violet-700 bg-violet-100",
  },
  {
    icon: "⚠️",
    tag: "ALERTS",
    title: "Risk Alerts",
    desc: "Automated outbreak and pest warnings for your region before they reach your fields.",
    href: "/pest-alerts",
    size: "small",
    accent: "from-rose-50 to-red-100",
    border: "border-rose-200",
    tagColor: "text-rose-700 bg-rose-100",
  },
];

const STATS = [
  { value: "90.4%", label: "Diagnosis Accuracy", sub: "across 400+ crop diseases" },
  { value: "2.3s", label: "Avg Scan Time", sub: "from photo to result" },
  { value: "24/7", label: "AI Availability", sub: "zero downtime SLA" },
];

const STEPS = [
  { num: "01", title: "Upload a Photo", desc: "Take a clear picture of the affected leaf, stem, or fruit." },
  { num: "02", title: "Describe the Issue", desc: "Add any symptoms you've noticed — wilting, spots, color change." },
  { num: "03", title: "Get Diagnosis", desc: "Our AI returns the disease name, cause, and treatment plan instantly." },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function AnimatedSection({ children, className = "", delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-serif { font-family: 'Lora', Georgia, serif; }
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
        }
        .leaf-pattern {
          background-image: radial-gradient(circle at 20% 50%, rgba(134,192,107,0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(251,191,36,0.07) 0%, transparent 40%),
                            radial-gradient(circle at 60% 80%, rgba(134,192,107,0.06) 0%, transparent 40%);
        }
        .card-hover {
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.1);
        }
        .btn-scan {
          background: linear-gradient(135deg, #3d8b37 0%, #5aab54 100%);
          box-shadow: 0 8px 24px rgba(61,139,55,0.35);
          transition: all 0.3s ease;
        }
        .btn-scan:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(61,139,55,0.45);
        }
        .hero-blob {
          animation: blob 12s ease-in-out infinite alternate;
        }
        @keyframes blob {
          0% { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
          50% { border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%; }
          100% { border-radius: 55% 45% 65% 35% / 45% 55% 45% 55%; }
        }
        .badge-pulse::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 9999px;
          background: rgba(61,139,55,0.3);
          animation: badge-ring 2s ease-out infinite;
        }
        @keyframes badge-ring {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .marquee {
          animation: marquee 28s linear infinite;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .step-line::after {
          content: '';
          position: absolute;
          top: 20px;
          left: calc(100% + 16px);
          width: calc(100% - 32px);
          height: 1px;
          background: repeating-linear-gradient(90deg, #86c06b 0, #86c06b 6px, transparent 6px, transparent 14px);
        }
      `}</style>

      {/* ── NAV ── */}
      {/* <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
        <div className={`mx-auto max-w-6xl px-6 flex items-center justify-between rounded-2xl transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border border-stone-200/80" : "bg-transparent"}`}>
          <a href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 bg-[#3d8b37] rounded-lg flex items-center justify-center text-white text-sm font-bold">A</div>
            <span className="font-serif font-bold text-xl text-stone-800 tracking-tight">AgriZone</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="text-sm font-medium text-stone-600 hover:text-[#3d8b37] transition-colors no-underline">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="/disease" className="btn-scan text-white text-sm font-semibold px-5 py-2.5 rounded-xl no-underline">
              Scan a Plant →
            </a>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 bg-white rounded-lg border border-stone-200">
            <span className="w-5 h-0.5 bg-stone-700 block" />
            <span className="w-5 h-0.5 bg-stone-700 block" />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-2 mx-4 bg-white rounded-2xl shadow-xl border border-stone-100 p-4">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="block py-3 px-4 text-stone-700 font-medium hover:text-[#3d8b37] no-underline border-b border-stone-50 last:border-0">
                {l.label}
              </a>
            ))}
            <a href="/disease" className="btn-scan mt-3 block text-center text-white text-sm font-semibold px-5 py-3 rounded-xl no-underline">
              Scan a Plant →
            </a>
          </div>
        )}
      </nav> */}
      {/* <Navbar /> */}

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center leaf-pattern overflow-hidden pt-20">
        {/* Background decorative blobs */}
        <div className="hero-blob absolute top-20 right-[-5%] w-[500px] h-[500px] bg-[#86c06b]/15 -z-0" />
        <div className="hero-blob absolute bottom-10 left-[-8%] w-[400px] h-[400px] bg-amber-300/10 -z-0" style={{ animationDelay: "3s" }} />

        {/* Grain overlay */}
        <div className="grain absolute inset-0 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center py-20">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#3d8b37]/10 border border-[#3d8b37]/20 rounded-full px-4 py-1.5 mb-8">
              <span className="relative w-2 h-2 badge-pulse">
                <span className="block w-2 h-2 rounded-full bg-[#3d8b37]" />
              </span>
              <span className="text-xs font-semibold tracking-widest text-[#3d8b37] uppercase">AI Plant Doctor · Live</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.08] font-bold text-stone-900 mb-6">
              Your farm's
              <span className="italic text-[#3d8b37]"> smartest</span>
              <br />companion.
            </h1>

            <p className="text-stone-500 text-lg md:text-xl leading-relaxed mb-10 max-w-[480px] font-light">
              Photograph a sick plant, describe what you see, and get a precise diagnosis with treatment plan — in under 3 seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a href="/disease" className="btn-scan text-white font-semibold text-base px-8 py-4 rounded-2xl no-underline inline-flex items-center justify-center gap-2">
                <span>🔬</span> Scan Your Plant
              </a>
              <a href="/chatbot" className="inline-flex items-center justify-center gap-2 bg-white border-2 border-stone-200 text-stone-700 font-semibold text-base px-8 py-4 rounded-2xl no-underline hover:border-[#3d8b37] hover:text-[#3d8b37] transition-colors">
                Ask the AI 🤖
              </a>
            </div>


          </div>

          {/* Right — mock scan card */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Floating label top */}
              <div className="absolute -top-4 -left-4 z-10 bg-white rounded-2xl shadow-lg shadow-black/8 border border-stone-100 px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">🍃</span>
                <div>
                  <div className="text-xs font-bold text-rose-600 uppercase tracking-wide">Disease Detected</div>
                  <div className="text-sm font-semibold text-stone-800">Early Blight</div>
                </div>
                <div className="ml-2 text-xs text-stone-400 bg-stone-50 rounded-lg px-2 py-1">97.2%</div>
              </div>

              {/* Main card */}
              <div className="bg-white rounded-3xl shadow-2xl shadow-green-900/10 border border-stone-100 overflow-hidden">
                {/* Leaf image placeholder */}
                <div className="h-52 bg-gradient-to-br from-emerald-100 via-green-200 to-lime-100 relative overflow-hidden flex items-center justify-center">
                  <div className="text-8xl opacity-60" style={{ filter: "saturate(0.8)" }}>🌿</div>
                  {/* scan lines */}
                  <div className="absolute inset-0 flex flex-col justify-around opacity-20">
                    {[...Array(8)].map((_, i) => <div key={i} className="h-px bg-[#3d8b37]" />)}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#3d8b37] text-white text-xs font-bold rounded-lg px-2 py-1">SCANNING</div>
                </div>

                {/* Result */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-serif text-xl font-bold text-stone-900">Early Blight</div>
                      <div className="text-sm text-stone-400 mt-0.5">Alternaria solani · Tomato</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-2xl font-bold text-[#3d8b37]">95%</div>
                      <div className="text-xs text-stone-400">Confidence</div>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-3 mb-4 border border-amber-100">
                    <div className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Recommended Action</div>
                    <div className="text-sm text-amber-800">Apply copper-based fungicide. Remove infected lower leaves immediately.</div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 bg-stone-50 rounded-xl p-3 text-center border border-stone-100">
                      <div className="text-xs text-stone-400">Severity</div>
                      <div className="text-sm font-bold text-orange-600">Moderate</div>
                    </div>
                    <div className="flex-1 bg-stone-50 rounded-xl p-3 text-center border border-stone-100">
                      <div className="text-xs text-stone-400">Spread Risk</div>
                      <div className="text-sm font-bold text-rose-600">High</div>
                    </div>
                    <div className="flex-1 bg-stone-50 rounded-xl p-3 text-center border border-stone-100">
                      <div className="text-xs text-stone-400">Recovery</div>
                      <div className="text-sm font-bold text-green-600">Good</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating bottom label */}
              <div className="absolute -bottom-4 -right-4 z-10 bg-[#3d8b37] text-white rounded-2xl shadow-lg px-4 py-3">
                <div className="text-xs font-semibold opacity-80">Analysis time</div>
                <div className="text-lg font-bold">2.1s ⚡</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="bg-[#3d8b37] py-3 overflow-hidden border-y-0">
        <div className="flex whitespace-nowrap marquee">
          {[...Array(2)].map((_, outer) => (
            <div key={outer} className="flex">
              {["Crop Advisor", "Disease Diagnosis", "Weather Intelligence", "AI Consultation", "Pest Alerts", "Soil Analysis", "Yield Forecasting", "Market Insights"].map((t, i) => (
                <span key={i} className="text-white/90 text-sm font-medium mx-8 flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/40 inline-block" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-6">
              {STATS.map((s, i) => (
                <div key={i} className="text-center py-8 px-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-1">{s.value}</div>
                  <div className="text-sm font-semibold text-[#3d8b37] mb-1">{s.label}</div>
                  <div className="text-xs text-stone-400">{s.sub}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── FEATURES BENTO ── */}
      <section className="py-24 bg-[#FAFAF7] leaf-pattern">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-[#3d8b37] mb-4 block">Everything You Need</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight">
              A complete farming<br />
              <span className="italic text-[#3d8b37]">intelligence platform.</span>
            </h2>
            <p className="text-stone-500 text-lg max-w-xl mx-auto leading-relaxed font-light">
              From seed to harvest — every tool your farm needs, powered by the latest AI models.
            </p>
          </AnimatedSection>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Large card */}
            <AnimatedSection className="md:col-span-2 md:row-span-1" delay={0}>
              <a href={FEATURES[0].href} className={`card-hover block h-full bg-gradient-to-br ${FEATURES[0].accent} rounded-3xl p-8 border ${FEATURES[0].border} no-underline group relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/4" />
                <span className={`inline-block text-xs font-bold tracking-widest uppercase rounded-full px-3 py-1 mb-5 ${FEATURES[0].tagColor}`}>
                  {FEATURES[0].tag}
                </span>
                <div className="text-5xl mb-5">{FEATURES[0].icon}</div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 mb-3">{FEATURES[0].title}</h3>
                <p className="text-stone-600 text-base leading-relaxed max-w-sm">{FEATURES[0].desc}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#3d8b37] group-hover:gap-4 transition-all">
                  Open Module <span>→</span>
                </div>
              </a>
            </AnimatedSection>

            {/* Right column small cards */}
            {FEATURES.slice(1, 3).map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 80 + 100}>
                <a href={f.href} className={`card-hover block bg-gradient-to-br ${f.accent} rounded-3xl p-7 border ${f.border} no-underline group h-full relative overflow-hidden`}>
                  <div className="absolute bottom-0 right-0 w-28 h-28 bg-white/20 rounded-full translate-y-1/3 translate-x-1/3" />
                  <span className={`inline-block text-xs font-bold tracking-widest uppercase rounded-full px-3 py-1 mb-4 ${f.tagColor}`}>
                    {f.tag}
                  </span>
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">{f.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{f.desc}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#3d8b37] group-hover:gap-3 transition-all">
                    Open <span>→</span>
                  </div>
                </a>
              </AnimatedSection>
            ))}

            {/* Bottom row */}
            {FEATURES.slice(3).map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 80 + 200}>
                <a href={f.href} className={`card-hover block bg-gradient-to-br ${f.accent} rounded-3xl p-7 border ${f.border} no-underline group h-full relative overflow-hidden`}>
                  <div className="absolute bottom-0 right-0 w-28 h-28 bg-white/20 rounded-full translate-y-1/3 translate-x-1/3" />
                  <span className={`inline-block text-xs font-bold tracking-widest uppercase rounded-full px-3 py-1 mb-4 ${f.tagColor}`}>
                    {f.tag}
                  </span>
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">{f.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{f.desc}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#3d8b37] group-hover:gap-3 transition-all">
                    Open <span>→</span>
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-[#3d8b37] mb-4 block">Simple Process</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
              Diagnosis in<br />
              <span className="italic text-[#3d8b37]">three steps.</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {STEPS.map((s, i) => (
              <AnimatedSection key={i} delay={i * 120}>
                <div className="relative group">
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[calc(100%+4px)] w-[calc(100%-32px)] h-px z-10" style={{ backgroundImage: "repeating-linear-gradient(90deg,#86c06b 0,#86c06b 6px,transparent 6px,transparent 14px)" }} />
                  )}
                  <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100 group-hover:border-[#3d8b37]/30 transition-colors h-full">
                    <div className="font-serif text-6xl font-bold text-[#3d8b37]/15 mb-4 leading-none">{s.num}</div>
                    <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">{s.title}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-12 text-center" delay={300}>
            <a href="/disease" className="btn-scan inline-flex items-center gap-3 text-white font-semibold text-base px-10 py-4 rounded-2xl no-underline">
              <span>🔬</span> Try Disease Scan Now
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 bg-[#FAFAF7] leaf-pattern">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="relative bg-[#1a3d19] rounded-3xl overflow-hidden">
              {/* decorative */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #86c06b, transparent 60%), radial-gradient(circle at 20% 80%, #4ade80, transparent 50%)" }} />
              <div className="grain absolute inset-0" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-10 md:px-16 py-14">
                <div className="max-w-xl text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-[#3d8b37]/30 border border-[#86c06b]/20 rounded-full px-4 py-1.5 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#86c06b] inline-block" />
                    <span className="text-xs font-semibold tracking-widest text-[#86c06b] uppercase">Free Forever for Small Farms</span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    Protect your crops <br />
                    <span className="italic text-[#86c06b]">before it's too late.</span>
                  </h2>
                </div>

                <div className="flex flex-col items-center gap-4 flex-shrink-0">
                  <a href="/disease" className="inline-flex items-center gap-2 bg-[#86c06b] hover:bg-[#74b059] text-[#1a3d19] font-bold text-base px-10 py-4 rounded-2xl no-underline transition-colors whitespace-nowrap shadow-lg shadow-black/20">
                    🌱 Start Scanning — Free
                  </a>
                  <span className="text-white/40 text-xs">No account needed to start</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-stone-100 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#3d8b37] rounded-lg flex items-center justify-center text-white text-sm font-bold">A</div>
              <span className="font-serif font-bold text-xl text-stone-800 tracking-tight">AgriZone</span>
            </div>
            <div className="flex items-center gap-8">
              {NAV_LINKS.map((l) => (
                <a key={l.label} href={l.href} className="text-sm text-stone-400 hover:text-[#3d8b37] transition-colors no-underline">
                  {l.label}
                </a>
              ))}
            </div>
            <p className="text-sm text-stone-400">© 2026 AgriZone · Feeding the Future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}