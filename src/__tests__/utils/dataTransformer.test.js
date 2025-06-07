import { describe, it, expect } from 'vitest';
import { toFahrenheit, toCelsius } from '../../utils/dataTransformer';

describe('Temperature Conversion Utilities', () => {
  it('converts Celsius to Fahrenheit correctly', () => {
    expect(toFahrenheit(0)).toBe(32);
    expect(toFahrenheit(100)).toBe(212);
    expect(toFahrenheit(-10)).toBe(14);
  });

  it('converts Fahrenheit to Celsius correctly', () => {
    expect(toCelsius(32)).toBe(0);
    expect(toCelsius(212)).toBe(100);
    expect(toCelsius(14)).toBe(-10);
  });
});