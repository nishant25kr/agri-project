import { useState, useRef, useEffect } from 'react';
import API_BASE from '../api/config';

const QUICK_QUESTIONS = [
  'Best fertilizer for wheat?',
  'How to treat tomato blight?',
  'Crops to plant in November?',
  'Organic pest control methods?',
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "👋 Hi! I'm your AgriZone AI expert. Ask me anything about soil, weather, disease treatment, or seasonal farming strategies!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input,   setInput]   = useState('');
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
      const res  = await fetch(`${API_BASE}/chatbot/send-message/`, {
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
    <div className="page-wrapper container" style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: '40px' }}>
      <div style={{ padding: '60px 0 20px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>AI Farm <span style={{ color: 'var(--primary)' }}>Assistant</span></h1>
        <p className="text-muted">Powered by Intelligence. Built for Farmers.</p>
      </div>

      <div className="card-glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
         {/* Chat Area */}
         <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ 
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                display: 'flex',
                gap: '12px',
                flexDirection: m.role === 'user' ? 'row-reverse' : 'row'
              }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', background: m.role === 'user' ? 'var(--secondary)' : 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '0.8rem'
                }}>
                  {m.role === 'user' ? '👤' : 'AI'}
                </div>
                <div>
                   <div style={{ 
                      padding: '16px 20px', 
                      borderRadius: '20px', 
                      background: m.role === 'user' ? 'var(--secondary)' : '#f1f5f9', 
                      color: m.role === 'user' ? 'white' : 'var(--text-main)',
                      boxShadow: 'var(--shadow-sm)',
                      fontSize: '0.95rem'
                    }}>
                      {m.text}
                   </div>
                   <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: m.role === 'user' ? 'right' : 'left' }}>{m.time}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '0.8rem' }}>AI</div>
                <div style={{ padding: '16px 20px', background: '#f1f5f9', borderRadius: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', animation: 'pulse 1.5s infinite' }}>
                   Analyzing Knowledge Base...
                </div>
              </div>
            )}
            <div ref={endRef} />
         </div>

         {/* Input Area */}
         <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0', background: 'white' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
               {QUICK_QUESTIONS.map(q => (
                 <button key={q} onClick={() => send(q)} style={{ 
                   whiteSpace: 'nowrap', padding: '10px 16px', borderRadius: '50px', border: '1px solid #e2e8f0', background: 'white',
                   fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', transition: 'var(--transition)'
                 }}>
                   {q}
                 </button>
               ))}
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
               <input 
                  className="form-input" 
                  placeholder="Ask a farming question..." 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  style={{ borderRadius: '50px' }}
               />
               <button className="btn btn-primary" onClick={() => send()} disabled={loading} style={{ width: '100px', borderRadius: '50px' }}>
                  Send
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
