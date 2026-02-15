const KEYS = {
  API_URL: 'anitube_api_url',
  ANIME_PROVIDER: 'anitube_anime_provider',
  MANGA_PROVIDER: 'anitube_manga_provider',
  SUB_DUB: 'anitube_sub_dub',
};

export const store = {
  getApiUrl: (): string => localStorage.getItem(KEYS.API_URL) || '',
  setApiUrl: (url: string) => localStorage.setItem(KEYS.API_URL, url.replace(/\/+$/, '')),

  getAnimeProvider: (): string => localStorage.getItem(KEYS.ANIME_PROVIDER) || 'gogoanime',
  setAnimeProvider: (p: string) => localStorage.setItem(KEYS.ANIME_PROVIDER, p),

  getMangaProvider: (): string => localStorage.getItem(KEYS.MANGA_PROVIDER) || 'mangadex',
  setMangaProvider: (p: string) => localStorage.setItem(KEYS.MANGA_PROVIDER, p),

  getSubDub: (): 'sub' | 'dub' => (localStorage.getItem(KEYS.SUB_DUB) as 'sub' | 'dub') || 'sub',
  setSubDub: (v: 'sub' | 'dub') => localStorage.setItem(KEYS.SUB_DUB, v),
};
