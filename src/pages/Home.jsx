import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import TeddyMascot from '../components/TeddyMascot';
import PupJourney from '../components/PupJourney';
import { PUPPIES_DATA, puppiesData } from '../data/puppiesData';
import { REVIEWS_DATA } from '../data/reviewsData';
import { FAQ_DATA } from '../data/faqData';

export default function Home({ navigate, onSelectPuppy, onSelectPhoto }) {
  // Hero lineup duck & pop interactive cycle
  const [heroPupStates, setHeroPupStates] = useState({});
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [poppedSeat, setPoppedSeat] = useState(null);

  useEffect(() => {
    let timeoutId;
    const runCycle = () => {
      const candidates = [0, 1, 2, 3, 4, 5].filter((idx) => idx !== hoveredSeat);
      if (!candidates.length) {
        timeoutId = setTimeout(runCycle, 2000);
        return;
      }
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      setHeroPupStates((prev) => ({ ...prev, [chosen]: 'duck' }));
      timeoutId = setTimeout(() => {
        setHeroPupStates((prev) => ({ ...prev, [chosen]: 'pop' }));
        setPoppedSeat(chosen);
        setTimeout(() => setPoppedSeat((cur) => (cur === chosen ? null : cur)), 1800);
        setTimeout(() => {
          setHeroPupStates((prev) => {
            const next = { ...prev };
            delete next[chosen];
            return next;
          });
        }, 700);
        timeoutId = setTimeout(runCycle, 1900 + Math.random() * 1200);
      }, 360);
    };
    timeoutId = setTimeout(runCycle, 2400);
    return () => clearTimeout(timeoutId);
  }, [hoveredSeat]);

  // Journey phone interactive state
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);
  const [selectedChatBreed, setSelectedChatBreed] = useState('Maltipoo');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Meet the Pups Pinned Hallway state & refs
  const meetSectionRef = useRef(null);
  const meetTrackRef = useRef(null);
  const [meetScrollX, setMeetScrollX] = useState(0);
  const [meetProgress, setMeetProgress] = useState(0);
  const [hoveredDoorIdx, setHoveredDoorIdx] = useState(null);

  // Journey steps refs & phone auto-scroll
  const journeyStepsRef = useRef([]);
  const chatScreenRef = useRef(null);

  // Happy families photowall ref
  const photowallRef = useRef(null);
  const [isWallRevealed, setIsWallRevealed] = useState(false);

  // Scroll handler for pinned horizontal hallway (Meet the pups)
  useEffect(() => {
    let animId;
    const handleScroll = () => {
      if (!meetSectionRef.current || !meetTrackRef.current) return;
      const rect = meetSectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalScrollable = rect.height - windowH;

      if (totalScrollable > 0) {
        const current = -rect.top;
        const p = Math.max(0, Math.min(1, current / totalScrollable));
        setMeetProgress(p);

        const track = meetTrackRef.current;
        const maxScrollDist = Math.max(0, track.scrollWidth - window.innerWidth + 80);
        setMeetScrollX(p * maxScrollDist);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    handleScroll();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // IntersectionObserver for Journey steps (scroll-driven step activation)
  useEffect(() => {
    const elements = journeyStepsRef.current;
    if (!elements || elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIdx = Number(entry.target.getAttribute('data-step-index'));
            if (!isNaN(stepIdx)) {
              setActiveJourneyStep(stepIdx);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -40% 0px',
        threshold: 0.1
      }
    );

    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Phone screen auto-scroll on step / message change
  useEffect(() => {
    if (chatScreenRef.current) {
      chatScreenRef.current.scrollTo({
        top: chatScreenRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [activeJourneyStep, selectedChatBreed]);

  // Photowall reveal observer
  useEffect(() => {
    if (!photowallRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsWallRevealed(true);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(photowallRef.current);
    return () => observer.disconnect();
  }, []);

  // Fallback safe list
  const puppiesList = PUPPIES_DATA && PUPPIES_DATA.length > 0 ? PUPPIES_DATA : puppiesData;
  const reviewsList = REVIEWS_DATA && REVIEWS_DATA.length > 0 ? REVIEWS_DATA : [];
  const faqList = FAQ_DATA && FAQ_DATA.length > 0 ? FAQ_DATA.slice(0, 3) : [];

  // Hero peeking lineup: 6 puppy seats
  const heroSeats = [
    {
      x: '9%',
      w: '8.6rem',
      peek: '0.62',
      tilt: '-5deg',
      i: 0,
      pup: puppiesList.find((p) => p.slug === 'maltipoo-max-male') || puppiesList[0],
      name: 'Max',
      img: 'https://puppy.instabizweb.com/media/Z0ToauDx7Eve/5fffe4d022/b942a5_4b8cfb8204d24eadaf524332aba1dc15-mv2.webp'
    },
    {
      x: '22.5%',
      w: '10.4rem',
      peek: '0.8',
      tilt: '3deg',
      i: 1,
      pup: puppiesList.find((p) => p.slug === 'korean-teacup-maltipoo-female') || puppiesList[1],
      name: 'Korean Teacup Maltipoo',
      img: 'https://puppy.instabizweb.com/media/gAaGwoGej2g6/5523e884dd/b942a5_50f0ae67c9ff437d911597d52a9e63b3-mv2.jpg'
    },
    {
      x: '35%',
      w: '9.2rem',
      peek: '0.7',
      tilt: '-2deg',
      i: 2,
      pup: puppiesList.find((p) => p.slug === 'korean-teacup-poodle-female') || puppiesList[2],
      name: 'Korean Teacup Poodle',
      img: 'https://puppy.instabizweb.com/media/xeMJCapr5vcU/e618c653b2/b942a5_14376a216177484dbbb27995d0f6aeb7-mv2.jpg'
    },
    {
      x: '65%',
      w: '9.4rem',
      peek: '0.74',
      tilt: '3deg',
      i: 3,
      pup: puppiesList.find((p) => p.slug === 'maltipoo-cavapoo-male') || puppiesList[3],
      name: 'Maltipoo & Cavapoo',
      img: 'https://puppy.instabizweb.com/media/YQhey4j7uWvZ/3ea10db6c1/b942a5_7ce7e7bd18424b6c8fb16dd30113ade2-mv2.jpg'
    },
    {
      x: '77.5%',
      w: '10.6rem',
      peek: '0.82',
      tilt: '-3deg',
      i: 4,
      pup: puppiesList.find((p) => p.slug === 'toy-poodle-male-female') || puppiesList[4],
      name: 'Toy Poodle',
      img: 'https://puppy.instabizweb.com/media/vMu0BPvkAZ-j/c65e53967d/b942a5_0b2c0c0d178c4005acbe28725a5ea573-mv2.jpg'
    },
    {
      x: '91%',
      w: '8.4rem',
      peek: '0.6',
      tilt: '4deg',
      i: 5,
      pup: puppiesList.find((p) => p.slug === 'maltipoo-female-2') || puppiesList[5],
      name: 'Maltipoo',
      img: 'https://puppy.instabizweb.com/media/3WJNmn6VVgVu/732f779474/b942a5_2b5dcece361b4589890ae920c66a1b70-mv2.jpg'
    }
  ];

  // Door card colors in hallway
  const doorColors = ['#a24a1a', '#5a3a28', '#d4893f', '#b8644a', '#7a4a2e'];

  // Doors for Meet the Pups section (first 12 puppies)
  const meetPups = puppiesList.slice(0, 12);

  // Polaroids for Happy Families (8 items)
  const polaroidsList = [
    {
      id: 1,
      image: 'https://puppy.instabizweb.com/media/dI8Jv0KRTiLJ/d2d7e5375b/27b888_7d940ce5701f48d98327e4a242b53ac4-mv2.jpg',
      caption: 'Lulu 🧸 with her new mummy ❤️',
      tilt: '-2.2deg',
      tape: '#f6d79a',
      tapePos: 'tp-tape--center',
      d: '330ms'
    },
    {
      id: 2,
      image: 'https://puppy.instabizweb.com/media/TI-WtaFssfQt/c41fb2a387/27b888_15920f828b864dd1b44b98ec4e964c53-mv2.jpg',
      caption: 'Adorable Maltipoo baby 🧸❤️',
      tilt: '1.6deg',
      tape: '#f9cdbf',
      tapePos: 'tp-tape--left',
      d: '0ms'
    },
    {
      id: 3,
      image: 'https://puppy.instabizweb.com/media/j6T9eswP2eS8/59c6879a1d/27b888_bc27df54dcce410196c6016475364ff3-mv2.jpg',
      caption: 'My new teddy puppy 🥰🧸',
      tilt: '-0.9deg',
      tape: '#cfe5f6',
      tapePos: 'tp-tape--right',
      d: '550ms'
    },
    {
      id: 4,
      image: 'https://puppy.instabizweb.com/media/HJgL4rRnmReV/533701358f/27b888_082e47dfd8144423a96dc70d966fa5b2-mv2.jpg',
      caption: 'Our new puppies 🧸🥰🤗',
      tilt: '2.4deg',
      tape: '#f6d79a',
      tapePos: 'tp-tape--tl',
      d: '110ms'
    },
    {
      id: 5,
      image: 'https://puppy.instabizweb.com/media/uc5ANs5jm7r7/7160d8b7b1/27b888_f7f4966e59e94db591784d4ec546682f-mv2.jpg',
      caption: 'New puppy 🧸😍',
      tilt: '-1.5deg',
      tape: '#e9dcc4',
      tapePos: 'tp-tape--center',
      d: '660ms'
    },
    {
      id: 6,
      image: 'https://puppy.instabizweb.com/media/pRJubyqHw8p7/d58c4c07ee/27b888_b073c5815f7c4f92ad9a57741a653663-mv2.jpg',
      caption: 'Gang of 3 😍🧸',
      tilt: '0.8deg',
      tape: '#f6d79a',
      tapePos: 'tp-tape--right',
      d: '220ms'
    },
    {
      id: 7,
      image: 'https://puppy.instabizweb.com/media/4wOJk9azop_-/65ecf66bf0/27b888_cfe895dbcc2d4bff85f890be9b496543-mv2.jpg',
      caption: 'So happy 😍😍',
      tilt: '-2.6deg',
      tape: '#f9cdbf',
      tapePos: 'tp-tape--left',
      d: '770ms'
    },
    {
      id: 8,
      image: 'https://puppy.instabizweb.com/media/3h20rIasJCOa/10c307cb1c/27b888_a7e7ab6a931e4c79a798bab9927d396e-mv2.jpg',
      caption: 'New pup 🤗💫',
      tilt: '1.2deg',
      tape: '#cfe5f6',
      tapePos: 'tp-tape--center',
      d: '440ms'
    }
  ];

  const handleNav = (path, e) => {
    if (e) e.preventDefault();
    if (navigate) {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePupClick = (pup, e) => {
    if (e) e.preventDefault();
    if (navigate && pup?.slug) {
      navigate(`/puppies/${pup.slug}`);
    } else if (onSelectPuppy) {
      onSelectPuppy(pup);
    } else if (navigate) {
      navigate('/puppies');
    }
  };

  const handlePhotoClick = (item, e) => {
    if (e) e.preventDefault();
    const fullReview = reviewsList.find((r) => r.id === item.id) || item;
    if (onSelectPhoto) {
      onSelectPhoto(fullReview);
    } else if (navigate) {
      navigate('/happy-families');
    }
  };

  return (
    <div data-page="home" className="tp-page">
      <PupJourney />
      {/* 1. HERO SECTION */}
      <div data-section="hero">
        <section
          data-pup-scene="true"
          data-tone="light"
          className="tp-scene tp-hero"
          style={{ '--sky-top': '#fffdf8', '--sky-bottom': '#fff1d8', '--quilt': '#fff1d8' }}
          aria-labelledby="hero-title"
        >
          <span aria-hidden="true" className="tp-hero__sun"></span>

          <div className="tp-hero__copy gutter">
            <p className="tp-hero__note font-scrawl">
              every puppy is family
              <svg
                viewBox="0 0 220 24"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-full text-toffee"
                aria-hidden="true"
              >
                <path
                  d="M4 14c18-10 30 8 48-1s28-9 46 0 30 8 48-1 30-9 48 0 18 2 22 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </p>

            <h1 id="hero-title" className="tp-hero__title font-plush">
              <span className="tp-hero__line">Premium teacup</span>
              <span className="tp-hero__line tp-hero__line--2">puppies in Dubai</span>
            </h1>

            <p className="tp-hero__lede">
              Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.
            </p>

            <div className="tp-hero__actions">
              <a
                className="btn btn-primary"
                href="/puppies"
                onClick={(e) => handleNav('/puppies', e)}
              >
                View available puppies
              </a>
              <a
                href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Enquire on WhatsApp
              </a>
            </div>
          </div>

          <div className="tp-hero__stage">
            {/* Puppy Peeking Lineup */}
            <ul className="tp-lineup" aria-label="Some of the puppies in our showroom">
              {heroSeats.map((seat) => (
                <li
                  key={seat.i}
                  className="tp-lineup__seat"
                  style={{
                    '--x': seat.x,
                    '--w': seat.w,
                    '--peek': seat.peek,
                    '--tilt': seat.tilt,
                    '--i': seat.i
                  }}
                >
                  <a
                    className="tp-lineup__pup"
                    data-pup-friend="true"
                    data-state={heroPupStates[seat.i]}
                    onPointerEnter={() => setHoveredSeat(seat.i)}
                    onPointerLeave={() => setHoveredSeat(null)}
                    aria-label={`Meet ${seat.name}`}
                    href={`/puppies/${seat.pup?.slug || ''}`}
                    onClick={(e) => handlePupClick(seat.pup, e)}
                  >
                    <span className="tp-lineup__photo">
                      <img
                        alt={seat.name}
                        src={seat.img || seat.pup?.cover}
                        style={{
                          position: 'absolute',
                          height: '100%',
                          width: '100%',
                          left: 0,
                          top: 0,
                          right: 0,
                          bottom: 0,
                          objectFit: 'cover'
                        }}
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Hover name tags */}
            <ul aria-hidden="true" className="tp-lineup tp-lineup--tags">
              {heroSeats.map((seat) => (
                <li
                  key={seat.i}
                  className="tp-lineup__seat"
                  style={{
                    '--x': seat.x,
                    '--w': seat.w,
                    '--peek': seat.peek,
                    '--tilt': seat.tilt,
                    '--i': seat.i
                  }}
                >
                  <span
                    className="tp-lineup__ghost"
                    data-state={heroPupStates[seat.i]}
                    data-tag={poppedSeat === seat.i || hoveredSeat === seat.i ? 'show' : undefined}
                  >
                    <span className="tp-lineup__name font-scrawl">{seat.name}</span>
                  </span>
                </li>
              ))}
            </ul>

            {/* Teddy Mascot peeking in center */}
            <div
              data-pup-stop="true"
              data-pose="peek"
              data-facing="right"
              data-act="peekaboo"
              data-behind="true"
              data-lane="true"
              className="pup-stop tp-hero__teddy"
            >
              <TeddyMascot pose="peek" facing="right" bubbleText="peekaboo!" />
            </div>

            {/* Scalloped Quilt Edge */}
            <div aria-hidden="true" className="tp-quilt">
              <svg className="tp-quilt__edge" width="100%" height="40" preserveAspectRatio="none">
                <defs>
                  <pattern id="tp-scallop" width="76" height="40" patternUnits="userSpaceOnUse">
                    <path d="M0 40V27A38 25 0 0 1 76 27V40Z" style={{ fill: 'var(--quilt)' }}></path>
                    <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3"></path>
                    <path
                      d="M11 33A27 19 0 0 1 65 33"
                      fill="none"
                      stroke="#2a170e"
                      strokeWidth="1.6"
                      strokeDasharray="3.5 5.5"
                      strokeLinecap="round"
                      opacity=".42"
                    ></path>
                  </pattern>
                </defs>
                <rect width="100%" height="40" fill="url(#tp-scallop)"></rect>
              </svg>
            </div>
          </div>
        </section>
      </div>

      {/* 2. MEET THE PUPS (DOORS HALLWAY) */}
      <div data-section="meet">
        <section
          ref={meetSectionRef}
          data-pup-scene="true"
          data-tone="light"
          data-pinned="true"
          className="tp-scene tp-meet"
          style={{
            '--sky-top': '#fff1d8',
            '--sky-bottom': '#fbe3b4',
            '--meet-progress': meetProgress
          }}
          aria-labelledby="meet-title"
        >
          <div data-pin-range="true" style={{ '--pinned': meetProgress }}>
            <div className="tp-meet__stage">
              <header className="tp-meet__head gutter">
                <div>
                  <h2 id="meet-title" className="font-plush text-huge">
                    Meet the pups
                  </h2>
                  <p className="text-lede mt-3 max-w-[44ch] text-[var(--ink-soft)]">
                    Real puppies, real photos, looking for their families right now.
                  </p>
                </div>
                <a
                  className="btn btn-primary shrink-0"
                  href="/puppies"
                  onClick={(e) => handleNav('/puppies', e)}
                >
                  See all available puppies
                </a>
              </header>

              <div className="tp-meet__hall">
                <ol
                  ref={meetTrackRef}
                  className="tp-meet__track"
                  data-treadmill="true"
                  aria-label="Puppies looking for a family"
                  style={{
                    transform: `translate3d(-${meetScrollX}px, 0, 0)`
                  }}
                >
                  {meetPups.map((pup, idx) => {
                    const doorColor = doorColors[idx % doorColors.length];
                    const isDoorOpen = hoveredDoorIdx === idx || (meetProgress > 0.04 && idx <= Math.floor(meetProgress * (meetPups.length + 3)) + 1);
                    return (
                      <li
                        key={pup.id || idx}
                        className="tp-door"
                        data-open={isDoorOpen ? 'true' : 'false'}
                        onMouseEnter={() => setHoveredDoorIdx(idx)}
                        onMouseLeave={() => setHoveredDoorIdx(null)}
                      >
                        <a
                          className="tp-door__link"
                          style={{ '--door': doorColor }}
                          href={`/puppies/${pup.slug || ''}`}
                          onClick={(e) => handlePupClick(pup, e)}
                        >
                          <span className="tp-door__plate">
                            <span className="font-plush tp-door__name">{pup.name || pup.title}</span>
                            <span className="tp-door__meta">
                              {pup.breed}, {pup.gender || 'boy'}{pup.age ? `, ${pup.age}` : ''}
                            </span>
                          </span>

                          <span className="tp-door__frame">
                            <span className="tp-door__room">
                              <img
                                alt={pup.name || pup.title}
                                loading="lazy"
                                src={pup.cover || pup.image}
                                style={{
                                  position: 'absolute',
                                  height: '100%',
                                  width: '100%',
                                  left: 0,
                                  top: 0,
                                  right: 0,
                                  bottom: 0,
                                  objectFit: 'cover'
                                }}
                              />
                            </span>

                            <span aria-hidden="true" className="tp-door__way">
                              <span className="tp-door__leaf">
                                <svg
                                  viewBox="0 0 64 64"
                                  className="tp-door__peephole"
                                  aria-hidden="true"
                                  fill="currentColor"
                                >
                                  <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z"></path>
                                </svg>
                                <span className="tp-door__knob"></span>
                              </span>
                            </span>

                            <span className="tp-door__tag font-scrawl">Available</span>
                          </span>
                        </a>
                      </li>
                    );
                  })}

                  {/* Door 13: Meet them all */}
                  <li className="tp-door tp-door--all" data-open="true">
                    <a
                      className="tp-door__link"
                      href="/puppies"
                      onClick={(e) => handleNav('/puppies', e)}
                    >
                      <span className="tp-door__frame tp-door__frame--all">
                        <span className="font-plush tp-door__all">Meet them all</span>
                      </span>
                    </a>
                  </li>
                </ol>

                <div
                  aria-hidden="true"
                  className="tp-meet__floor"
                  style={{
                    '--floor-x': `-${meetScrollX * 0.65}px`
                  }}
                ></div>

                <div data-pup-stop="true" data-pose="walk" data-act="treadmill" data-facing="right" className="pup-stop tp-meet__teddy">
                  <TeddyMascot pose="walk" act="treadmill" facing="right" bubbleText="pick me!" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 3. TWO WAYS TO MEET YOUR PUPPY */}
      <div data-section="paths">
        <section
          data-pup-scene="true"
          data-tone="light"
          className="tp-scene tp-paths"
          style={{ '--sky-top': '#fbe3b4', '--sky-bottom': '#f7d18d' }}
          aria-labelledby="paths-title"
        >
          <div className="gutter mx-auto max-w-[110rem]">
            <h2 id="paths-title" className="tp-paths__title font-plush text-huge">
              Two ways to meet your puppy
            </h2>

            <div className="tp-fork">
              <div aria-hidden="true" className="tp-fork__post"></div>

              {/* Left way: In Dubai */}
              <article className="tp-way tp-way--left" aria-labelledby="way-local">
                <h3 id="way-local" className="tp-sign tp-sign--left font-plush">
                  Puppies in Dubai
                </h3>
                <div className="tp-way__scene">
                  <svg viewBox="0 0 300 120" className="tp-way__skyline" aria-hidden="true">
                    <path
                      d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <figure className="tp-window">
                    <span className="tp-window__glass">
                      <img
                        alt="A tiny apricot teddy bear puppy held up in the TeddyPups showroom"
                        loading="lazy"
                        src="https://puppy.instabizweb.com/media/FHyoHcIosLZE/60f6e7e00a/27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg"
                        style={{
                          position: 'absolute',
                          height: '100%',
                          width: '100%',
                          left: 0,
                          top: 0,
                          right: 0,
                          bottom: 0,
                          objectFit: 'cover'
                        }}
                      />
                    </span>
                    <figcaption className="font-scrawl">In our showroom</figcaption>
                  </figure>
                </div>
                <p className="tp-way__text">
                  See them, love them, take them home. Come meet our locally available puppies before you decide.
                </p>
                <a
                  className="btn btn-primary"
                  href="/puppies?origin=local"
                  onClick={(e) => handleNav('/puppies', e)}
                >
                  Meet local puppies
                </a>
              </article>

              {/* Right way: Imported */}
              <article className="tp-way tp-way--right" aria-labelledby="way-imported">
                <h3 id="way-imported" className="tp-sign tp-sign--right font-plush">
                  Imported for you
                </h3>
                <div className="tp-way__scene">
                  <div className="tp-flight">
                    <svg viewBox="0 0 660 300" role="img" aria-label="A plane bringing a puppy from Korea to Dubai">
                      <defs>
                        <clipPath id="home-flight-porthole">
                          <circle r="25" cx="0" cy="0"></circle>
                        </clipPath>
                      </defs>
                      <path d="M40 250 C 170 40, 470 20, 620 168" className="tp-flight__route"></path>
                      <circle cx="40" cy="250" r="7" className="tp-flight__dot"></circle>
                      <circle cx="620" cy="168" r="7" className="tp-flight__dot"></circle>
                      <text x="40" y="284" textAnchor="middle" className="tp-flight__label">Korea</text>
                      <text x="620" y="202" textAnchor="middle" className="tp-flight__label">Dubai</text>
                      <g className="tp-flight__plane-group" transform="translate(410 70)">
                        <g transform="translate(-126 -78)">
                          <path d="M28 60 L8 26 L34 26 L60 54 Z" className="tp-flight__wing"></path>
                          <path d="M108 112 L142 156 L172 156 L158 112 Z" className="tp-flight__wing tp-flight__wing--far"></path>
                          <path d="M20 80 C20 52 52 44 80 44 L168 44 C200 44 224 60 232 80 C224 100 200 112 168 112 L80 112 C52 112 20 104 20 80 Z" className="tp-flight__body"></path>
                          <path d="M104 44 L138 2 L168 2 L154 44 Z" className="tp-flight__wing"></path>
                          <path d="M206 64 C215 67 221 73 224 80" className="tp-flight__line"></path>
                        </g>
                        <g transform="translate(10 2)" className="tp-flight__pup-porthole">
                          <image
                            href="https://puppy.instabizweb.com/media/gAaGwoGej2g6/5523e884dd/b942a5_50f0ae67c9ff437d911597d52a9e63b3-mv2.jpg"
                            x="-25"
                            y="-25"
                            width="50"
                            height="50"
                            clipPath="url(#home-flight-porthole)"
                            preserveAspectRatio="xMidYMid slice"
                          ></image>
                          <circle r="25" className="tp-flight__porthole"></circle>
                        </g>
                      </g>
                    </svg>
                  </div>
                </div>
                <p className="tp-way__text">
                  Exclusive Korean teacup puppies, delivered. Order from the world's most reputable breeders and let us handle the import.
                </p>
                <a
                  className="btn btn-primary"
                  href="/puppies?origin=imported"
                  onClick={(e) => handleNav('/puppies', e)}
                >
                  See imported puppies
                </a>
              </article>

              {/* Center Teddy */}
              <div data-pup-stop="true" data-pose="sit" data-facing="right" className="pup-stop tp-fork__teddy">
                <TeddyMascot pose="sit" facing="right" bubbleText="both are great!" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 4. YOUR PUPPY JOURNEY (CONCIERGE & WHATSAPP) */}
      <div data-section="journey">
        <section
          data-pup-scene="true"
          data-tone="light"
          className="tp-scene tp-chat"
          style={{ '--sky-top': '#f7d18d', '--sky-bottom': '#f0b866' }}
          aria-labelledby="journey-title"
        >
          <div className="tp-chat__grid gutter" data-pin-range="true">
            <div className="tp-chat__story">
              <h2 id="journey-title" className="font-plush text-huge">
                Your puppy journey
              </h2>
              <p className="text-lede mt-5 max-w-[42ch] text-[var(--ink-soft)]">
                A premium, step-by-step concierge experience. We make adoption simple, secure, and purely joyful.
              </p>

              <ol className="tp-chat__steps">
                <li
                  ref={(el) => (journeyStepsRef.current[0] = el)}
                  data-step-index="0"
                  className="tp-chat__step"
                  data-done="true"
                  data-active={activeJourneyStep === 0 ? 'true' : undefined}
                  onClick={() => setActiveJourneyStep(0)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="tp-chat__num font-plush" aria-hidden="true">1</span>
                  <h3 className="font-plush tp-chat__title">Choose your breed</h3>
                  <p className="tp-chat__text">
                    Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle.
                  </p>
                </li>

                <li
                  ref={(el) => (journeyStepsRef.current[1] = el)}
                  data-step-index="1"
                  className="tp-chat__step"
                  data-done="true"
                  data-active={activeJourneyStep === 1 ? 'true' : undefined}
                  onClick={() => setActiveJourneyStep(1)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="tp-chat__num font-plush" aria-hidden="true">2</span>
                  <h3 className="font-plush tp-chat__title">Get photos & details</h3>
                  <p className="tp-chat__text">
                    Our team will share real photos, health details, and all necessary information directly on WhatsApp.
                  </p>
                </li>

                <li
                  ref={(el) => (journeyStepsRef.current[2] = el)}
                  data-step-index="2"
                  className="tp-chat__step"
                  data-done={activeJourneyStep >= 2 ? 'true' : undefined}
                  data-active={activeJourneyStep === 2 ? 'true' : undefined}
                  onClick={() => setActiveJourneyStep(2)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="tp-chat__num font-plush" aria-hidden="true">3</span>
                  <h3 className="font-plush tp-chat__title">Secure & safe delivery</h3>
                  <p className="tp-chat__text">
                    Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.
                  </p>
                </li>
              </ol>

              <a
                className="btn btn-ghost tp-chat__cta"
                href="/how-it-works"
                onClick={(e) => handleNav('/how-it-works', e)}
              >
                How it works
              </a>
            </div>

            {/* Interactive Phone Simulation & Mobile Featured Chat */}
            <div className="tp-chat__side">
              {/* Mobile interactive step switcher */}
              <div className="tp-mobile-step-nav" aria-label="Step switcher">
                <button
                  type="button"
                  className={`tp-mobile-step-btn ${activeJourneyStep === 0 ? 'is-active' : ''}`}
                  onClick={() => setActiveJourneyStep(0)}
                >
                  <span className="tp-mobile-step-pill">1</span> Breed
                </button>
                <button
                  type="button"
                  className={`tp-mobile-step-btn ${activeJourneyStep === 1 ? 'is-active' : ''}`}
                  onClick={() => setActiveJourneyStep(1)}
                >
                  <span className="tp-mobile-step-pill">2</span> Snaps & Clip
                </button>
                <button
                  type="button"
                  className={`tp-mobile-step-btn ${activeJourneyStep === 2 ? 'is-active' : ''}`}
                  onClick={() => setActiveJourneyStep(2)}
                >
                  <span className="tp-mobile-step-pill">3</span> Safe Delivery
                </button>
              </div>

              <div className="tp-phone" aria-label="A WhatsApp conversation with TeddyPups U.A.E." role="group">
                <div className="tp-phone__bar">
                  <img
                    alt="TeddyPups"
                    loading="lazy"
                    width="40"
                    height="40"
                    className="tp-phone__avatar"
                    src="https://puppy.instabizweb.com/brand/logo.png"
                  />
                  <span>
                    <span className="tp-phone__name">TeddyPups U.A.E.</span>
                    <span className="tp-phone__status">online</span>
                  </span>
                </div>

                <div className="tp-phone__screen" ref={chatScreenRef}>
                  <p className="tp-msg tp-msg--me">Hi TeddyPups! I'd love to know more about your puppies.</p>

                  <div className="tp-msg-group" data-step="0" data-show={activeJourneyStep >= 0 ? 'true' : 'false'}>
                    <div className="tp-msg tp-msg--them">
                      <p>Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle.</p>
                      <ul className="tp-chips" aria-label="Breeds we have now">
                        {['Maltipoo', 'Pomeranian', 'Poodle', 'Cavapoo', 'Shih Tzu'].map((breed) => (
                          <li key={breed}>
                            <a
                              href={`/puppies?breed=${breed.toLowerCase().replace(/\s+/g, '-')}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedChatBreed(breed);
                                setActiveJourneyStep(1);
                              }}
                              style={selectedChatBreed === breed ? { background: 'var(--color-honey)', color: 'var(--color-cocoa)' } : {}}
                            >
                              {breed}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="tp-msg-group" data-step="1" data-show={activeJourneyStep >= 1 ? 'true' : 'false'}>
                    <div className="tp-msg tp-msg--them tp-msg--media">
                      <div className="tp-snaps">
                        <span className="tp-snaps__one">
                          <img
                            alt="Apricot puppy in showroom"
                            src="https://puppy.instabizweb.com/media/FHyoHcIosLZE/60f6e7e00a/27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg"
                            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </span>
                        <span className="tp-snaps__one">
                          <img
                            alt="Showroom puppy close up"
                            src="https://puppy.instabizweb.com/media/Vi-kzyvemRl4/e740ed8a24/27b888_323008bb0f6a41d4bde2a0da7206cd98f001.jpg"
                            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </span>
                        <span className="tp-snaps__one">
                          <img
                            alt="Puppy looking up"
                            src="https://puppy.instabizweb.com/media/g_e4ebbc7fyG/8276289ae7/27b888_323008bb0f6a41d4bde2a0da7206cd98f002.jpg"
                            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </span>
                        <span className="tp-snaps__one">
                          <img
                            alt="Puppy held up saying hello"
                            src="https://puppy.instabizweb.com/media/skvodl2NZiKq/cefab5eee9/27b888_323008bb0f6a41d4bde2a0da7206cd98f003.jpg"
                            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </span>
                      </div>
                    </div>

                    <div className="tp-msg tp-msg--them tp-msg--media">
                      <div className="tp-clip">
                        <video
                          src="https://puppy.instabizweb.com/media/dSAUmXs8Qai9/ef39cbea20/27b888_323008bb0f6a41d4bde2a0da7206cd98-720p.mp4"
                          poster="https://puppy.instabizweb.com/media/FHyoHcIosLZE/60f6e7e00a/27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg"
                          muted
                          loop
                          playsInline
                          ref={(el) => {
                            if (el) {
                              if (isVideoPlaying) el.play().catch(() => {});
                              else el.pause();
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="tp-clip__play"
                          aria-pressed={isVideoPlaying}
                          aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
                          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            {isVideoPlaying ? (
                              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
                            ) : (
                              <path d="M8 5v14l11-7z"></path>
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>

                    <p className="tp-msg tp-msg--them">
                      Our team will share real photos, health details, and all necessary information directly on WhatsApp.
                    </p>
                  </div>

                  <div className="tp-msg-group" data-step="2" data-show={activeJourneyStep >= 2 ? 'true' : 'false'}>
                    <div className="tp-msg tp-msg--them">
                      <p>Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.</p>
                      <svg viewBox="0 0 220 70" className="tp-route" aria-hidden="true">
                        <path d="M14 52 C 60 6, 120 70, 170 28" className="tp-route__line"></path>
                        <circle cx="14" cy="52" r="5" className="tp-route__dot"></circle>
                        <path d="M164 32 l12 -12 l12 12 v14 h-24 z" className="tp-route__home"></path>
                        <path d="M176 42 c-2-3-7-2-6 2c1 3 6 5 6 5s5-2 6-5c1-4-4-5-6-2z" className="tp-route__heart"></path>
                        <path
                          d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5z"
                          transform="translate(70 22) scale(.3) rotate(70 32 32)"
                          className="tp-route__paw"
                        ></path>
                        <path
                          d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5z"
                          transform="translate(104 38) scale(.3) rotate(100 32 32)"
                          className="tp-route__paw"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <a
                  href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tp-phone__compose"
                >
                  <span>Say hello on WhatsApp</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 20l18-8L3 4v6l12 2-12 2z"></path>
                  </svg>
                </a>
              </div>

              <div data-pup-stop="true" data-pose="sit" data-facing="right" className="pup-stop tp-chat__teddy">
                <TeddyMascot pose="sit" facing="right" bubbleText="chat anytime!" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 5. WHY FAMILIES TRUST TEDDYPUPS (PASSPORT) */}
      <div data-section="trust">
        <section
          data-pup-scene="true"
          data-tone="light"
          className="tp-scene tp-passport"
          style={{ '--sky-top': '#f0b866', '--sky-bottom': '#a65a30' }}
          aria-labelledby="trust-title"
        >
          <div className="gutter mx-auto max-w-[96rem]">
            <div className="tp-book">
              <div className="tp-book__page tp-book__page--left">
                <p aria-hidden="true" className="tp-book__kicker font-scrawl">
                  puppy passport
                </p>
                <h2 id="trust-title" className="font-plush tp-book__title">
                  Why families trust TeddyPups
                </h2>

                <div data-pup-stop="true" data-pose="sit" data-facing="right" className="pup-stop tp-book__teddy">
                  <TeddyMascot pose="sit" facing="right" bubbleText="certified safe!" />
                </div>
              </div>

              <ul className="tp-book__page tp-book__page--right">
                <li className="tp-entry" style={{ '--ink-stamp': '#a24a1a', '--tilt': '-8deg', '--i': 0 }}>
                  <span className="tp-stamp tp-stamp--round">
                    <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden="true">
                      <path
                        d="M32 54C16 43 8 34 8 24c0-7 5.4-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 6.6 0 12 5 12 12 0 10-8 19-24 30z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M22 30h7l3-7 4 13 3-6h7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <span className="tp-stamp__title font-plush">Vet-checked & healthy</span>
                  </span>
                  <p className="tp-entry__text">Every puppy comes vaccinated, dewormed, and with a verified health certificate.</p>
                </li>

                <li className="tp-entry" style={{ '--ink-stamp': '#1f6b45', '--tilt': '5deg', '--i': 1 }}>
                  <span className="tp-stamp tp-stamp--ticket">
                    <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden="true">
                      <path
                        d="M6 36l22-3 12-17h6l-6 17 12-1 6-7h3l-2 10 2 10h-3l-6-7-12-1 6 17h-6L28 37 6 36z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M8 50c10 4 20 4 30 0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="2 7"
                      ></path>
                    </svg>
                    <span className="tp-stamp__title font-plush">Korea to Dubai, safely</span>
                  </span>
                  <p className="tp-entry__text">Trusted breeders, safe travel, and premium care from start to finish.</p>
                </li>

                <li className="tp-entry" style={{ '--ink-stamp': '#5a3a28', '--tilt': '-4deg', '--i': 2 }}>
                  <span className="tp-stamp tp-stamp--oval">
                    <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden="true">
                      <path
                        d="M10 14h44v28H30l-12 10v-10h-8z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M22 28h0M32 28h0M42 28h0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <span className="tp-stamp__title font-plush">Support 24/7</span>
                  </span>
                  <p className="tp-entry__text">Always here to help, from choosing your puppy to post-delivery support.</p>
                </li>

                <li className="tp-entry" style={{ '--ink-stamp': '#c2622b', '--tilt': '7deg', '--i': 3 }}>
                  <span className="tp-stamp tp-stamp--scallop">
                    <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden="true">
                      <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></circle>
                      <path d="M10 32h44M32 10c-8 8-8 36 0 44M32 10c8 8 8 36 0 44" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <span className="tp-stamp__title font-plush">Trusted by families worldwide</span>
                  </span>
                  <p className="tp-entry__text">Puppies delivered to loving homes all around the world.</p>
                </li>
              </ul>
            </div>
          </div>

          <div aria-hidden="true" className="tp-horizon">
            <span className="tp-horizon__sun"></span>
            <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="tp-horizon__city">
              <path d="M0 160V118h34v-14h22v-22h30v34h18V96h26v30h22v-18h16v-30h34v40h20V70h28v56h24V98h18v-26h30v54h20v-38h26v-40l14-6 14 6v40h22v46h18V84h26v-30h22v50h24V76h36v50h20V96h18v-58h30v44h14V96h22v-30h16v22h26v-52l6-8v-24l4-6v-30l3-18 3 18v30l4 6v24l6 8v52h26v30h22V82h30v-20h24v48h20V90h28v-36h26v56h18V74h30v36h22V94h26v-24h30v62h20V102h26v20h34v38z"></path>
            </svg>
          </div>
        </section>
      </div>

      {/* 6. HAPPY FAMILIES & PUPPIES (POLAROID PHOTO WALL) */}
      <div data-section="families">
        <section
          data-pup-scene="true"
          data-tone="dark"
          className="tp-scene tp-dusk"
          style={{ '--sky-top': '#a65a30', '--sky-bottom': '#4d2b19' }}
          aria-labelledby="dusk-title"
        >
          <div className="tp-dusk__sky gutter">
            <div className="tp-dusk__head">
              <h2 id="dusk-title" className="font-plush text-huge">
                Happy families & puppies
              </h2>
              <p className="text-lede mt-5 max-w-[50ch] text-[var(--ink-soft)]">
                We are truly honored to see our puppies become cherished members of loving families. These heartwarming moments have been shared by our valued clients who welcomed a Teddy Pup into their homes and hearts.
              </p>
            </div>

            <figure className="tp-dusk__note">
              <blockquote className="font-plush-text">
                “TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.”
              </blockquote>
              <figcaption className="font-scrawl">Sarah M., Dubai, UAE</figcaption>
            </figure>
          </div>

          <div
            ref={photowallRef}
            className="tp-photowall"
            data-revealed={isWallRevealed ? 'true' : 'false'}
          >
            <div className="tp-photowall__wall">
              <ul className="tp-photowall__prints" aria-label="Photos from TeddyPups families">
                {polaroidsList.map((item) => (
                  <li
                    key={item.id}
                    data-reveal={isWallRevealed ? 'true' : 'false'}
                    style={{ '--d': item.d }}
                  >
                    <button
                      type="button"
                      className="tp-photowall__print"
                      aria-label={`Open photo: ${item.caption}`}
                      onClick={(e) => handlePhotoClick(item, e)}
                    >
                      <span className="tp-polaroid" style={{ '--tilt': item.tilt, '--i': item.id }}>
                        <span aria-hidden="true" className={`tp-tape ${item.tapePos}`}></span>
                        <span className="tp-polaroid__photo">
                          <img alt="Happy TeddyPups family" loading="lazy" src={item.image} />
                        </span>
                        <span className="tp-polaroid__caption font-scrawl">{item.caption}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="tp-facade__ground">
                <span aria-hidden="true" className="tp-facade__door"></span>
                <span aria-hidden="true" className="tp-lamp">
                  <span className="tp-lamp__light"></span>
                </span>
                <a
                  className="btn btn-primary tp-facade__cta"
                  href="/happy-families"
                  onClick={(e) => handleNav('/happy-families', e)}
                >
                  See every happy family
                </a>
                <div data-pup-stop="true" data-pose="sit" data-facing="right" className="pup-stop tp-dusk__teddy">
                  <TeddyMascot pose="sit" facing="right" bubbleText="so joyful!" />
                </div>
              </div>
            </div>

            <div aria-hidden="true" className="tp-street__pavement"></div>
          </div>
        </section>
      </div>

      {/* 7. QUESTIONS, ANSWERED (NIGHT SKY FAQ) */}
      <div data-section="questions">
        <section
          data-pup-scene="true"
          data-tone="dark"
          className="tp-scene tp-night"
          style={{ '--sky-top': '#4d2b19', '--sky-bottom': '#2f1a10' }}
          aria-labelledby="questions-title"
        >
          {/* Twinkling Stars */}
          <div aria-hidden="true" className="pointer-events-none tp-night__stars">
            <svg viewBox="0 0 40 40" className="tp-twinkle absolute text-honey" style={{ left: '8%', top: '12%', width: '16.2px', animationDelay: '0s' }} aria-hidden="true">
              <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
            </svg>
            <svg viewBox="0 0 40 40" className="tp-twinkle absolute text-honey" style={{ left: '22%', top: '30%', width: '9px', animationDelay: '0.4s' }} aria-hidden="true">
              <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
            </svg>
            <svg viewBox="0 0 40 40" className="tp-twinkle absolute text-honey" style={{ left: '41%', top: '8%', width: '12.6px', animationDelay: '0.8s' }} aria-hidden="true">
              <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
            </svg>
            <svg viewBox="0 0 40 40" className="tp-twinkle absolute text-honey" style={{ left: '57%', top: '22%', width: '8.1px', animationDelay: '1.2s' }} aria-hidden="true">
              <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
            </svg>
            <svg viewBox="0 0 40 40" className="tp-twinkle absolute text-honey" style={{ left: '72%', top: '6%', width: '14.4px', animationDelay: '1.6s' }} aria-hidden="true">
              <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
            </svg>
            <svg viewBox="0 0 40 40" className="tp-twinkle absolute text-honey" style={{ left: '88%', top: '18%', width: '10.8px', animationDelay: '2.0s' }} aria-hidden="true">
              <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
            </svg>
          </div>

          <div className="tp-night__grid gutter">
            <div className="tp-night__intro">
              <h2 id="questions-title" className="font-plush text-huge">
                Questions, answered
              </h2>
              <a
                className="btn btn-ghost tp-night__cta"
                href="/faq"
                onClick={(e) => handleNav('/faq', e)}
              >
                Read all questions
              </a>
              <div className="tp-night__pup">
                <span aria-hidden="true" className="tp-night__wonder font-plush">?</span>
                <div data-pup-stop="true" data-pose="sit" data-facing="right" data-act="tilt" className="pup-stop tp-night__teddy">
                  <TeddyMascot pose="tilt" facing="right" bubbleText="ask anything!" />
                </div>
              </div>
            </div>

            <dl className="tp-night__list">
              {faqList.map((item, idx) => (
                <div key={item.id || idx} className="tp-qa">
                  <dt className="font-plush tp-qa__q">
                    <svg viewBox="0 0 40 40" className="tp-qa__star" aria-hidden="true">
                      <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
                    </svg>
                    {item.question || item.q}
                  </dt>
                  <dd className="tp-qa__a">
                    {item.answer || item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>

      {/* 8. READY TO MEET YOUR NEW BEST FRIEND? (COTTAGE HOUSE CTA) */}
      <div data-section="cta">
        <section
          data-pup-scene="true"
          data-tone="dark"
          className="tp-scene tp-home"
          style={{ '--sky-top': '#2f1a10', '--sky-bottom': '#24130b' }}
          aria-labelledby="cta-title"
        >
          <div className="tp-home__copy gutter">
            <h2 id="cta-title" className="font-plush text-huge">
              Ready to meet your new best friend?
            </h2>
            <p className="tp-home__lede">
              Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you find the right match and ensure a smooth, safe delivery across the UAE.
            </p>
          </div>

          <div className="tp-house">
            <span aria-hidden="true" className="tp-house__plant tp-house__plant--left"></span>
            <span aria-hidden="true" className="tp-house__lamp"></span>

            <div className="tp-house__doorway">
              <span className="tp-house__inside">
                <img
                  alt="Max, waiting inside"
                  loading="lazy"
                  src="https://puppy.instabizweb.com/media/Z0ToauDx7Eve/5fffe4d022/b942a5_4b8cfb8204d24eadaf524332aba1dc15-mv2.webp"
                  style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    objectFit: 'cover'
                  }}
                />
              </span>
              <span aria-hidden="true" className="tp-house__door">
                <span className="tp-house__peep"></span>
                <span className="tp-house__knob"></span>
              </span>
            </div>

            <span aria-hidden="true" className="tp-house__plant tp-house__plant--right"></span>
            <span aria-hidden="true" className="tp-house__mat font-scrawl">welcome home</span>

            <div data-pup-stop="true" data-pose="bow" data-facing="right" className="pup-stop tp-house__teddy">
              <TeddyMascot pose="bow" facing="right" bubbleText="welcome home!" />
            </div>
          </div>

          <div className="tp-home__actions gutter">
            <a
              href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              Enquire on WhatsApp
            </a>
            <a
              className="btn btn-ghost tp-home__ghost"
              href="/contact"
              onClick={(e) => handleNav('/contact', e)}
            >
              Visit & contact
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
