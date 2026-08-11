import React from 'react';

export default function Footer({ authorName }) {
  const author = authorName || import.meta.env.VITE_AUTHOR_NAME || 'S_Square';

  return (
    <footer className="footer">
      <div className="footer-links">
        <span className="author-credit">Maintained by <strong>{author}</strong></span>
        <span className="bullet-divider">•</span>
        <span className="copyright">© 2026 BitAcademia. All rights reserved.</span>
      </div>
    </footer>
  );
}
