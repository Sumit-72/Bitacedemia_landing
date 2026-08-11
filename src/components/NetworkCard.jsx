import React, { useRef, useState } from 'react';
import { Wifi, Globe, Copy, Check, ArrowRight, Zap } from 'lucide-react';
import { trackNetworkClick } from '../lib/analytics';

export default function NetworkCard({
  type, // 'bit' | 'outside'
  title,
  subtitle,
  tagLabel,
  url,
  features,
  onCopySuccess
}) {
  const cardRef = useRef(null);
  const [ripples, setRipples] = useState([]);

  const isBit = type === 'bit';

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  const handleCopyIp = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      onCopySuccess(`Copied ${url} to clipboard!`);
    } catch (err) {
      onCopySuccess(`Copied ${url} to clipboard!`);
    }
  };

  const handleButtonClick = (e) => {
    // Dispatch ripple
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const diameter = Math.max(rect.width, rect.height);
    const newRipple = {
      id: Date.now(),
      left: e.clientX - rect.left - diameter / 2,
      top: e.clientY - rect.top - diameter / 2,
      size: diameter
    };
    setRipples(prev => [...prev, newRipple]);

    // Analytics tracking
    trackNetworkClick(type, url);

    // Clean up ripple animation state
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <article
      ref={cardRef}
      className={`access-card ${isBit ? 'card-bit' : 'card-outside'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-inner">
        <div className="card-header">
          <div className={`tag-badge ${isBit ? 'tag-bit' : 'tag-outside'}`}>
            <span className="tag-dot"></span>
            <span className="tag-label">{tagLabel}</span>
          </div>

          <div className="ping-badge">
            {isBit ? <Zap size={14} color="#06b6d4" /> : <Globe size={14} color="#8b5cf6" />}
            <span className="ping-val">{isBit ? 'Internal Route' : 'Public Route'}</span>
          </div>
        </div>

        <div className="card-body">
          <div className={`network-icon-box ${isBit ? 'icon-bit' : 'icon-outside'}`}>
            {isBit ? <Wifi size={28} /> : <Globe size={28} />}
          </div>

          <h2 className="card-title">{title}</h2>
          <p className="card-subtitle">{subtitle}</p>

          <div className="ip-address-box">
            <span className="ip-label">IP Endpoint</span>
            <code className="ip-value">{url}</code>
            <button
              className="copy-ip-btn"
              onClick={handleCopyIp}
              title="Copy IP Endpoint"
              aria-label={`Copy ${title} IP`}
            >
              <Copy size={16} />
            </button>
          </div>

          <ul className="feature-list">
            {features.map((feat, idx) => (
              <li key={idx}>
                <Check className="check-icon" size={18} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-footer">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-primary ${isBit ? 'btn-bit-action' : 'btn-outside-action'} ripple-btn`}
            onClick={handleButtonClick}
          >
            {ripples.map(r => (
              <span
                key={r.id}
                className="ripple-circle"
                style={{
                  left: `${r.left}px`,
                  top: `${r.top}px`,
                  width: `${r.size}px`,
                  height: `${r.size}px`
                }}
              />
            ))}
            <span className="btn-text">
              Launch {title}
              <ArrowRight className="btn-arrow" size={18} />
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}
