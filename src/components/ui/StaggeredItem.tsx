import { useEffect, useRef, useState, type ReactNode } from 'react';

interface StaggeredItemProps {
  children: ReactNode;
  index: number;
  baseDelay?: number;
  staggerDelay?: number;
  className?: string;
}

export function StaggeredItem({
  children,
  index,
  baseDelay = 0,
  staggerDelay = 100,
  className = '',
}: StaggeredItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Add staggered delay based on index
            const delay = baseDelay + index * staggerDelay;
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [index, baseDelay, staggerDelay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
}
