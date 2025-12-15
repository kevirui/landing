import { useState, useEffect, useLayoutEffect, useRef } from 'react';

interface MetricModalProps {
  id: string;
  value: string;
  label: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

type AnimationState = 'closed' | 'opening' | 'open' | 'closing';

export default function MetricModal({
  id,
  value,
  label,
  description,
  imageSrc,
  imageAlt,
}: MetricModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [animationState, setAnimationState] =
    useState<AnimationState>('closed');
  const modalRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<number | null>(null);

  // Handle open/close transitions
  // This pattern is intentional for enter/exit animations - we need to synchronously
  // update animationState when isOpen changes to trigger the animation flow
  useLayoutEffect(() => {
    if (isOpen && animationState === 'closed') {
      setAnimationState('opening');
    } else if (!isOpen && animationState === 'open') {
      setAnimationState('closing');
    }
  }, [isOpen, animationState]);

  useEffect(() => {
    if (animationState === 'opening') {
      // Trigger animation after mount
      animationTimeoutRef.current = requestAnimationFrame(() => {
        setAnimationState('open');
      });
    } else if (animationState === 'closing') {
      // Wait for animation to complete
      animationTimeoutRef.current = window.setTimeout(() => {
        setAnimationState('closed');
      }, 300);
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        cancelAnimationFrame(animationTimeoutRef.current);
      }
    };
  }, [animationState]);

  // Listen for open events from outside
  useEffect(() => {
    const handleOpenModal = (e: CustomEvent<{ modalId: string }>) => {
      if (e.detail?.modalId === id) {
        setIsOpen(true);
      }
    };

    window.addEventListener(
      `open-modal-${id}`,
      handleOpenModal as EventListener
    );
    return () => {
      window.removeEventListener(
        `open-modal-${id}`,
        handleOpenModal as EventListener
      );
    };
  }, [id]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && e.target === modalRef.current) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Derive render and visibility states from animationState
  const shouldRender = animationState !== 'closed';
  const isVisible = animationState === 'open';

  if (!shouldRender) return null;

  return (
    <div
      ref={modalRef}
      className={`modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 text-white transition-opacity duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      data-modal
    >
      <div
        className={`relative w-full max-w-5xl rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[300px] sm:aspect-video transition-all duration-300 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Background Image */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/40 z-0"></div>

        {/* Close button */}
        <button
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 rounded-full bg-black/50 backdrop-blur-sm p-1.5 sm:p-2 transition-colors hover:bg-black/70"
          onClick={() => setIsOpen(false)}
          aria-label="Cerrar modal"
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-8 md:p-10 lg:p-12">
          {/* Metric Block */}
          <div className="mt-8 mb-3 sm:mt-0">
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-montserrat font-bold mb-1 sm:mb-2">
              {value}
            </p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-montserrat font-semibold">
              {label}
            </p>
          </div>

          {/* Description Block */}
          <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl mt-auto">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
