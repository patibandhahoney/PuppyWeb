import React, { useEffect } from 'react';
import './PhotoModal.css';

export default function PhotoModal({ item, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <div className="tp-photo-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="tp-photo-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tp-photo-modal__washi" />
        <button className="tp-photo-modal__close" onClick={onClose} aria-label="Close photo">
          ×
        </button>

        <div className="tp-photo-modal__img-wrap">
          <img
            src={item.image || item.url}
            alt={item.family || item.alt || 'Happy Family'}
            className="tp-photo-modal__img"
            onError={(e) => {
              e.target.src = 'https://puppy.instabizweb.com/brand/logo.png';
            }}
          />
        </div>

        <div className="tp-photo-modal__caption">
          <div className="tp-photo-modal__quote font-scrawl">
            "{item.quote || 'We found our dearest family member here! Couldn’t be happier.'}"
          </div>
          <div className="tp-photo-modal__family">
            {item.family || 'TeddyPups Family'} {item.location && `• ${item.location}`}
          </div>
          {item.puppyName && (
            <div style={{ fontSize: '0.85rem', color: 'var(--color-cocoa-soft)', marginTop: '0.2rem' }}>
              Puppy: {item.puppyName} ({item.breed || 'Teacup'})
            </div>
          )}
        </div>

        {(onPrev || onNext) && (
          <div className="tp-photo-modal__nav">
            <button className="tp-photo-modal__nav-btn" onClick={onPrev}>
              ← Previous Polaroid
            </button>
            <button className="tp-photo-modal__nav-btn" onClick={onNext}>
              Next Polaroid →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
