import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mangaApi } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

export default function MangaReader() {
  const { mangaId, chapterId } = useParams<{ mangaId: string; chapterId: string }>();
  const [mode, setMode] = useState<'scroll' | 'page'>('scroll');
  const [currentPage, setCurrentPage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const { data: pages, isLoading } = useQuery({
    queryKey: ['manga-read', chapterId],
    queryFn: () => mangaApi.read(chapterId!),
    enabled: !!chapterId,
  });

  const { data: mangaInfo } = useQuery({
    queryKey: ['manga-info-reader', mangaId],
    queryFn: () => mangaApi.info(mangaId!),
    enabled: !!mangaId,
  });

  const chapters = mangaInfo?.chapters || [];
  const currentChIdx = chapters.findIndex(c => c.id === chapterId);
  const prevCh = currentChIdx > 0 ? chapters[currentChIdx - 1] : null;
  const nextCh = currentChIdx < chapters.length - 1 ? chapters[currentChIdx + 1] : null;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (mode === 'page' && pages) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrentPage(p => Math.min(p + 1, pages.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentPage(p => Math.max(p - 1, 0));
      }
    }
  }, [mode, pages]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => { setCurrentPage(0); }, [chapterId]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-[900px] p-4 space-y-4">
          <Skeleton className="aspect-[2/3] w-full" />
        </div>
      </>
    );
  }

  return (
    <div className={fullscreen ? 'fixed inset-0 z-50 bg-background overflow-auto' : ''}>
      {!fullscreen && <Navbar />}

      {/* Controls */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur px-4 py-2">
        <div className="mx-auto max-w-[900px] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {prevCh && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/read/${encodeURIComponent(mangaId!)}/${encodeURIComponent(prevCh.id)}`}>
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <span className="text-sm font-medium text-foreground">
              Ch. {chapters[currentChIdx]?.chapterNumber || '?'}
            </span>
            {nextCh && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/read/${encodeURIComponent(mangaId!)}/${encodeURIComponent(nextCh.id)}`}>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {mode === 'page' && pages && (
              <span className="text-xs text-muted-foreground">
                {currentPage + 1} / {pages.length}
              </span>
            )}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button onClick={() => setMode('scroll')}
                className={`px-3 py-1 text-xs font-medium ${mode === 'scroll' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                Scroll
              </button>
              <button onClick={() => setMode('page')}
                className={`px-3 py-1 text-xs font-medium ${mode === 'page' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                Page
              </button>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFullscreen(!fullscreen)}>
              {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Reader */}
      <div className="mx-auto max-w-[900px] p-4">
        {!pages || pages.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No pages available.</p>
        ) : mode === 'scroll' ? (
          <div className="space-y-1">
            {pages.map((p, i) => (
              <img key={i} src={p.img} alt={`Page ${p.page}`} className="w-full" loading="lazy" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <img
              src={pages[currentPage]?.img}
              alt={`Page ${currentPage + 1}`}
              className="max-h-[85vh] w-auto cursor-pointer"
              onClick={() => setCurrentPage(p => Math.min(p + 1, pages.length - 1))}
            />
            <div className="flex items-center gap-3 mt-4">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 0))} disabled={currentPage === 0}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">{currentPage + 1} / {pages.length}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, pages.length - 1))} disabled={currentPage === pages.length - 1}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Chapter nav at bottom */}
        <div className="flex justify-between mt-8 pt-4 border-t border-border">
          {prevCh ? (
            <Button variant="outline" asChild>
              <Link to={`/read/${encodeURIComponent(mangaId!)}/${encodeURIComponent(prevCh.id)}`}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous Chapter
              </Link>
            </Button>
          ) : <div />}
          {nextCh ? (
            <Button variant="outline" asChild>
              <Link to={`/read/${encodeURIComponent(mangaId!)}/${encodeURIComponent(nextCh.id)}`}>
                Next Chapter <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
