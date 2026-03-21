import { useState, useRef } from 'react';
import API_BASE from '../api/config';
import './PageCommon.css';
import './DiseaseDetection.css';

export default function DiseaseDetection() {
  const [image,   setImage]   = useState(null);
  const [preview, setPreview] = useState(null);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [drag,    setDrag]    = useState(false);
  const inputRef = useRef();

  const SEVERITY_COLOR = { Healthy: 'green', 'Powdery Mildew': 'orange', Rust: 'orange', default: 'red' };

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
      setError('Server unreachable. Make sure Django is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setImage(null); setPreview(null); setResult(null); setError(''); };

  const sevColor = result
    ? (SEVERITY_COLOR[result.disease] || SEVERITY_COLOR.default)
    : 'green';

  return (
    <div className="page">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #33691E, #8BC34A)' }}>
        <div className="container">
          <div className="page-hero-icon">🔬</div>
          <h1>Plant Disease Detection</h1>
          <p>Upload a photo of your plant leaf and get instant AI-powered disease diagnosis.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px' }}>
        <div className="disease-layout">
          {/* Upload */}
          <div className="card disease-upload-card">
            <h2 className="card-title">Upload Plant Image</h2>

            {!preview ? (
              <div
                className={`dropzone${drag ? ' drag-over' : ''}`}
                onDrop={onDrop}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onClick={() => inputRef.current?.click()}
              >
                <div className="dropzone-icon">🌿</div>
                <p className="dropzone-title">Drop your plant photo here</p>
                <p className="dropzone-sub">or click to browse · JPG, PNG, WEBP supported</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => processFile(e.target.files[0])}
                />
              </div>
            ) : (
              <div className="preview-area">
                <img src={preview} alt="Preview" className="preview-img" />
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ flex: 1 }}>
                    {loading ? <><span className="mini-spinner" /> Analyzing…</> : '🔬 Detect Disease'}
                  </button>
                  <button className="btn btn-outline" onClick={reset}>Change</button>
                </div>
              </div>
            )}

            {error && <div className="alert alert-danger" style={{ marginTop: 16 }}>{error}</div>}

            {/* Tips */}
            <div className="upload-tips">
              <div className="tip">📸 Use clear, well-lit photos</div>
              <div className="tip">🍃 Focus on affected leaves</div>
              <div className="tip">🌿 Avoid blurry images</div>
            </div>
          </div>

          {/* Result */}
          <div>
            {!result && !loading && (
              <div className="empty-state card">
                <div style={{ fontSize: '4rem' }}>🍃</div>
                <h3>No analysis yet</h3>
                <p>Upload a plant image on the left to scan for diseases with our AI model.</p>
              </div>
            )}

            {loading && (
              <div className="empty-state card">
                <div className="spinner" style={{ margin: '0 auto 16px' }} />
                <h3>Scanning your plant…</h3>
                <p>AI is analysing the leaf patterns and symptoms.</p>
              </div>
            )}

            {result && (
              <div className="result-disease card animate-fade-up">
                <div className={`disease-severity badge badge-${sevColor}`}>
                  {result.disease === 'Healthy' ? '✅ Healthy Plant' : '⚠️ Disease Detected'}
                </div>
                <h2 className="disease-name">{result.disease}</h2>
                <div className="confidence-bar">
                  <div className="confidence-label">
                    <span>AI Confidence</span>
                    <strong>{result.confidence}%</strong>
                  </div>
                  <div className="conf-track">
                    <div className="conf-fill" style={{ width: `${result.confidence}%`, background: result.confidence > 85 ? '#4CAF50' : '#FF8F00' }} />
                  </div>
                </div>
                <div className="treatment-box">
                  <div className="treatment-title">💊 Recommended Treatment</div>
                  <p>{result.treatment}</p>
                </div>
                <button className="btn btn-outline" style={{ width: '100%', marginTop: 16 }} onClick={reset}>
                  Analyse Another Plant
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
