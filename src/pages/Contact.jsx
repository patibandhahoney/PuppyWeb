import React, { useState, useRef, useEffect, useId } from 'react';
import './Contact.css';
import TeddyMascot from '../components/TeddyMascot';

const PUPPY_OPTIONS = [
  { id: '', label: 'any puppy (not sure yet)' },
  { id: '4218427a-dd65-4b09-a089-584b912aa7ab', label: 'Max (Maltipoo, boy)' },
  { id: '0abcf3f5-0080-44c1-b1e1-2a2de24a3cf4', label: 'Korean Teacup Maltipoo (girl)' },
  { id: 'c5d2cf3c-51e8-4ecf-ac94-97ef8fceb6ec', label: 'Korean Teacup Poodle (girl)' },
  { id: '9cb7d6db-bf35-4e63-8e61-ca63e1925dbd', label: 'Maltipoo & Cavapoo (boy)' },
  { id: 'b39adb3f-eace-45af-a2e8-425de01ffc50', label: 'Toy Poodle (boy & girl)' },
  { id: '027d7333-a8b2-49de-9bbc-9a47af88ebac', label: 'Maltipoo (girl)' },
  { id: 'ec3a42bf-bd62-46ba-962d-8f94f09715c5', label: 'Pomeranian (girl)' },
  { id: 'e486e544-f1fd-48f9-8ba0-f556d7ee44e7', label: 'Copper (Cavapoo, boy)' },
  { id: 'd2d146b2-6454-4e05-967a-87f2ab02946d', label: 'Shih Tzu (girl)' },
  { id: '0fe92eee-1937-48e1-b48b-77292a6f25d8', label: 'Shih Tzu (boy)' },
  { id: '0deaea0d-1c0e-4e85-868b-3c7376358e03', label: 'Maltipoo (girl)' },
  { id: 'cbfa8ebd-7e0c-4818-b0ec-144ede4d3352', label: 'Maltipoo (girl)' },
  { id: '35d5e8bd-bebb-41c7-b0a9-256482edb3c8', label: 'Korean Teacup Pomeranian (girl)' },
  { id: '9fd5c518-a1ce-46d4-b9a4-8fb9714717f4', label: 'Korean Teacup Pomeranian (girl)' },
  { id: 'e838ce49-59e0-4f3e-ab83-55cd2d98d2a2', label: 'Korean Teacup Pomeranian (boy)' }
];

export default function Contact() {
  const [phase, setPhase] = useState('writing'); // 'writing' | 'sealing' | 'posting' | 'sent'
  const [minHeight, setMinHeight] = useState(undefined);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    area: '',
    puppyId: '',
    message: '',
    website: '' // honeypot
  });
  const [errors, setErrors] = useState({});

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const sentRef = useRef(null);

  const puppySelectId = useId();
  const messageId = useId();

  const whatsappHref = `https://wa.me/971541676733?text=${encodeURIComponent(
    formData.name
      ? `Hi TeddyPups! My name is ${formData.name}. I'm inquiring from the website about puppies.`
      : "Hi TeddyPups! I'd love to know more about your puppies."
  )}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check honeypot
    if (formData.website) return;

    // Validate
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Your name must be at least 2 characters';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone or WhatsApp number is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setErrors({});
    if (containerRef.current) {
      setMinHeight(containerRef.current.offsetHeight);
    }

    // Sequence: writing -> sealing -> posting -> sent
    setPhase('sealing');
    const timer1 = setTimeout(() => {
      setPhase('posting');
    }, 750);

    const timer2 = setTimeout(() => {
      setMinHeight(undefined);
      setPhase('sent');
    }, 1750);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  useEffect(() => {
    if (phase === 'sent' && sentRef.current) {
      sentRef.current.focus({ preventScroll: true });
      const rectTop = sentRef.current.getBoundingClientRect().top;
      const headerH = 76;
      if (rectTop < headerH + 8) {
        window.scrollBy({ top: rectTop - headerH - 24, behavior: 'smooth' });
      }
    }
  }, [phase]);

  return (
    <div data-page="contact" className="tp-page">
      <section
        data-pup-scene="true"
        data-tone="light"
        className="tp-scene"
        style={{ '--sky-top': '#fff9ee', '--sky-bottom': '#f9dca4' }}
        aria-labelledby="contact-title"
      >
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 id="contact-title" className="font-plush text-giant max-w-[12ch] lg:col-span-7">
              Get in touch with us
            </h1>
            <p className="text-lede text-[var(--ink-soft)] lg:col-span-5 lg:pb-3">
              Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you promptly. Whether ready to adopt or just seeking info, we'd love to hear from you!
            </p>
          </header>

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* RIGHT COLUMN on desktop: Letterform + Teddy mascot */}
            <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <div
                ref={containerRef}
                className="tp-post"
                data-phase={phase}
                style={{ minHeight: minHeight }}
              >
                {phase !== 'sent' && (
                  <form
                    ref={formRef}
                    noValidate
                    onSubmit={handleSubmit}
                    className="tp-letterform"
                    aria-hidden={phase !== 'writing' || undefined}
                    inert={phase !== 'writing' ? '' : undefined}
                  >
                    <span aria-hidden="true" className="tp-letter__stamp">
                      <svg viewBox="0 0 64 64" className="size-9" aria-hidden="true" fill="currentColor">
                        <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
                      </svg>
                    </span>

                    <p className="font-scrawl tp-letterform__greeting">Dear TeddyPups,</p>

                    {Object.keys(errors).length > 0 && (
                      <div role="alert" className="tp-letterform__alert">
                        <p className="font-semibold text-[#b3261e]">Please check the missing details:</p>
                        <ul className="text-[#8a1c14]">
                          {Object.entries(errors).map(([field, err]) => (
                            <li key={field} id={`${field}-err`}>
                              {err}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p className="tp-letterform__line">
                      my name is{' '}
                      <span className="tp-blank" style={{ '--size': '16ch' }}>
                        <input
                          aria-label="Your name (required)"
                          autoComplete="name"
                          required
                          minLength={2}
                          maxLength={80}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          aria-invalid={!!errors.name || undefined}
                          aria-describedby={errors.name ? 'name-err' : undefined}
                        />
                      </span>
                      , and you can reach me on{' '}
                      <span className="tp-blank" style={{ '--size': '15ch' }}>
                        <input
                          aria-label="Phone or WhatsApp number with country code (required)"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          required
                          placeholder="+971 50 123 4567"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          aria-invalid={!!errors.phone || undefined}
                          aria-describedby={errors.phone ? 'phone-err' : undefined}
                        />
                      </span>{' '}
                      or by email at{' '}
                      <span className="tp-blank" style={{ '--size': '20ch' }}>
                        <input
                          aria-label="Email (optional)"
                          type="email"
                          autoComplete="email"
                          placeholder="optional"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </span>
                      .
                    </p>

                    <p className="tp-letterform__line">
                      I live in{' '}
                      <span className="tp-blank" style={{ '--size': '13ch' }}>
                        <input
                          aria-label="Your area (optional)"
                          autoComplete="address-level2"
                          maxLength={80}
                          placeholder="e.g. Dubai Marina"
                          name="area"
                          value={formData.area}
                          onChange={handleChange}
                        />
                      </span>
                      , and I'm curious about{' '}
                      <span className="tp-blank tp-blank--select">
                        <label htmlFor={puppySelectId} className="sr-only">
                          Puppy you're interested in (optional)
                        </label>
                        <select
                          id={puppySelectId}
                          name="puppyId"
                          value={formData.puppyId}
                          onChange={handleChange}
                        >
                          {PUPPY_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </span>
                      .
                    </p>

                    <label htmlFor={messageId} className="sr-only">
                      Your message (optional)
                    </label>
                    <textarea
                      id={messageId}
                      name="message"
                      rows={4}
                      maxLength={2000}
                      placeholder="Anything else you'd like to tell us…"
                      className="tp-letterform__note"
                      value={formData.message}
                      onChange={handleChange}
                    />

                    {/* Honeypot field */}
                    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                      <label>
                        Website
                        <input
                          tabIndex={-1}
                          autoComplete="off"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                        />
                      </label>
                    </div>

                    <div className="tp-letterform__sign">
                      <p className="font-scrawl">with love, a future puppy parent</p>
                      <button
                        type="submit"
                        disabled={phase === 'sealing' || phase === 'posting'}
                        className="btn btn-primary disabled:opacity-70"
                      >
                        {phase === 'sealing' || phase === 'posting'
                          ? 'Sealing the envelope…'
                          : 'Post my letter'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Animated Post Envelope & Mailbox Scene */}
                {(phase === 'sealing' || phase === 'posting') && (
                  <div aria-hidden="true" className="tp-post__scene">
                    <svg viewBox="0 0 160 112" className="tp-post__envelope">
                      <rect x="4" y="18" width="152" height="90" rx="6" fill="#fffdf8" stroke="#2a170e" strokeWidth="4" />
                      <path d="M6 104 64 62M154 104 96 62" fill="none" stroke="#2a170e" strokeWidth="3" strokeLinecap="round" />
                      <path className="tp-post__flap" d="M6 22 80 74 154 22" fill="#fbe3b4" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
                      <circle cx="80" cy="72" r="11" fill="#a24a1a" stroke="#2a170e" strokeWidth="3" />
                    </svg>

                    <svg viewBox="0 0 200 260" className="tp-post__box">
                      <rect x="86" y="170" width="28" height="86" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
                      <path d="M30 70a70 54 0 0 1 140 0v104H30z" fill="#c2622b" stroke="#2a170e" strokeWidth="5" strokeLinejoin="round" />
                      <rect x="58" y="86" width="84" height="14" rx="7" fill="#2a170e" />
                      <path d="M44 128h112" stroke="#2a170e" strokeWidth="3" strokeLinecap="round" opacity=".35" />
                      <g className="tp-post__flag">
                        <path d="M170 120V64" stroke="#2a170e" strokeWidth="5" strokeLinecap="round" />
                        <path d="M170 64h22v16h-22" fill="#f2be6b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
                      </g>
                    </svg>
                  </div>
                )}

                {/* Sent / Delivered state */}
                {phase === 'sent' && (
                  <div ref={sentRef} tabIndex={-1} role="status" className="tp-post__sent">
                    <svg viewBox="0 0 200 150" aria-hidden="true" className="tp-post__box tp-post__box--sent">
                      <rect x="86" y="96" width="28" height="52" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
                      <path d="M30 50a70 44 0 0 1 140 0v52H30z" fill="#c2622b" stroke="#2a170e" strokeWidth="5" strokeLinejoin="round" />
                      <rect x="58" y="58" width="84" height="12" rx="6" fill="#2a170e" />
                      <path d="M170 92V22" stroke="#2a170e" strokeWidth="5" strokeLinecap="round" />
                      <path d="M170 22h22v16h-22" fill="#f2be6b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
                    </svg>
                    <p className="font-plush mt-4 text-[2rem]">Message received!</p>
                    <p className="mx-auto mt-2 max-w-[40ch] text-cocoa-soft">
                      Thank you — our team will get back to you promptly. For the quickest reply, message us on WhatsApp.
                    </p>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp mt-6"
                    >
                      WhatsApp us
                    </a>
                  </div>
                )}
              </div>

              {/* Teddy mascot sitting and waiting for letter */}
              <div className="pup-buddy ml-auto mr-6 -mt-3 w-36 md:w-40" data-facing="left">
                <TeddyMascot
                  pose="sit"
                  facing="left"
                  bubbleText="waiting for your note!"
                  label="Teddy, waiting for your letter"
                />
              </div>
            </div>

            {/* LEFT COLUMN on desktop: Direct contact & Showroom */}
            <div className="lg:col-span-5 lg:row-start-1">
              <a
                href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp w-full sm:w-auto"
              >
                WhatsApp +971 54 167 6733
              </a>

              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">call us</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    <a className="link-ink" href="tel:+971541676733">
                      +971 54 167 6733
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">email</dt>
                  <dd className="mt-1 break-all text-lg font-semibold">
                    <a className="link-ink" href="mailto:teddypupsadmin@gmail.com">
                      teddypupsadmin@gmail.com
                    </a>
                  </dd>
                </div>
              </dl>

              {/* Showroom visit card */}
              <section aria-labelledby="visit-title" className="tp-shopfront mt-12">
                <svg
                  viewBox="0 0 300 120"
                  className="absolute -bottom-1 right-0 w-3/4 text-toffee/30"
                  aria-hidden="true"
                >
                  <path
                    d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <div className="tp-visit relative p-7 pt-6">
                  <div>
                    <h2 id="visit-title" className="font-plush text-[2rem] leading-tight">
                      Visit us in Downtown Dubai
                    </h2>
                    <p className="mt-3 max-w-[38ch] text-cocoa-soft">
                      Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face.
                    </p>
                    <p className="mt-4 flex items-center gap-2 font-semibold">
                      <svg
                        viewBox="0 0 64 64"
                        className="size-5 shrink-0 text-toffee-deep"
                        aria-hidden="true"
                        fill="currentColor"
                      >
                        <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
                      </svg>
                      Downtown Dubai, United Arab Emirates
                    </p>
                    <a
                      href="https://maps.app.goo.gl/ZdJvwHBSQWWZT54s7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost mt-6 !bg-milk"
                    >
                      Open in Google Maps
                    </a>
                  </div>

                  <figure className="tp-visit__photo">
                    <img
                      src="https://puppy.instabizweb.com/media/skvodl2NZiKq/cefab5eee9/27b888_323008bb0f6a41d4bde2a0da7206cd98f003.jpg"
                      alt="The apricot teddy bear puppy from our showroom, held up to say hello"
                      loading="lazy"
                      style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        objectFit: 'cover',
                        objectPosition: '45.3% 44.4%'
                      }}
                    />
                  </figure>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
