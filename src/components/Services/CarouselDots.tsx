import React from 'react';

interface CarouselDotsProps {
  totalDots: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

export const CarouselDots: React.FC<CarouselDotsProps> = ({
  totalDots,
  currentIndex,
  onDotClick,
}) => {
  return (
    <div className="dot-indicators flex justify-center gap-3 mt-6">
      {Array.from({ length: totalDots }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`p-0 cursor-pointer transition-all duration-300 ease-in-out border-2 rounded-full hover:scale-125 ${
            index === currentIndex
              ? 'w-8 md:w-8 h-3 md:h-3 bg-white border-white rounded-md shadow-[0_2px_8px_rgba(255,255,255,0.3)]'
              : 'w-3 md:w-3 h-3 md:h-3 bg-white/30 border-white/40 hover:bg-white/50'
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};
