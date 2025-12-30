
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Download, ChevronLeft, Timer, ExternalLink, Tv, Hash, Film } from 'lucide-react';
import { Movie, AdConfig, SiteConfig } from '../types';
import AdSection from '../components/AdSection';
import MovieCard from '../components/MovieCard';

interface MovieDetailProps {
  movies: Movie[];
  adsEnabled: boolean;
  adCodes: AdConfig;
  siteConfig: SiteConfig;
}

const MovieDetailPage: React.FC<MovieDetailProps> = ({ movies, adsEnabled, adCodes, siteConfig }) => {
  const { slug } = useParams<{ slug: string }>();
  const movie = movies.find(m => m.slug === slug);
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const [watchTimeLeft, setWatchTimeLeft] = useState<number>(0);
  const [isWatchReady, setIsWatchReady] = useState<boolean>(false);
  const watchTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset states when movie changes
    setIsReady(false);
    setTimeLeft(0);
    setIsWatchReady(false);
    setWatchTimeLeft(0);
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (watchTimerRef.current) window.clearInterval(watchTimerRef.current);

    if (movie) {
      const originalTitle = document.title;
      document.title = movie.seoTitle || `${movie.title} (${movie.year}) - Bappam.tv`;

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

      if (movie.seoDescription) {
        updateMetaTag('description', movie.seoDescription);
        updateMetaTag('og:description', movie.seoDescription, true);
      } else {
        updateMetaTag('description', movie.description.slice(0, 160));
      }

      if (movie.seoKeywords) {
        updateMetaTag('keywords', movie.seoKeywords);
      }

      if (movie.posterUrl) {
        updateMetaTag('og:image', movie.posterUrl, true);
      }

      updateMetaTag('og:title', movie.seoTitle || movie.title, true);

      return () => {
        document.title = originalTitle;
      };
    }
  }, [movie]); // Re-run effect when movie (or slug) changes

  const startDownloadTimer = () => {
    if (timeLeft > 0 || isReady) return;
    setTimeLeft(15); // Shortened for UX
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          setIsReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startWatchTimer = () => {
    if (watchTimeLeft > 0 || isWatchReady) return;
    setWatchTimeLeft(15); // Shortened for UX
    watchTimerRef.current = window.setInterval(() => {
      setWatchTimeLeft((prev) => {
        if (prev <= 1) {
          if (watchTimerRef.current) window.clearInterval(watchTimerRef.current);
          setIsWatchReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleWatchOnlineClick = () => {
    if (movie?.watchUrl && movie.watchUrl !== '#') {
      if (movie.watchNewTab) {
        window.open(movie.watchUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = movie.watchUrl;
      }
    } else {
      const player = document.getElementById('player-section');
      if (player) {
        player.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold">Movie not found</h2>
        <Link to="/" className="text-[#FACC15] mt-4 hover:underline">Go back home</Link>
      </div>
    );
  }

  const handleTrailerScroll = () => {
    const player = document.getElementById('player-section');
    if (player) {
      player.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const searchTags = movie.seoKeywords 
    ? movie.seoKeywords.split(',').map(tag => tag.trim()).filter(Boolean)
    : [];

  const relatedMovies = siteConfig.showRelatedMovies
    ? movies
        .filter(m => m.id !== movie.id && m.isActive && m.genres.some(g => movie.genres.includes(g)))
        .slice(0, 12)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-zinc-500 hover:text-white mb-6 text-sm transition-colors">
        <ChevronLeft size={16} /> Back to Home
      </Link>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <img 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="w-full rounded-lg shadow-2xl border border-zinc-800"
          />
        </div>

        <div className="flex-grow pt-4">
          <span className="text-zinc-500 text-sm font-bold block mb-2">{movie.year}</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">{movie.title} ({movie.year})</h1>
          
          <div className="space-y-4 text-zinc-400 text-sm font-medium">
            <p><span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mr-2">Genre</span> {movie.genres.join(', ')}</p>
            <p><span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mr-2">Cast</span> {movie.cast.join(', ')}</p>
            <p><span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mr-2">Director</span> {movie.director}</p>
          </div>

          <div className="flex flex-wrap gap-4 mt-8">
            <button 
              onClick={handleTrailerScroll}
              className="flex items-center gap-2 bg-transparent border border-white/20 text-white hover:bg-white hover:text-black transition-all font-black py-2.5 px-6 rounded uppercase text-sm"
            >
              <Play size={16} fill="currentColor" /> Trailer
            </button>

            {isWatchReady ? (
              <button 
                onClick={handleWatchOnlineClick}
                className="flex items-center gap-2 bg-green-500 text-black hover:bg-white transition-all font-black py-2.5 px-6 rounded uppercase text-sm shadow-[0_0_20px_rgba(34,197,94,0.4)]"
              >
                <Tv size={16} /> Watch Online
              </button>
            ) : watchTimeLeft > 0 ? (
              <button 
                disabled
                className="flex items-center gap-2 bg-zinc-900 text-zinc-400 font-black py-2.5 px-6 rounded uppercase text-sm cursor-not-allowed border border-zinc-800"
              >
                <Timer size={16} className="animate-spin" /> Stream in {watchTimeLeft}s...
              </button>
            ) : (
              <button 
                onClick={startWatchTimer}
                className="flex items-center gap-2 bg-[var(--accent-color)] text-black hover:bg-white transition-all font-black py-2.5 px-6 rounded uppercase text-sm shadow-lg shadow-[var(--accent-color)]/20"
              >
                <Play size={16} fill="black" /> Watch Now
              </button>
            )}

            {isReady ? (
              <a 
                href={movie.downloadUrl || '#'} 
                target={movie.downloadNewTab ? "_blank" : "_self"}
                rel={movie.downloadNewTab ? "noopener noreferrer" : ""}
                className="flex items-center gap-2 bg-green-500 text-black hover:bg-white transition-all font-black py-2.5 px-6 rounded uppercase text-sm shadow-[0_0_20px_rgba(34,197,94,0.4)]"
              >
                <ExternalLink size={16} /> Download Now
              </a>
            ) : timeLeft > 0 ? (
              <button 
                disabled
                className="flex items-center gap-2 bg-zinc-900 text-zinc-400 font-black py-2.5 px-6 rounded uppercase text-sm cursor-not-allowed border border-zinc-800"
              >
                <Timer size={16} className="animate-spin" /> Link in {timeLeft}s...
              </button>
            ) : (
              <button 
                onClick={startDownloadTimer}
                className="flex items-center gap-2 bg-zinc-800 text-white hover:bg-white hover:text-black transition-all font-black py-2.5 px-6 rounded uppercase text-sm shadow-lg"
              >
                <Download size={16} /> Mobile Download
              </button>
            )}
          </div>
          
          <div className="mt-8 space-y-4">
             {watchTimeLeft > 0 && !isWatchReady && <AdSection type="leaderboard" slot={adCodes.watchTimer} globalEnabled={adsEnabled} className="rounded-xl border border-dashed border-zinc-800 p-2" />}
             {timeLeft > 0 && !isReady && <AdSection type="leaderboard" slot={adCodes.downloadTimer} globalEnabled={adsEnabled} className="rounded-xl border border-dashed border-zinc-800 p-2" />}
          </div>
        </div>
      </div>

      <div className="mb-12">
        <AdSection type="leaderboard" slot={adCodes.detailTop} globalEnabled={adsEnabled} />
      </div>

      <div id="player-section" className="w-full aspect-video bg-black rounded-3xl overflow-hidden mb-12 border border-zinc-800 flex flex-col items-center justify-center relative group shadow-2xl">
        {movie.trailerUrl ? (
          <iframe 
            src={movie.trailerUrl} 
            className="w-full h-full"
            title={`${movie.title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full border-2 border-white/10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform bg-white/5">
              <Play size={40} fill="white" className="ml-1" />
            </div>
            <p className="text-zinc-600 font-black tracking-widest uppercase mb-2 text-xs">Premium Content Placeholder</p>
            <p className="text-5xl font-black text-[var(--accent-color)] tracking-tighter uppercase">BAPPAM PLAYER</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#111111] p-10 rounded-3xl border border-zinc-800 shadow-xl">
            <h3 className="text-2xl font-black text-[var(--accent-color)] mb-6 tracking-tight">{movie.title} Storyline</h3>
            <div className="h-1 w-20 bg-[var(--accent-color)] mb-8" />
            <div className="space-y-6 mb-12">
              {movie.description.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                <p key={index} className="text-zinc-400 leading-relaxed text-lg font-medium">
                  {paragraph.trim()}
                </p>
              ))}
            </div>

            {searchTags.length > 0 && (
              <div className="pt-8 border-t border-zinc-800/50">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">
                  <Hash size={12} className="text-[var(--accent-color)]" /> Search Optimization Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {searchTags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-1.5 bg-black border border-zinc-800 rounded-lg text-[11px] font-bold text-zinc-400 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/30 transition-all cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-10">
          <div className="sticky top-24 space-y-10">
            <AdSection type="rectangle" slot={adCodes.detailSidebar1} globalEnabled={adsEnabled} className="rounded-3xl border border-zinc-900" />
            <AdSection type="rectangle" slot={adCodes.detailSidebar2} globalEnabled={adsEnabled} className="rounded-3xl border border-zinc-900" />
          </div>
        </div>
      </div>

      {siteConfig.showRelatedMovies && relatedMovies.length > 0 && (
        <div className="mt-20 border-t border-zinc-900 pt-16">
          <h3 className="text-3xl font-black text-white mb-10 flex items-center gap-3 tracking-tight">
            <Film className="text-[var(--accent-color)]" size={28} />
            You May Also Like
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
            {relatedMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
