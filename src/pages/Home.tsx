
import React from 'react';
import { WPPost, WPSiteConfig } from '../types';
import { Link } from 'react-router-dom';
import { Play, Star, Clock, Flame } from 'lucide-react';

const WPHome: React.FC<{ posts: WPPost[], settings: WPSiteConfig }> = ({ posts, settings }) => {
    return (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
            {/* Theme Hero Section */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <Flame className="text-[var(--accent-color)]" fill="currentColor" />
                    <h2 className="text-xl font-black uppercase tracking-tighter">Featured Releases</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {posts.slice(0, 6).map(post => (
                        <Link key={post.id} to={`/movie/${post.slug}`} className="group relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl">
                            <img src={post.featured_image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-0 p-4 w-full">
                                <span className="bg-[var(--accent-color)] text-black text-[9px] font-black px-2 py-0.5 rounded uppercase mb-1 inline-block">{post.meta.quality}</span>
                                <h3 className="text-xs font-bold text-white leading-tight truncate">{post.title}</h3>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-10 h-10 bg-[var(--accent-color)] rounded-full flex items-center justify-center text-black shadow-[0_0_20px_var(--accent-color)]">
                                    <Play size={20} fill="currentColor" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Main Content Area */}
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
                        <h2 className="text-lg font-black uppercase flex items-center gap-2">
                            <Clock size={18} className="text-[var(--accent-color)]" /> Recent Movies
                        </h2>
                        <div className="flex gap-4 text-[10px] font-black text-zinc-500 uppercase">
                            <button className="text-[var(--accent-color)] border-b-2 border-[var(--accent-color)] pb-4 -mb-4.5">Latest</button>
                            <button className="hover:text-white transition-colors">Popular</button>
                            <button className="hover:text-white transition-colors">HD Only</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                        {posts.map(post => (
                            <div key={post.id} className="group flex flex-col gap-3">
                                <Link to={`/movie/${post.slug}`} className="relative aspect-[2/3] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                                    <img src={post.featured_image} className="w-full h-full object-cover" loading="lazy" />
                                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[9px] font-black text-white">{post.meta.release_year}</div>
                                    <div className="absolute bottom-2 right-2 bg-[var(--accent-color)] text-black px-1.5 py-0.5 rounded font-black text-[9px]">{post.meta.quality}</div>
                                </Link>
                                <div>
                                    <Link to={`/movie/${post.slug}`} className="text-sm font-bold text-zinc-200 group-hover:text-[var(--accent-color)] transition-colors truncate block">
                                        {post.title}
                                    </Link>
                                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase mt-1">
                                        <Star size={10} className="text-yellow-500" fill="currentColor" /> {post.meta.rating || 'N/A'} • Movie
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* WP Sidebar Architecture */}
                <div className="w-full lg:w-[320px] flex-shrink-0 space-y-10">
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-xs font-black uppercase text-zinc-500 mb-6 flex items-center gap-2 tracking-widest">
                            <span className="w-1.5 h-1.5 bg-[var(--accent-color)] rounded-full" /> Categories
                        </h3>
                        <div className="grid grid-cols-1 gap-1">
                            {['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Telugu'].map(cat => (
                                <button key={cat} className="flex justify-between items-center px-4 py-2.5 bg-black/40 rounded-lg text-xs font-bold text-zinc-400 hover:text-[var(--accent-color)] hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-800">
                                    {cat} <span>→</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-xs font-black uppercase text-zinc-500 mb-6 tracking-widest">Trending Now</h3>
                        <div className="space-y-6">
                            {posts.slice(0, 4).map(post => (
                                <Link key={post.id} to={`/movie/${post.slug}`} className="flex gap-4 group">
                                    <img src={post.featured_image} className="w-14 h-20 rounded-md object-cover border border-zinc-800" />
                                    <div className="flex flex-col justify-center">
                                        <h4 className="text-xs font-bold text-zinc-200 group-hover:text-[var(--accent-color)] transition-colors line-clamp-2 leading-snug">{post.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] font-black text-zinc-500 uppercase">{post.meta.release_year}</span>
                                            <span className="text-[9px] font-black text-zinc-500 uppercase">•</span>
                                            <span className="text-[9px] font-black text-yellow-500 uppercase flex items-center gap-1"><Star size={8} fill="currentColor" /> {post.meta.rating || '8.2'}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WPHome;
