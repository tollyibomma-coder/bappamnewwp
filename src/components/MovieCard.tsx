
import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="group relative flex flex-col bg-[#0a0a0a] overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.03] active:scale-95 border border-zinc-800 hover:border-[var(--accent-color)]/50 shadow-xl">
      <Link 
        to={`/movie/${movie.slug}`}
        className="block"
      >
        <div className="aspect-[2/3] overflow-hidden relative border-b border-zinc-900">
          <img 
            src={movie.posterUrl} 
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
        </div>
        <div className="p-3 pb-1 flex flex-col gap-1">
          <h3 className="text-sm md:text-base font-bold truncate text-zinc-100 group-hover:text-[var(--accent-color)] transition-colors leading-tight">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[var(--accent-color)]/90 tracking-wide">{movie.year}</span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase group-hover:text-zinc-400">Telugu</span>
          </div>
        </div>
      </Link>
      
      <div className="p-3 pt-2">
        <Link 
          to={`/movie/${movie.slug}`}
          className="flex items-center justify-center gap-1.5 w-full bg-[var(--accent-color)] hover:bg-white text-black text-[11px] font-black py-2 rounded uppercase transition-colors"
        >
          <Play size={12} fill="black" /> Watch Now
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
