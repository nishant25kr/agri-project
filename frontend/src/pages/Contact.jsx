import { useState } from 'react';
import API_BASE from '../api/config';
import './PageCommon.css';
import './Contact.css';

const INITIAL = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form,    setForm]    = useState(INITIAL);
  const [status,  setStatus]  = useState('idle'); // idle | loading | success | error
  const [errMsg,  setErrMsg]  = useState('');

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setStatus('loading'); setErrMsg('');
    try {
      const res  = await fetch(`${API_BASE}/send-contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) { setStatus('success'); setForm(INITIAL); }
      else { setStatus('error'); setErrMsg(data.error || 'Failed to send message.'); }
    } catch {
      setStatus('error');
      setErrMsg('Server unreachable. Make sure Django is running on port 8000.');
    }
  };

  return (
    <div className="page">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #00695C, #26A69A)' }}>
        <div className="container">
          <div className="page-hero-icon">📬</div>
          <h1>Contact Us</h1>
          <p>Have a question, partnership idea, or need support? We'd love to hear from you!</p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px' }}>
        <div className="contact-layout">
          {/* Form */}
          <div className="card contact-form-card">
            <h2 className="card-title">Send a Message</h2>

            {status === 'success' ? (
              <div className="success-state">
                <div style={{ fontSize: '4rem' }}>✅</div>
                <h3>Message Sent!</h3>
                <p>We'll get back to you as soon as possible.</p>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setStatus('idle')}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input className="form-control" name="name" value={form.name} onChange={handle} placeholder="John Doe" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-control" type="email" name="email" value={form.email} onChange={handle} placeholder="john@example.com" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-control" name="subject" value={form.subject} onChange={handle} placeholder="How can we help?" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={handle}
                    placeholder="Share your question, feedback, or idea…"
                    required
                  />
                </div>

                {status === 'error' && <div className="alert alert-danger">{errMsg}</div>}

                <button className="btn btn-primary" type="submit" disabled={status === 'loading'} style={{ width: '100%', marginTop: 8 }}>
                  {status === 'loading' ? <><span className="mini-spinner" /> Sending…</> : '📨 Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="contact-info">
            {[
              { icon: '📧', title: 'Email', val: 'support@agrizone.ai', sub: 'We reply within 24 hours' },
              { icon: '🌍', title: 'Platform', val: 'Agrizone.ai', sub: 'Available worldwide, free to use' },
              { icon: '🕐', title: 'AI Support', val: '24/7 via Chatbot', sub: 'Instant answers anytime' },
            ].map(i => (
              <div key={i.title} className="info-item card">
                <div className="info-icon">{i.icon}</div>
                <div>
                  <strong>{i.title}</strong>
                  <p>{i.val}</p>
                  <small>{i.sub}</small>
                </div>
              </div>
            ))}

            <div className="card faq-box">
              <h3>💡 Quick Answers</h3>
              {[
                { q: 'Is Agrizone free?', a: 'Yes — completely free for all farmers.' },
                { q: 'How accurate is the AI?', a: '94%+ on crop recommendation. Disease detection improves with your feedback.' },
                { q: 'Do I need an API key?', a: 'Only for live weather data. Demo mode works without a key.' },
              ].map(f => (
                <div key={f.q} className="faq-item">
                  <strong>{f.q}</strong>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
