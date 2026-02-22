
import DOMPurify from 'dompurify';

export interface ValidationResult {
  isValid: boolean;
  sanitizedValue?: string;
  errors: string[];
}

export class InputValidator {
  // Maximum lengths to prevent abuse
  private static readonly MAX_ARGUMENT_LENGTH = 2000;
  private static readonly MAX_TITLE_LENGTH = 200;
  private static readonly MAX_USERNAME_LENGTH = 50;
  private static readonly MAX_SOURCE_URL_LENGTH = 500;

  // Rate limiting tracking
  private static userActionCounts = new Map<string, { count: number; lastReset: number }>();

  static validateAndSanitizeArgument(text: string): ValidationResult {
    const errors: string[] = [];

    // Length validation
    if (text.length > this.MAX_ARGUMENT_LENGTH) {
      errors.push(`Argument ist zu lang (max. ${this.MAX_ARGUMENT_LENGTH} Zeichen)`);
    }

    if (text.trim().length < 10) {
      errors.push('Argument muss mindestens 10 Zeichen enthalten');
    }

    // Content validation - block suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:text\/html/i,
      /vbscript:/i
    ];

    const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(text));
    if (hasSuspiciousContent) {
      errors.push('Text enthält nicht erlaubte Inhalte');
    }

    // Sanitize HTML content
    const sanitizedValue = DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });

    return {
      isValid: errors.length === 0,
      sanitizedValue: sanitizedValue.trim(),
      errors
    };
  }

  static validateTitle(title: string): ValidationResult {
    const errors: string[] = [];

    if (title.length > this.MAX_TITLE_LENGTH) {
      errors.push(`Titel ist zu lang (max. ${this.MAX_TITLE_LENGTH} Zeichen)`);
    }

    if (title.trim().length < 3) {
      errors.push('Titel muss mindestens 3 Zeichen enthalten');
    }

    const sanitizedValue = DOMPurify.sanitize(title, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });

    return {
      isValid: errors.length === 0,
      sanitizedValue: sanitizedValue.trim(),
      errors
    };
  }

  static validateUsername(username: string): ValidationResult {
    const errors: string[] = [];

    if (username.length > this.MAX_USERNAME_LENGTH) {
      errors.push(`Benutzername ist zu lang (max. ${this.MAX_USERNAME_LENGTH} Zeichen)`);
    }

    if (username.trim().length < 2) {
      errors.push('Benutzername muss mindestens 2 Zeichen enthalten');
    }

    // Only allow alphanumeric characters, spaces, and basic punctuation
    const allowedPattern = /^[a-zA-Z0-9\s\-_.äöüÄÖÜß]+$/;
    if (!allowedPattern.test(username)) {
      errors.push('Benutzername enthält nicht erlaubte Zeichen');
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: username.trim(),
      errors
    };
  }

  static validateSourceUrl(url: string): ValidationResult {
    const errors: string[] = [];

    if (url.length > this.MAX_SOURCE_URL_LENGTH) {
      errors.push(`URL ist zu lang (max. ${this.MAX_SOURCE_URL_LENGTH} Zeichen)`);
    }

    // Basic URL validation
    try {
      const urlObj = new URL(url);
      
      // Only allow http/https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        errors.push('Nur HTTP/HTTPS URLs sind erlaubt');
      }

      // Block localhost and private IPs in production
      if (import.meta.env.PROD) {
        const hostname = urlObj.hostname.toLowerCase();
        if (
          hostname === 'localhost' ||
          hostname.startsWith('127.') ||
          hostname.startsWith('192.168.') ||
          hostname.startsWith('10.') ||
          hostname.includes('0.0.0.0')
        ) {
          errors.push('Lokale URLs sind nicht erlaubt');
        }
      }
    } catch {
      errors.push('Ungültiges URL-Format');
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: url.trim(),
      errors
    };
  }

  // Client-side rate limiting check
  static checkRateLimit(userId: string, action: string, maxActions: number = 5, timeWindowMs: number = 60000): boolean {
    const key = `${userId}-${action}`;
    const now = Date.now();
    const userAction = this.userActionCounts.get(key);

    if (!userAction || now - userAction.lastReset > timeWindowMs) {
      this.userActionCounts.set(key, { count: 1, lastReset: now });
      return true;
    }

    if (userAction.count >= maxActions) {
      return false;
    }

    userAction.count++;
    return true;
  }
}
