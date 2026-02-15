import { Link } from 'react-router-dom';
import { AnimeResult, getTitle } from '@/lib/api';

interface Props {
  anime: AnimeResult;
  className?: string;
}

export function AnimeCard({ anime, className }: Props) {
  const title = getTitle(anime.title);
  return (
    <Link
      to={`/anime/${anime.id}`}
      className={`group block rounded-lg overflow-hidden transition-transform hover:scale-[1.02] ${className || ''}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-secondary">
        {anime.image ? (
          <img
            src={anime.image}
            alt={title}
            className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No Image</div>
        )}
        {anime.rating && (
          <span className="absolute top-2 left-2 rounded bg-primary px-1.5 py-0.5 text-xs font-bold text-primary-foreground">
            ★ {(anime.rating / 10).toFixed(1)}
          </span>
        )}
        {anime.totalEpisodes && (
          <span className="absolute bottom-2 right-2 rounded bg-background/80 px-1.5 py-0.5 text-xs font-medium text-foreground">
            {anime.totalEpisodes} EP
          </span>
        )}
      </div>
      <div className="mt-2 space-y-1">
        <h3 className="text-sm font-medium leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {anime.type && <span>{anime.type}</span>}
          {anime.releaseDate && <span>{anime.releaseDate}</span>}
          {anime.subOrDub && (
            <span className="rounded bg-secondary px-1.5 py-0.5 uppercase text-[10px] font-bold">
              {anime.subOrDub}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
