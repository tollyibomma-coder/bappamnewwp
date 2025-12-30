
import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'wp_content.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "wp-admin2025";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());
app.use(express.json({ limit: '50mb' }));

const getWPData = () => {
    if (!fs.existsSync(DB_FILE)) {
        return { 
            posts: [], 
            settings: {
                blogname: 'Bappam.tv',
                blogdescription: 'The Ultimate WordPress Movie Theme',
                site_icon: 'https://cdn-icons-png.flaticon.com/512/3172/3172551.png',
                accent_color: '#FACC15',
                header_menu: [
                    { label: 'Home', url: '/' },
                    { label: 'Latest', url: '/category/latest' },
                    { label: 'Action', url: '/category/action' }
                ],
                footer_text: '© 2025 Bappam.tv - Powered by WordPress Emulator',
                ads_enabled: true,
                ad_codes: {
                    globalHeader: { code: '', active: true },
                    popUnder: { code: '', active: true },
                    homeTop: { code: '', active: true },
                    homeInGrid: { code: '', active: true },
                    homeBottom: { code: '', active: true },
                    detailTop: { code: '', active: true },
                    detailSidebar1: { code: '', active: true },
                    detailSidebar2: { code: '', active: true },
                    watchTimer: { code: '', active: true },
                    downloadTimer: { code: '', active: true }
                }
            }
        };
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
};

const saveWPData = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// WP-REST API Routes
app.get('/wp-json/wp/v2/posts', (req, res) => {
    const { posts } = getWPData();
    res.json(posts.filter(p => p.status === 'publish'));
});

app.get('/wp-json/wp/v2/settings', (req, res) => {
    const { settings } = getWPData();
    res.json(settings);
});

app.post('/api/wp-login', (req, res) => {
    if (req.body.password === ADMIN_PASSWORD) res.sendStatus(200);
    else res.sendStatus(401);
});

app.post('/api/wp-save', (req, res) => {
    if (req.headers.authorization === ADMIN_PASSWORD) {
        saveWPData(req.body);
        res.sendStatus(200);
    } else res.sendStatus(401);
});

// Serve Frontend
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

app.listen(PORT, () => console.log(`WordPress Theme Server on port ${PORT}`));
