import React from 'react';
import './GoneHome.css';
import { goneHomePups } from '../data/puppiesData';
import TeddyMascot from '../components/TeddyMascot';

export default function GoneHome({ navigate }) {
  const handleNav = (path, e) => {
    e.preventDefault();
    if (navigate) {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="tp-gone-page">
      {/* Header */}
      <div className="tp-gone-header">
        <div className="tp-gone-tag">
          <span>🏡</span>
          <span>Cherished Archives</span>
        </div>
        <h1 className="tp-gone-title font-plush">
          Gone Home Archive
        </h1>
        <p className="tp-gone-desc">
          A celebration of the past puppies who have found their forever families across the UAE. If you see a look or personality you adore, our concierge can match a sibling from our certified partner kennels.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <TeddyMascot pose="snug" size={120} />
        </div>
      </div>

      {/* Grid */}
      <div className="tp-gone-grid">
        {goneHomePups.map((pup) => (
          <div key={pup.id} className="tp-gone-card">
            <div className="tp-gone-card__img-wrap">
              <img
                src={pup.image}
                alt={pup.title}
                className="tp-gone-card__img"
                onError={(e) => {
                  e.target.src = 'https://puppy.instabizweb.com/brand/logo.png';
                }}
              />
              <div className="tp-gone-stamp">Gone Home 🏡</div>
            </div>

            <h2 className="tp-gone-card__title font-plush">{pup.title}</h2>
            <div className="tp-gone-card__breed font-scrawl">{pup.breed}</div>

            <div className="tp-gone-card__home-to">
              ❤️ Adopted by loving family in {pup.homeTo || 'Dubai, UAE'}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Match Banner */}
      <div style={{ maxWidth: '840px', margin: '5rem auto 0', padding: '0 var(--gutter)', textAlign: 'center' }}>
        <div style={{
          background: 'var(--color-honey-soft)',
          border: '3px dashed var(--color-toffee)',
          borderRadius: '32px',
          padding: '2.8rem 2rem',
        }}>
          <h3 className="font-plush" style={{ fontSize: '1.8rem', color: 'var(--color-cocoa)', marginBottom: '0.8rem' }}>
            Fell in love with one of our adopted sweethearts?
          </h3>
          <p style={{ color: 'var(--color-cocoa-soft)', fontSize: '1.02rem', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto 1.8rem' }}>
            Tell our Seoul concierge team which puppy stole your heart, and we will source a matching purebred teacup companion from the same certified ethical lineage!
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="/puppies"
              className="btn-primary"
              onClick={(e) => handleNav('/puppies', e)}
            >
              <span>Browse Currently Available Puppies</span>
              <span>🐾</span>
            </a>
            <a
              href="https://wa.me/971501234567?text=Hello%20TeddyPups!%20I%20saw%20a%20puppy%20in%20your%20Gone%20Home%20archive%20and%20would%20love%20a%20similar%20match."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <span>Request Custom Matching on WhatsApp</span>
              <span>💬</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
