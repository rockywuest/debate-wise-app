import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';

const createLocalStoragePolyfill = () => {
  const store = new Map<string, string>();

  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    }
  };
};

beforeEach(() => {
  const localStorageApi = window.localStorage as Partial<Storage> | undefined;

  if (
    !localStorageApi ||
    typeof localStorageApi.getItem !== 'function' ||
    typeof localStorageApi.setItem !== 'function'
  ) {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: createLocalStoragePolyfill()
    });
  }
});

afterEach(() => {
  cleanup();
});
