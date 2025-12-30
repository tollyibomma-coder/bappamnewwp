
import { Movie } from './types';

// Change this version string to force an automatic cache clear for all users upon their next visit
export const APP_VERSION = '1.0.2';

// Fixed type error by combining movies into a single array literal instead of using .concat()
export const INITIAL_MOVIES: Movie[] = [
  {
    id: '1',
    slug: 'shambhala-2025',
    title: 'Shambhala',
    year: '2025',
    genres: ['Action', 'Horror', 'Thriller'],
    cast: ['Aadi', 'Archana Iyerr', 'Swasika Vijay'],
    director: 'Ugandhar Muni',
    posterUrl: 'https://picsum.photos/seed/shamb/400/600',
    description: 'Shambhala: Mystical Thrillers Keep On Captivating The Telugu Film Industry, And This Has Consistently Adapted To Become A Favorite Of The Crowd.\n\nThe Filmmakers Are Riding On The Wave That Folklore-Driven Hits Such As Karthikeya 2 And Virupaksha Have Created As They Seek To Go Deeper Into The Realm Of Faith, Fear, And Fate Colliding.\n\nThis high-octane journey promises to blend traditional elements with modern cinematic thrills, delivering an experience that resonates with both local and global audiences.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    downloadUrl: '#',
    isActive: true,
    seoTitle: 'Shambhala (2025) Telugu Movie Watch Online - Bappam.tv',
    seoDescription: 'Watch Shambhala (2025) Telugu Movie online in HD. A mystical thriller starring Aadi and Swasika Vijay.',
    seoKeywords: 'Shambhala movie, telugu movies 2025, Shambhala telugu watch online, bappam tv'
  },
  {
    id: '2',
    slug: 'stranger-things-season-5',
    title: 'Stranger Things Season 5',
    year: '2025',
    genres: ['Sci-Fi', 'Horror'],
    cast: ['Millie Bobby Brown', 'Finn Wolfhard'],
    director: 'Duffer Brothers',
    posterUrl: 'https://picsum.photos/seed/stranger/400/600',
    description: 'The final season of the global phenomenon.\n\nHawkins will never be the same as the group faces their ultimate challenge from the Upside Down.',
    trailerUrl: '',
    downloadUrl: '#',
    isActive: true,
    seoTitle: 'Stranger Things Season 5 Watch Online - Bappam.tv',
    seoDescription: 'Stream the final season of Stranger Things online in Telugu dubbed HD.',
    seoKeywords: 'Stranger Things Season 5, Stranger Things Telugu, Web Series Online'
  },
  {
    id: '3',
    slug: 'ayalaan-2025',
    title: 'Ayalaan',
    year: '2025',
    genres: ['Sci-Fi', 'Comedy'],
    cast: ['Sivakarthikeyan', 'Rakul Preet Singh'],
    director: 'R. Ravikumar',
    posterUrl: 'https://picsum.photos/seed/aya/400/600',
    description: 'A sci-fi adventure involving an extra-terrestrial visitor.\n\nFollow the hilarious and action-packed journey of a man who befriends an alien to save the Earth from a cosmic threat.',
    trailerUrl: '',
    downloadUrl: '#',
    isActive: true,
    seoTitle: 'Ayalaan (2025) Telugu Dubbed Movie HD - Bappam.tv',
    seoDescription: 'Watch Ayalaan (2025) Telugu dubbed movie. A fun sci-fi adventure with Sivakarthikeyan.',
    seoKeywords: 'Ayalaan telugu, Ayalaan movie online, bappam telugu movies'
  },
  { id: '4', slug: 'dhandora-2025', title: 'Dhandora', year: '2025', genres: ['Drama', 'Action'], cast: ['Bhuvan Bam'], director: 'Himank Gaur', posterUrl: 'https://picsum.photos/seed/dhan/400/600', description: 'A story of destiny and chance.', trailerUrl: '', downloadUrl: '#', isActive: true },
  { id: '5', slug: 'champion-2025', title: 'Champion', year: '2025', genres: ['Sports', 'Drama'], cast: ['Vishwaksen'], director: 'Sandeep Raj', posterUrl: 'https://picsum.photos/seed/champ/400/600', description: 'The journey of an underdog athlete.', trailerUrl: '', downloadUrl: '#', isActive: true },
  { id: '6', slug: 'nayanam-season-1', title: 'Nayanam Season 1', year: '2025', genres: ['Mystery', 'Thriller'], cast: ['Navdeep', 'Bindu Madhavi'], director: 'Anand Ravichandran', posterUrl: 'https://picsum.photos/seed/nayan/400/600', description: 'A dark mystery unfolding in a small town.', trailerUrl: '', downloadUrl: '#', isActive: true },
  { id: '7', slug: 'pharma-telugu-dubbed-2025', title: 'Pharma Telugu Dubbed', year: '2025', genres: ['Medical', 'Thriller'], cast: ['Nivin Pauly'], director: 'P.R. Arun', posterUrl: 'https://picsum.photos/seed/pharma/400/600', description: 'A medical conspiracy thriller.', trailerUrl: '', downloadUrl: '#', isActive: true },
  { id: '8', slug: 'gurram-paapi-reddy-2025', title: 'Gurram Paapi Reddy', year: '2025', genres: ['Comedy', 'Drama'], cast: ['Ali', 'Brahmanandam'], director: 'S.V. Krishna Reddy', posterUrl: 'https://picsum.photos/seed/gurram/400/600', description: 'A hilarious ride through rural Andhra.', trailerUrl: '', downloadUrl: '#', isActive: true }
];
