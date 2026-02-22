
import { useState, useEffect, useCallback } from 'react';
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

  const [cache, setCache] = useState<Map<string, CacheEntry<T>>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (enableLocalStorage) {
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          const entry: CacheEntry<T> = JSON.parse(stored);
          if (Date.now() - entry.timestamp < entry.ttl) {
            setCache(prev => new Map(prev.set(key, entry)));
          } else {
            localStorage.removeItem(`cache_${key}`);
          }
        }
      } catch (e) {
        console.warn('Failed to load cache from localStorage:', e);
      }
    }
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
  const isStale = cache.get(key) ? Date.now() - cache.get(key)!.timestamp > ttl : true;

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
