import React, { useState, useEffect } from 'react';
import './PuppyDetail.css';
import { PUPPIES_DATA } from '../data/puppiesData';
import TeddyMascot from '../components/TeddyMascot';

export default function PuppyDetail({ slug, navigate }) {
  // Find puppy by slug or id, fallback to korean-teacup-pomeranian-1 or first
  const fallbackIndex = PUPPIES_DATA.findIndex((p) => p.slug === 'korean-teacup-pomeranian-1');
  const puppyIndex = PUPPIES_DATA.findIndex(
    (p) => p.slug === slug || p.id === slug
  );
  const activeIndex = puppyIndex !== -1 ? puppyIndex : (fallbackIndex !== -1 ? fallbackIndex : 0);
  const puppy = PUPPIES_DATA[activeIndex];

  // Previous and Next puppy in the Storybook
  const prevPup = PUPPIES_DATA[(activeIndex - 1 + PUPPIES_DATA.length) % PUPPIES_DATA.length];
  const nextPup = PUPPIES_DATA[(activeIndex + 1) % PUPPIES_DATA.length];

  // Media items (support both kind: "image" and kind: "video")
  const mediaItems =
    puppy.media && puppy.media.length > 0
      ? puppy.media
      : puppy.gallery && puppy.gallery.length > 0
      ? puppy.gallery.map((url, i) => ({
          id: `${puppy.id}-${i}`,
          kind: 'image',
          url,
          poster: url,
          alt: `${puppy.gender === 'boy' ? 'Male' : 'Female'} ${puppy.name} puppy, photo ${i + 1}`
        }))
      : [
          {
            id: `${puppy.id}-cover`,
            kind: 'image',
            url: puppy.cover || puppy.image,
            poster: puppy.cover || puppy.image,
            alt: `${puppy.gender === 'boy' ? 'Male' : 'Female'} ${puppy.name} puppy`
          }
        ];

  const [mediaIndex, setMediaIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [ribbonProgress, setRibbonProgress] = useState(0.2);

  // Scroll ribbon tracker & reset scroll on slug change
  useEffect(() => {
    setMediaIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(Math.max(window.scrollY / docHeight, 0.15), 1);
        setRibbonProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  // Keyboard navigation for gallery & modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setMediaIndex((prev) => (prev + 1) % mediaItems.length);
      } else if (e.key === 'ArrowLeft') {
        setMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
      } else if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mediaItems.length]);

  // Enquiry form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    area: '',
    message: `Hi! I'd love to know more about ${puppy.name}.`
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  const handlePrevMedia = (e) => {
    e.stopPropagation();
    setMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const handleNextMedia = (e) => {
    e.stopPropagation();
    setMediaIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const currentMedia = mediaItems[mediaIndex] || mediaItems[0];
  const washColor = puppy.wash || '#484848';
  const whatsappUrl = `https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'm%20interested%20in%20the%20${encodeURIComponent(puppy.name)}%20(${puppy.gender === 'boy' ? 'boy' : 'girl'})%3A%20https%3A%2F%2Fpuppy.instabizweb.com%2Fpuppies%2F${puppy.slug}`;

  return (
    <div data-page="pup" className="tp-page">
      <article
        className="tp-storybook"
        style={{
          background: `linear-gradient(180deg, color-mix(in oklab, ${washColor} 24%, var(--color-milk)) 0, var(--color-milk) 85%)`
        }}
      >
        {/* Book Ribbon Bookmark on Left Margin */}
        <div aria-hidden="true" className="tp-ribbon">
          <div className="tp-ribbon__track">
            <span
              className="tp-ribbon__band"
              style={{ transform: `scaleY(${ribbonProgress})` }}
            ></span>
          </div>
        </div>

        <div className="tp-pup-container gutter">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="tp-pup-breadcrumb">
            <a
              className="link-ink"
              href="/puppies"
              onClick={(e) => {
                e.preventDefault();
                if (navigate) navigate('/puppies');
              }}
            >
              Available puppies
            </a>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{puppy.name}</span>
          </nav>

          {/* Chapter 1: hello, it's me */}
          <p className="tp-chapter">
            <span aria-hidden="true" className="tp-chapter__n font-plush">
              1
            </span>
            <span className="font-scrawl">hello, it's me</span>
          </p>

          {/* Main Grid: Gallery on Left & Tag Board on Right */}
          <div className="tp-pup-layout">
            {/* Left Column: Storypage Gallery (7 Cols) */}
            <div className="tp-pup-gallery-col">
              <div className="tp-storypage">
                {currentMedia.kind === 'video' ? (
                  <div className="tp-storypage__video-wrap">
                    <video
                      key={currentMedia.url}
                      src={currentMedia.url}
                      poster={currentMedia.poster}
                      controls
                      playsInline
                      className="tp-storypage__video"
                    />
                    <button
                      type="button"
                      className="tp-storypage__expand-btn"
                      onClick={() => setIsLightboxOpen(true)}
                      aria-label="Fullscreen video"
                    >
                      ⛶ Expand
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="tp-storypage__main-btn"
                    aria-label={`Open ${puppy.name}, photo ${mediaIndex + 1} of ${mediaItems.length} full screen`}
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    <img
                      alt={currentMedia.alt || `${puppy.gender === 'boy' ? 'Male' : 'Female'} ${puppy.name} puppy`}
                      fetchPriority="high"
                      loading="eager"
                      decoding="async"
                      src={currentMedia.url}
                    />
                  </button>
                )}

                {/* Slider Arrows & Counter */}
                {mediaItems.length > 1 && (
                  <div className="tp-storypage__controls">
                    <button
                      type="button"
                      className="tp-storypage__arrow"
                      aria-label="Previous photo"
                      onClick={handlePrevMedia}
                    >
                      ‹
                    </button>
                    <span className="tp-storypage__counter">
                      {mediaIndex + 1} / {mediaItems.length}
                    </span>
                    <button
                      type="button"
                      className="tp-storypage__arrow"
                      aria-label="Next photo"
                      onClick={handleNextMedia}
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              {mediaItems.length > 1 && (
                <ul
                  className="tp-storypage__thumbs"
                  aria-label={`All photos of ${puppy.name}`}
                >
                  {mediaItems.map((item, idx) => (
                    <li key={item.id || idx} className="tp-storypage__thumb-item">
                      <button
                        type="button"
                        aria-label={`${puppy.name}, ${item.kind === 'video' ? 'video' : 'photo'} ${idx + 1} of ${mediaItems.length}`}
                        aria-current={mediaIndex === idx}
                        className="tp-storypage__thumb-btn"
                        onClick={() => setMediaIndex(idx)}
                      >
                        <img
                          alt=""
                          loading="lazy"
                          decoding="async"
                          src={item.poster || item.url}
                        />
                        {item.kind === 'video' && (
                          <span className="tp-storypage__thumb-play" aria-hidden="true">
                            ▶
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Right Column: Tag Board & Chapter 2 (5 Cols) */}
            <div className="tp-pup-info-col">
              <div className="tp-pup-sticky-container">
                {/* Tag Board */}
                <div className="tp-tag tp-board">
                  <span aria-hidden="true" className="tp-tag__ring"></span>

                  {/* Peeking Teddy Mascot */}
                  <div className="tp-tag-peeking-teddy">
                    <TeddyMascot pose="peek" facing="right" />
                  </div>

                  {/* Status chip */}
                  <span className="chip">
                    <svg viewBox="0 0 64 64" className="chip-paw" aria-hidden="true" fill="currentColor">
                      <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z"></path>
                    </svg>
                    {puppy.status || 'Available'}
                  </span>

                  {/* Puppy Name Title */}
                  <h1 className="tp-pup-name font-plush">
                    {puppy.name}
                  </h1>

                  {/* Specifications List */}
                  <dl className="tp-pup-spec-grid">
                    <div className="tp-pup-spec-item">
                      <dt>Breed</dt>
                      <dd>{puppy.breed}</dd>
                    </div>
                    <div className="tp-pup-spec-item">
                      <dt>Boy or girl</dt>
                      <dd>{puppy.gender === 'boy' ? 'Boy' : (puppy.gender === 'girl' ? 'Girl' : 'Boy & Girl')}</dd>
                    </div>
                    <div className="tp-pup-spec-item">
                      <dt>Age</dt>
                      <dd>{puppy.age}</dd>
                    </div>
                    <div className="tp-pup-spec-item">
                      <dt>Where</dt>
                      <dd>{puppy.origin || (puppy.type === 'Imported' ? 'Imported for you' : 'Downtown Dubai')}</dd>
                    </div>
                  </dl>

                  {/* Caption / note (e.g. Maltipoo (Left) & Cavapoo (Right).) */}
                  {puppy.caption && (
                    <p className="tp-pup-caption">
                      {puppy.caption}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="tp-pup-actions">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp"
                    >
                      Ask about this puppy on WhatsApp
                    </a>
                    <a href={`#enquire-${puppy.slug}`} className="btn btn-ghost">
                      Send an enquiry
                    </a>
                  </div>
                </div>

                {/* Chapter 2: What comes with this puppy */}
                <div className="tp-paper -rotate-1">
                  <p className="tp-chapter">
                    <span aria-hidden="true" className="tp-chapter__n font-plush">
                      2
                    </span>
                    <span className="font-scrawl">what comes with this {puppy.name}</span>
                  </p>
                  <h2 className="tp-paper__heading font-plush">Every Teddy Pup comes</h2>
                  <ul className="tp-paper__list">
                    <li className="tp-paper__item">
                      <svg viewBox="0 0 32 32" className="tp-paper__check" aria-hidden="true">
                        <path d="M5 17l7 7L27 8" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Vaccinated</span>
                    </li>
                    <li className="tp-paper__item">
                      <svg viewBox="0 0 32 32" className="tp-paper__check" aria-hidden="true">
                        <path d="M5 17l7 7L27 8" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Dewormed</span>
                    </li>
                    <li className="tp-paper__item">
                      <svg viewBox="0 0 32 32" className="tp-paper__check" aria-hidden="true">
                        <path d="M5 17l7 7L27 8" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Verified health certificate from licensed vets</span>
                    </li>
                    <li className="tp-paper__item">
                      <svg viewBox="0 0 32 32" className="tp-paper__check" aria-hidden="true">
                        <path d="M5 17l7 7L27 8" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Thoroughly checked before joining your family</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Chapter 3: The way home */}
          <section aria-labelledby={`home-steps-${puppy.slug}`} className="tp-trail-section">
            <p className="tp-chapter">
              <span aria-hidden="true" className="tp-chapter__n font-plush">
                3
              </span>
              <span className="font-scrawl">the way home</span>
            </p>
            <h2 id={`home-steps-${puppy.slug}`} className="font-plush text-big tp-trail-heading">
              {puppy.type === 'Imported' || (puppy.origin && (puppy.origin.toLowerCase().includes('korean') || puppy.origin.toLowerCase().includes('import') || puppy.origin.toLowerCase().includes('abroad')))
                ? 'Coming home from abroad'
                : 'Joining your family in Dubai'}
            </h2>
            <ol className="tp-trail tp-trail--row tp-trail--paws">
              <li>
                <span aria-hidden="true" className="tp-trail__num font-plush">
                  1
                </span>
                <h3 className="tp-trail__title font-plush-text">Reserve your puppy</h3>
                <p className="tp-trail__desc">
                  Tell us which puppy has captured your heart.
                </p>
              </li>
              <li>
                <span aria-hidden="true" className="tp-trail__num font-plush">
                  2
                </span>
                <h3 className="tp-trail__title font-plush-text">Personalized consultation</h3>
                <p className="tp-trail__desc">
                  We finalize details with you and share updates on your puppy's journey.
                </p>
              </li>
              <li>
                <span aria-hidden="true" className="tp-trail__num font-plush">
                  3
                </span>
                <h3 className="tp-trail__title font-plush-text">Import and arrival</h3>
                <p className="tp-trail__desc">
                  We manage health checks, travel arrangements, and documentation.
                </p>
              </li>
              <li>
                <span aria-hidden="true" className="tp-trail__num font-plush">
                  4
                </span>
                <h3 className="tp-trail__title font-plush-text">Welcome home</h3>
                <p className="tp-trail__desc">
                  We help your new puppy settle in and ensure a smooth transition into your home.
                </p>
              </li>
            </ol>
          </section>

          {/* Chapter 4: Dear TeddyPups (Enquiry Letter Form) */}
          <section
            id={`enquire-${puppy.slug}`}
            aria-labelledby={`enquire-title-${puppy.slug}`}
            className="tp-letter"
          >
            <span aria-hidden="true" className="tp-letter__stamp">
              <svg viewBox="0 0 64 64" className="tp-letter__stamp-paw" aria-hidden="true" fill="currentColor">
                <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z"></path>
              </svg>
            </span>

            <div className="tp-letter__left">
              <p className="tp-chapter">
                <span aria-hidden="true" className="tp-chapter__n font-plush">
                  4
                </span>
                <span className="font-scrawl">dear TeddyPups…</span>
              </p>
              <h2 id={`enquire-title-${puppy.slug}`} className="font-plush text-big tp-letter__title">
                Ask about this puppy
              </h2>
              <p className="tp-letter__desc">
                Leave your details and our team will get back to you promptly — or message us on WhatsApp for the quickest reply.
              </p>
            </div>

            <div className="tp-letter__right">
              {submitted ? (
                <div className="tp-sent">
                  <svg viewBox="0 0 120 84" className="tp-envelope" aria-hidden="true">
                    <path d="M6 10h108v68H6z" fill="#fffdf8" stroke="#2a170e" strokeWidth="3" strokeLinejoin="round" />
                    <path d="M6 10l54 40 54-40" fill="none" stroke="#2a170e" strokeWidth="3" strokeLinejoin="round" />
                    <circle cx="94" cy="62" r="12" fill="#c2622b" stroke="#2a170e" strokeWidth="2.5" />
                  </svg>
                  <p className="font-plush tp-sent__title">Message received!</p>
                  <p className="tp-sent__desc">
                    Thank you, {formData.name} — our team will get back to you promptly regarding <strong>{puppy.name}</strong>. For the quickest reply, message us on WhatsApp.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp tp-sent__btn"
                  >
                    WhatsApp us
                  </a>
                </div>
              ) : (
                <form noValidate className="tp-enquiry-form" onSubmit={handleEnquirySubmit}>
                  <div className="tp-form-grid">
                    <div className="tp-form-field">
                      <label className="tp-form-label">
                        Your name<span className="text-toffee-ink"> *</span>
                      </label>
                      <input
                        className="tp-form-input"
                        autoComplete="name"
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Sarah"
                      />
                    </div>
                    <div className="tp-form-field">
                      <label className="tp-form-label">
                        Phone or WhatsApp<span className="text-toffee-ink"> *</span>
                      </label>
                      <input
                        className="tp-form-input"
                        type="tel"
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+971 50 123 4567"
                      />
                      <p className="tp-form-hint">With country code, e.g. +971 50 123 4567</p>
                    </div>
                    <div className="tp-form-field">
                      <label className="tp-form-label">
                        Email<span className="tp-form-opt"> (optional)</span>
                      </label>
                      <input
                        className="tp-form-input"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="sarah@example.com"
                      />
                    </div>
                    <div className="tp-form-field">
                      <label className="tp-form-label">
                        Your area<span className="tp-form-opt"> (optional)</span>
                      </label>
                      <input
                        className="tp-form-input"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="e.g. Dubai Marina"
                      />
                      <p className="tp-form-hint">e.g. Dubai Marina</p>
                    </div>
                  </div>

                  <div className="tp-form-field tp-form-field--full">
                    <label className="tp-form-label">
                      Message <span className="tp-form-opt">(optional)</span>
                    </label>
                    <textarea
                      rows="4"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="tp-form-textarea"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary tp-form-submit">
                    Send enquiry
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* Previous / Next Puppy Navigation */}
          <nav aria-label="More puppies" className="tp-pup-nav-grid">
            <a
              className="tp-pup-nav-card tp-pup-nav-card--prev"
              href={`/puppies/${prevPup.slug}`}
              onClick={(e) => {
                e.preventDefault();
                if (navigate) navigate(`/puppies/${prevPup.slug}`);
              }}
            >
              <span className="tp-pup-nav-card__thumb">
                <img
                  alt={`${prevPup.name} puppy`}
                  loading="lazy"
                  decoding="async"
                  src={prevPup.cover || prevPup.image}
                />
              </span>
              <span className="tp-pup-nav-card__meta">
                <span className="font-scrawl tp-pup-nav-card__kicker">Previous pup</span>
                <span className="font-plush tp-pup-nav-card__name">{prevPup.name}</span>
              </span>
            </a>

            <a
              className="tp-pup-nav-card tp-pup-nav-card--next"
              href={`/puppies/${nextPup.slug}`}
              onClick={(e) => {
                e.preventDefault();
                if (navigate) navigate(`/puppies/${nextPup.slug}`);
              }}
            >
              <span className="tp-pup-nav-card__thumb">
                <img
                  alt={`${nextPup.name} puppy`}
                  loading="lazy"
                  decoding="async"
                  src={nextPup.cover || nextPup.image}
                />
              </span>
              <span className="tp-pup-nav-card__meta">
                <span className="font-scrawl tp-pup-nav-card__kicker">Next pup</span>
                <span className="font-plush tp-pup-nav-card__name">{nextPup.name}</span>
              </span>
            </a>
          </nav>
        </div>
      </article>

      {/* Lightbox Fullscreen Dialog */}
      {isLightboxOpen && (
        <div className="tp-photo-lightbox" onClick={() => setIsLightboxOpen(false)}>
          <div className="tp-photo-lightbox__header">
            <p className="tp-photo-lightbox__title">
              {puppy.name}, {currentMedia.kind === 'video' ? 'video' : 'photo'} {mediaIndex + 1} of {mediaItems.length}
            </p>
            <button
              type="button"
              className="tp-photo-lightbox__close"
              onClick={() => setIsLightboxOpen(false)}
            >
              Close
            </button>
          </div>

          <div className="tp-photo-lightbox__stage" onClick={(e) => e.stopPropagation()}>
            {currentMedia.kind === 'video' ? (
              <video
                src={currentMedia.url}
                poster={currentMedia.poster}
                controls
                autoPlay
                playsInline
                className="tp-photo-lightbox__video"
              />
            ) : (
              <img
                className="tp-photo-lightbox__img"
                src={currentMedia.url}
                alt={currentMedia.alt || puppy.name}
              />
            )}
          </div>

          {mediaItems.length > 1 && (
            <div className="tp-photo-lightbox__footer" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="tp-photo-lightbox__nav-btn"
                onClick={handlePrevMedia}
              >
                Previous
              </button>
              <span className="tp-photo-lightbox__counter">
                {mediaIndex + 1} / {mediaItems.length}
              </span>
              <button
                type="button"
                className="tp-photo-lightbox__nav-btn"
                onClick={handleNextMedia}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
