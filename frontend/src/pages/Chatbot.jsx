import { useState, useRef, useEffect } from 'react';
import API_BASE from '../api/config';
import './PageCommon.css';
import './Chatbot.css';

const QUICK_QUESTIONS = [
  'Best fertilizer for wheat?',
  'How to treat tomato blight?',
  'Crops to plant in November?',
  'Organic pest control methods?',
  'Sugarcane pesticide advice?',
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "👋 Hi! I'm AgriGPT, your AI farming expert. Ask me anything about crops, fertilizers, diseases, pests, or seasonal advice!",
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
      setMessages(prev => [...prev, { role: 'assistant', text: '⚠️ Server unreachable. Make sure Django is running on port 8000.', time: '' }]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div className="page">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #4527A0, #7B1FA2)' }}>
        <div className="container">
          <div className="page-hero-icon">🤖</div>
          <h1>AI Farm Assistant</h1>
          <p>Powered by Gemini AI — your interactive agricultural expert, 24/7.</p>
        </div>
      </div>

      <div className="container chat-container">
        {/* Quick questions */}
        <div className="quick-qs">
          {QUICK_QUESTIONS.map(q => (
            <button key={q} className="quick-btn" onClick={() => send(q)} disabled={loading}>
              {q}
            </button>
          ))}
        </div>

        {/* Chat window */}
        <div className="chat-window card">
          <div className="messages-area">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.role}`}>
                {m.role === 'assistant' && <div className="avatar">🤖</div>}
                <div className="bubble">
                  <div className="bubble-text">{m.text}</div>
                  {m.time && <div className="bubble-time">{m.time}</div>}
                </div>
                {m.role === 'user' && <div className="avatar user-av">👤</div>}
              </div>
            ))}

            {loading && (
              <div className="message assistant">
                <div className="avatar">🤖</div>
                <div className="bubble typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="chat-input-bar">
            <textarea
              className="chat-input"
              rows={1}
              placeholder="Ask about crops, fertilizers, disease treatment…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              disabled={loading}
            />
            <button className="btn btn-primary send-btn" onClick={() => send()} disabled={loading || !input.trim()}>
              {loading ? <span className="mini-spinner" /> : '➤'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
