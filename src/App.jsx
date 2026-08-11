import React, { useEffect, useState } from 'react';
import AmbientCanvas from './components/AmbientCanvas';
import Header from './components/Header';
import NetworkCard from './components/NetworkCard';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { initGA } from './lib/analytics';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [toasts, setToasts] = useState([]);
  const [statusText, setStatusText] = useState('Network Auto-Detect Active');

  // Read environment variables
  const bitUrl = import.meta.env.VITE_BIT_NETWORK_URL || 'http://172.16.220.105:3000/';
  const outsideUrl = import.meta.env.VITE_OUTSIDE_NETWORK_URL || 'http://139.167.188.221:3000/';

  useEffect(() => {
    // Initialize GA4
    initGA();

    // Auto network check
    const img = new Image();
    const timer = setTimeout(() => {
      setStatusText('Network Gateway Ready');
    }, 2500);

    img.onload = () => {
      clearTimeout(timer);
      setStatusText('Detected: IN BIT NETWORK');
    };
    img.onerror = () => {
      clearTimeout(timer);
      setStatusText('Network Gateway Ready');
    };
    img.src = `${bitUrl}favicon.ico?${Date.now()}`;

    return () => clearTimeout(timer);
  }, [bitUrl]);

  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  return (
    <div className="app-container">
      <AmbientCanvas />

      <Header statusText={statusText} />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-tag">
          <Sparkles className="sparkle-icon" size={14} />
          <span>Official Server Access Portal</span>
        </div>
        <h1 className="hero-title">Select Your Network Connection Route</h1>
        <p className="hero-description">
          Choose your connection endpoint based on your location. Use the <strong>BIT Network</strong> route when connected to campus Wi-Fi/LAN, or the <strong>Outside Network</strong> route from anywhere else.
        </p>
      </section>

      {/* Main Network Cards Grid */}
      <main className="cards-grid">
        <NetworkCard
          type="bit"
          title="BIT Network"
          subtitle="For users connected inside campus Wi-Fi, Hostels, or Department LAN"
          tagLabel="IN BIT NETWORK"
          url={bitUrl}
          features={[
            'Ultra-high intranet bandwidth & low latency',
            'Direct hostel / lab Wi-Fi connection',
          ]}
          onCopySuccess={addToast}
        />

        <NetworkCard
          type="outside"
          title="Outside Network"
          subtitle="For users accessing remotely via Mobile 5G/4G, Home Wi-Fi, or External ISP"
          tagLabel="OUTSIDE NETWORK"
          url={outsideUrl}
          features={[
            'Accessible anywhere worldwide',
            'Public IP routing with SSL/security wrapper',
          ]}
          onCopySuccess={addToast}
        />
      </main>

      <InfoSection />

      <Footer />

      <Toast toasts={toasts} />
    </div>
  );
}
