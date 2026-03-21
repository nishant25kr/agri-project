import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CropRecommendation from './pages/CropRecommendation';
import Weather from './pages/Weather';
import DiseaseDetection from './pages/DiseaseDetection';
import Chatbot from './pages/Chatbot';
import PestAlerts from './pages/PestAlerts';
import About from './pages/About';
import Contact from './pages/Contact';
import './index.css';

function NotFound() {
  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: 16 }}>🌿</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>The page you're looking for doesn't exist.</p>
        <a href="/" className="btn btn-primary">Go Home</a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/crop"        element={<CropRecommendation />} />
        <Route path="/weather"     element={<Weather />} />
        <Route path="/disease"     element={<DiseaseDetection />} />
        <Route path="/chatbot"     element={<Chatbot />} />
        <Route path="/pest-alerts" element={<PestAlerts />} />
        <Route path="/about"       element={<About />} />
        <Route path="/contact"     element={<Contact />} />
        <Route path="*"            element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
