import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import RoadmapCard from './RoadmapCard.jsx';

const RoadmapCarousel = forwardRef(
  (
    {
      phases,
      quarters,
      currentIndex: externalIndex,
      onIndexChange,
      keyFeaturesLabel = 'Características clave:',
    },
    ref
  ) => {
    // Use external index as source of truth when available
    const currentIndex = externalIndex ?? 0;
    const [mouseStart, setMouseStart] = useState(null);
    const [mouseEnd, setMouseEnd] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const carouselRef = useRef(null);
    const currentIndexRef = useRef(currentIndex);
    const touchStartRef = useRef(null);
    const touchEndRef = useRef(null);

    // Minimum swipe distance (in pixels)
    const minSwipeDistance = 50;
    const touchStartY = useRef(null);

    // Update ref when currentIndex changes
    useEffect(() => {
      currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    // Navigation helper function
    const navigateTo = useCallback(
      newIndex => {
        if (newIndex >= 0 && newIndex < phases.length) {
          onIndexChange?.(newIndex);
        }
      },
      [phases.length, onIndexChange]
    );

    // Touch handlers
    const onTouchStart = e => {
      const touch = e.targetTouches[0];
      touchEndRef.current = null;
      touchStartRef.current = touch.clientX;
      touchStartY.current = touch.clientY;
    };

    const onTouchMove = e => {
      if (touchStartRef.current === null) return;
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartRef.current);
      const deltaY = Math.abs(touch.clientY - (touchStartY.current || 0));

      // Only prevent default if horizontal swipe is dominant
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
      touchEndRef.current = touch.clientX;
    };

    const onTouchEnd = useCallback(() => {
      if (touchStartRef.current === null || touchEndRef.current === null) {
        touchStartRef.current = null;
        touchEndRef.current = null;
        touchStartY.current = null;
        return;
      }
      const distance = touchStartRef.current - touchEndRef.current;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      const currentIdx = currentIndexRef.current;

      if (isLeftSwipe) {
        navigateTo(currentIdx + 1);
      } else if (isRightSwipe) {
        navigateTo(currentIdx - 1);
      }

      touchStartRef.current = null;
      touchEndRef.current = null;
      touchStartY.current = null;
    }, [navigateTo]);

    // Mouse handlers for desktop drag
    const onMouseDown = e => {
      setIsDragging(true);
      setMouseEnd(null);
      setMouseStart(e.clientX);
      e.preventDefault();
    };

    const onMouseMove = e => {
      if (!isDragging || mouseStart === null) return;
      setMouseEnd(e.clientX);
    };

    const onMouseUp = useCallback(() => {
      if (!mouseStart || !mouseEnd) {
        setIsDragging(false);
        return;
      }
      const distance = mouseStart - mouseEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe) {
        navigateTo(currentIndex + 1);
      } else if (isRightSwipe) {
        navigateTo(currentIndex - 1);
      }

      setIsDragging(false);
      setMouseStart(null);
      setMouseEnd(null);
    }, [mouseStart, mouseEnd, currentIndex, navigateTo]);

    // Register touch event listeners manually with passive: false
    useEffect(() => {
      const element = carouselRef.current;
      if (!element) return;

      // Register touch events - only touchmove needs passive: false for preventDefault
      element.addEventListener('touchstart', onTouchStart, { passive: true });
      element.addEventListener('touchmove', onTouchMove, { passive: false });
      element.addEventListener('touchend', onTouchEnd, { passive: true });

      return () => {
        element.removeEventListener('touchstart', onTouchStart);
        element.removeEventListener('touchmove', onTouchMove);
        element.removeEventListener('touchend', onTouchEnd);
      };
    }, [onTouchEnd]);

    // Prevent text selection while dragging
    useEffect(() => {
      if (isDragging) {
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
      } else {
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
      return () => {
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }, [isDragging]);

    // Keyboard navigation
    useEffect(() => {
      const handleKeyDown = e => {
        if (e.key === 'ArrowLeft') {
          navigateTo(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
          navigateTo(currentIndex + 1);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, navigateTo]);

    // Expose goToSlide to parent component via ref
    useImperativeHandle(ref, () => ({
      goToSlide: index => {
        navigateTo(index);
      },
      getCurrentIndex: () => currentIndex,
    }));

    return (
      <div className="relative w-full -mx-2 sm:-mx-3 md:mx-0 text-white">
        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className={`roadmap-carousel-container relative overflow-hidden ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <div
            className="roadmap-carousel-slide flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {phases.map((phase, index) => {
              const phaseId = phase.id || `phase-${index}`;
              return (
                <div
                  key={phaseId}
                  className="min-w-full shrink-0 px-2 sm:px-3 md:px-6 flex justify-center"
                >
                  <RoadmapCard
                    phase={phase}
                    quarter={quarters[index]}
                    keyFeaturesLabel={keyFeaturesLabel}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

RoadmapCarousel.displayName = 'RoadmapCarousel';

export default RoadmapCarousel;
