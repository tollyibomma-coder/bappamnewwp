
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Movie, AdConfig, SiteConfig, AdSlot } from './types';
import { INITIAL_MOVIES, APP_VERSION } from './constants';
import HomePage from './pages/Home';
import MovieDetailPage from './pages/MovieDetail';
import AdminPage from './pages/Admin';
import Header from './components/Header';
import Footer from './components/Footer';

const createEmptySlot = (): AdSlot => ({ code: '', active: true });

const DEFAULT_SITE_CONFIG: SiteConfig = {
  headerTitle: 'bappam.tv',
  headerMessage: 'JOIN OUR TELEGRAM CHANNEL FOR LATEST UPDATES',
  headerCode: '',
  updatesTicker: 'LATEST UPDATES: Shambhala (2025) HD Print Added • Stranger Things Season 5 (Telugu) Episodes 1-2 Added • Ayalaan Original DVD Rip Added',
  heroTitle: 'for... bappam.tv',
  heroSubtitle: 'Watch Telugu movies in HD, exclusively available on bappam.tv\nDesigned and Developed for bappam batch',
  footerMainText: 'Bappam TV - Watch The Latest Telugu Movies Anytime, Any Place',
  footerAboutText: "Never miss a single movie, webseries, or any latest trends in Telugu entertainment with Bappam TV. It's the best app to watch the latest Telugu movies, trending webseries, and all Tollywood premieres in HD quality.\n\nIf you have Telugu cinema in your blood, then Bappam TV is the entertainment center for you. Designed for Tollywood enthusiasts, its extensive collection of new releases, blockbusters, and exclusive creations puts you in the front row—directly on your smartphone or smart TV.",
  footerDisclaimer: 'Tollybomma.Com Firmly Stands Against Movie Piracy And Proudly Supports The Film Industry\'s Creativity And Hard Work.',
  siteTitle: 'Bappam.tv - Watch Latest Telugu Movies & Web Series Online',
  siteDescription: 'Stream the latest Telugu movies and web series in high definition. Bappam.tv is your ultimate destination for Tollywood entertainment.',
  siteKeywords: 'telugu movies, watch online, hd telugu movies, bappam tv, latest tollywood, web series',
  ogImage: 'https://picsum.photos/seed/bappam/1200/630',
  faviconUrl: 'https://cdn-icons-png.flaticon.com/512/3172/3172551.png',
  accentColor: '#FACC15',
  showRelatedMovies: true
};

const DEFAULT_AD_CONFIG: AdConfig = {
  globalHeader: createEmptySlot(),
  popUnder: createEmptySlot(),
  homeTop: createEmptySlot(),
  homeInGrid: createEmptySlot(),
  homeBottom: createEmptySlot(),
  detailTop: createEmptySlot(),
  detailSidebar1: createEmptySlot(),
  detailSidebar2: createEmptySlot(),
  watchTimer: createEmptySlot(),
  downloadTimer: createEmptySlot()
};

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>(() => {
    const savedVersion = localStorage.getItem('bappam_app_version');
    if (savedVersion !== APP_VERSION) {
      localStorage.removeItem('bappam_movies');
      localStorage.removeItem('bappam_ads_enabled');
      localStorage.removeItem('bappam_ad_codes');
      localStorage.removeItem('bappam_site_config');
      localStorage.setItem('bappam_app_version', APP_VERSION);
      return INITIAL_MOVIES;
    }
    const saved = localStorage.getItem('bappam_movies');
    return saved ? JSON.parse(saved) : INITIAL_MOVIES;
  });

  const [adsEnabled, setAdsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('bappam_ads_enabled');
    return saved ? JSON.parse(saved) : true;
  });

  const [adCodes, setAdCodes] = useState<AdConfig>(() => {
    const saved = localStorage.getItem('bappam_ad_codes');
    return saved ? JSON.parse(saved) : DEFAULT_AD_CONFIG;
  });

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('bappam_site_config');
    return saved ? { ...DEFAULT_SITE_CONFIG, ...JSON.parse(saved) } : DEFAULT_SITE_CONFIG;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const injectedHeadNodes = useRef<Node[]>([]);

  // BROADCAST LISTENER: Sync changes across tabs instantly
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Only process keys belonging to our application to avoid parsing non-JSON global keys
      if (e.newValue === null || !e.key || !e.key.startsWith('bappam_')) return;
      
      try {
        const data = JSON.parse(e.newValue);
        switch (e.key) {
          case 'bappam_movies': setMovies(data); break;
          case 'bappam_ads_enabled': setAdsEnabled(data); break;
          case 'bappam_ad_codes': setAdCodes(data); break;
          case 'bappam_site_config': setSiteConfig(data); break;
        }
      } catch (err) {
        // Only log error if it was actually one of our keys that failed parsing
        const ourKeys = ['bappam_movies', 'bappam_ads_enabled', 'bappam_ad_codes', 'bappam_site_config'];
        if (ourKeys.includes(e.key)) {
          console.error(`Error parsing cross-tab update for key: ${e.key}`, err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('bappam_movies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('bappam_ads_enabled', JSON.stringify(adsEnabled));
  }, [adsEnabled]);

  useEffect(() => {
    localStorage.setItem('bappam_ad_codes', JSON.stringify(adCodes));
    if (adsEnabled) {
      const injectScript = (id: string, slot: AdSlot) => {
        if (!slot.active) {
            const container = document.getElementById(id);
            if (container) container.innerHTML = '';
            return;
        }
        let container = document.getElementById(id);
        if (!container) {
          container = document.createElement('div');
          container.id = id;
          container.style.display = 'none';
          document.body.appendChild(container);
        }
        if (slot.code) {
          const range = document.createRange();
          container.innerHTML = '';
          const frag = range.createContextualFragment(slot.code);
          container.appendChild(frag);
        } else {
          container.innerHTML = '';
        }
      };
      injectScript('global-header-ad-container', adCodes.globalHeader);
      injectScript('popunder-ad-container', adCodes.popUnder);
    }
  }, [adCodes, adsEnabled]);

  useEffect(() => {
    localStorage.setItem('bappam_site_config', JSON.stringify(siteConfig));
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = siteConfig.faviconUrl || DEFAULT_SITE_CONFIG.faviconUrl;
    document.documentElement.style.setProperty('--accent-color', siteConfig.accentColor || '#FACC15');

    injectedHeadNodes.current.forEach(node => {
        if (node.parentNode) node.parentNode.removeChild(node);
    });
    injectedHeadNodes.current = [];

    if (siteConfig.headerCode) {
      try {
        const range = document.createRange();
        range.selectNode(document.head);
        const fragment = range.createContextualFragment(siteConfig.headerCode);
        const nodes = Array.from(fragment.childNodes);
        injectedHeadNodes.current = nodes;
        document.head.appendChild(fragment);
      } catch (e) {
        console.error("Failed to inject custom header code", e);
      }
    }
  }, [siteConfig]);

  const addMovie = (movie: Movie) => setMovies(prev => [movie, ...prev]);
  const updateMovie = (updatedMovie: Movie) => setMovies(prev => prev.map(m => m.id === updatedMovie.id ? updatedMovie : m));
  const deleteMovie = (id: string) => setMovies(prev => prev.filter(m => m.id !== id));

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} siteConfig={siteConfig} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage movies={filteredMovies} adsEnabled={adsEnabled} adCodes={adCodes} siteConfig={siteConfig} />} />
            <Route path="/admin" element={<AdminPage movies={movies} onAdd={addMovie} onUpdate={updateMovie} onDelete={deleteMovie} adsEnabled={adsEnabled} setAdsEnabled={setAdsEnabled} adCodes={adCodes} setAdCodes={setAdCodes} siteConfig={siteConfig} setSiteConfig={setSiteConfig} />} />
            <Route path="/movie/:slug" element={<MovieDetailPage movies={movies} adsEnabled={adsEnabled} adCodes={adCodes} siteConfig={siteConfig} />} />
          </Routes>
        </main>
        <Footer siteConfig={siteConfig} />
      </div>
    </Router>
  );
};

export default App;
