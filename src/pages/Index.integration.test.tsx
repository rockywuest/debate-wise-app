import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Index from './Index';
import { I18nProvider } from '@/utils/i18n';

const authHook = vi.hoisted(() => ({
  useAuth: vi.fn()
}));

const debatesHook = vi.hoisted(() => ({
  useDebates: vi.fn()
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: authHook.useAuth
}));

vi.mock('@/hooks/useDebates', () => ({
  useDebates: debatesHook.useDebates
}));

vi.mock('@/components/CreateDebateForm', () => ({
  CreateDebateForm: () => <div data-testid="create-debate-form">create-debate-form</div>
}));

const renderIndex = () => {
  return render(
    <I18nProvider>
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Index />
      </MemoryRouter>
    </I18nProvider>
  );
};

describe('Index integration', () => {
  beforeEach(() => {
    authHook.useAuth.mockReset();
    debatesHook.useDebates.mockReset();

    authHook.useAuth.mockReturnValue({
      user: null,
      loading: false
    });

    debatesHook.useDebates.mockReturnValue({
      debates: [],
      loading: false
    });
  });

  it('shows loading state while auth is initializing', () => {
    authHook.useAuth.mockReturnValue({
      user: null,
      loading: true
    });

    renderIndex();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows unauthenticated onboarding call-to-action', () => {
    renderIndex();

    expect(screen.getByText('Welcome to the Debate System')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.queryByTestId('create-debate-form')).not.toBeInTheDocument();
  });

  it('shows authenticated dashboard preview with debates list', () => {
    authHook.useAuth.mockReturnValue({
      user: { id: 'user-1' },
      loading: false
    });

    debatesHook.useDebates.mockReturnValue({
      loading: false,
      debates: [
        {
          id: 'debate-1',
          titel: 'Climate Policy',
          beschreibung: 'How should cities reduce emissions?',
          erstellt_von: 'user-1',
          erstellt_am: '2026-02-22T00:00:00.000Z',
          aktualisiert_am: '2026-02-22T00:00:00.000Z'
        }
      ]
    });

    renderIndex();

    expect(screen.getByText('Latest Debates')).toBeInTheDocument();
    expect(screen.getByText('Climate Policy')).toBeInTheDocument();
    expect(screen.getByTestId('create-debate-form')).toBeInTheDocument();
  });
});
