import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Debates from './Debates';
import { I18nProvider } from '@/utils/i18n';

const authHook = vi.hoisted(() => ({
  useAuth: vi.fn()
}));

const supabaseMock = vi.hoisted(() => ({
  from: vi.fn(),
  select: vi.fn(),
  order: vi.fn()
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: authHook.useAuth
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: supabaseMock.from
  }
}));

vi.mock('@/components/CreateDebateForm', () => ({
  CreateDebateForm: () => <div data-testid="create-debate-form">create-debate-form</div>
}));

const renderDebates = () => {
  return render(
    <I18nProvider>
      <MemoryRouter>
        <Debates />
      </MemoryRouter>
    </I18nProvider>
  );
};

describe('Debates integration', () => {
  beforeEach(() => {
    authHook.useAuth.mockReset();
    supabaseMock.from.mockReset();
    supabaseMock.select.mockReset();
    supabaseMock.order.mockReset();

    authHook.useAuth.mockReturnValue({
      user: null
    });

    supabaseMock.order.mockResolvedValue({
      data: [],
      error: null
    });
    supabaseMock.select.mockReturnValue({
      order: supabaseMock.order
    });
    supabaseMock.from.mockReturnValue({
      select: supabaseMock.select
    });
  });

  it('shows unauthenticated sign-in prompt after loading debates', async () => {
    renderDebates();

    expect(await screen.findByText('Intelligent Debates')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.queryByText('New Debate')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(supabaseMock.from).toHaveBeenCalledWith('debatten');
    });
  });

  it('shows debates list and create action for authenticated users', async () => {
    authHook.useAuth.mockReturnValue({
      user: { id: 'user-1' }
    });

    supabaseMock.order.mockResolvedValueOnce({
      data: [
        {
          id: 'debate-1',
          titel: 'Climate Policy',
          beschreibung: 'How should cities reduce emissions?',
          erstellt_von: 'user-1',
          erstellt_am: '2026-02-22T00:00:00.000Z'
        }
      ],
      error: null
    });

    renderDebates();

    expect(await screen.findByText('Climate Policy')).toBeInTheDocument();
    expect(screen.getByText('New Debate')).toBeInTheDocument();
    expect(screen.getByText('Join Discussion')).toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });
});
