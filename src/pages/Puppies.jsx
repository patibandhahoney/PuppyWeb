import React, { useState, useMemo } from 'react';
import './Puppies.css';
import { PUPPIES_DATA, goneHomePups } from '../data/puppiesData';
import TeddyMascot from '../components/TeddyMascot';

export default function Puppies({ navigate, onSelectPuppy }) {
  const [whereFilter, setWhereFilter] = useState('Everywhere');
  const [breedFilter, setBreedFilter] = useState(null);
  const [genderFilter, setGenderFilter] = useState(null);

  const whereOptions = ['Everywhere', 'Imported', 'Korean Teacup'];
  const breedOptions = ['Maltipoo', 'Pomeranian', 'Poodle', 'Cavapoo', 'Shih Tzu'];
  const genderOptions = ['Boys', 'Girls'];

  const filteredPups = useMemo(() => {
    return PUPPIES_DATA.filter((pup) => {
      // 1. Where filter
      if (whereFilter === 'Korean Teacup') {
        const isKorean =
          (pup.type && pup.type.toLowerCase().includes('korean')) ||
          (pup.origin && pup.origin.toLowerCase().includes('korean')) ||
          (pup.name && pup.name.toLowerCase().includes('korean')) ||
          (pup.slug && pup.slug.toLowerCase().includes('korean'));
        if (!isKorean) return false;
      } else if (whereFilter === 'Imported') {
        const isImported =
          (pup.type && pup.type.toLowerCase().includes('import')) ||
          (pup.origin && pup.origin.toLowerCase().includes('import')) ||
          (pup.type && pup.type.toLowerCase().includes('korean')) ||
          (pup.origin && pup.origin.toLowerCase().includes('korean')) ||
          (pup.name && pup.name.toLowerCase().includes('korean')) ||
          (pup.slug && pup.slug.toLowerCase().includes('import'));
        if (!isImported) return false;
      }

      // 2. Breed filter
      if (breedFilter) {
        const matchBreed =
          pup.breed.toLowerCase().includes(breedFilter.toLowerCase()) ||
          pup.name.toLowerCase().includes(breedFilter.toLowerCase());
        if (!matchBreed) return false;
      }

      // 3. Gender filter
      if (genderFilter === 'Boys') {
        const isBoy =
          pup.gender.toLowerCase().includes('boy') ||
          pup.gender.toLowerCase().includes('male');
        if (!isBoy) return false;
      } else if (genderFilter === 'Girls') {
        const isGirl =
          pup.gender.toLowerCase().includes('girl') ||
          pup.gender.toLowerCase().includes('female');
        if (!isGirl) return false;
      }

      return true;
    });
  }, [whereFilter, breedFilter, genderFilter]);

  return (
    <div data-page="pups" className="tp-page">
      {/* ----------------------------------------------------------------------
          Section 1: Teddy's Living Sketchbook
          ---------------------------------------------------------------------- */}
      <section aria-labelledby="pups-title" className="tp-sketchbook gutter py-16 md:py-24">
        <div className="tp-sketchbook__inner">
          <div className="tp-sketchbook__head">
            <div className="tp-sketchbook__words">
              <p className="font-scrawl text-lg text-toffee-ink" data-reveal="true">
                from Teddy's sketchbook
              </p>
              <h1 id="pups-title" className="font-plush text-giant tp-sketchbook__title" data-reveal="true">
                Available puppies
                <svg aria-hidden="true" viewBox="0 0 400 24" preserveAspectRatio="none" className="tp-sketchbook__underline">
                  <path d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1" pathLength="1"></path>
                </svg>
              </h1>
              <p className="tp-sketchbook__lede text-lede mt-6 max-w-[46ch] text-cocoa-soft" data-reveal="true">
                Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on WhatsApp.
              </p>
            </div>
            <div className="tp-sketchbook__self" aria-hidden="true">
              <TeddyMascot pose="play" facing="left" />
              <span className="font-scrawl tp-sketchbook__caption">self-portrait</span>
            </div>
          </div>

          {/* Filter Pad */}
          <div className="tp-sketchpad mt-10">
            <div className="tp-sketchpad__inner">
              {/* Where Filter */}
              <div className="tp-sketchpad__group" role="group" aria-label="Filter puppies by source">
                <span className="tp-sketchpad__label font-scrawl text-sm text-[var(--ink-soft)]">where</span>
                <div className="tp-sketchpad__chips">
                  {whereOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className="tp-sticker-chip"
                      aria-pressed={whereFilter === opt}
                      onClick={() => setWhereFilter(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Breed Filter */}
              <div className="tp-sketchpad__group" role="group" aria-label="Filter puppies by breed">
                <span className="tp-sketchpad__label font-scrawl text-sm text-[var(--ink-soft)]">breed</span>
                <div className="tp-sketchpad__chips">
                  {breedOptions.map((breed) => (
                    <button
                      key={breed}
                      type="button"
                      className="tp-sticker-chip"
                      aria-pressed={breedFilter === breed}
                      onClick={() => setBreedFilter(breedFilter === breed ? null : breed)}
                    >
                      {breed}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              <div className="tp-sketchpad__group" role="group" aria-label="Filter puppies by gender">
                <span className="tp-sketchpad__label font-scrawl text-sm text-[var(--ink-soft)]">boy or girl</span>
                <div className="tp-sketchpad__chips">
                  {genderOptions.map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      className="tp-sticker-chip"
                      aria-pressed={genderFilter === gender}
                      onClick={() => setGenderFilter(genderFilter === gender ? null : gender)}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live Count Text */}
          <p className="tp-sketchbook__count font-scrawl mt-10 text-lg text-[var(--ink-soft)]" aria-live="polite">
            {filteredPups.length} {filteredPups.length === 1 ? 'puppy' : 'puppies'} looking for a home
          </p>

          {/* Available Puppies Grid (15 sketches) */}
          <ul className="tp-sketches mt-8">
            {filteredPups.map((pup, index) => (
              <li key={pup.id}>
                <a
                  className="tp-sketch"
                  style={{
                    '--tilt': pup.tilt || '0deg',
                    '--d': `${(1.2 + (index % 6) * 0.12).toFixed(2)}s`,
                    '--wash': pup.wash || '#fbe3b4'
                  }}
                  href={`/puppies/${pup.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (navigate) {
                      navigate(`/puppies/${pup.slug}`);
                    } else if (onSelectPuppy) {
                      onSelectPuppy(pup);
                    }
                  }}
                >
                  <div className="tp-sketch__frame">
                    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="tp-sketch__wash">
                      <path d="M5 45 Q 2 15 25 8 T 75 5 Q 98 12 95 48 T 88 92 Q 55 98 25 94 T 5 45 Z"></path>
                    </svg>
                    <div className="tp-sketch__photo">
                      <img
                        alt={`${pup.name} the ${pup.breed} puppy`}
                        loading="lazy"
                        width="600"
                        height="750"
                        decoding="async"
                        src={pup.cover || pup.image}
                      />
                    </div>
                    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="tp-sketch__ink">
                      <path d="M5 45 Q 2 15 25 8 T 75 5 Q 98 12 95 48 T 88 92 Q 55 98 25 94 T 5 45 Z" className="tp-sketch__line"></path>
                      <path d="M7 47 Q 4 17 27 10 T 77 7 Q 96 14 93 50 T 86 90 Q 53 96 27 92 T 7 47 Z" className="tp-sketch__line tp-sketch__line--retrace"></path>
                    </svg>
                    <svg aria-hidden="true" viewBox="0 0 40 40" className="tp-sketch__doodle">
                      <path d="M8 20 C 14 12, 26 12, 32 20 C 26 28, 14 28, 8 20 Z"></path>
                      <circle cx="20" cy="20" r="3" fill="currentColor"></circle>
                    </svg>
                    <span className="font-scrawl tp-sketch__sticker">Available</span>
                    {pup.hasVideo && (
                      <span className="tp-sketch__video" aria-label="has video">
                        <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                          <path d="M8 5v14l11-7z"></path>
                        </svg>
                        video
                      </span>
                    )}
                  </div>
                  <div className="tp-sketch__meta">
                    <div className="tp-sketch__name font-plush">
                      {pup.name}
                      <span className="font-scrawl tp-sketch__arrow" aria-hidden="true">→</span>
                    </div>
                    <p className="tp-sketch__sub">{pup.breed} · {pup.gender} · {pup.age}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          {/* Empty state if filtered to 0 */}
          {filteredPups.length === 0 && (
            <div className="tp-sketches-empty">
              <p className="font-scrawl text-2xl text-[var(--ink-soft)]">
                No puppies match this filter combination.
              </p>
              <button
                type="button"
                className="btn btn-primary mt-4"
                onClick={() => {
                  setWhereFilter('Everywhere');
                  setBreedFilter(null);
                  setGenderFilter(null);
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          Section 2: Already Gone Home Strip
          ---------------------------------------------------------------------- */}
      <section aria-labelledby="gone-title" className="tp-gone-strip gutter">
        <div className="tp-gone-strip__inner">
          <div className="tp-gone-strip__words">
            <h2 id="gone-title" className="font-plush text-big">Already gone home</h2>
            <p className="mt-3 text-cocoa-soft">
              These puppies have found their families. We keep them here so you can see past litters and get a feel for our look.
            </p>
            <a className="btn btn-primary mt-6" href="/gone-home">
              See the puppies who've gone home
            </a>
          </div>
          <ul className="tp-gone-strip__row" aria-label="Some puppies who have gone home">
            {goneHomePups.map((pup, idx) => (
              <li key={pup.id}>
                <a
                  className="tp-sketch tp-sketch--small"
                  style={{
                    '--tilt': pup.tilt || '-0.63deg',
                    '--d': `${(1.2 + idx * 0.1).toFixed(2)}s`,
                    '--wash': pup.wash || '#f9cdbf'
                  }}
                  href={`/puppies/${pup.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (navigate) {
                      navigate(`/puppies/${pup.slug}`);
                    } else if (onSelectPuppy) {
                      onSelectPuppy(pup);
                    }
                  }}
                >
                  <div className="tp-sketch__frame">
                    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="tp-sketch__wash">
                      <path d="M5 45 Q 2 15 25 8 T 75 5 Q 98 12 95 48 T 88 92 Q 55 98 25 94 T 5 45 Z"></path>
                    </svg>
                    <div className="tp-sketch__photo">
                      <img
                        alt={`${pup.name} the ${pup.breed} puppy`}
                        loading="lazy"
                        width="600"
                        height="750"
                        decoding="async"
                        src={pup.image || pup.photo}
                      />
                    </div>
                    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="tp-sketch__ink">
                      <path d="M5 45 Q 2 15 25 8 T 75 5 Q 98 12 95 48 T 88 92 Q 55 98 25 94 T 5 45 Z" className="tp-sketch__line"></path>
                    </svg>
                    <span className="font-scrawl tp-sketch__sticker tp-sketch__sticker--home">gone home ♥</span>
                  </div>
                  <div className="tp-sketch__meta">
                    <div className="tp-sketch__name font-plush">{pup.name}</div>
                    <p className="tp-sketch__sub">{pup.breed} · {pup.gender} · {pup.age}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
