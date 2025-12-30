
import { WPPost, WPSiteConfig, WPAppData } from "./types";

const WP_JSON_POSTS = "/wp-json/wp/v2/posts";
const WP_JSON_SETTINGS = "/wp-json/wp/v2/settings";

export const fetchWPData = async (): Promise<WPAppData | null> => {
    try {
        const [postsRes, settingsRes] = await Promise.all([
            fetch(WP_JSON_POSTS),
            fetch(WP_JSON_SETTINGS)
        ]);
        if (postsRes.ok && settingsRes.ok) {
            return {
                posts: await postsRes.json(),
                settings: await settingsRes.json()
            };
        }
        return null;
    } catch (err) {
        return null;
    }
};

export const subscribeToWPUpdates = (onData: (data: WPAppData) => void) => {
    const sync = async () => {
        const data = await fetchWPData();
        if (data) onData(data);
    };
    sync();
    const interval = setInterval(sync, 15000);
    return () => clearInterval(interval);
};

export const saveWPData = async (data: WPAppData, pass: string) => {
    return fetch('/api/wp-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': pass },
        body: JSON.stringify(data)
    });
};
