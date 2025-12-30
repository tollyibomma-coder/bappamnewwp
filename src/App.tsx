
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { WPAppData } from './types';
import { subscribeToWPUpdates } from './api';
import WPHome from './pages/Home';
import WPAdmin from './pages/Admin';
import MovieDetailPage from './pages/MovieDetail'; // Re-use and adapt logic
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [wpData, setWpData] = useState<WPAppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToWPUpdates((data) => {
      setWpData(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (wpData?.settings) {
        document.title = wpData.settings.blogname;
        document.documentElement.style.setProperty('--accent-color', wpData.settings.accent_color);
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) link.href = wpData.settings.site_icon;
    }
  }, [wpData]);

  if (loading || !wpData) {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
             <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-[var(--accent-color)] animate-spin" />
             <p className="text-zinc-600 font-bold uppercase text-[9px] tracking-widest">Initializing WordPress Theme...</p>
        </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-black text-white font-sans antialiased">
        <Routes>
          {/* Admin doesn't get header/footer */}
          <Route path="/wp-admin" element={<WPAdmin data={wpData} onUpdate={setWpData} />} />
          <Route path="*" element={
            <>
              <Header searchQuery="" setSearchQuery={() => {}} siteConfig={{ headerTitle: wpData.settings.blogname, headerMessage: wpData.settings.blogdescription, accentColor: wpData.settings.accent_color } as any} />
              <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<WPHome posts={wpData.posts} settings={wpData.settings} />} />
                    {/* Detail page needs slight adjustment for WPPost structure */}
                    <Route path="/movie/:slug" element={<MovieDetailPage movies={wpData.posts.map(p => ({ ...p.meta, id: p.id, title: p.title, slug: p.slug, genres: p.categories, posterUrl: p.featured_image, description: p.content, isActive: true, year: p.meta.release_year } as any))} adsEnabled={wpData.settings.ads_enabled} adCodes={wpData.settings.ad_codes} siteConfig={{ showRelatedMovies: true } as any} />} />
                </Routes>
              </main>
              <Footer siteConfig={{ footerMainText: wpData.settings.blogname, footerAboutText: wpData.settings.blogdescription, footerDisclaimer: wpData.settings.footer_text, headerTitle: wpData.settings.blogname } as any} />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
