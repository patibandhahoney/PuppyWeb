import React, { useState, useMemo, useId } from 'react';
import './FAQ.css';
import { FAQ_DATA } from '../data/faqData';
import TeddyMascot from '../components/TeddyMascot';

const TILT_ANGLES = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.7, -1.9, 1.4];
const PIN_COLORS = ["var(--color-toffee)", "var(--color-sky-deep)", "#d9a13c", "#c45a6a"];

function Highlight({ text, query }) {
  const n = query.trim();
  if (!n) return <>{text}</>;
  const regex = new RegExp(`(${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, idx) =>
        idx % 2 ? <mark key={idx}>{part}</mark> : <React.Fragment key={idx}>{part}</React.Fragment>
      )}
    </>
  );
}

export default function FAQ() {
  const [openId, setOpenId] = useState(null);
  const [query, setQuery] = useState('');
  const searchInputId = useId();

  const trimmedQuery = query.trim().toLowerCase();

  const filteredFaqs = useMemo(() => {
    if (!trimmedQuery) return FAQ_DATA;
    return FAQ_DATA.filter((faq) =>
      `${faq.question} ${faq.answer} ${faq.keywords || ''}`
        .toLowerCase()
        .includes(trimmedQuery)
    );
  }, [trimmedQuery]);

  const toggleNote = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const askHref = "https://wa.me/971541676733?text=Hi%20TeddyPups!%20I%20have%20a%20question%3A";

  const isOpenActive = openId !== null || !!trimmedQuery;

  return (
    <div data-page="faq" className="tp-page">
      {/* Schema.org FAQPage structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_DATA.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer
              }
            }))
          })
        }}
      />

      <section
        data-pup-scene="true"
        data-tone="dark"
        className="tp-scene tp-faqroom overflow-hidden"
        style={{
          "--sky-top": "#a95e32",
          "--sky-bottom": "#331c11"
        }}
        aria-labelledby="faq-title"
      >
        <div className="gutter relative mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          {/* Header */}
          <header className="max-w-4xl">
            <h1 id="faq-title" className="font-plush text-giant">
              Questions &amp; answers
            </h1>
            <p className="text-lede mt-6 max-w-[52ch] text-[var(--ink-soft)]">
              Can't find what you're looking for? Message us on WhatsApp — our team is available 24/7.
            </p>
          </header>

          {/* Notice Board Area */}
          <div className="mt-12 md:mt-16">
            <div className="tp-notes" data-open={isOpenActive ? "" : undefined}>
              {/* Sticky Sidebar */}
              <aside className="tp-notes__side" aria-label="Find a question">
                <label htmlFor={searchInputId} className="font-scrawl tp-notes__label">
                  sniff out a question
                </label>

                <div className="tp-notes__search">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="tp-notes__lens">
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path d="m15.5 15.5 5 5" />
                  </svg>
                  <input
                    id={searchInputId}
                    type="search"
                    placeholder="delivery, Korea, vaccinated…"
                    autoComplete="off"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <p className="tp-notes__count" aria-live="polite">
                  {query.trim()
                    ? `${filteredFaqs.length} ${filteredFaqs.length === 1 ? 'note' : 'notes'} found`
                    : `${FAQ_DATA.length} notes on the board`}
                </p>

                {/* Teddy Reading Mascot with Dynamic Bubble */}
                <div className="tp-notes__teddy">
                  <span aria-hidden="true" className="tp-notes__bubble font-plush">
                    <span className="tp-notes__q">?</span>
                    <span className="tp-notes__a">!</span>
                  </span>
                  <TeddyMascot pose="sit" act="tilt" label="Teddy, reading the notes" />
                </div>

                <a
                  href={askHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp tp-notes__ask"
                >
                  Ask your own question
                </a>
              </aside>

              {/* Realistic Cork Notice Board */}
              <div className="tp-notes__board">
                <ul className="tp-notes__list">
                  {filteredFaqs.map((faq, idx) => {
                    const isOpen =
                      openId === faq.id ||
                      (!!trimmedQuery && faq.answer.toLowerCase().includes(trimmedQuery));

                    const tiltDeg = `${TILT_ANGLES[idx % TILT_ANGLES.length]}deg`;
                    const pinCol = PIN_COLORS[idx % PIN_COLORS.length];

                    return (
                      <li
                        key={faq.id}
                        className="tp-note"
                        data-reveal="true"
                        data-revealed="true"
                        data-unfolded={isOpen ? "" : undefined}
                        style={{
                          "--tilt": tiltDeg,
                          "--pin": pinCol,
                          "--i": idx
                        }}
                      >
                        {/* Realistic Pushpin */}
                        <span aria-hidden="true" className="tp-note__pin" />

                        {/* Note Question Accordion Toggle */}
                        <h2 className="tp-note__q">
                          <button
                            type="button"
                            id={`q-${faq.id}`}
                            aria-expanded={isOpen}
                            aria-controls={`a-${faq.id}`}
                            onClick={() => toggleNote(faq.id)}
                          >
                            <span className="font-plush-text">
                              <Highlight text={faq.question} query={query} />
                            </span>
                            <span aria-hidden="true" className="tp-note__chevron" />
                          </button>
                        </h2>

                        {/* Fold-Out Flap Accordion Answer */}
                        <div
                          id={`a-${faq.id}`}
                          role="region"
                          aria-labelledby={`q-${faq.id}`}
                          className="tp-note__answer"
                          inert={!isOpen ? "" : undefined}
                        >
                          <div className="tp-note__flap">
                            <p>
                              <Highlight text={faq.answer} query={query} />
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Empty State when no notes match search query */}
                {!filteredFaqs.length && (
                  <div className="tp-note tp-note--empty">
                    <span aria-hidden="true" className="tp-note__pin" />
                    <p className="font-plush-text text-[1.2rem] font-bold">
                      No note about “{query.trim()}” yet.
                    </p>
                    <p className="mt-2">
                      <a
                        href={askHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-ink"
                      >
                        Ask us on WhatsApp
                      </a>{" "}
                      and we'll answer.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
