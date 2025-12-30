
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

export type Category = 'All' | 'Latest' | 'Action' | 'Horror' | 'Thriller' | 'Romance';
