
export interface AdSlot {
  code: string;
  active: boolean;
}

export interface AdConfig {
  globalHeader: AdSlot;
  popUnder: AdSlot;
  homeTop: AdSlot;
  homeInGrid: AdSlot;
  homeBottom: AdSlot;
  detailTop: AdSlot;
  detailSidebar1: AdSlot;
  detailSidebar2: AdSlot;
  watchTimer: AdSlot;
  downloadTimer: AdSlot;
}

// Added Movie interface to fix compilation errors in components using legacy Movie structure
export interface Movie {
  id: string;
  slug: string;
  title: string;
  year: string;
  genres: string[];
  cast: string[];
  director: string;
  posterUrl: string;
  description: string;
  trailerUrl: string;
  downloadUrl: string;
  downloadNewTab?: boolean;
  watchUrl?: string; // Admin controlled watch link
  watchNewTab?: boolean; // Toggle for watch link target
  isActive: boolean; // Toggle to show/hide movie
  // SEO Fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

// Added SiteConfig interface to fix compilation errors in Header, Footer, and Detail pages
export interface SiteConfig {
  // Header Section
  headerTitle: string;
  headerMessage: string;
  headerCode?: string; // For general custom head code
  updatesTicker?: string; // New field for scrolling updates
  // Body (Hero) Section
  heroTitle: string;
  heroSubtitle: string;
  // Footer Section
  footerMainText: string;
  footerAboutText: string;
  footerDisclaimer: string;
  // Global SEO & Assets
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  ogImage: string;
  faviconUrl: string;
  // Theme
  accentColor: string;
  // Features
  showRelatedMovies: boolean;
}

export interface WPPostMeta {
  quality: string;
  duration: string;
  rating: string;
  trailer_url: string;
  download_url: string;
  watch_url: string;
  release_year: string;
  cast: string[];
}

export interface WPPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  date: string;
  status: 'publish' | 'draft';
  categories: string[];
  tags: string[];
  meta: WPPostMeta;
}

export interface WPSiteConfig {
  blogname: string;
  blogdescription: string;
  site_icon: string;
  accent_color: string;
  header_menu: { label: string; url: string }[];
  footer_text: string;
  ads_enabled: boolean;
  ad_codes: AdConfig;
}

export interface WPAppData {
  posts: WPPost[];
  settings: WPSiteConfig;
}
