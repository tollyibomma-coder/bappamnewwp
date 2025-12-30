
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, Settings, Image, Plus, Trash2, Edit, Save, LogOut, Lock, Globe, Megaphone, CheckCircle, ChevronRight, Monitor, Palette } from 'lucide-react';
import { WPPost, WPSiteConfig, WPAppData } from '../types';
import { saveWPData } from '../api';

const WPAdmin: React.FC<{ 
    data: WPAppData, 
    onUpdate: (data: WPAppData) => void 
}> = ({ data, onUpdate }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!sessionStorage.getItem('wp_pass'));
    const [pass, setPass] = useState('');
    const [activeMenu, setActiveMenu] = useState<'posts' | 'settings' | 'ads'>('posts');
    const [editingPost, setEditingPost] = useState<WPPost | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/wp-login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({password: pass}) });
        if (res.ok) { sessionStorage.setItem('wp_pass', pass); setIsLoggedIn(true); }
        else alert('Invalid Admin Password');
    };

    const pushUpdate = async (newData: WPAppData) => {
        setIsSaving(true);
        const wpPass = sessionStorage.getItem('wp_pass') || "";
        const res = await saveWPData(newData, wpPass);
        if (res.ok) onUpdate(newData);
        setIsSaving(false);
    };

    const handleSavePost = () => {
        if (!editingPost) return;
        const newPosts = data.posts.find(p => p.id === editingPost.id)
            ? data.posts.map(p => p.id === editingPost.id ? editingPost : p)
            : [editingPost, ...data.posts];
        pushUpdate({ ...data, posts: newPosts });
        setEditingPost(null);
    };

    if (!isLoggedIn) return (
        <div className="min-h-screen bg-[#f0f0f1] flex items-center justify-center p-4">
            <div className="w-full max-w-[320px] space-y-4">
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 bg-[#2271b1] rounded-full flex items-center justify-center text-white shadow-lg">
                        <Lock size={40} />
                    </div>
                </div>
                <form onSubmit={handleLogin} className="bg-white p-6 shadow-sm border border-[#ccd0d4] rounded">
                    <label className="block text-xs font-bold text-[#2c3338] mb-1 uppercase">Password</label>
                    <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full border border-[#8c8f94] p-2 mb-4 focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none" autoFocus />
                    <button className="w-full bg-[#2271b1] text-white py-2 rounded text-sm font-bold hover:bg-[#135e96] transition-colors">Log In</button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f0f0f1] flex text-[#2c3338] font-sans">
            {/* WP Sidebar */}
            <div className="w-64 bg-[#1d2327] flex-shrink-0 flex flex-col">
                <div className="p-4 flex items-center gap-2 border-b border-white/5 bg-[#2271b1] text-white">
                    <Globe size={20} />
                    <span className="font-bold text-sm">WP Dashboard</span>
                </div>
                <nav className="flex-grow pt-2">
                    {[
                        { id: 'posts', label: 'Posts', icon: FileText },
                        { id: 'settings', label: 'Settings', icon: Settings },
                        { id: 'ads', label: 'Advertisements', icon: Megaphone }
                    ].map(item => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveMenu(item.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${activeMenu === item.id ? 'bg-[#2271b1] text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>
                <button onClick={() => {sessionStorage.removeItem('wp_pass'); setIsLoggedIn(false);}} className="p-4 text-zinc-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase border-t border-white/5">
                    <LogOut size={14} /> Exit Admin
                </button>
            </div>

            {/* Main Workspace */}
            <div className="flex-grow overflow-y-auto p-8">
                {activeMenu === 'posts' && (
                    <div className="max-w-5xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-normal">Posts</h1>
                            <button onClick={() => setEditingPost({ id: Date.now().toString(), title: '', slug: '', content: '', excerpt: '', featured_image: '', date: new Date().toISOString(), status: 'publish', categories: [], tags: [], meta: { quality: 'HD', duration: '', rating: '', trailer_url: '', download_url: '', watch_url: '', release_year: '2025', cast: [] } })} className="bg-white border border-[#2271b1] text-[#2271b1] px-4 py-1 rounded text-sm font-medium hover:bg-[#f6f7f7]">Add New</button>
                        </div>
                        <div className="bg-white border border-[#ccd0d4] shadow-sm rounded overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-[#f6f7f7] border-b border-[#ccd0d4] text-xs font-bold">
                                    <tr>
                                        <th className="px-6 py-3">Title</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#ccd0d4]">
                                    {data.posts.map(post => (
                                        <tr key={post.id} className="hover:bg-[#f6f7f7] group">
                                            <td className="px-6 py-4 font-bold text-[#2271b1]">{post.title}</td>
                                            <td className="px-6 py-4 text-xs font-bold uppercase">{post.status}</td>
                                            <td className="px-6 py-4 text-xs text-[#8c8f94]">{new Date(post.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => setEditingPost(post)} className="text-[#2271b1] hover:underline text-xs">Edit</button>
                                                <button onClick={() => pushUpdate({...data, posts: data.posts.filter(p => p.id !== post.id)})} className="text-red-600 hover:underline text-xs">Bin</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeMenu === 'settings' && (
                    <div className="max-w-2xl mx-auto bg-white p-8 border border-[#ccd0d4] shadow-sm rounded">
                        <h1 className="text-2xl font-normal mb-8 flex items-center gap-2"><Settings className="text-[#2271b1]" /> General Settings</h1>
                        <div className="space-y-6">
                            <div><label className="block text-sm font-bold mb-2">Site Title</label><input className="w-full border border-[#8c8f94] p-2 focus:border-[#2271b1] outline-none" value={data.settings.blogname} onChange={e => onUpdate({...data, settings: {...data.settings, blogname: e.target.value}})} /></div>
                            <div><label className="block text-sm font-bold mb-2">Tagline</label><input className="w-full border border-[#8c8f94] p-2 focus:border-[#2271b1] outline-none" value={data.settings.blogdescription} onChange={e => onUpdate({...data, settings: {...data.settings, blogdescription: e.target.value}})} /></div>
                            <div><label className="block text-sm font-bold mb-2">Theme Accent</label><input type="color" className="w-16 h-10 border border-[#8c8f94]" value={data.settings.accent_color} onChange={e => onUpdate({...data, settings: {...data.settings, accent_color: e.target.value}})} /></div>
                            <button onClick={() => pushUpdate(data)} className="bg-[#2271b1] text-white px-8 py-2.5 rounded font-bold text-sm">Save Changes</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Post Editor Modal */}
            {editingPost && (
                <div className="fixed inset-0 z-50 bg-[#f0f0f1] flex flex-col">
                    <div className="bg-[#1d2327] text-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setEditingPost(null)} className="text-zinc-400 hover:text-white"><ChevronRight className="rotate-180" /></button>
                            <h2 className="font-bold text-sm">Edit Post</h2>
                        </div>
                        <button onClick={handleSavePost} className="bg-[#2271b1] px-6 py-1.5 rounded text-sm font-bold">Publish</button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-12 bg-white flex justify-center">
                        <div className="w-full max-w-4xl space-y-8">
                            <input className="w-full text-4xl font-bold border-none outline-none placeholder:text-zinc-200" placeholder="Enter title here" value={editingPost.title} onChange={e => setEditingPost({...editingPost, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-100">
                                <div><label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Featured Image URL</label><input className="w-full bg-[#f6f7f7] border border-[#ccd0d4] p-2 text-sm" value={editingPost.featured_image} onChange={e => setEditingPost({...editingPost, featured_image: e.target.value})} /></div>
                                <div><label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Release Year</label><input className="w-full bg-[#f6f7f7] border border-[#ccd0d4] p-2 text-sm" value={editingPost.meta.release_year} onChange={e => setEditingPost({...editingPost, meta: {...editingPost.meta, release_year: e.target.value}})} /></div>
                                <div><label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Watch Online URL</label><input className="w-full bg-[#f6f7f7] border border-[#ccd0d4] p-2 text-sm" value={editingPost.meta.watch_url} onChange={e => setEditingPost({...editingPost, meta: {...editingPost.meta, watch_url: e.target.value}})} /></div>
                                <div><label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Download Link</label><input className="w-full bg-[#f6f7f7] border border-[#ccd0d4] p-2 text-sm" value={editingPost.meta.download_url} onChange={e => setEditingPost({...editingPost, meta: {...editingPost.meta, download_url: e.target.value}})} /></div>
                                <div className="md:col-span-2"><label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Synopsis</label><textarea rows={5} className="w-full bg-[#f6f7f7] border border-[#ccd0d4] p-4 text-sm" value={editingPost.content} onChange={e => setEditingPost({...editingPost, content: e.target.value})} /></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WPAdmin;
