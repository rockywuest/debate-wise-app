import { useState, type ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthForm } from './AuthForm';
import { I18nProvider } from '@/utils/i18n';

const authHook = vi.hoisted(() => ({
  useAuth: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn()
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: authHook.useAuth
}));

const renderWithI18n = (node: ReactNode) => {
  return render(<I18nProvider>{node}</I18nProvider>);
};

const AuthFormHarness = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  return <AuthForm mode={mode} onModeChange={setMode} />;
};

describe('AuthForm integration', () => {
  beforeEach(() => {
    authHook.signIn.mockReset();
    authHook.signUp.mockReset();
    authHook.useAuth.mockReset();

    authHook.signIn.mockResolvedValue({ error: null });
    authHook.signUp.mockResolvedValue({ error: null });
    authHook.useAuth.mockReturnValue({
      signIn: authHook.signIn,
      signUp: authHook.signUp
    });
  });

  it('submits sign-in credentials through useAuth', async () => {
    const user = userEvent.setup();

    renderWithI18n(<AuthForm mode="signin" onModeChange={vi.fn()} />);

    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(authHook.signIn).toHaveBeenCalledWith('user@example.com', 'secret123');
    });
    expect(authHook.signUp).not.toHaveBeenCalled();
  });

  it('switches to sign-up mode and submits username, email, and password', async () => {
    const user = userEvent.setup();

    renderWithI18n(<AuthFormHarness />);

    await user.click(screen.getByRole('button', { name: "Don't have an account? Sign up" }));
    expect(screen.getByLabelText('Username')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Username'), 'rocky');
    await user.type(screen.getByLabelText('Email'), 'new@example.com');
    await user.type(screen.getByLabelText('Password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(authHook.signUp).toHaveBeenCalledWith('new@example.com', 'secret123', 'rocky');
    });
    expect(authHook.signIn).not.toHaveBeenCalled();
  });
});
