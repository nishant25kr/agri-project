import { useState } from 'react';
import API_BASE from '../api/config';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/send-contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', text: 'Message delivered. Our team will contact you soon.' });
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', text: data.error || 'Failed to send message.' });
      }
    } catch {
      setStatus({ type: 'error', text: 'Connection error. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .contact-font  { font-family: 'DM Sans', sans-serif; }
        .contact-serif { font-family: 'Lora', Georgia, serif; }
        .leaf-bg {
          background-image:
            radial-gradient(circle at 10% 40%, rgba(134,192,107,0.07) 0%, transparent 50%),
            radial-gradient(circle at 90% 60%, rgba(251,191,36,0.05) 0%, transparent 45%);
        }
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
        }
        .contact-input {
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.25s ease;
        }
        .contact-input:focus {
          border-color: #3d8b37;
          box-shadow: 0 0 0 4px rgba(61,139,55,0.1);
        }
        .submit-btn {
          background: linear-gradient(135deg, #3d8b37 0%, #5aab54 100%);
          box-shadow: 0 8px 24px rgba(61,139,55,0.35);
          transition: all 0.3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(61,139,55,0.45); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="contact-font leaf-bg pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* ── Header ── */}
          <div className="mb-12 text-center md:text-left">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#3d8b37] mb-4">
              Get in touch
            </span>
            <h1 className="contact-serif text-5xl md:text-6xl font-bold text-stone-900 leading-[1.08] mb-4">
              Contact <span className="italic text-[#3d8b37]">Support</span>
            </h1>
            <p className="text-stone-500 text-lg font-light max-w-xl leading-relaxed mx-auto md:mx-0">
              Connect with our agricultural expert network for hardware, software, or field setup inquiries.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {/* ── Left: Info Panel ── */}
            <div className="md:col-span-2 flex flex-col gap-5">
              <div className="bg-white rounded-3xl border border-stone-100 p-7 shadow-sm shadow-black/4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 text-xl">📧</div>
                <h4 className="contact-serif text-lg font-bold text-stone-900 mb-1.5">General Inquiries</h4>
                <p className="text-stone-500 text-sm mb-1">contact@agrizone.systems</p>
                <p className="text-stone-500 text-sm">+1 800 - AGRI - HELP</p>
              </div>
              
              <div className="bg-white rounded-3xl border border-stone-100 p-7 shadow-sm shadow-black/4">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-4 text-xl">🏢</div>
                <h4 className="contact-serif text-lg font-bold text-stone-900 mb-1.5">Headquarters</h4>
                <p className="text-stone-500 text-sm leading-relaxed">Innovation Hub 22, Silicon Valley<br/>Agricultural Division</p>
              </div>

              <div className="bg-[#1a3d19] rounded-3xl p-7 relative overflow-hidden grain shadow-lg mt-auto">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-[#3d8b37]/20 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                 <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                   24/7 Monitoring
                 </h4>
                 <p className="text-white/70 text-sm leading-relaxed">Our AI systems and support staff monitor global networks around the clock.</p>
              </div>
            </div>

            {/* ── Right: form ── */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-3xl border border-stone-100 p-8 shadow-sm shadow-black/4">
                <h3 className="contact-serif text-2xl font-bold text-stone-900 mb-6">Send a Message</h3>
                
                <form onSubmit={submit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-stone-400 mb-2">Full Name</label>
                    <input 
                      className="contact-input w-full px-5 py-3.5 rounded-2xl border-2 border-stone-200 bg-stone-50 text-stone-900 text-sm placeholder-stone-400 font-medium" 
                      name="name" 
                      placeholder="John Doe" 
                      value={form.name} 
                      onChange={handle} 
                      required 
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-stone-400 mb-2">Email Address</label>
                      <input 
                        className="contact-input w-full px-5 py-3.5 rounded-2xl border-2 border-stone-200 bg-stone-50 text-stone-900 text-sm placeholder-stone-400 font-medium" 
                        name="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        value={form.email} 
                        onChange={handle} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-stone-400 mb-2">Subject</label>
                      <input 
                        className="contact-input w-full px-5 py-3.5 rounded-2xl border-2 border-stone-200 bg-stone-50 text-stone-900 text-sm placeholder-stone-400 font-medium" 
                        name="subject" 
                        placeholder="How can we help?" 
                        value={form.subject} 
                        onChange={handle} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-stone-400 mb-2">Message</label>
                    <textarea 
                      className="contact-input w-full px-5 py-3.5 rounded-2xl border-2 border-stone-200 bg-stone-50 text-stone-900 text-sm placeholder-stone-400 font-medium" 
                      name="message" 
                      placeholder="Your detailed inquiry..." 
                      rows={5} 
                      value={form.message} 
                      onChange={handle} 
                      required 
                      style={{ resize: 'none' }}
                    />
                  </div>
                  
                  {status && (
                    <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                      <span>{status.type === 'success' ? '✅' : '⚠️'}</span> {status.text}
                    </div>
                  )}

                  <button 
                    className="submit-btn mt-2 w-full text-white font-semibold text-base py-4 rounded-2xl cursor-pointer flex items-center justify-center gap-2 border-0" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <><svg className="spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> Sending...</>
                    ) : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
