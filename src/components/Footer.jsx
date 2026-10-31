import React from 'react';
import './Footer.css';
import TeddyMascot from './TeddyMascot';

export default function Footer({ navigate }) {
  const handleNav = (path, e) => {
    e.preventDefault();
    if (navigate) {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const stars = [
    { left: '6%', top: '18%', width: '12.6px', animationDelay: '0.00s' },
    { left: '14%', top: '42%', width: '8.4px', animationDelay: '0.40s' },
    { left: '23%', top: '12%', width: '9.8px', animationDelay: '0.80s' },
    { left: '31%', top: '30%', width: '7px', animationDelay: '1.20s' },
    { left: '44%', top: '9%', width: '11.2px', animationDelay: '1.60s' },
    { left: '52%', top: '36%', width: '7.7px', animationDelay: '2.00s' },
    { left: '63%', top: '15%', width: '10.5px', animationDelay: '2.40s' },
    { left: '71%', top: '40%', width: '7px', animationDelay: '2.80s' },
    { left: '92%', top: '33%', width: '8.4px', animationDelay: '3.20s' },
  ];

  return (
    <footer className="tp-footer relative pb-[calc(var(--bar-h)+2rem)] text-milk md:pb-10">
      {/* Top wavy hill curve */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="tp-footer__hill"
      >
        <path d="M0 80V44c120-30 240-44 360-30s240 46 360 34 240-58 360-46 240 40 360 26v52z" />
      </svg>

      {/* Sky stars and Crescent Moon */}
      <div aria-hidden="true" className="tp-footer__sky pointer-events-none absolute inset-x-0 top-6 h-64 overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {stars.map((s, idx) => (
            <svg
              key={idx}
              viewBox="0 0 40 40"
              className="tp-twinkle absolute text-honey"
              style={{ left: s.left, top: s.top, width: s.width, animationDelay: s.animationDelay }}
              aria-hidden="true"
            >
              <path
                d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z"
                fill="currentColor"
              />
            </svg>
          ))}
        </div>
        <span className="tp-moon"></span>
      </div>

      <div className="tp-footer__container gutter relative mx-auto grid max-w-[110rem] gap-12 pt-20 md:grid-cols-12 md:gap-x-12 md:gap-y-6 md:pt-28">
        {/* Left Column: Heading & Description */}
        <div className="tp-footer__intro md:col-span-5">
          <p className="tp-footer__heading font-plush text-big text-honey-soft">
            Home, at last.
          </p>
          <p className="tp-footer__desc mt-5 max-w-md text-milk/80">
            TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies, offering premium services and worldwide shipping.
          </p>
        </div>

        {/* Mascot Basket underneath left column on desktop */}
        <div className="tp-footer__basket-col order-last md:order-none md:col-span-5 md:col-start-1 md:row-start-2">
          <div className="tp-basket">
            <svg aria-hidden="true" viewBox="0 0 300 240" className="tp-basket__back">
              <ellipse cx="212" cy="145" rx="96" ry="12" className="tp-basket__hollow" />
              <path d="M116 145 A96 12 0 0 1 308 145" className="tp-basket__rim-line" />
              <path d="M116 145 A96 12 0 0 1 308 145" className="tp-basket__rim" />
            </svg>
            <div
              data-pup-stop="true"
              data-pose="snug"
              data-facing="right"
              data-act="basket"
              data-behind="true"
              data-lane="true"
              className="pup-stop tp-basket__pup"
            >
              <TeddyMascot pose="snug" facing="right" label="Teddy, sitting snug in his basket" interactive={false} />
            </div>
            <svg aria-hidden="true" viewBox="0 0 300 240" className="tp-basket__front">
              <path
                d="M116 145 C118 180 126 214 138 232 L286 232 C298 214 306 180 308 145 A96 12 0 0 1 116 145 Z"
                className="tp-basket__body"
              />
              <path
                d="M121 178 Q212 197 303 178 M127 206 Q212 223 297 206"
                className="tp-basket__weave"
              />
              <path
                d="M150 164 L158 230 M182 168 L185 232 M212 169 V232 M242 168 L239 232 M274 164 L266 230"
                className="tp-basket__weave tp-basket__weave--stakes"
              />
              <path d="M116 145 A96 12 0 0 0 308 145" className="tp-basket__rim-line" />
              <path d="M116 145 A96 12 0 0 0 308 145" className="tp-basket__rim" />
            </svg>
          </div>
        </div>

        {/* Center Column: Explore Navigation */}
        <nav aria-label="Footer" className="tp-footer__nav md:col-span-3 md:col-start-7 md:row-span-2 md:row-start-1">
          <h2 className="font-scrawl text-lg text-honey">Explore</h2>
          <ul className="tp-footer__links mt-4 space-y-2.5">
            <li>
              <a
                href="/puppies"
                onClick={(e) => handleNav('/puppies', e)}
                className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline"
              >
                Available puppies
              </a>
            </li>
            <li>
              <a
                href="/gone-home"
                onClick={(e) => handleNav('/gone-home', e)}
                className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline"
              >
                Gone home
              </a>
            </li>
            <li>
              <a
                href="/happy-families"
                onClick={(e) => handleNav('/happy-families', e)}
                className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline"
              >
                Happy families
              </a>
            </li>
            <li>
              <a
                href="/how-it-works"
                onClick={(e) => handleNav('/how-it-works', e)}
                className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline"
              >
                How it works
              </a>
            </li>
            <li>
              <a
                href="/how-it-works#delivery"
                onClick={(e) => handleNav('/how-it-works', e)}
                className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline"
              >
                Delivery &amp; collection
              </a>
            </li>
            <li>
              <a
                href="/faq"
                onClick={(e) => handleNav('/faq', e)}
                className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline"
              >
                FAQ
              </a>
            </li>
            <li>
              <a
                href="/contact"
                onClick={(e) => handleNav('/contact', e)}
                className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline"
              >
                Visit &amp; contact
              </a>
            </li>
          </ul>
        </nav>

        {/* Right Column: Say hello */}
        <div className="tp-footer__contact md:col-span-3 md:row-span-2 md:row-start-1">
          <h2 className="font-scrawl text-lg text-honey">Say hello</h2>
          <ul className="tp-footer__contact-list mt-4 space-y-2.5 text-milk/90">
            <li>
              <a
                className="font-semibold hover:text-honey"
                href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies."
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp +971 54 167 6733
              </a>
            </li>
            <li>
              <a className="break-all hover:text-honey" href="mailto:teddypupsadmin@gmail.com">
                teddypupsadmin@gmail.com
              </a>
            </li>
            <li>Downtown Dubai, United Arab Emirates</li>
          </ul>
          <ul className="tp-footer__social mt-6 flex flex-wrap gap-3" aria-label="Social media">
            <li>
              <a
                href="https://www.instagram.com/teddypups.worldwide/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center rounded-full border-2 border-milk/30 px-4 text-sm font-semibold hover:border-honey hover:text-honey"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@teddypupsuae"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center rounded-full border-2 border-milk/30 px-4 text-sm font-semibold hover:border-honey hover:text-honey"
              >
                TikTok
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/profile.php?id=61567496944539"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center rounded-full border-2 border-milk/30 px-4 text-sm font-semibold hover:border-honey hover:text-honey"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="tp-footer__bottom gutter relative mx-auto mt-16 flex max-w-[110rem] flex-col items-start justify-between gap-4 border-t border-milk/15 pt-6 text-sm text-milk/60 md:flex-row md:items-center">
        <span className="flex items-center gap-3">
          <img
            src="https://puppy.instabizweb.com/brand/logo.png"
            alt="TeddyPups U.A.E."
            width="36"
            height="36"
            className="tp-footer__logo size-9 rounded-full"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          © 2026 TeddyPups U.A.E.
        </span>
        <span className="tp-footer__family font-scrawl text-base text-honey/80">
          every puppy is family
        </span>
      </div>
    </footer>
  );
}
