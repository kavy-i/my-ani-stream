import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mangaApi, getTitle } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApiConfig } from '@/hooks/use-api-config';
import { BookOpen } from 'lucide-react';

const PROVIDERS = ['mangadex', 'mangahere', 'mangakakalot', 'mangapark', 'mangapill', 'mangareader', 'mangasee123'];

export default function MangaDetail() {
  const { id } = useParams<{ id: string }>();
  const { mangaProvider, setMangaProvider } = useApiConfig();

  const { data: manga, isLoading } = useQuery({
    queryKey: ['manga-info', id, mangaProvider],
    queryFn: () => mangaApi.info(id!, mangaProvider),
    enabled: !!id,
  });

  const title = manga ? getTitle(manga.title) : '';

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-[1200px] p-4 space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </>
    );
  }

  if (!manga) return <><Navbar /><p className="p-8 text-center text-muted-foreground">Manga not found.</p></>;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1200px] p-4 pb-12 space-y-6">
        {/* Banner */}
        <div className="flex gap-6 rounded-xl border border-border bg-card p-6">
          {manga.image && (
            <img src={manga.image} alt={title} className="h-60 w-40 rounded-lg object-cover shadow-lg shrink-0" />
          )}
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {manga.status && <span className="rounded bg-primary/10 text-primary px-2 py-0.5">{manga.status}</span>}
              {manga.releaseDate && <span>{manga.releaseDate}</span>}
              {manga.chapters && <span>{manga.chapters.length} Chapters</span>}
            </div>
            {manga.genres && (
              <div className="flex flex-wrap gap-1">
                {manga.genres.map(g => (
                  <span key={g} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{g}</span>
                ))}
              </div>
            )}
            {manga.description && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4"
                dangerouslySetInnerHTML={{ __html: manga.description }}
              />
            )}
          </div>
        </div>

        {/* Provider */}
        <div className="flex items-center gap-3">
          <Select value={mangaProvider} onValueChange={setMangaProvider}>
            <SelectTrigger className="w-[160px] bg-secondary">
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              {PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Chapters */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Chapters</h2>
          <div className="space-y-1 rounded-xl border border-border bg-card overflow-hidden">
            {manga.chapters?.map(ch => (
              <Link
                key={ch.id}
                to={`/read/${encodeURIComponent(manga.id)}/${encodeURIComponent(ch.id)}`}
                className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-accent last:border-0"
              >
                <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium text-sm text-foreground">
                  Chapter {ch.chapterNumber || '?'}
                </span>
                {ch.title && <span className="text-xs text-muted-foreground truncate">{ch.title}</span>}
              </Link>
            ))}
            {(!manga.chapters || manga.chapters.length === 0) && (
              <p className="p-4 text-sm text-muted-foreground text-center">No chapters available.</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
