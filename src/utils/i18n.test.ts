import { describe, expect, it, beforeEach } from 'vitest';
import { getPreferredLanguage, localizeText } from './i18n';

describe('i18n utils', () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = new Map<string, string>();

    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
        setItem: (key: string, value: string) => {
          store.set(key, value);
        },
        removeItem: (key: string) => {
          store.delete(key);
        },
        clear: () => {
          store.clear();
        }
      }
    });
  });

  it('returns english text for en language', () => {
    expect(localizeText('en', 'Hello', 'Hallo')).toBe('Hello');
  });

  it('returns german text for de language', () => {
    expect(localizeText('de', 'Hello', 'Hallo')).toBe('Hallo');
  });

  it('prefers stored language from known storage keys', () => {
    window.localStorage.setItem('debate-platform-language', 'de');
    expect(getPreferredLanguage()).toBe('de');
  });

  it('falls back to english when no valid stored language exists', () => {
    window.localStorage.setItem('debate-wise-language', 'fr');
    expect(getPreferredLanguage()).toBe('en');
  });
});
