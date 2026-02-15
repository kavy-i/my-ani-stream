import { Link } from 'react-router-dom';
import { MangaResult, getTitle } from '@/lib/api';

interface Props {
  manga: MangaResult;
  className?: string;
}

export function MangaCard({ manga, className }: Props) {
  const title = getTitle(manga.title);
  return (
    <Link
      to={`/manga/${encodeURIComponent(manga.id)}`}
      className={`group block rounded-lg overflow-hidden transition-transform hover:scale-[1.02] ${className || ''}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-secondary">
        {manga.image ? (
          <img
            src={manga.image}
            alt={title}
            className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No Image</div>
        )}
        {manga.status && (
          <span className="absolute top-2 left-2 rounded bg-primary px-1.5 py-0.5 text-xs font-bold text-primary-foreground">
            {manga.status}
          </span>
        )}
      </div>
      <div className="mt-2 space-y-1">
        <h3 className="text-sm font-medium leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        {manga.genres && (
          <p className="text-xs text-muted-foreground line-clamp-1">{manga.genres.slice(0, 3).join(', ')}</p>
        )}
      </div>
    </Link>
  );
}
