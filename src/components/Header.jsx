import React from 'react';
import { Layers, Activity } from 'lucide-react';

export default function Header({ statusText }) {
  return (
    <header className="navbar">
      <div className="logo-group">
        <div className="logo-icon-wrapper">
          <Layers className="logo-svg" size={24} />
        </div>
        <div className="logo-text">
          <span className="brand-title">BitAcademia</span>
          <span className="brand-subtitle">Network Gateway</span>
        </div>
      </div>

      <div className="header-status-badge">
        <span className="pulse-dot"></span>
        <span className="status-text">{statusText || 'Network Auto-Detect Active'}</span>
      </div>
    </header>
  );
}
