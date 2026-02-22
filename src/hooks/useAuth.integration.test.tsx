import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from './useAuth';

const mocks = vi.hoisted(() => {
  const authState = {
    callback: undefined as
      | ((event: string, session: { user?: { id: string } } | null) => void)
      | undefined
  };

  const unsubscribe = vi.fn();
  const onAuthStateChange = vi.fn((callback: typeof authState.callback) => {
    authState.callback = callback;
    return { data: { subscription: { unsubscribe } } };
  });
  const getSession = vi.fn();
  const signUp = vi.fn();
  const signInWithPassword = vi.fn();
  const signOut = vi.fn();
  const toast = vi.fn();

  return {
    authState,
    unsubscribe,
    onAuthStateChange,
    getSession,
    signUp,
    signInWithPassword,
    signOut,
    toast
  };
});

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: mocks.onAuthStateChange,
      getSession: mocks.getSession,
      signUp: mocks.signUp,
      signInWithPassword: mocks.signInWithPassword,
      signOut: mocks.signOut
    }
  }
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mocks.toast })
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth integration', () => {
  beforeEach(() => {
    mocks.authState.callback = undefined;
    mocks.unsubscribe.mockReset();
    mocks.onAuthStateChange.mockClear();
    mocks.getSession.mockReset();
    mocks.signUp.mockReset();
    mocks.signInWithPassword.mockReset();
    mocks.signOut.mockReset();
    mocks.toast.mockReset();

    mocks.getSession.mockResolvedValue({ data: { session: null } });
    mocks.signUp.mockResolvedValue({ error: null });
    mocks.signInWithPassword.mockResolvedValue({ error: null });
    mocks.signOut.mockResolvedValue({});
  });

  it('initializes from getSession and updates when auth callback emits session', async () => {
    mocks.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: 'session-user' } } }
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.user?.id).toBe('session-user');

    act(() => {
      mocks.authState.callback?.('SIGNED_IN', { user: { id: 'callback-user' } });
    });

    expect(result.current.user?.id).toBe('callback-user');
  });

  it('submits sign-up payload and shows success toast', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.signUp('new@example.com', 'secret123', 'rocky');
    });

    expect(mocks.signUp).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'secret123',
      options: {
        emailRedirectTo: expect.stringMatching(/\/$/),
        data: { username: 'rocky' }
      }
    });
    expect(mocks.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Sign-up successful'
      })
    );
  });

  it('shows sign-in error toast when auth provider returns an error', async () => {
    mocks.signInWithPassword.mockResolvedValueOnce({
      error: { message: 'Invalid credentials' }
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.signIn('user@example.com', 'wrong');
    });

    expect(mocks.signInWithPassword).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'wrong'
    });
    expect(mocks.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Sign-in failed',
        variant: 'destructive'
      })
    );
  });

  it('signs out user and shows confirmation toast', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(mocks.signOut).toHaveBeenCalledTimes(1);
    expect(mocks.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Signed out'
      })
    );
  });
});
