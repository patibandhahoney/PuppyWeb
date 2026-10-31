import React, { useState, useRef, useEffect, useCallback } from 'react';
import './HappyFamilies.css';
import { happyFamiliesPhotos } from '../data/reviewsData';
import TeddyMascot from '../components/TeddyMascot';

const ROTATIONS = [-2.2, 1.6, -0.9, 2.4, -1.5, 0.8, -2.6, 1.2];
const TAPE_POSITIONS = ["center", "left", "right", "corners", "center", "right", "left", "center"];
const TAPE_COLORS = ["#f6d79a", "#f9cdbf", "#cfe5f6", "#f6d79a", "#e9dcc4"];

export default function HappyFamilies({ onSelectPhoto }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const dialogRef = useRef(null);
  const touchStartX = useRef(null);

  const photos = happyFamiliesPhotos;
  const total = photos.length;

  const navigateTo = useCallback((newIndex) => {
    const wrapped = (newIndex % total + total) % total;
    setActiveIndex(wrapped);
  }, [total]);

  const openViewer = (index) => {
    setActiveIndex(index);
    if (dialogRef.current) {
      if (typeof dialogRef.current.showModal === 'function') {
        dialogRef.current.showModal();
      }
    }
  };

  const closeViewer = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    setActiveIndex(null);
  };

  const handlePrev = useCallback(() => {
    if (activeIndex !== null) {
      navigateTo(activeIndex - 1);
    }
  }, [activeIndex, navigateTo]);

  const handleNext = useCallback(() => {
    if (activeIndex !== null) {
      navigateTo(activeIndex + 1);
    }
  }, [activeIndex, navigateTo]);

  // Keyboard navigation
  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        closeViewer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, handleNext, handlePrev]);

  // Touch swipe support
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff < -50) {
      handleNext();
    } else if (diff > 50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const currentPhoto = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <div data-page="families" className="tp-page">
      <section aria-labelledby="families-title" className="tp-memories">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          {/* Header Section */}
          <div className="tp-memories__head">
            <div>
              <p className="font-scrawl text-lg text-toffee-ink" data-reveal="true">
                our wall of happy endings
              </p>
              <h1 id="families-title" className="font-plush text-giant tp-memories__title" data-reveal="true">
                Happy families
                <svg viewBox="0 0 48 44" className="tp-memories__heart" aria-hidden="true">
                  <path
                    d="M24 40C10 30 4 22 4 14.5 4 8.7 8.6 4 14.3 4c4.1 0 7.6 2.4 9.7 6 2.1-3.6 5.6-6 9.7-6C39.4 4 44 8.7 44 14.5 44 22 38 30 24 40z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </h1>
              <p className="text-lede mt-6 max-w-[50ch] text-cocoa-soft" data-reveal="true">
                Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful moments shared by our amazing clients after welcoming their furry friends.
              </p>
              <p className="font-scrawl mt-5 text-lg text-toffee-ink" data-reveal="true">
                {total} moments and counting
              </p>
            </div>

            {/* Testimonial notebook note */}
            <figure className="tp-memories__note" data-reveal="true">
              <span
                aria-hidden="true"
                className="tp-tape tp-tape--center"
                style={{ '--tape': '#cfe5f6' }}
              />
              <blockquote className="font-plush-text">
                “TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.”
              </blockquote>
              <figcaption className="font-scrawl">
                Sarah M., Dubai, UAE
              </figcaption>
            </figure>
          </div>

          {/* Masonry Polaroid Wall */}
          <div className="mt-16 md:mt-20">
            <ul className="tp-wall" aria-label="Photos from TeddyPups families">
              {photos.map((photo, index) => {
                const tilt = ROTATIONS[index % ROTATIONS.length];
                const tapePos = TAPE_POSITIONS[index % TAPE_POSITIONS.length];
                const tapeColor = TAPE_COLORS[index % TAPE_COLORS.length];
                const delayMs = (index % 4) * 60;

                return (
                  <li
                    key={photo.id}
                    className="tp-wall__item"
                    data-reveal="true"
                    data-armed="true"
                    data-revealed="true"
                    style={{ '--d': `${delayMs}ms` }}
                  >
                    <button
                      type="button"
                      className="tp-wall__print"
                      onClick={() => openViewer(index)}
                      aria-label={`Open photo ${index + 1} of ${total}${photo.caption ? `: ${photo.caption}` : ''}`}
                    >
                      <span
                        className="tp-polaroid"
                        style={{
                          '--tilt': `${tilt}deg`,
                          '--tape': tapeColor,
                          '--i': index
                        }}
                      >
                        {tapePos === 'corners' ? (
                          <>
                            <span aria-hidden="true" className="tp-tape tp-tape--tl" />
                            <span aria-hidden="true" className="tp-tape tp-tape--tr" />
                          </>
                        ) : (
                          <span aria-hidden="true" className={`tp-tape tp-tape--${tapePos}`} />
                        )}

                        <span className="tp-polaroid__photo">
                          <img
                            src={photo.url}
                            alt={photo.alt || 'A happy TeddyPups family with their new puppy'}
                            loading={index < 4 ? 'eager' : 'lazy'}
                            width={photo.width}
                            height={photo.height}
                            style={{
                              width: '100%',
                              height: 'auto',
                              backgroundColor: photo.color || '#e8c8a8'
                            }}
                          />
                        </span>

                        <span className="tp-polaroid__caption font-scrawl">
                          {photo.caption}
                        </span>
                      </span>

                      {/* Animated Paw Print Stamp */}
                      <svg viewBox="0 0 64 64" className="tp-wall__paw" aria-hidden="true" fill="currentColor">
                        <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer Mascot Section */}
          <div className="tp-memories__foot">
            <TeddyMascot pose="sit" facing="left" className="w-36 md:w-44" label="Teddy, admiring the wall" />
            <p className="font-scrawl text-lg text-cocoa-soft">every one of them was a Teddy Pup once</p>
          </div>
        </div>
      </section>

      {/* Lightbox Photo Dialog */}
      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        className="tp-photo-dialog m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
        onClose={() => setActiveIndex(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeViewer();
        }}
        data-lenis-prevent="true"
      >
        {currentPhoto && (
          <div
            className="flex h-full flex-col"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <p className="font-scrawl text-lg">
                {activeIndex + 1} / {total}
                {currentPhoto.caption ? ` — ${currentPhoto.caption}` : ''}
              </p>
              <button
                type="button"
                onClick={closeViewer}
                className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa cursor-pointer hover:bg-honey-soft transition-colors"
              >
                Close
              </button>
            </div>

            {/* Photo Viewport */}
            <div className="relative flex-1 overflow-hidden flex items-center justify-center p-4">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.alt || ''}
                className="max-h-full max-w-full object-contain select-none"
                style={{ maxHeight: 'calc(100vh - 160px)' }}
              />
            </div>

            {/* Bottom Controls */}
            <div className="flex justify-center gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
              <button
                type="button"
                onClick={handlePrev}
                className="h-12 rounded-full border-2 border-milk px-6 font-semibold cursor-pointer hover:bg-milk/10 transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="h-12 rounded-full bg-honey px-6 font-semibold text-cocoa cursor-pointer hover:bg-honey-soft transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
