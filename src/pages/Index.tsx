import { useQuery } from '@tanstack/react-query';
import { animeApi } from '@/lib/api';
import { AnimeCard } from '@/components/AnimeCard';
import { ContentSection } from '@/components/ContentSection';
import { ApiSetupPrompt } from '@/components/ApiSetupPrompt';
import { useApiConfig } from '@/hooks/use-api-config';
import { Navbar } from '@/components/Navbar';

const Index = () => {
  const { isConfigured } = useApiConfig();

  const trending = useQuery({
    queryKey: ['trending'],
    queryFn: () => animeApi.trending(1, 12),
    enabled: isConfigured,
  });

  const popular = useQuery({
    queryKey: ['popular'],
    queryFn: () => animeApi.popular(1, 12),
    enabled: isConfigured,
  });

  const recent = useQuery({
    queryKey: ['recent'],
    queryFn: () => animeApi.recentEpisodes(1, 12),
    enabled: isConfigured,
  });

  if (!isConfigured) {
    return (
      <>
        <Navbar />
        <ApiSetupPrompt />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1800px] space-y-8 p-4 pb-12">
        {/* Hero */}
        {trending.data?.results?.[0] && (() => {
          const hero = trending.data.results[0];
          const title = typeof hero.title === 'string' ? hero.title : hero.title?.english || hero.title?.romaji || '';
          return (
            <section className="relative overflow-hidden rounded-xl bg-secondary">
              <div className="absolute inset-0">
                {(hero.cover || hero.image) && (
                  <img src={hero.cover || hero.image} alt="" className="h-full w-full object-cover opacity-30 blur-sm" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
              </div>
              <div className="relative flex items-center gap-6 p-8 md:p-12">
                {hero.image && (
                  <img src={hero.image} alt={title} className="hidden sm:block h-48 w-32 rounded-lg object-cover shadow-lg" />
                )}
                <div className="space-y-3">
                  <span className="inline-block rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                    TRENDING
                  </span>
                  <h1 className="text-2xl md:text-4xl font-bold text-foreground">{title}</h1>
                  {hero.description && (
                    <p className="max-w-xl text-sm text-muted-foreground line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: hero.description }}
                    />
                  )}
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    {hero.type && <span className="rounded bg-secondary px-2 py-0.5">{hero.type}</span>}
                    {hero.totalEpisodes && <span>{hero.totalEpisodes} Episodes</span>}
                    {hero.rating && <span>★ {(hero.rating / 10).toFixed(1)}</span>}
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        <ContentSection title="🔥 Trending Now" isLoading={trending.isLoading} itemCount={12}>
          {trending.data?.results?.map(a => <AnimeCard key={a.id} anime={a} />)}
        </ContentSection>

        <ContentSection title="⭐ Popular Anime" isLoading={popular.isLoading} itemCount={12}>
          {popular.data?.results?.map(a => <AnimeCard key={a.id} anime={a} />)}
        </ContentSection>

        <ContentSection title="📺 Recently Updated" isLoading={recent.isLoading} itemCount={12}>
          {recent.data?.results?.map(a => <AnimeCard key={a.id} anime={a} />)}
        </ContentSection>
      </main>
    </>
  );
};

export default Index;
