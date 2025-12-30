
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, Bug, Search } from 'lucide-react';
import { SiteConfig } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  siteConfig: SiteConfig;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, siteConfig }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`sticky top-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {siteConfig.headerMessage && (
        <div className="bg-black text-[var(--accent-color)] text-[10px] md:text-xs font-bold text-center py-1 uppercase tracking-widest border-b border-[var(--accent-color)]/20">
          {siteConfig.headerMessage}
        </div>
      )}
      <header className="bg-[var(--accent-color)] py-2 px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <Link to="/" className="flex items-center gap-1" onClick={() => setSearchQuery('')}>
          <span className="text-2xl font-black text-black tracking-tighter">{siteConfig.headerTitle}</span>
        </Link>

        <div className="flex items-center gap-6 text-black font-bold text-sm">
          <Link to="/" className="flex items-center gap-1 hover:opacity-70 transition-opacity">
            <Home size={18} fill="black" /> Home
          </Link>
          <button className="flex items-center gap-1 hover:opacity-70 transition-opacity">
            <Info size={18} fill="black" /> About
          </button>
          <button className="flex items-center gap-1 hover:opacity-70 transition-opacity">
            <Bug size={18} fill="black" /> Bug
          </button>
        </div>

        {isHome && (
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black text-[var(--accent-color)] rounded-full py-1.5 px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 font-medium"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--accent-color)]" size={16} />
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
