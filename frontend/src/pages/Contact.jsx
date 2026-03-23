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
    <div className="page-wrapper container" style={{ paddingBottom: '100px' }}>
       <div style={{ padding: '60px 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '12px' }}>Contact <span style={{ color: 'var(--primary)' }}>Support</span></h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '48px' }}>
          Connect with our agricultural expert network for hardware, software, or field setup inquiries.
        </p>

        <div className="grid-2">
           {/* Info */}
           <div className="flex-between" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '32px' }}>
              <div className="card-glass" style={{ width: '100%' }}>
                 <h4 style={{ marginBottom: '12px' }}>General Inquiries</h4>
                 <p className="text-muted">contact@agrizone.systems</p>
                 <p className="text-muted">+1 800 - AGRI - HELP</p>
              </div>
              <div className="card-glass" style={{ width: '100%' }}>
                 <h4 style={{ marginBottom: '12px' }}>Headquarters</h4>
                 <p className="text-muted">Innovation Hub 22, Silicon Valley - Agricultural Division</p>
              </div>
              <div style={{ width: '100%', padding: '24px', background: 'var(--primary-light)', borderRadius: '16px', color: 'white' }}>
                 <h4 style={{ color: 'white', marginBottom: '8px' }}>24/7 Monitoring</h4>
                 <p style={{ fontSize: '0.85rem' }}>Our AI systems and support staff monitor global networks around the clock.</p>
              </div>
           </div>

           {/* Form */}
           <div className="card-glass">
              <h3 style={{ marginBottom: '32px' }}>Message Command</h3>
              <form onSubmit={submit} style={{ display: 'grid', gap: '20px' }}>
                 <div>
                    <input className="form-input" name="name" placeholder="Agent Full Name" value={form.name} onChange={handle} required />
                 </div>
                 <div className="grid-2">
                    <input className="form-input" name="email" type="email" placeholder="Verification Email" value={form.email} onChange={handle} required />
                    <input className="form-input" name="subject" placeholder="Query ID/Subject" value={form.subject} onChange={handle} required />
                 </div>
                 <div>
                    <textarea 
                      className="form-input" 
                      name="message" 
                      placeholder="Detailed transmission..." 
                      rows={6} 
                      value={form.message} 
                      onChange={handle} 
                      required 
                      style={{ resize: 'none' }}
                    />
                 </div>
                 
                 {status && (
                   <div style={{ 
                     padding: '16px', 
                     background: status.type === 'success' ? '#f0fdf4' : '#fef2f2', 
                     color: status.type === 'success' ? 'var(--success)' : 'var(--error)',
                     borderRadius: '12px',
                     fontWeight: '700',
                     fontSize: '0.9rem'
                   }}>
                     {status.text}
                   </div>
                 )}

                 <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', height: '56px' }}>
                   {loading ? 'Transmitting...' : 'Send Transmission'}
                 </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
