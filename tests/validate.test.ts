import { describe, it, expect } from 'vitest';
import { isValidEmail, validateMessage } from '../src/lib/validate';

describe('validate', () => {
  it('validates email', () => {
    expect(isValidEmail('a@b.co')).toBe(true);
    expect(isValidEmail('bad')).toBe(false);
  });
  it('validates message length', () => {
    expect(validateMessage('hello world', 5, 20)).toBe(true);
    expect(validateMessage('short', 6, 20)).toBe(false);
  });
});

