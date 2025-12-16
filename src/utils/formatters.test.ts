import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatters';

describe('formatCurrency', () => {
  it('should format positive numbers as USD currency', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
    expect(formatCurrency(1234567)).toBe('$1,234,567');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('should format negative numbers correctly', () => {
    expect(formatCurrency(-500)).toBe('-$500');
    expect(formatCurrency(-1234)).toBe('-$1,234');
  });

  it('should format decimal numbers without fraction digits', () => {
    expect(formatCurrency(1000.99)).toBe('$1,001');
    expect(formatCurrency(1000.49)).toBe('$1,000');
  });

  it('should handle large numbers', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000');
    expect(formatCurrency(1000000000)).toBe('$1,000,000,000');
  });

  it('should handle small decimal values', () => {
    expect(formatCurrency(0.99)).toBe('$1');
    expect(formatCurrency(0.49)).toBe('$0');
  });
});
