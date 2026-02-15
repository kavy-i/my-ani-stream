import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { animeApi, mangaApi } from '@/lib/api';
import { AnimeCard } from '@/components/AnimeCard';
import { MangaCard } from '@/components/MangaCard';
import { ContentSection } from '@/components/ContentSection';
import { Navbar } from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';

  const animeResults = useQuery({
    queryKey: ['search-anime', query],
    queryFn: () => animeApi.search(query),
    enabled: !!query,
  });

  const mangaResults = useQuery({
    queryKey: ['search-manga', query],
    queryFn: () => mangaApi.search(query),
    enabled: !!query,
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1800px] p-4 pb-12">
        <h1 className="mb-6 text-2xl font-bold text-foreground">
          {query ? `Results for "${query}"` : 'Search'}
        </h1>

        {query && (
          <Tabs defaultValue="anime" className="space-y-6">
            <TabsList>
              <TabsTrigger value="anime">
                Anime {animeResults.data?.results && `(${animeResults.data.results.length})`}
              </TabsTrigger>
              <TabsTrigger value="manga">
                Manga {mangaResults.data?.results && `(${mangaResults.data.results.length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="anime">
              <ContentSection title="Anime Results" isLoading={animeResults.isLoading}>
                {animeResults.data?.results?.map(a => <AnimeCard key={a.id} anime={a} />)}
              </ContentSection>
              {animeResults.data?.results?.length === 0 && (
                <p className="text-muted-foreground text-center py-12">No anime found.</p>
              )}
            </TabsContent>

            <TabsContent value="manga">
              <ContentSection title="Manga Results" isLoading={mangaResults.isLoading}>
                {mangaResults.data?.results?.map(m => <MangaCard key={m.id} manga={m} />)}
              </ContentSection>
              {mangaResults.data?.results?.length === 0 && (
                <p className="text-muted-foreground text-center py-12">No manga found.</p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </>
  );
}
