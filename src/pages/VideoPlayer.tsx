import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { animeApi, getTitle } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApiConfig } from '@/hooks/use-api-config';
import { ChevronLeft, ChevronRight, Play, List } from 'lucide-react';
import { useEffect, useState } from 'react';

function decodeParam(value: string | undefined): string {
  if (!value) return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default function VideoPlayer() {
  const { animeId, episodeId } = useParams<{ animeId: string; episodeId: string }>();
  const { animeProvider, subDub, setSubDub } = useApiConfig();
  const [selectedSource, setSelectedSource] = useState(0);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const resolvedAnimeId = decodeParam(animeId);
  const resolvedEpisodeId = decodeParam(episodeId);

  const { data: anime } = useQuery({
    queryKey: ['anime-info', resolvedAnimeId, animeProvider],
    queryFn: () => animeApi.info(resolvedAnimeId, animeProvider),
    enabled: !!resolvedAnimeId,
  });

  const { data: stream, isLoading: streamLoading } = useQuery({
    queryKey: ['watch', resolvedEpisodeId, animeProvider],
    queryFn: () => animeApi.watch(resolvedEpisodeId, animeProvider),
    enabled: !!resolvedEpisodeId,
  });

  const title = anime ? getTitle(anime.title) : '';
  const episodes = anime?.episodes || [];
  const currentIdx = episodes.findIndex(e => e.id === resolvedEpisodeId);
  const prevEp = currentIdx > 0 ? episodes[currentIdx - 1] : null;
  const nextEp = currentIdx < episodes.length - 1 ? episodes[currentIdx + 1] : null;
  const currentEp = episodes[currentIdx];

  useEffect(() => {
    setSelectedSource(0);
  }, [resolvedEpisodeId, animeProvider]);

  const source = stream?.sources?.[selectedSource];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1800px] p-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Player */}
          <div className="flex-1 space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
              {streamLoading ? (
                <Skeleton className="h-full w-full" />
              ) : source ? (
                source.isM3U8 ? (
                  <iframe
                    src={`https://hlsplayer.net/embed?url=${encodeURIComponent(source.url)}`}
                    className="h-full w-full"
                    allowFullScreen
                    allow="autoplay; fullscreen"
                  />
                ) : (
                  <video src={source.url} controls className="h-full w-full" autoPlay />
                )
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No streaming source available
                </div>
              )}
            </div>

            {/* Title + controls */}
            <div className="space-y-3">
              <h1 className="text-xl font-bold text-foreground">
                {title} {currentEp && `- Episode ${currentEp.number}`}
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                {/* Nav */}
                {prevEp && (
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/watch/${encodeURIComponent(resolvedAnimeId)}/${encodeURIComponent(prevEp.id)}`}>
                      <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Link>
                  </Button>
                )}
                {nextEp && (
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/watch/${encodeURIComponent(resolvedAnimeId)}/${encodeURIComponent(nextEp.id)}`}>
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                )}

                {/* Sub/Dub */}
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <button onClick={() => setSubDub('sub')}
                    className={`px-3 py-1.5 text-xs font-bold ${subDub === 'sub' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                    SUB
                  </button>
                  <button onClick={() => setSubDub('dub')}
                    className={`px-3 py-1.5 text-xs font-bold ${subDub === 'dub' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                    DUB
                  </button>
                </div>

                {/* Source selector */}
                {stream?.sources && stream.sources.length > 1 && (
                  <Select value={String(selectedSource)} onValueChange={v => setSelectedSource(Number(v))}>
                    <SelectTrigger className="w-[140px] bg-secondary h-8 text-xs">
                      <SelectValue placeholder="Quality" />
                    </SelectTrigger>
                    <SelectContent>
                      {stream.sources.map((s, i) => (
                        <SelectItem key={i} value={String(i)}>{s.quality || `Source ${i + 1}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Episode list toggle (mobile) */}
                <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowEpisodes(!showEpisodes)}>
                  <List className="h-4 w-4 mr-1" /> Episodes
                </Button>
              </div>
            </div>
          </div>

          {/* Episode sidebar */}
          <aside className={`lg:w-80 shrink-0 ${showEpisodes ? 'block' : 'hidden lg:block'}`}>
            <div className="rounded-xl border border-border bg-card p-3 space-y-1 max-h-[70vh] overflow-y-auto">
              <h3 className="text-sm font-bold text-foreground mb-2 px-1">Episodes ({episodes.length})</h3>
              {episodes.map(ep => (
                <Link
                  key={ep.id}
                  to={`/watch/${encodeURIComponent(resolvedAnimeId)}/${encodeURIComponent(ep.id)}`}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    ep.id === resolvedEpisodeId
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <Play className="h-3 w-3 shrink-0" />
                  <span className="font-medium">EP {ep.number}</span>
                  {ep.title && <span className="truncate text-xs opacity-70">{ep.title}</span>}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
