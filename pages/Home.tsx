
import React, { useEffect } from 'react';
import { Movie, AdConfig, SiteConfig } from '../types';
import MovieCard from '../components/MovieCard';
import AdSection from '../components/AdSection';

interface HomeProps {
  movies: Movie[];
  adsEnabled: boolean;
  adCodes: AdConfig;
  siteConfig: SiteConfig;
}

const HomePage: React.FC<HomeProps> = ({ movies, adsEnabled, adCodes, siteConfig }) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = siteConfig.siteTitle;

    const updateMetaTag = (name: string, content: string, property: boolean = false) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMetaTag('description', siteConfig.siteDescription);
    updateMetaTag('keywords', siteConfig.siteKeywords);
    updateMetaTag('og:title', siteConfig.siteTitle, true);
    updateMetaTag('og:description', siteConfig.siteDescription, true);
    updateMetaTag('og:image', siteConfig.ogImage, true);

    return () => {
      document.title = originalTitle;
    };
  }, [siteConfig]);

  // Display movies as is (Natural order - LIFO based on how they are added in App.tsx)
  const displayMovies = movies.filter(m => m.isActive);

  return (
    <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 py-6">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
            display: inline-block;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      {/* Latest Updates Ticker */}
      {siteConfig.updatesTicker && (
         <div className="w-full bg-[#111111] border border-zinc-800 rounded-lg mb-10 overflow-hidden flex items-stretch shadow-lg h-10">
           <div className="bg-[var(--accent-color)] text-black text-[10px] md:text-xs font-black px-4 flex items-center justify-center uppercase tracking-widest shrink-0 z-10 shadow-lg">
             Updates
           </div>
           <div className="flex-grow overflow-hidden relative flex items-center">
             <div className="whitespace-nowrap animate-marquee text-[11px] md:text-xs font-bold text-zinc-300 pl-4">
                <span className="mx-4">{siteConfig.updatesTicker}</span>
                <span className="mx-4 text-[var(--accent-color)]">•</span>
                <span className="mx-4">{siteConfig.updatesTicker}</span>
                <span className="mx-4 text-[var(--accent-color)]">•</span>
                <span className="mx-4">{siteConfig.updatesTicker}</span>
             </div>
           </div>
         </div>
      )}

      <div className="flex flex-col items-center mb-16 text-center">
        <div className="flex items-center gap-2 mb-3">
            <div className="bg-[var(--accent-color)] text-black font-black text-4xl px-2.5 py-0.5 rounded leading-none">
              {siteConfig.headerTitle.charAt(0)}
            </div>
            <h1 className="text-4xl font-black tracking-tight">{siteConfig.heroTitle}</h1>
        </div>
        <div className="text-zinc-500 text-base max-w-2xl whitespace-pre-line">
          {siteConfig.heroSubtitle.split('\n').map((line, i) => (
            <p key={i}>
              {line.includes('bappam batch') ? (
                <>
                  {line.split('bappam batch')[0]}
                  <span className="text-[var(--accent-color)] font-bold">bappam batch</span>
                  {line.split('bappam batch')[1]}
                </>
              ) : line}
            </p>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <AdSection type="leaderboard" slot={adCodes.homeTop} globalEnabled={adsEnabled} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
        {displayMovies.length > 0 ? (
          displayMovies.map((movie, index) => (
            <React.Fragment key={movie.id}>
              <MovieCard movie={movie} />
              {/* Home In-Grid Ad Slot (Every 12 items to be less intrusive) */}
              {(index + 1) % 12 === 0 && (
                <div className="col-span-full my-6">
                  <AdSection type="leaderboard" slot={adCodes.homeInGrid} globalEnabled={adsEnabled} />
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <div className="col-span-full py-24 text-center text-zinc-500">
            <p className="text-xl font-bold mb-2">No active movies found</p>
            <p>Check back later or try searching</p>
          </div>
        )}
      </div>

      <div className="mt-16">
        <AdSection type="leaderboard" slot={adCodes.homeBottom} globalEnabled={adsEnabled} />
      </div>
    </div>
  );
};

export default HomePage;
