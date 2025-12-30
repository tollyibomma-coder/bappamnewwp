
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Search, Settings, Code, Globe, Layout, Palette, Type, Terminal, MonitorPlay, Zap, Megaphone, Image as ImageIcon, Eye, EyeOff, Film, RefreshCw, Radio, Tv, CheckCircle } from 'lucide-react';
import { Movie, AdConfig, SiteConfig } from '../types';

interface AdminProps {
  movies: Movie[];
  onAdd: (movie: Movie) => void;
  onUpdate: (movie: Movie) => void;
  onDelete: (id: string) => void;
  adsEnabled: boolean;
  setAdsEnabled: (enabled: boolean) => void;
  adCodes: AdConfig;
  setAdCodes: (codes: AdConfig) => void;
  siteConfig: SiteConfig;
  setSiteConfig: (config: SiteConfig) => void;
}

const AdminPage: React.FC<AdminProps> = ({ 
  movies, onAdd, onUpdate, onDelete, 
  adsEnabled, setAdsEnabled,
  adCodes, setAdCodes,
  siteConfig, setSiteConfig
}) => {
  // Admin Logic State
  const [isEditing, setIsEditing] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<any>({});
  const [adminSearch, setAdminSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'ads' | 'site'>('content');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const [tempSiteConfig, setTempSiteConfig] = useState<SiteConfig>(siteConfig);
  const [tempAdCodes, setTempAdCodes] = useState<AdConfig>(adCodes);

  // Sync temp state if props change externally (though typically admin drives changes)
  useEffect(() => {
    setTempSiteConfig(siteConfig);
  }, [siteConfig]);

  useEffect(() => {
    setTempAdCodes(adCodes);
  }, [adCodes]);

  const showNotification = (message: string) => {
    setNotification({ message, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleClearCache = () => {
    if (window.confirm('⚠️ CLEAR CACHE ⚠️\n\nThis will reset your Site Settings, Ad Configurations, and Layout preferences to their defaults.\n\n✅ Your MOVIE DATA will be preserved and will NOT be deleted.\n\nThis is useful for fixing layout issues or resetting configurations.\n\nAre you sure you want to proceed?')) {
      // Intentionally NOT removing 'bappam_movies' to preserve data
      localStorage.removeItem('bappam_ads_enabled');
      localStorage.removeItem('bappam_ad_codes');
      localStorage.removeItem('bappam_site_config');
      
      alert('Application settings cache cleared. Reloading...');
      window.location.reload();
    }
  };

  // Helper Functions
  const toTitleCase = (str: string) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  const handleEdit = (movie: Movie) => {
    setCurrentMovie({
      ...movie,
      genres: movie.genres?.join(', ') || '',
      cast: movie.cast?.join(', ') || ''
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentMovie({
      id: Math.random().toString(36).substr(2, 9),
      slug: '',
      title: '',
      year: new Date().getFullYear().toString(),
      genres: '',
      cast: '',
      director: '',
      posterUrl: '',
      description: '',
      trailerUrl: '',
      downloadUrl: '#',
      downloadNewTab: true,
      watchUrl: '',
      watchNewTab: true,
      isActive: true,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: ''
    });
    setIsEditing(true);
  };

  const handleTitleChange = (title: string) => {
    const slug = slugify(title);
    setCurrentMovie({
      ...currentMovie,
      title,
      slug: currentMovie.slug === slugify(currentMovie.title || '') ? slug : currentMovie.slug
    });
  };

  const handleSave = () => {
    if (currentMovie.id && currentMovie.title && currentMovie.slug) {
      const formattedTitle = toTitleCase(currentMovie.title);
      
      const movieToSave: Movie = {
        ...currentMovie,
        title: formattedTitle,
        genres: typeof currentMovie.genres === 'string' 
          ? currentMovie.genres.split(',').map((s: string) => s.trim()).filter(Boolean)
          : currentMovie.genres,
        cast: typeof currentMovie.cast === 'string'
          ? currentMovie.cast.split(',').map((s: string) => s.trim()).filter(Boolean)
          : currentMovie.cast,
      };

      const existing = movies.find(m => m.id === movieToSave.id);
      if (existing) {
        onUpdate(movieToSave);
        showNotification(`"${formattedTitle}" updated successfully & live!`);
      } else {
        onAdd(movieToSave);
        showNotification(`"${formattedTitle}" added & published!`);
      }
      setIsEditing(false);
      setCurrentMovie({});
    } else {
      alert("Title and Slug are required.");
    }
  };

  const saveAdSettings = () => {
    setAdCodes(tempAdCodes);
    showNotification('Ad configurations published to live site!');
  };

  const saveSiteSettings = () => {
    setSiteConfig(tempSiteConfig);
    showNotification('Site settings updated & visible to all users!');
  };

  const toggleMovieStatus = (movie: Movie) => {
    const newStatus = !movie.isActive;
    onUpdate({ ...movie, isActive: newStatus });
    showNotification(newStatus ? 'Movie is now Visible' : 'Movie is now Hidden');
  };

  const AdSlotEditor = ({ label, slotKey, description }: { label: string, slotKey: keyof AdConfig, description?: string }) => {
    const slot = tempAdCodes[slotKey];
    return (
      <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6 shadow-lg transition-all hover:border-zinc-700">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800/50">
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider">{label}</h4>
            {description && <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">{description}</p>}
          </div>
          <button 
            onClick={() => setTempAdCodes({
                ...tempAdCodes,
                [slotKey]: { ...slot, active: !slot.active }
            })}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all ${
              slot.active 
              ? 'bg-green-500 text-black' 
              : 'bg-zinc-800 text-zinc-500'
            }`}
          >
            {slot.active ? 'Enabled' : 'Disabled'}
          </button>
        </div>
        <textarea 
          rows={4}
          className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-[11px] font-mono focus:border-[var(--accent-color)] focus:outline-none text-zinc-300 placeholder:text-zinc-800"
          placeholder="Paste Ad Code (HTML/Script) here..."
          value={slot.code}
          onChange={(e) => setTempAdCodes({
              ...tempAdCodes,
              [slotKey]: { ...slot, code: e.target.value }
          })}
        />
      </div>
    );
  };

  // Authenticated Admin Dashboard
  const filteredMovies = movies.filter(m => m.title.toLowerCase().includes(adminSearch.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 text-white relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-4 md:right-12 z-[100] animate-in slide-in-from-right fade-in duration-300">
          <div className="bg-[#FACC15] text-black px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-black text-sm border-2 border-white/20">
            <CheckCircle size={20} />
            {notification.message}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-[var(--accent-color)] tracking-tighter">Admin Control</h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Live Content Management System</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-[#111111] p-1 rounded-xl border border-zinc-800">
            <button 
              onClick={() => setActiveTab('content')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'content' ? 'bg-[var(--accent-color)] text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              Content
            </button>
            <button 
              onClick={() => setActiveTab('ads')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'ads' ? 'bg-[var(--accent-color)] text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              Ad Center
            </button>
            <button 
              onClick={() => setActiveTab('site')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'site' ? 'bg-[var(--accent-color)] text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              Site Layout
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                placeholder="Search movies..."
                className="w-full bg-[#111111] border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none font-bold text-sm"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={handleAddNew}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--accent-color)] text-black px-8 py-2.5 rounded-lg font-black hover:bg-white transition-all uppercase text-sm"
            >
              <Plus size={20} /> Add New Entry
            </button>
          </div>

          <div className="bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1a1a1a] text-[var(--accent-color)] text-[10px] uppercase tracking-widest border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-5 font-black">Media</th>
                  <th className="px-6 py-5 font-black">Identity</th>
                  <th className="px-6 py-5 font-black">Status</th>
                  <th className="px-6 py-5 font-black text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredMovies.map((movie) => (
                  <tr 
                    key={movie.id} 
                    className="hover:bg-zinc-900/40 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-16 rounded border border-zinc-800 overflow-hidden">
                        <img src={movie.posterUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-white text-base group-hover:text-[var(--accent-color)] transition-colors">{movie.title}</div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase">{movie.year} • {movie.genres.join(', ')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleMovieStatus(movie)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${
                          movie.isActive 
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}
                      >
                        {movie.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                        {movie.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleEdit(movie)} className="p-2.5 bg-zinc-800/50 rounded-lg text-zinc-400 hover:text-[var(--accent-color)] hover:bg-zinc-800 transition-all"><Edit size={16} /></button>
                        <button onClick={() => {if(confirm('Delete permanently?')) onDelete(movie.id)}} className="p-2.5 bg-zinc-800/50 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-800 transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ads and Site Settings Tabs */}
      {activeTab === 'ads' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 pb-24">
          <div className="flex items-center justify-between bg-[#111111] p-6 rounded-2xl border border-zinc-800 shadow-xl">
            <div>
              <h2 className="text-2xl font-black text-[var(--accent-color)] flex items-center gap-3">
                <Megaphone className="text-[var(--accent-color)]" size={24} /> Ad Center
              </h2>
              <p className="text-zinc-500 font-bold text-xs uppercase tracking-tight">Configure and toggle individual advertisement placements</p>
              <p className="text-[10px] text-zinc-600 mt-1 uppercase font-bold">Note: Inactive or empty ad slots are automatically hidden from the public site.</p>
            </div>
            <div className="flex items-center gap-4 bg-black p-3 rounded-xl border border-zinc-800">
               <span className={`text-[10px] font-black uppercase ${adsEnabled ? 'text-green-500' : 'text-zinc-600'}`}>Master Switch {adsEnabled ? 'ON' : 'OFF'}</span>
               <button 
                onClick={() => setAdsEnabled(!adsEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${adsEnabled ? 'bg-green-500' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${adsEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-full mt-6 mb-2">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Terminal size={14} className="text-blue-400" /> Global Scripts & Injections
                </h3>
            </div>
            <AdSlotEditor label="Global Head Slot" slotKey="globalHeader" description="Loads on every page in the hidden head tag" />
            <AdSlotEditor label="Pop-Under Code" slotKey="popUnder" description="Triggered scripts for pop-ups or background redirects" />

            <div className="col-span-full mt-10 mb-2">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <MonitorPlay size={14} className="text-purple-400" /> Homepage Placements
                </h3>
            </div>
            <AdSlotEditor label="Home Top Leaderboard" slotKey="homeTop" description="Top of homepage grid" />
            <AdSlotEditor label="Home In-Grid Slot" slotKey="homeInGrid" description="Repeats within the movie list" />
            <AdSlotEditor label="Home Bottom Slot" slotKey="homeBottom" description="Bottom of homepage grid" />

            <div className="col-span-full mt-10 mb-2">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Tv size={14} className="text-green-400" /> Movie Detail Page
                </h3>
            </div>
            <AdSlotEditor label="Detail Top Leaderboard" slotKey="detailTop" description="Top of the movie detail view" />
            <AdSlotEditor label="Detail Sidebar 1" slotKey="detailSidebar1" description="Right sidebar (top)" />
            <AdSlotEditor label="Detail Sidebar 2" slotKey="detailSidebar2" description="Right sidebar (bottom)" />

            <div className="col-span-full mt-10 mb-2">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Zap size={14} className="text-yellow-400" /> High-Value Interaction Timers
                </h3>
            </div>
            <AdSlotEditor label="Watch Timer Ad" slotKey="watchTimer" description="Shown during the 15s watch-online wait" />
            <AdSlotEditor label="Download Timer Ad" slotKey="downloadTimer" description="Shown during the 15s download wait" />
          </div>

          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 z-50">
            <button 
                onClick={saveAdSettings}
                className="w-full py-4 bg-[var(--accent-color)] hover:bg-white text-black transition-all rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-black/10 transform active:scale-95 duration-200"
            >
                <Save size={20} /> Save & Publish Ad Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === 'site' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12 animate-in fade-in slide-in-from-bottom-2 pb-20">
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-8 shadow-xl">
               
               {/* Identity Section */}
               <div className="space-y-8">
                 <div className="p-6 bg-black/40 rounded-2xl border border-zinc-800">
                   <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Palette size={14} className="text-[var(--accent-color)]" /> Main Branding
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Logo Text</label>
                      <input 
                        type="text"
                        className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[var(--accent-color)] focus:outline-none font-bold"
                        value={tempSiteConfig.headerTitle}
                        onChange={(e) => setTempSiteConfig({...tempSiteConfig, headerTitle: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Accent Color (HEX)</label>
                      <input 
                        type="text"
                        className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[var(--accent-color)] focus:outline-none font-mono"
                        value={tempSiteConfig.accentColor}
                        onChange={(e) => setTempSiteConfig({...tempSiteConfig, accentColor: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Favicon URL</label>
                      <input 
                        type="text"
                        className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[var(--accent-color)] focus:outline-none font-mono"
                        placeholder="https://..."
                        value={tempSiteConfig.faviconUrl}
                        onChange={(e) => setTempSiteConfig({...tempSiteConfig, faviconUrl: e.target.value})}
                      />
                    </div>
                  </div>
                 </div>

                 {/* Page Content & Footer */}
                 <div className="p-6 bg-black/40 rounded-2xl border border-zinc-800">
                   <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Layout size={14} className="text-[var(--accent-color)]" /> Page Content & Footer
                   </h3>
                   <div className="space-y-6">
                     <div>
                       <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Header Top Message</label>
                       <input 
                         type="text"
                         className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[var(--accent-color)] focus:outline-none"
                         value={tempSiteConfig.headerMessage}
                         onChange={(e) => setTempSiteConfig({...tempSiteConfig, headerMessage: e.target.value})}
                       />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase flex items-center gap-2">
                          <Radio size={12} className="text-[var(--accent-color)]" /> Updates Ticker Message
                       </label>
                       <textarea 
                         rows={2}
                         className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[var(--accent-color)] focus:outline-none"
                         placeholder="Latest movies added..."
                         value={tempSiteConfig.updatesTicker || ''}
                         onChange={(e) => setTempSiteConfig({...tempSiteConfig, updatesTicker: e.target.value})}
                       />
                       <p className="text-[9px] text-zinc-500 mt-1 font-bold">This scrolling text appears at the very top of the homepage content.</p>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800/50">
                        <div>
                           <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Hero Section Title</label>
                           <input 
                             type="text"
                             className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[var(--accent-color)] focus:outline-none font-black"
                             value={tempSiteConfig.heroTitle}
                             onChange={(e) => setTempSiteConfig({...tempSiteConfig, heroTitle: e.target.value})}
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Hero Section Subtitle</label>
                           <textarea 
                             rows={2}
                             className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[var(--accent-color)] focus:outline-none"
                             value={tempSiteConfig.heroSubtitle}
                             onChange={(e) => setTempSiteConfig({...tempSiteConfig, heroSubtitle: e.target.value})}
                           />
                        </div>
                     </div>
                     
                     <div className="flex items-center justify-between p-4 bg-black border border-zinc-800 rounded-lg">
                       <div>
                         <label className="block text-[10px] font-black text-zinc-400 mb-1 uppercase flex items-center gap-2">
                             <Film size={12} className="text-[var(--accent-color)]" /> Related Movies Section
                         </label>
                         <p className="text-[9px] text-zinc-500 font-bold uppercase">Show suggested content on detail pages</p>
                       </div>
                       <button 
                         onClick={() => setTempSiteConfig({...tempSiteConfig, showRelatedMovies: !tempSiteConfig.showRelatedMovies})}
                         className={`relative w-10 h-5 rounded-full transition-colors ${tempSiteConfig.showRelatedMovies ? 'bg-[var(--accent-color)]' : 'bg-zinc-700'}`}
                       >
                         <div className={`absolute top-0.5 w-4 h-4 bg-black rounded-full transition-all ${tempSiteConfig.showRelatedMovies ? 'left-5.5' : 'left-0.5'}`} />
                       </button>
                     </div>

                     <div className="pt-4 border-t border-zinc-800/50">
                        <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Footer Headline</label>
                        <input 
                             type="text"
                             className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[var(--accent-color)] focus:outline-none font-bold"
                             value={tempSiteConfig.footerMainText}
                             onChange={(e) => setTempSiteConfig({...tempSiteConfig, footerMainText: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Footer About Text</label>
                        <textarea 
                             rows={4}
                             className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[var(--accent-color)] focus:outline-none leading-relaxed"
                             value={tempSiteConfig.footerAboutText}
                             onChange={(e) => setTempSiteConfig({...tempSiteConfig, footerAboutText: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Footer Disclaimer</label>
                        <textarea 
                             rows={2}
                             className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[var(--accent-color)] focus:outline-none"
                             value={tempSiteConfig.footerDisclaimer}
                             onChange={(e) => setTempSiteConfig({...tempSiteConfig, footerDisclaimer: e.target.value})}
                        />
                     </div>
                   </div>
                 </div>

                 {/* SEO Section */}
                 <div className="p-6 bg-black/40 rounded-2xl border border-zinc-800">
                   <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Globe size={14} className="text-[var(--accent-color)]" /> Site SEO & Metadata
                   </h3>
                   <div className="space-y-6">
                     <div>
                       <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">SEO Title</label>
                       <p className="text-[9px] text-zinc-500 mb-2 font-bold uppercase">The main title tag for the home page</p>
                       <input 
                         type="text"
                         className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[var(--accent-color)] focus:outline-none font-bold"
                         value={tempSiteConfig.siteTitle}
                         onChange={(e) => setTempSiteConfig({...tempSiteConfig, siteTitle: e.target.value})}
                       />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">SEO Description</label>
                       <p className="text-[9px] text-zinc-500 mb-2 font-bold uppercase">Global meta description for search engines</p>
                       <textarea 
                         rows={3}
                         className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[var(--accent-color)] focus:outline-none"
                         value={tempSiteConfig.siteDescription}
                         onChange={(e) => setTempSiteConfig({...tempSiteConfig, siteDescription: e.target.value})}
                       />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">SEO Tags (Keywords)</label>
                       <p className="text-[9px] text-zinc-500 mb-2 font-bold uppercase">Comma separated keywords</p>
                       <input 
                         type="text"
                         className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[var(--accent-color)] focus:outline-none"
                         placeholder="e.g. telugu movies, streaming, hd movies"
                         value={tempSiteConfig.siteKeywords}
                         onChange={(e) => setTempSiteConfig({...tempSiteConfig, siteKeywords: e.target.value})}
                       />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Open Graph Image (Social Share)</label>
                       <p className="text-[9px] text-zinc-500 mb-2 font-bold uppercase">Image URL shown when sharing the site link</p>
                       <input 
                         type="text"
                         className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[var(--accent-color)] focus:outline-none font-mono"
                         placeholder="https://..."
                         value={tempSiteConfig.ogImage}
                         onChange={(e) => setTempSiteConfig({...tempSiteConfig, ogImage: e.target.value})}
                       />
                     </div>
                   </div>
                 </div>

                 {/* Advanced Configuration */}
                 <div className="p-6 bg-black/40 rounded-2xl border border-zinc-800 mt-8">
                   <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Code size={14} className="text-[var(--accent-color)]" /> Custom Header Code
                   </h3>
                   <div>
                     <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Head Injection (Scripts/Meta/Styles)</label>
                     <p className="text-[9px] text-zinc-500 mb-2 font-bold uppercase">Code entered here will be injected into the &lt;head&gt; tag.</p>
                     <textarea 
                       rows={6}
                       className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[var(--accent-color)] focus:outline-none font-mono text-zinc-300 placeholder:text-zinc-800"
                       placeholder="<script>...</script>"
                       value={tempSiteConfig.headerCode || ''}
                       onChange={(e) => setTempSiteConfig({...tempSiteConfig, headerCode: e.target.value})}
                     />
                   </div>
                 </div>

                 {/* System Utilities */}
                 <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/20 mt-8">
                   <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Zap size={14} /> System Utilities
                   </h3>
                   <div className="flex items-center justify-between">
                     <div>
                       <h4 className="font-bold text-white text-sm">Clear Application Cache</h4>
                       <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Resets site settings & ads (Keeps Movie Data)</p>
                     </div>
                     <button 
                       onClick={handleClearCache}
                       className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 rounded-xl font-black text-xs uppercase transition-all flex items-center gap-2"
                     >
                       <RefreshCw size={16} /> Clear Cache
                     </button>
                   </div>
                 </div>

               </div>
               <button 
                onClick={saveSiteSettings}
                className="w-full mt-10 py-4 bg-[var(--accent-color)] hover:bg-white text-black transition-all rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 transform active:scale-95 duration-200"
              >
                <Save size={20} /> Save & Publish Site Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="bg-[#111111] border border-zinc-800 w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-3xl p-10 shadow-2xl relative">
            <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
              <X size={32} />
            </button>
            
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-[var(--accent-color)] tracking-tighter">
                  {movies.find(m => m.id === currentMovie.id) ? 'Refine Entry' : 'Create New Entry'}
                </h2>
                <p className="text-zinc-500 font-bold text-xs uppercase">Content Editor v2.0</p>
              </div>

              <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border border-zinc-800">
                 <span className={`text-[10px] font-black uppercase ${currentMovie.isActive ? 'text-green-500' : 'text-zinc-500'}`}>Status: {currentMovie.isActive ? 'Active' : 'Hidden'}</span>
                 <button 
                  onClick={() => setCurrentMovie({...currentMovie, isActive: !currentMovie.isActive})}
                  className={`relative w-10 h-5 rounded-full transition-colors ${currentMovie.isActive ? 'bg-green-500' : 'bg-zinc-700'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${currentMovie.isActive ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-black/40 p-8 rounded-2xl border border-zinc-800 space-y-6">
                  <h3 className="font-black text-white text-sm uppercase tracking-widest border-b border-zinc-800 pb-3 flex items-center gap-2">
                    <Type size={18} className="text-[var(--accent-color)]" /> Identity & Content
                  </h3>
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Content Title</label>
                    <input 
                      type="text" 
                      value={currentMovie.title || ''}
                      onChange={e => handleTitleChange(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3 focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none font-black text-lg"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Release Year</label>
                      <input 
                        type="text" 
                        value={currentMovie.year || ''}
                        onChange={e => setCurrentMovie({...currentMovie, year: e.target.value})}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3 focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">URL Slug (lowercase, no spaces)</label>
                      <input 
                        type="text" 
                        value={currentMovie.slug || ''}
                        onChange={e => setCurrentMovie({...currentMovie, slug: slugify(e.target.value)})}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3 focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none font-mono text-xs text-zinc-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Genres</label>
                      <input 
                        type="text" 
                        value={currentMovie.genres || ''}
                        onChange={e => setCurrentMovie({...currentMovie, genres: e.target.value})}
                        placeholder="Action, Horror, Comedy..."
                        className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3 focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Cast</label>
                      <input 
                        type="text" 
                        value={currentMovie.cast || ''}
                        onChange={e => setCurrentMovie({...currentMovie, cast: e.target.value})}
                        placeholder="Actor 1, Actor 2..."
                        className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3 focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 space-y-6">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                       <ImageIcon size={14} className="text-[var(--accent-color)]" /> Cover Artwork
                    </h4>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-grow">
                        <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Poster Image URL</label>
                        <input 
                          type="text" 
                          value={currentMovie.posterUrl || ''}
                          onChange={e => setCurrentMovie({...currentMovie, posterUrl: e.target.value})}
                          placeholder="https://..."
                          className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3 focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Synopsis / Storyline</label>
                    <textarea 
                      rows={6}
                      value={currentMovie.description || ''}
                      onChange={e => setCurrentMovie({...currentMovie, description: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3 focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none leading-relaxed text-sm"
                    ></textarea>
                  </div>
                </div>

                <div className="bg-black/40 p-8 rounded-2xl border border-zinc-800 space-y-6">
                  <h3 className="font-black text-white text-sm uppercase tracking-widest border-b border-zinc-800 pb-3 flex items-center gap-2">
                    <Globe size={18} className="text-[var(--accent-color)]" /> Search Optimization (SEO)
                  </h3>
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 mb-1 uppercase">Meta Title</label>
                    <p className="text-[9px] text-zinc-500 mb-2 font-bold uppercase">Defaults to "Title (Year) - Site Name" if blank</p>
                    <input 
                      type="text" 
                      value={currentMovie.seoTitle || ''}
                      onChange={e => setCurrentMovie({...currentMovie, seoTitle: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 mb-1 uppercase">Meta Tags (Keywords)</label>
                    <p className="text-[9px] text-zinc-500 mb-2 font-bold uppercase">Comma-separated tags for SEO & discovery</p>
                    <input 
                      type="text" 
                      value={currentMovie.seoKeywords || ''}
                      onChange={e => setCurrentMovie({...currentMovie, seoKeywords: e.target.value})}
                      placeholder="tag1, tag2, tag3"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 mb-1 uppercase">Meta Description</label>
                    <p className="text-[9px] text-zinc-500 mb-2 font-bold uppercase">A short summary for search engine results</p>
                    <textarea 
                      rows={3}
                      value={currentMovie.seoDescription || ''}
                      onChange={e => setCurrentMovie({...currentMovie, seoDescription: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-black/40 p-8 rounded-2xl border border-zinc-800 space-y-6">
                  <h3 className="font-black text-white text-sm uppercase tracking-widest border-b border-zinc-800 pb-3 flex items-center gap-2">
                    <MonitorPlay size={18} className="text-[var(--accent-color)]" /> Streaming URLs
                  </h3>
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">External Watch URL</label>
                    <input 
                      type="text" 
                      value={currentMovie.watchUrl || ''}
                      onChange={e => setCurrentMovie({...currentMovie, watchUrl: e.target.value})}
                      placeholder="https://vidcloud.com/..."
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Trailer Embed URL</label>
                    <input 
                      type="text" 
                      value={currentMovie.trailerUrl || ''}
                      onChange={e => setCurrentMovie({...currentMovie, trailerUrl: e.target.value})}
                      placeholder="https://youtube.com/embed/..."
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase">Download Link</label>
                    <input 
                      type="text" 
                      value={currentMovie.downloadUrl || ''}
                      onChange={e => setCurrentMovie({...currentMovie, downloadUrl: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-end gap-6 border-t border-zinc-800 pt-10">
              <button onClick={() => setIsEditing(false)} className="px-10 py-3 rounded-xl font-black text-zinc-400 hover:text-white uppercase text-xs">Discard</button>
              <button onClick={handleSave} className="bg-[var(--accent-color)] text-black px-16 py-3 rounded-xl font-black hover:bg-white transition-all shadow-xl uppercase text-sm transform active:scale-95 duration-200">Save & Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
