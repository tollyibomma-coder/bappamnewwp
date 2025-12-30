
import React from 'react';
import { SiteConfig } from '../types';

interface FooterProps {
  siteConfig: SiteConfig;
}

const Footer: React.FC<FooterProps> = ({ siteConfig }) => {
  return (
    <footer className="bg-black py-16 px-4 md:px-12 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-black text-[var(--accent-color)] mb-6">
          {siteConfig.footerMainText}
        </h2>
        <div className="text-zinc-400 text-base mb-8 leading-relaxed whitespace-pre-line">
          {siteConfig.footerAboutText}
        </div>

        <div className="bg-[#111111] p-8 rounded-2xl mb-12 border border-zinc-800">
          <h3 className="text-2xl font-black mb-10">Why Everyone Loves {siteConfig.headerTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-[var(--accent-color)] flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <h4 className="font-bold text-white">Free New Telugu Movies</h4>
                <p className="text-zinc-400 text-sm">Watch new movies as soon as they are released.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-[var(--accent-color)] flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <h4 className="font-bold text-white">High-Definition Streaming</h4>
                <p className="text-zinc-400 text-sm">Feel all the emotions in clear and untouched HD.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-[var(--accent-color)] flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <h4 className="font-bold text-white">Stream 24/7 Anywhere, Anytime</h4>
                <p className="text-zinc-400 text-sm">Stream whatever you want, from wherever you are.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-[var(--accent-color)] flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <h4 className="font-bold text-white">Fresh Content Updates</h4>
                <p className="text-zinc-400 text-sm">Discover new movies, shows, and premieres each week.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-zinc-500 text-base mt-12 pt-8 border-t border-zinc-900 max-w-4xl mx-auto leading-relaxed font-medium">
            {siteConfig.footerDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
