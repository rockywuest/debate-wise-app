import { renderHook, waitFor, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebates } from './useDebates';

const mocks = vi.hoisted(() => {
  const fetchOrder = vi.fn();
  const insertSingle = vi.fn();
  const insertSelect = vi.fn(() => ({ single: insertSingle }));
  const insert = vi.fn(() => ({ select: insertSelect }));
  const select = vi.fn(() => ({ order: fetchOrder }));
  const from = vi.fn(() => ({ select, insert }));
  const toast = vi.fn();
  const useAuth = vi.fn();
  const useTranslation = vi.fn();

  return {
    fetchOrder,
    insertSingle,
    insertSelect,
    insert,
    select,
    from,
    toast,
    useAuth,
    useTranslation
  };
});

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: mocks.from
  }
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mocks.toast })
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: mocks.useAuth
}));

vi.mock('@/utils/i18n', () => ({
  useTranslation: mocks.useTranslation
}));

describe('useDebates integration', () => {
  beforeEach(() => {
    mocks.fetchOrder.mockReset();
    mocks.insertSingle.mockReset();
    mocks.insertSelect.mockReset();
    mocks.insert.mockReset();
    mocks.select.mockReset();
    mocks.from.mockReset();
    mocks.toast.mockReset();
    mocks.useAuth.mockReset();
    mocks.useTranslation.mockReset();

    mocks.insertSelect.mockReturnValue({ single: mocks.insertSingle });
    mocks.insert.mockReturnValue({ select: mocks.insertSelect });
    mocks.select.mockReturnValue({ order: mocks.fetchOrder });
    mocks.from.mockReturnValue({ select: mocks.select, insert: mocks.insert });

    mocks.useAuth.mockReturnValue({ user: null });
    mocks.useTranslation.mockReturnValue({ language: 'en' });
    mocks.fetchOrder.mockResolvedValue({ data: [], error: null });
  });

  it('loads debates on mount and updates loading state', async () => {
    mocks.fetchOrder.mockResolvedValueOnce({
      data: [
        {
          id: 'debate-1',
          titel: 'Climate Policy',
          beschreibung: 'How should cities reduce emissions?',
          erstellt_von: 'user-1',
          erstellt_am: '2026-02-22T00:00:00.000Z',
          aktualisiert_am: '2026-02-22T00:00:00.000Z'
        }
      ],
      error: null
    });

    const { result } = renderHook(() => useDebates());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.debates).toHaveLength(1);
    expect(result.current.debates[0].titel).toBe('Climate Policy');
    expect(mocks.from).toHaveBeenCalledWith('debatten');
  });

  it('returns null and toasts when creating debate without authenticated user', async () => {
    const { result } = renderHook(() => useDebates());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let created: unknown;
    await act(async () => {
      created = await result.current.createDebate('New debate', 'Description');
    });

    expect(created).toBeNull();
    expect(mocks.insert).not.toHaveBeenCalled();
    expect(mocks.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Sign-in required',
        variant: 'destructive'
      })
    );
  });

  it('creates debate for authenticated user and refreshes list', async () => {
    mocks.useAuth.mockReturnValue({ user: { id: 'user-1' } });
    mocks.fetchOrder
      .mockResolvedValueOnce({ data: [], error: null })
      .mockResolvedValueOnce({
        data: [
          {
            id: 'debate-2',
            titel: 'AI Governance',
            beschreibung: 'How should we regulate AI systems?',
            erstellt_von: 'user-1',
            erstellt_am: '2026-02-22T00:00:00.000Z',
            aktualisiert_am: '2026-02-22T00:00:00.000Z'
          }
        ],
        error: null
      });
    mocks.insertSingle.mockResolvedValueOnce({
      data: {
        id: 'debate-2',
        titel: 'AI Governance'
      },
      error: null
    });

    const { result } = renderHook(() => useDebates());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      const created = await result.current.createDebate(
        'AI Governance',
        'How should we regulate AI systems?'
      );
      expect(created).toEqual({ id: 'debate-2', titel: 'AI Governance' });
    });

    expect(mocks.insert).toHaveBeenCalledWith({
      titel: 'AI Governance',
      beschreibung: 'How should we regulate AI systems?',
      erstellt_von: 'user-1'
    });
    expect(mocks.fetchOrder).toHaveBeenCalledTimes(2);
    expect(mocks.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Debate created'
      })
    );
  });
});
