import { useState, useCallback, type MouseEvent } from 'react';

interface RippleProps {
  x: number;
  y: number;
  size: number;
}

interface UseRippleReturn {
  ripples: RippleProps[];
  createRipple: (e: MouseEvent<HTMLElement>) => void;
}

export function useRipple(): UseRippleReturn {
  const [ripples, setRipples] = useState<RippleProps[]>([]);

  const createRipple = useCallback((e: MouseEvent<HTMLElement>) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();

    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple: RippleProps = { x, y, size };
    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.slice(1));
    }, 600);
  }, []);

  return { ripples, createRipple };
}

interface RippleContainerProps {
  ripples: RippleProps[];
}

export function RippleContainer({ ripples }: RippleContainerProps) {
  return (
    <span className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {ripples.map((ripple, index) => (
        <span
          key={index}
          className="absolute animate-ripple rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </span>
  );
}
