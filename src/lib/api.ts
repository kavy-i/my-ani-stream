import { store } from './store';

async function fetchApi<T>(path: string): Promise<T> {
  const base = store.getApiUrl();
  if (!base) throw new Error('API URL not configured. Please set it in settings.');
  const res = await fetch(`${base}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeStreamSource(source: unknown, index: number): StreamingSource | null {
  if (!source || typeof source !== 'object') return null;
  const src = source as Record<string, unknown>;
  const url = typeof src.url === 'string' ? src.url : typeof src.file === 'string' ? src.file : '';
  if (!url) return null;

  return {
    url,
    isM3U8: Boolean(src.isM3U8) || url.includes('.m3u8'),
    quality: typeof src.quality === 'string' ? src.quality : `Source ${index + 1}`,
  };
}

function normalizeStreamingResult(payload: unknown): StreamingResult {
  const data = (payload && typeof payload === 'object' ? payload : {}) as Record<string, unknown>;
  const rawSources = Array.isArray(data.sources)
    ? data.sources
    : Array.isArray(data.result)
      ? data.result
      : [];

  const sources = rawSources
    .map((source, index) => normalizeStreamSource(source, index))
    .filter((source): source is StreamingSource => source !== null);

  const subtitlesInput = Array.isArray(data.subtitles)
    ? data.subtitles
    : Array.isArray(data.tracks)
      ? data.tracks
      : [];

  const subtitles = subtitlesInput
    .map((track) => {
      if (!track || typeof track !== 'object') return null;
      const sub = track as Record<string, unknown>;
      const url = typeof sub.url === 'string' ? sub.url : typeof sub.file === 'string' ? sub.file : '';
      if (!url) return null;
      return {
        url,
        lang: typeof sub.lang === 'string' ? sub.lang : typeof sub.label === 'string' ? sub.label : 'Unknown',
      };
    })
    .filter((track): track is { url: string; lang: string } => track !== null);

  return {
    headers: data.headers && typeof data.headers === 'object' ? (data.headers as Record<string, string>) : undefined,
    sources,
    subtitles,
  };
}

function normalizeMangaPages(payload: unknown): MangaPage[] {
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? ((payload as Record<string, unknown>).pages as unknown[] | undefined) ||
        ((payload as Record<string, unknown>).results as unknown[] | undefined) ||
        []
      : [];

  return source
    .map((page, index) => {
      if (typeof page === 'string') {
        return { img: page, page: index + 1 };
      }
      if (!page || typeof page !== 'object') return null;
      const obj = page as Record<string, unknown>;
      const img =
        typeof obj.img === 'string'
          ? obj.img
          : typeof obj.url === 'string'
            ? obj.url
            : typeof obj.src === 'string'
              ? obj.src
              : '';
      if (!img) return null;
      const pageNum = typeof obj.page === 'number' ? obj.page : index + 1;
      return { img, page: pageNum };
    })
    .filter((page): page is MangaPage => page !== null);
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

  watch: async (episodeId: string, provider?: string) => {
    const resolvedEpisodeId = safeDecode(episodeId);
    const query = provider ? `?provider=${encodeURIComponent(provider)}` : '';
    const result = await fetchApi<unknown>(`/meta/anilist/watch/${encodeURIComponent(resolvedEpisodeId)}${query}`);
    return normalizeStreamingResult(result);
  },
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

  read: async (chapterId: string, provider?: string) => {
    const p = provider || store.getMangaProvider();
    const resolvedChapterId = safeDecode(chapterId);
    const result = await fetchApi<unknown>(`/manga/${p}/read?chapterId=${encodeURIComponent(resolvedChapterId)}`);
    return normalizeMangaPages(result);
  },
};
