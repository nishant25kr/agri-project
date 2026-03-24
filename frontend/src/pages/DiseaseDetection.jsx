import { useState, useRef } from 'react';
import API_BASE from '../api/config';

export default function DiseaseDetection() {
  const [image,   setImage]   = useState(null);
  const [preview, setPreview] = useState(null);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [drag,    setDrag]    = useState(false);
  const inputRef = useRef();

  const processFile = file => {
    if (!file || !file.type.startsWith('image/')) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null); setError('');
  };

  const onDrop = e => {
    e.preventDefault(); setDrag(false);
    processFile(e.dataTransfer.files[0]);
  };

  const submit = async () => {
    if (!image) return;
    setLoading(true); setError(''); setResult(null);
    const fd = new FormData();
    fd.append('image', image);
    try {
      const res  = await fetch(`${API_BASE}/disease/api/upload/`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) setResult(data);
      else setError(data.error || 'Detection failed.');
    } catch {
      setError('Server unreachable. Make sure Django is running.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setImage(null); setPreview(null); setResult(null); setError(''); };

  return (
    <div className="page-wrapper container" style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '60px 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '12px' }}>Disease <span style={{ color: 'var(--primary)' }}>Detection</span></h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '48px' }}>
          Upload a high-resolution photo of your plant leaf for instant AI-based diagnosis.
        </p>

        <div className="grid-2">
          {/* Upload Terminal */}
          <div className="card-glass" style={{ border: drag ? '2px dashed var(--primary)' : '1px solid var(--glass-border)' }}>
             <h3 style={{ marginBottom: '24px' }}>Diagnostic Input</h3>
             
             {!preview ? (
               <div 
                  onDrop={onDrop}
                  onDragOver={e => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onClick={() => inputRef.current?.click()}
                  style={{ 
                    height: '350px', 
                    background: '#f8fafc', 
                    borderRadius: '24px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
               >
                  <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🍃</div>
                  <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>Drop Leaf Image Here</p>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>or click to browse filesystem</p>
                  <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => processFile(e.target.files[0])} />
               </div>
             ) : (
               <div className="animate-fade-up">
                  <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '350px', boxShadow: 'var(--shadow-md)' }}>
                    <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.2)' }} />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ flex: 1 }}>
                      {loading ? 'Analyzing Plant...' : 'Start Diagnosis'}
                    </button>
                    <button className="btn btn-secondary" onClick={reset}>Clear</button>
                  </div>
               </div>
             )}
             
             {error && <p style={{ color: 'var(--error)', marginTop: '16px', fontWeight: '600' }}>{error}</p>}
          </div>

          {/* Diagnosis Result */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card-glass" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
               {!result && !loading && (
                 <div style={{ textAlign: 'center', opacity: 0.5 }}>
                   <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🔬</div>
                   <p style={{ fontWeight: '600' }}>Terminal Ready for Scan</p>
                 </div>
               )}

               {loading && (
                 <div style={{ textAlign: 'center' }}>
                   <div className="spinner" style={{ margin: '0 auto 20px' }} />
                   <p style={{ fontWeight: '600' }}>Leaf Pattern Recognition In Progress...</p>
                 </div>
               )}

               {result && (
                 <div className="animate-up" style={{ width: '100%' }}>
                    <div style={{ display: 'inline-block', padding: '10px 20px', background: result.disease === 'Healthy' ? 'var(--success)' : 'var(--error)', color: 'white', borderRadius: '50px', fontWeight: '800', fontSize: '0.75rem', marginBottom: '16px' }}>
                       DIAGNOSIS COMPLETE
                    </div>
                    <h2 style={{ fontSize: '3rem', color: 'var(--secondary)', marginBottom: '24px' }}>{result.disease}</h2>
                    
                    <div style={{ marginBottom: '32px' }}>
                        <div className="flex-between" style={{ marginBottom: '12px' }}>
                           <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Detection Confidence</span>
                           <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{result.confidence}%</span>
                        </div>
                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                           <div style={{ width: `${result.confidence}%`, height: '100%', background: 'var(--primary)', transition: 'width 1s ease' }} />
                        </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '20px', textAlign: 'left' }}>
                       <h4 style={{ marginBottom: '12px', color: 'var(--secondary)' }}>💊 Suggested Action Plan</h4>
                       <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{result.treatment}</p>
                    </div>

                    <button className="btn btn-secondary" style={{ width: '100%', marginTop: '32px' }} onClick={reset}>
                       Diagnose Another Plant
                    </button>
                 </div>
               )}
            </div>
            
            <div className="card-glass" style={{ background: 'var(--secondary)', color: 'white', padding: '24px' }}>
               <h4 style={{ color: 'white', marginBottom: '8px' }}>Analysis Tip</h4>
               <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>For 99% accuracy, ensure the leaf is well-lit and covers at least 70% of the camera frame.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
