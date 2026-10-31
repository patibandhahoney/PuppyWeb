import React, { useState, useEffect } from 'react';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import IntroCurtain from './components/IntroCurtain';
import PuppyModal from './components/PuppyModal';
import PhotoModal from './components/PhotoModal';

// Pages
import Home from './pages/Home';
import Puppies from './pages/Puppies';
import HowItWorks from './pages/HowItWorks';
import HappyFamilies from './pages/HappyFamilies';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import GoneHome from './pages/GoneHome';
import PuppyDetail from './pages/PuppyDetail';

// Data
import { reviewsData } from './data/reviewsData';

function getInitialRoute() {
  const hash = window.location.hash.replace('#', '');
  if (hash && hash.startsWith('/')) return hash;
  const path = window.location.pathname;
  if (path && path !== '') return path;
  return '/';
}

export default function App() {
  const [route, setRoute] = useState(getInitialRoute);
  const [selectedPuppy, setSelectedPuppy] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Listen to browser popstate / back / forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (newPath) => {
    setRoute(newPath);
    window.history.pushState(null, '', newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lightbox Prev/Next logic
  const handlePhotoPrev = () => {
    if (!selectedPhoto) return;
    const currentIndex = reviewsData.findIndex((r) => r.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + reviewsData.length) % reviewsData.length;
    setSelectedPhoto(reviewsData[prevIndex]);
  };

  const handlePhotoNext = () => {
    if (!selectedPhoto) return;
    const currentIndex = reviewsData.findIndex((r) => r.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % reviewsData.length;
    setSelectedPhoto(reviewsData[nextIndex]);
  };

  // Route matching
  const renderCurrentPage = () => {
    const cleanRoute = route.split('?')[0].split('#')[0];

    // Dynamic puppy storybook route /puppies/:slug
    if (cleanRoute.startsWith('/puppies/') && cleanRoute.length > '/puppies/'.length) {
      const slug = cleanRoute.replace('/puppies/', '');
      return <PuppyDetail slug={slug} navigate={navigate} />;
    }

    switch (cleanRoute) {
      case '/puppies':
        return <Puppies navigate={navigate} onSelectPuppy={setSelectedPuppy} />;
      case '/how-it-works':
        return <HowItWorks navigate={navigate} />;
      case '/happy-families':
        return <HappyFamilies onSelectPhoto={setSelectedPhoto} />;
      case '/faq':
        return <FAQ />;
      case '/contact':
        return <Contact />;
      case '/gone-home':
        return <GoneHome navigate={navigate} />;
      case '/':
      default:
        return (
          <Home
            navigate={navigate}
            onSelectPuppy={setSelectedPuppy}
            onSelectPhoto={setSelectedPhoto}
          />
        );
    }
  };

  return (
    <div className="tp-app">
      {/* Intro Blanket Lift Curtain */}
      <IntroCurtain />

      {/* Main Header */}
      <Header currentRoute={route} navigate={navigate} />

      {/* Main Page Content */}
      <main id="main" className="tp-main">{renderCurrentPage()}</main>

      {/* Main Footer */}
      <Footer navigate={navigate} />

      {/* Modals */}
      {selectedPuppy && (
        <PuppyModal
          puppy={selectedPuppy}
          onClose={() => setSelectedPuppy(null)}
        />
      )}

      {selectedPhoto && (
        <PhotoModal
          item={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onPrev={handlePhotoPrev}
          onNext={handlePhotoNext}
        />
      )}
    </div>
  );
}
