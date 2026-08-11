import React from 'react';

export default function InfoSection() {
  return (
    <section className="info-section">
      <div className="info-card">
        <div className="info-icon">💡</div>
        <div className="info-content">
          <h3>Which network route should I use?</h3>
          <p>
            If you are connected to the <strong>BIT Campus Wi-Fi, Hostel LAN, or Department Network</strong>, select <strong>"IN BIT NETWORK"</strong> for maximum bandwidth and zero latency. If you are using <strong>Mobile Data (5G/4G) or Home Broadband</strong>, select <strong>"OUTSIDE NETWORK"</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
