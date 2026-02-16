import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { animeApi, getTitle } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApiConfig } from '@/hooks/use-api-config';
import { Play } from 'lucide-react';

const PROVIDERS = ['gogoanime', 'zoro', 'animekai', 'animepahe', 'enime', 'animefox', '9anime'];

export default function AnimeDetail() {
  const { id } = useParams<{ id: string }>();
  const { animeProvider, setAnimeProvider, subDub, setSubDub } = useApiConfig();

  const { data: anime, isLoading } = useQuery({
    queryKey: ['anime-info', id, animeProvider],
    queryFn: () => animeApi.info(id!, animeProvider),
    enabled: !!id,
  });

  const title = anime ? getTitle(anime.title) : '';

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-[1200px] p-4 space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      </>
    );
  }

  if (!anime) return <><Navbar /><p className="p-8 text-center text-muted-foreground">Anime not found.</p></>;

  const filteredEpisodes = anime.episodes?.filter(ep => {
    if (subDub === 'dub') return ep.id?.toLowerCase().includes('dub');
    return !ep.id?.toLowerCase().includes('dub');
  }) || anime.episodes || [];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1200px] p-4 pb-12 space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-xl bg-secondary">
          <div className="absolute inset-0">
            {(anime.cover || anime.image) && (
              <img src={anime.cover || anime.image} alt="" className="h-full w-full object-cover opacity-25 blur-sm" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
          <div className="relative flex items-end gap-6 p-6 md:p-8 pt-24">
            {anime.image && (
              <img src={anime.image} alt={title} className="h-52 w-36 rounded-lg object-cover shadow-xl" />
            )}
            <div className="space-y-2 pb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {anime.type && <span className="rounded bg-secondary px-2 py-0.5 border border-border">{anime.type}</span>}
                {anime.status && <span className="rounded bg-secondary px-2 py-0.5 border border-border">{anime.status}</span>}
                {anime.releaseDate && <span>{anime.releaseDate}</span>}
                {anime.totalEpisodes && <span>{anime.totalEpisodes} Episodes</span>}
                {anime.rating && <span>★ {(anime.rating / 10).toFixed(1)}</span>}
              </div>
              {anime.genres && (
                <div className="flex flex-wrap gap-1">
                  {anime.genres.map(g => (
                    <span key={g} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{g}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Synopsis */}
        {anime.description && (
          <div className="rounded-lg bg-card border border-border p-4">
            <h2 className="text-sm font-semibold text-foreground mb-2">Synopsis</h2>
            <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: anime.description }} />
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={animeProvider} onValueChange={setAnimeProvider}>
            <SelectTrigger className="w-[150px] bg-secondary">
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              {PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>

          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setSubDub('sub')}
              className={`px-4 py-2 text-xs font-bold transition-colors ${subDub === 'sub' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
            >
              SUB
            </button>
            <button
              onClick={() => setSubDub('dub')}
              className={`px-4 py-2 text-xs font-bold transition-colors ${subDub === 'dub' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
            >
              DUB
            </button>
          </div>
        </div>

        {/* Episodes */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Episodes ({filteredEpisodes.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {filteredEpisodes.map(ep => (
              <Link
                key={ep.id}
                to={`/watch/${anime.id}/${encodeURIComponent(ep.id)}`}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card p-3 text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Play className="h-3 w-3" />
                EP {ep.number}
              </Link>
            ))}
          </div>
          {filteredEpisodes.length === 0 && (
            <p className="text-muted-foreground text-sm">No episodes available for this selection.</p>
          )}
        </div>
      </main>
    </>
  );
}
