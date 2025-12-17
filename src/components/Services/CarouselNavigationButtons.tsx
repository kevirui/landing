import React from 'react';

interface CarouselNavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
}

export const CarouselNavigationButtons: React.FC<
  CarouselNavigationButtonsProps
> = ({ onPrevious, onNext }) => {
  return (
    <>
      <div className="navigation-buttons flex justify-center gap-4 mt-8">
        <button
          onClick={onPrevious}
          className="nav-button nav-button-prev flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 border-2 border-white/20 text-white cursor-pointer transition-all duration-300 ease-in-out backdrop-blur-[10px] hover:bg-white/20 hover:border-white/40 hover:scale-110 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] active:scale-95"
          aria-label="Previous slide"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          onClick={onNext}
          className="nav-button nav-button-next flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 border-2 border-white/20 text-white cursor-pointer transition-all duration-300 ease-in-out backdrop-blur-[10px] hover:bg-white/20 hover:border-white/40 hover:scale-110 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] active:scale-95"
          aria-label="Next slide"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <style>{`
        .nav-button svg {
          transition: transform 0.3s ease;
        }

        .nav-button:hover svg {
          transform: translateX(0);
        }

        .nav-button-prev:hover svg {
          transform: translateX(-2px);
        }

        .nav-button-next:hover svg {
          transform: translateX(2px);
        }
      `}</style>
    </>
  );
};
