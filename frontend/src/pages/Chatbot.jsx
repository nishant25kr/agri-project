import { useState, useRef, useEffect } from 'react';
import API_BASE from '../api/config';

const QUICK_QUESTIONS = [
  { label: 'Best fertilizer for wheat?', icon: '🌾' },
  { label: 'How to treat tomato blight?', icon: '🍅' },
  { label: 'Crops to plant in November?', icon: '📅' },
  { label: 'Organic pest control methods?', icon: '🐛' },
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "👋 Hi! I'm your AgriZone AI expert. Ask me anything about soil, weather, disease treatment, or seasonal farming strategies!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text = input) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg = { role: 'user', text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chatbot/send-message/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: data.response || 'Sorry, I could not process that.',
        time: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: '⚠️ Connection Error. Ensure your backend is responding.', time: '' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .chat-font { font-family: 'DM Sans', sans-serif; }
        .chat-serif { font-family: 'Lora', Georgia, serif; }
        .leaf-bg {
          background-image:
            radial-gradient(circle at 15% 40%, rgba(134,192,107,0.07) 0%, transparent 50%),
            radial-gradient(circle at 85% 70%, rgba(251,191,36,0.06) 0%, transparent 45%);
        }
        .grain-light {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
        }
        .chat-input {
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.25s ease;
        }
        .chat-input:focus {
          border-color: #3d8b37;
          box-shadow: 0 0 0 4px rgba(61,139,55,0.1);
        }
        .send-btn {
          background: linear-gradient(135deg, #3d8b37 0%, #5aab54 100%);
          box-shadow: 0 6px 20px rgba(61,139,55,0.35);
          transition: all 0.25s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .send-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(61,139,55,0.45);
        }
        .send-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .msg-enter {
          animation: msgIn 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .quick-chip {
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .quick-chip:hover {
          background: #3d8b37;
          color: white;
          border-color: #3d8b37;
          transform: translateY(-1px);
        }
        .typing-dot {
          animation: blink 1.4s infinite both;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
        .scroll-area::-webkit-scrollbar { width: 5px; }
        .scroll-area::-webkit-scrollbar-track { background: transparent; }
        .scroll-area::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .scroll-area::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>

      <div className="chat-font leaf-bg pt-28 pb-10 px-4 min-h-screen flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex flex-col flex-1">

          {/* ── Page Header ── */}
          <div className="mb-8">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#3d8b37] mb-4">
              24/7 · AI-Powered · Agronomist
            </span>
            <h1 className="chat-serif text-5xl md:text-6xl font-bold text-stone-900 leading-[1.08] mb-4">
              AI Farm <span className="italic text-[#3d8b37]">Assistant</span>
            </h1>
            <p className="text-stone-500 text-lg font-light leading-relaxed">
              Powered by intelligence. Built for farmers. Ask anything about soil, crops, weather, or pests.
            </p>
          </div>

          {/* ── Chat Panel ── */}
          <div className="flex-1 bg-white rounded-3xl border border-stone-100 shadow-sm shadow-black/4 overflow-hidden flex flex-col" style={{ minHeight: '520px' }}>

            {/* Panel header */}
            <div className="px-7 py-5 border-b border-stone-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3d8b37] to-[#5aab54] flex items-center justify-center shadow-md shadow-green-200">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <div>
                <h2 className="chat-serif text-base font-bold text-stone-900 leading-none mb-0.5">AgriZone Assistant</h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span className="text-xs text-stone-400">Online · Responds instantly</span>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5">
                <span className="text-xs font-semibold text-emerald-700">🔬 Powered by Gemini</span>
              </div>
            </div>

            {/* Messages area */}
            <div className="scroll-area flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-5">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className="msg-enter flex gap-3"
                  style={{ flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%' }}
                >
                  {/* Avatar */}
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm"
                    style={{
                      background: m.role === 'user'
                        ? 'linear-gradient(135deg, #1a3d19 0%, #3d8b37 100%)'
                        : 'linear-gradient(135deg, #3d8b37 0%, #5aab54 100%)',
                      color: 'white',
                    }}
                  >
                    {m.role === 'user' ? '👤' : 'AI'}
                  </div>

                  {/* Bubble */}
                  <div>
                    <div
                      className="text-sm leading-relaxed rounded-2xl px-5 py-3.5"
                      style={{
                        background: m.role === 'user'
                          ? 'linear-gradient(135deg, #1a3d19 0%, #3d8b37 100%)'
                          : '#f8faf7',
                        color: m.role === 'user' ? 'white' : '#1c1917',
                        border: m.role === 'user' ? 'none' : '1px solid #e7ede5',
                        boxShadow: m.role === 'user'
                          ? '0 4px 14px rgba(61,139,55,0.25)'
                          : '0 2px 8px rgba(0,0,0,0.04)',
                        borderTopRightRadius: m.role === 'user' ? '4px' : '16px',
                        borderTopLeftRadius: m.role === 'user' ? '16px' : '4px',
                      }}
                    >
                      {m.text}
                    </div>
                    {m.time && (
                      <p className="text-[11px] text-stone-400 mt-1.5 px-1" style={{ textAlign: m.role === 'user' ? 'right' : 'left' }}>
                        {m.time}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="msg-enter flex gap-3" style={{ alignSelf: 'flex-start', maxWidth: '82%' }}>
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #3d8b37 0%, #5aab54 100%)', color: 'white' }}>
                    AI
                  </div>
                  <div className="bg-[#f8faf7] border border-[#e7ede5] rounded-2xl rounded-tl-[4px] px-5 py-4 flex items-center gap-1.5 shadow-sm">
                    <span className="typing-dot w-2 h-2 rounded-full bg-[#3d8b37] inline-block" />
                    <span className="typing-dot w-2 h-2 rounded-full bg-[#3d8b37] inline-block" />
                    <span className="typing-dot w-2 h-2 rounded-full bg-[#3d8b37] inline-block" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input area */}
            <div className="px-7 py-5 border-t border-stone-100 bg-[#fafaf8]">
              {/* Quick questions */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {QUICK_QUESTIONS.map(q => (
                  <button
                    key={q.label}
                    onClick={() => send(q.label)}
                    disabled={loading}
                    className="quick-chip flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-600 text-xs font-semibold cursor-pointer"
                  >
                    <span>{q.icon}</span> {q.label}
                  </button>
                ))}
              </div>

              {/* Text input + send */}
              <div className="flex gap-3 items-end">
                <input
                  id="chat-input"
                  className="chat-input flex-1 px-5 py-3.5 rounded-2xl border-2 border-stone-200 bg-white text-stone-900 text-sm placeholder-stone-400 font-medium"
                  placeholder="Ask a farming question…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                />
                <button
                  id="chat-send-btn"
                  className="send-btn flex-shrink-0 text-white font-semibold text-sm px-6 py-3.5 rounded-2xl border-0 cursor-pointer flex items-center gap-2"
                  onClick={() => send()}
                  disabled={loading}
                >
                  Send
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="opacity-90">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── Bottom tip card ── */}
          <div className="mt-5 bg-[#1a3d19] rounded-3xl p-6 relative overflow-hidden grain-light">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#3d8b37]/20 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-5 md:gap-8">
              <div className="flex-shrink-0 text-4xl">🌱</div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold tracking-widest uppercase text-[#86c06b]">Pro Tip</span>
                </div>
                <p className="text-white/75 text-sm leading-relaxed">
                  The more specific your question, the better the answer. Mention your{' '}
                  <span className="text-[#86c06b] font-semibold">crop type, location, and current symptoms</span>{' '}
                  for a tailored recommendation.
                </p>
              </div>
              <a
                href="/crop"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-[#86c06b] hover:bg-[#74b059] text-[#1a3d19] font-bold text-sm px-5 py-3 rounded-xl no-underline transition-colors whitespace-nowrap"
              >
                🌾 Try Crop Advisor
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
