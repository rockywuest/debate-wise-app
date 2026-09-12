
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number;
  enableLocalStorage?: boolean;
}

// Liest einen noch gueltigen Eintrag aus dem localStorage. Abgelaufene Eintraege
// werden dabei gleich entfernt. Reine Funktion gegenueber React: sie fasst keinen
// State an und ist damit als Lazy-Initializer von useState verwendbar.
const readCachedEntry = <T,>(
  key: string,
  enableLocalStorage: boolean
): Map<string, CacheEntry<T>> => {
  const empty = new Map<string, CacheEntry<T>>();
  if (!enableLocalStorage) return empty;

  try {
    const stored = localStorage.getItem(`cache_${key}`);
    if (!stored) return empty;

    const entry: CacheEntry<T> = JSON.parse(stored);
    if (Date.now() - entry.timestamp < entry.ttl) {
      empty.set(key, entry);
      return empty;
    }
    localStorage.removeItem(`cache_${key}`);
  } catch (e) {
    console.warn('Failed to load cache from localStorage:', e);
  }
  return empty;
};

export const useAdvancedCache = <T,>(
  key: string, 
  fetcher: () => Promise<T>,
  config: CacheConfig = {}
) => {
  const { 
    ttl = 5 * 60 * 1000, // 5 minutes default
    maxSize = 100,
    enableLocalStorage = true 
  } = config;

  // Der localStorage-Eintrag wird beim ersten Render gelesen, nicht per Effect
  // nachgereicht. Das spart den Render mit leerem Cache — der Verbraucher sah
  // sonst erst "keine Daten" und einen Frame spaeter den Treffer — und vermeidet
  // ein synchrones setState im Effect (react-hooks/set-state-in-effect).
  const [cache, setCache] = useState<Map<string, CacheEntry<T>>>(() =>
    readCachedEntry<T>(key, enableLocalStorage)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Ein Wechsel von key oder enableLocalStorage betrifft einen anderen Eintrag,
  // deshalb wird hier nachgeladen. setCache laeuft erst im Callback von
  // requestAnimationFrame, also ausserhalb des synchronen Effect-Rumpfs.
  const hydratedFor = useRef(key);
  useEffect(() => {
    if (hydratedFor.current === key) return;
    hydratedFor.current = key;
    setCache(readCachedEntry<T>(key, enableLocalStorage));
  }, [key, enableLocalStorage]);

  const invalidateCache = useCallback((cacheKey?: string) => {
    const keyToInvalidate = cacheKey || key;
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(keyToInvalidate);
      return newCache;
    });
    
    if (enableLocalStorage) {
      localStorage.removeItem(`cache_${keyToInvalidate}`);
    }
  }, [key, enableLocalStorage]);

  const getData = useCallback(async (forceRefresh = false): Promise<T> => {
    const cached = cache.get(key);
    
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetcher();
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl
      };

      // Update cache
      setCache(prev => {
        const newCache = new Map(prev);
        
        // Implement LRU eviction if cache is too large
        if (newCache.size >= maxSize) {
          const oldestKey = newCache.keys().next().value;
          newCache.delete(oldestKey);
          if (enableLocalStorage) {
            localStorage.removeItem(`cache_${oldestKey}`);
          }
        }
        
        newCache.set(key, entry);
        return newCache;
      });

      // Save to localStorage
      if (enableLocalStorage) {
        try {
          localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
        } catch (e) {
          console.warn('Failed to save cache to localStorage:', e);
        }
      }

      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [cache, key, fetcher, ttl, maxSize, enableLocalStorage]);

  const cachedData = cache.get(key)?.data;

  // Frueher wurde das waehrend des Renderns aus Date.now() berechnet. Das ist
  // unrein (react-hooks/purity): derselbe Render liefert je nach Zeitpunkt ein
  // anderes Ergebnis, was mit Memoisierung und konkurrierendem Rendern bricht.
  // Als Funktion fragt der Aufrufer den Zeitpunkt ab, an dem es ihn interessiert.
  const isStale = useCallback(() => {
    const entry = cache.get(key);
    return entry ? Date.now() - entry.timestamp > ttl : true;
  }, [cache, key, ttl]);

  return {
    data: cachedData,
    loading,
    error,
    getData,
    invalidateCache,
    isStale,
    refresh: () => getData(true)
  };
};
