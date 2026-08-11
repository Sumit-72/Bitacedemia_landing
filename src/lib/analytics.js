// Google Analytics GA4 Utility using Vite Environment Variables

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

export function initGA() {
  if (typeof window === 'undefined' || window.gtagInitialized) return;

  // Dynamically load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
    anonymize_ip: true,
  });

  window.gtagInitialized = true;
}

export function trackNetworkClick(networkType, targetUrl) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', `click_${networkType}_network`, {
      event_category: 'outbound_network_link',
      event_label: `${networkType.toUpperCase()} Network (${targetUrl})`,
      transport_type: 'beacon',
    });
  }
}
