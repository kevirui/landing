import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { render } from '@testing-library/react';
import { useRipple, RippleContainer } from './Ripple';

describe('useRipple hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with empty ripples array', () => {
    const { result } = renderHook(() => useRipple());
    expect(result.current.ripples).toEqual([]);
  });

  it('should create ripple on mouse event', () => {
    const { result } = renderHook(() => useRipple());

    const mockElement = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
      }),
    };

    const mockEvent = {
      currentTarget: mockElement,
      clientX: 50,
      clientY: 50,
    };

    act(() => {
      result.current.createRipple(mockEvent);
    });

    expect(result.current.ripples).toHaveLength(1);
    expect(result.current.ripples[0]).toMatchObject({
      x: expect.any(Number),
      y: expect.any(Number),
      size: expect.any(Number),
    });
  });

  it('should calculate ripple size based on element dimensions', () => {
    const { result } = renderHook(() => useRipple());

    const mockElement = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 50,
      }),
    };

    const mockEvent = {
      currentTarget: mockElement,
      clientX: 50,
      clientY: 25,
    };

    act(() => {
      result.current.createRipple(mockEvent);
    });

    // Size should be max(width, height) * 2 = 100 * 2 = 200
    expect(result.current.ripples[0].size).toBe(200);
  });

  it('should remove ripple after 600ms timeout', () => {
    const { result } = renderHook(() => useRipple());

    const mockElement = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
      }),
    };

    const mockEvent = {
      currentTarget: mockElement,
      clientX: 50,
      clientY: 50,
    };

    act(() => {
      result.current.createRipple(mockEvent);
    });

    expect(result.current.ripples).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(result.current.ripples).toHaveLength(0);
  });

  it('should handle multiple ripples', () => {
    const { result } = renderHook(() => useRipple());

    const mockElement = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
      }),
    };

    const createMockEvent = (x: number, y: number) => ({
      currentTarget: mockElement,
      clientX: x,
      clientY: y,
    });

    act(() => {
      result.current.createRipple(createMockEvent(25, 25));
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      result.current.createRipple(createMockEvent(75, 75));
    });

    expect(result.current.ripples).toHaveLength(2);

    // Advance time to remove first ripple (500ms remaining)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.ripples).toHaveLength(1);

    // Advance time to remove second ripple
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.ripples).toHaveLength(0);
  });
});

describe('RippleContainer component', () => {
  it('should render without ripples', () => {
    const { container } = render(<RippleContainer ripples={[]} />);
    const span = container.querySelector('span');
    expect(span).toBeTruthy();
    expect(span?.children.length).toBe(0);
  });

  it('should render single ripple', () => {
    const ripples = [{ x: 10, y: 20, size: 100 }];
    const { container } = render(<RippleContainer ripples={ripples} />);
    const rippleElements = container.querySelectorAll('span > span');
    expect(rippleElements.length).toBe(1);
  });

  it('should render multiple ripples', () => {
    const ripples = [
      { x: 10, y: 20, size: 100 },
      { x: 30, y: 40, size: 150 },
      { x: 50, y: 60, size: 200 },
    ];
    const { container } = render(<RippleContainer ripples={ripples} />);
    const rippleElements = container.querySelectorAll('span > span');
    expect(rippleElements.length).toBe(3);
  });

  it('should apply correct inline styles to ripples', () => {
    const ripples = [{ x: 15, y: 25, size: 120 }];
    const { container } = render(<RippleContainer ripples={ripples} />);
    const rippleElement = container.querySelector('span > span') as HTMLElement;

    expect(rippleElement?.style.left).toBe('15px');
    expect(rippleElement?.style.top).toBe('25px');
    expect(rippleElement?.style.width).toBe('120px');
    expect(rippleElement?.style.height).toBe('120px');
  });

  it('should have proper CSS classes', () => {
    const ripples = [{ x: 10, y: 20, size: 100 }];
    const { container } = render(<RippleContainer ripples={ripples} />);

    const containerSpan = container.querySelector('span');
    expect(containerSpan?.className).toContain('absolute');
    expect(containerSpan?.className).toContain('overflow-hidden');

    const rippleElement = container.querySelector('span > span');
    expect(rippleElement?.className).toContain('animate-ripple');
    expect(rippleElement?.className).toContain('rounded-full');
  });
});
