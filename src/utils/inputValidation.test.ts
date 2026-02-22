import { describe, expect, it } from 'vitest';
import { InputValidator } from './inputValidation';

describe('InputValidator', () => {
  it('sanitizes and validates a safe argument', () => {
    const result = InputValidator.validateAndSanitizeArgument('This is a safe argument with enough length.');

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.sanitizedValue).toBe('This is a safe argument with enough length.');
  });

  it('rejects suspicious script content', () => {
    const result = InputValidator.validateAndSanitizeArgument('<script>alert(1)</script> unsafe text');

    expect(result.isValid).toBe(false);
    expect(result.errors.some((message) => message.includes('nicht erlaubte Inhalte'))).toBe(true);
    expect(result.sanitizedValue).not.toContain('<script>');
  });

  it('rejects invalid source protocols', () => {
    const result = InputValidator.validateSourceUrl('javascript:alert(1)');

    expect(result.isValid).toBe(false);
    expect(result.errors.some((message) => message.includes('HTTP/HTTPS'))).toBe(true);
  });

  it('enforces rate limits', () => {
    const userId = `user-${Date.now()}`;
    const action = 'create_argument';

    const first = InputValidator.checkRateLimit(userId, action, 2, 60_000);
    const second = InputValidator.checkRateLimit(userId, action, 2, 60_000);
    const third = InputValidator.checkRateLimit(userId, action, 2, 60_000);

    expect(first).toBe(true);
    expect(second).toBe(true);
    expect(third).toBe(false);
  });
});
