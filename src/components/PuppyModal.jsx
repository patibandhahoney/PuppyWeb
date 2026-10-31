import React, { useEffect } from 'react';
import './PuppyModal.css';

export default function PuppyModal({ puppy, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!puppy) return null;

  const waMsg = encodeURIComponent(
    `Hello TeddyPups Dubai! I am very interested in adopting ${puppy.title} (${puppy.breed}, ${puppy.age}). Could you please share more videos and available viewing times?`
  );
  const waUrl = `https://wa.me/971501234567?text=${waMsg}`;

  return (
    <div className="tp-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="tp-modal-puppy" onClick={(e) => e.stopPropagation()}>
        <button className="tp-modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        {/* Media Side */}
        <div className="tp-modal-puppy__media-col">
          <div className="tp-modal-puppy__img-wrap">
            <img
              src={puppy.image}
              alt={puppy.title}
              className="tp-modal-puppy__img"
              onError={(e) => {
                e.target.src = 'https://puppy.instabizweb.com/brand/logo.png';
              }}
            />
            {puppy.tag && <div className="tp-modal-puppy__badge">{puppy.tag}</div>}
          </div>
        </div>

        {/* Details Side */}
        <div className="tp-modal-puppy__info-col">
          <div className="tp-modal-puppy__header">
            <h2 className="tp-modal-puppy__title font-plush">{puppy.title}</h2>
            <div className="tp-modal-puppy__breed font-scrawl">
              {puppy.breed} • {puppy.gender || 'Puppy'}
            </div>
          </div>

          <p style={{ color: 'var(--color-cocoa-soft)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            {puppy.description ||
              `A joyful, bundle-of-fluff companion ready to fill your home with unconditional love. Fully health-checked by UAE certified veterinarians.`}
          </p>

          {/* Details Table */}
          <div className="tp-modal-puppy__details">
            <div className="tp-detail-pill">
              <span className="tp-detail-pill__label">Age</span>
              <span className="tp-detail-pill__val">{puppy.age || '2.5 Months'}</span>
            </div>
            <div className="tp-detail-pill">
              <span className="tp-detail-pill__label">Gender</span>
              <span className="tp-detail-pill__val">{puppy.gender || 'Sweet Temperament'}</span>
            </div>
            <div className="tp-detail-pill">
              <span className="tp-detail-pill__label">Origin</span>
              <span className="tp-detail-pill__val">{puppy.origin || 'Ethical Certified Breeder'}</span>
            </div>
            <div className="tp-detail-pill">
              <span className="tp-detail-pill__label">Status</span>
              <span className="tp-detail-pill__val" style={{ color: puppy.status === 'Available' ? '#16a34a' : 'var(--color-toffee)' }}>
                {puppy.status || 'Available'}
              </span>
            </div>
          </div>

          {/* Perks Included */}
          <div className="tp-modal-puppy__perks">
            <div className="tp-modal-puppy__perks-title font-plush">Included with Adoption:</div>
            <div className="tp-perk-item">
              <span>✓</span> Full Vet Health Passport & 1-Year Genetic Guarantee
            </div>
            <div className="tp-perk-item">
              <span>✓</span> Microchip Registered with Dubai Municipality
            </div>
            <div className="tp-perk-item">
              <span>✓</span> Premium Puppy Starter Kit (Bed, Toy, Food, Blanket)
            </div>
            <div className="tp-perk-item">
              <span>✓</span> Lifetime WhatsApp Behavioral & Nutrition Advice
            </div>
          </div>

          {/* Actions */}
          <div className="tp-modal-puppy__actions">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{ justifyContent: 'center', width: '100%', fontSize: '1.02rem', padding: '0.85rem' }}
            >
              <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, fill: 'currentColor' }}>
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/>
              </svg>
              <span>Ask About {puppy.title.split(' ')[0]} on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
