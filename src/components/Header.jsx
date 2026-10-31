import React, { useState } from 'react';
import './Header.css';

export default function Header({ currentRoute = '/', navigate }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Puppies', path: '/puppies' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Happy Families', path: '/happy-families' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNav = (path, e) => {
    e.preventDefault();
    if (navigate) {
      navigate(path);
    }
    setIsDrawerOpen(false);
  };

  return (
    <>
      <header className="tp-header">
        <div className="tp-header__inner">
          {/* Brand Logo */}
          <a
            href="/"
            className="tp-brand"
            onClick={(e) => handleNav('/', e)}
          >
            <img
              src="https://puppy.instabizweb.com/brand/logo.png"
              alt="TeddyPups Logo"
              className="tp-brand__logo"
              onError={(e) => {
                // Fallback cute paw avatar if image network issue
                e.target.style.display = 'none';
              }}
            />
            <div className="tp-brand__text">
              <span className="tp-brand__title font-plush">TeddyPups</span>
              <span className="tp-brand__tagline font-scrawl">Ethical Puppies Dubai</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="tp-nav" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = currentRoute === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  className={`tp-nav__link ${isActive ? 'is-active' : ''}`}
                  onClick={(e) => handleNav(item.path, e)}
                >
                  <span>{item.label}</span>
                  {/* Floating paw indicator under active/hover nav item */}
                  <svg className="tp-nav__paw" viewBox="0 0 24 24">
                    <ellipse cx="12" cy="15" rx="4.5" ry="3.5" />
                    <ellipse cx="6" cy="9.5" rx="1.8" ry="2.4" transform="rotate(-15 6 9.5)" />
                    <ellipse cx="10" cy="7" rx="1.8" ry="2.4" transform="rotate(-5 10 7)" />
                    <ellipse cx="14" cy="7" rx="1.8" ry="2.4" transform="rotate(5 14 7)" />
                    <ellipse cx="18" cy="9.5" rx="1.8" ry="2.4" transform="rotate(15 18 9.5)" />
                  </svg>
                </a>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="tp-header__actions">
            <a
              href="https://wa.me/971501234567?text=Hello%20TeddyPups,%20I'm%20interested%20in%20adopting%20a%20puppy!"
              target="_blank"
              rel="noopener noreferrer"
              className="tp-header__whatsapp"
            >
              <svg viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.204 8.204 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.08l-.29-.17-3.12.82.83-3.04-.19-.3a8.217 8.217 0 0 1-1.25-4.46c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
              </svg>
              <span>WhatsApp</span>
            </a>

            {/* Mobile Hamburger */}
            <button
              className="tp-hamburger"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open navigation menu"
            >
              <svg className="tp-hamburger__icon" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom Scallop SVG border */}
        <svg
          className="tp-header__scallop"
          viewBox="0 0 1200 14"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="header-scallop-pattern" width="28" height="14" patternUnits="userSpaceOnUse">
              <path d="M 0,0 C 7,12 21,12 28,0 Z" fill="var(--color-milk)" />
            </pattern>
          </defs>
          <rect width="100%" height="14" fill="url(#header-scallop-pattern)" />
        </svg>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`tp-drawer-overlay ${isDrawerOpen ? 'is-open' : ''}`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Mobile Drawer Drawer */}
      <aside className={`tp-drawer ${isDrawerOpen ? 'is-open' : ''}`} aria-hidden={!isDrawerOpen}>
        <div className="tp-drawer__top">
          <div className="tp-brand">
            <span className="tp-brand__title font-plush">TeddyPups</span>
          </div>
          <button
            className="tp-drawer__close"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className="tp-drawer__nav">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`tp-drawer__link ${currentRoute === item.path ? 'is-active' : ''}`}
              onClick={(e) => handleNav(item.path, e)}
            >
              <span>{item.label}</span>
              <span>🐾</span>
            </a>
          ))}
          <a
            href="/gone-home"
            className={`tp-drawer__link ${currentRoute === '/gone-home' ? 'is-active' : ''}`}
            onClick={(e) => handleNav('/gone-home', e)}
          >
            <span>Gone Home (Adopted)</span>
            <span>🏡</span>
          </a>
        </nav>

        <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
          <a
            href="https://wa.me/971501234567?text=Hello%20TeddyPups,%20I'm%20interested%20in%20adopting%20a%20puppy!"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: 'currentColor' }}>
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>

        <div className="tp-drawer__info">
          <div className="tp-drawer__info-title">📍 Dubai Showroom</div>
          <p>Al Quoz 1, Dubai, United Arab Emirates</p>
          <p style={{ marginTop: '0.4rem' }}>⏰ Daily 10:00 AM – 8:00 PM</p>
        </div>
      </aside>
    </>
  );
}
