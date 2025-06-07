import { describe, it, expect, vi } from 'vitest';
import { debounce } from '../../utils/debounce';

describe('debounce utility', () => {
  it('should only call the function after the delay', () => {
    vi.useFakeTimers();
    const func = vi.fn();
    const debouncedFunc = debounce(func, 300);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(func).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(func).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});