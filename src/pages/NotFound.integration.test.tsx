import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import NotFound from './NotFound';
import { I18nProvider } from '@/utils/i18n';

const renderAtUnknownRoute = () => {
  return render(
    <I18nProvider>
      <MemoryRouter
        initialEntries={['/this-route-does-not-exist']}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    </I18nProvider>
  );
};

describe('NotFound integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the 404 heading and recovery CTAs in English by default', () => {
    renderAtUnknownRoute();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404');
    expect(screen.getByText('Page not found')).toBeInTheDocument();

    const debatesLink = screen.getByRole('link', { name: /Go to Debates/i });
    const signInLink = screen.getByRole('link', { name: /Sign In/i });
    const homeLink = screen.getByRole('link', { name: /Back to Home/i });

    expect(debatesLink).toHaveAttribute('href', '/debates');
    expect(signInLink).toHaveAttribute('href', '/auth');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders German labels when language is set to de', () => {
    window.localStorage.setItem('debate-wise-language', 'de');

    renderAtUnknownRoute();

    expect(screen.getByText('Seite nicht gefunden')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Zu den Debatten/i })).toHaveAttribute('href', '/debates');
    expect(screen.getByRole('link', { name: /Anmelden/i })).toHaveAttribute('href', '/auth');
    expect(screen.getByRole('link', { name: /Zur Startseite/i })).toHaveAttribute('href', '/');
  });
});
