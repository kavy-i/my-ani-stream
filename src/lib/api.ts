import { store } from './store';

async function fetchApi<T>(path: string): Promise<T> {
  const base = store.getApiUrl();
  if (!base) throw new Error('API URL not configured. Please set it in settings.');
  const res = await fetch(`${base}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Types
export interface AnimeResult {
  id: string;
  title: string | { romaji?: string; english?: string; native?: string };
  image?: string;
  cover?: string;
  type?: string;
  rating?: number;
  releaseDate?: string;
  subOrDub?: string;
  status?: string;
  totalEpisodes?: number;
  description?: string;
  genres?: string[];
  episodes?: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  title?: string;
  image?: string;
  description?: string;
}

export interface StreamingSource {
  url: string;
  isM3U8: boolean;
  quality: string;
}

export interface StreamingResult {
  headers?: Record<string, string>;
  sources: StreamingSource[];
  subtitles?: { url: string; lang: string }[];
}

export interface MangaResult {
  id: string;
  title: string | { romaji?: string; english?: string; native?: string };
  image?: string;
  description?: string;
  status?: string;
  releaseDate?: string;
  genres?: string[];
  chapters?: MangaChapter[];
}

export interface MangaChapter {
  id: string;
  title?: string;
  chapterNumber?: string;
  volumeNumber?: string;
  pages?: number;
}

export interface MangaPage {
  img: string;
  page: number;
}

// Helpers
export function getTitle(t: string | { romaji?: string; english?: string; native?: string } | undefined): string {
  if (!t) return 'Unknown';
  if (typeof t === 'string') return t;
  return t.english || t.romaji || t.native || 'Unknown';
}

// Anime APIs
export const animeApi = {
  trending: (page = 1, perPage = 20) =>
    fetchApi<{ results: AnimeResult[] }>(`/meta/anilist/trending?page=${page}&perPage=${perPage}`),

  popular: (page = 1, perPage = 20) =>
    fetchApi<{ results: AnimeResult[] }>(`/meta/anilist/popular?page=${page}&perPage=${perPage}`),

  recentEpisodes: (page = 1, perPage = 20, provider?: string) =>
    fetchApi<{ results: AnimeResult[] }>(
      `/meta/anilist/recent-episodes?page=${page}&perPage=${perPage}${provider ? `&provider=${provider}` : ''}`
    ),

  search: (query: string, page = 1, perPage = 20) =>
    fetchApi<{ results: AnimeResult[] }>(`/meta/anilist/${encodeURIComponent(query)}?page=${page}&perPage=${perPage}`),

  info: (id: string, provider?: string) =>
    fetchApi<AnimeResult>(`/meta/anilist/info/${id}${provider ? `?provider=${provider}` : ''}`),

  watch: (episodeId: string, provider?: string) =>
    fetchApi<StreamingResult>(`/meta/anilist/watch/${encodeURIComponent(episodeId)}${provider ? `?provider=${provider}` : ''}`),
};

// Manga APIs
export const mangaApi = {
  search: (query: string, provider?: string) => {
    const p = provider || store.getMangaProvider();
    return fetchApi<{ results: MangaResult[] }>(`/manga/${p}/${encodeURIComponent(query)}`);
  },

  info: (id: string, provider?: string) => {
    const p = provider || store.getMangaProvider();
    return fetchApi<MangaResult>(`/manga/${p}/info?id=${encodeURIComponent(id)}`);
  },

  read: (chapterId: string, provider?: string) => {
    const p = provider || store.getMangaProvider();
    return fetchApi<MangaPage[]>(`/manga/${p}/read?chapterId=${encodeURIComponent(chapterId)}`);
  },
};
