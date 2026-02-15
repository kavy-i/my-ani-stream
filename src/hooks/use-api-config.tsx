import { useState, useCallback } from 'react';
import { store } from '@/lib/store';

export function useApiConfig() {
  const [apiUrl, setApiUrlState] = useState(store.getApiUrl());
  const [animeProvider, setAnimeProviderState] = useState(store.getAnimeProvider());
  const [mangaProvider, setMangaProviderState] = useState(store.getMangaProvider());
  const [subDub, setSubDubState] = useState(store.getSubDub());

  const setApiUrl = useCallback((url: string) => {
    store.setApiUrl(url);
    setApiUrlState(url.replace(/\/+$/, ''));
  }, []);

  const setAnimeProvider = useCallback((p: string) => {
    store.setAnimeProvider(p);
    setAnimeProviderState(p);
  }, []);

  const setMangaProvider = useCallback((p: string) => {
    store.setMangaProvider(p);
    setMangaProviderState(p);
  }, []);

  const setSubDub = useCallback((v: 'sub' | 'dub') => {
    store.setSubDub(v);
    setSubDubState(v);
  }, []);

  return {
    apiUrl, setApiUrl,
    animeProvider, setAnimeProvider,
    mangaProvider, setMangaProvider,
    subDub, setSubDub,
    isConfigured: !!apiUrl,
  };
}
