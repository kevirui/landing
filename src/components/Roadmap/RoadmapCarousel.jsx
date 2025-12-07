import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';

const RoadmapCarousel = forwardRef(
  ({ phases, quarters, currentIndex: externalIndex, onIndexChange }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(externalIndex ?? 0);
    const [mouseStart, setMouseStart] = useState(null);
    const [mouseEnd, setMouseEnd] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const carouselRef = useRef(null);
    const prevExternalIndexRef = useRef(externalIndex);
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

    const onTouchEnd = () => {
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

      if (isLeftSwipe && currentIdx < phases.length - 1) {
        const newIndex = currentIdx + 1;
        setCurrentIndex(newIndex);
        if (onIndexChange) {
          onIndexChange(newIndex);
        }
      }
      if (isRightSwipe && currentIdx > 0) {
        const newIndex = currentIdx - 1;
        setCurrentIndex(newIndex);
        if (onIndexChange) {
          onIndexChange(newIndex);
        }
      }

      touchStartRef.current = null;
      touchEndRef.current = null;
      touchStartY.current = null;
    };

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

    const onMouseUp = () => {
      if (!mouseStart || !mouseEnd) {
        setIsDragging(false);
        return;
      }
      const distance = mouseStart - mouseEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe && currentIndex < phases.length - 1) {
        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        if (onIndexChange) {
          onIndexChange(newIndex);
        }
      }
      if (isRightSwipe && currentIndex > 0) {
        const newIndex = currentIndex - 1;
        setCurrentIndex(newIndex);
        if (onIndexChange) {
          onIndexChange(newIndex);
        }
      }

      setIsDragging(false);
      setMouseStart(null);
      setMouseEnd(null);
    };

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phases.length]);

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
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
          const newIndex = currentIndex - 1;
          setCurrentIndex(newIndex);
          if (onIndexChange) {
            onIndexChange(newIndex);
          }
        } else if (e.key === 'ArrowRight' && currentIndex < phases.length - 1) {
          const newIndex = currentIndex + 1;
          setCurrentIndex(newIndex);
          if (onIndexChange) {
            onIndexChange(newIndex);
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, phases.length, onIndexChange]);

    // Sync with external index if provided
    useEffect(() => {
      if (
        externalIndex !== undefined &&
        externalIndex !== prevExternalIndexRef.current &&
        externalIndex !== currentIndex
      ) {
        prevExternalIndexRef.current = externalIndex;
        // Defer state update to avoid synchronous setState in effect
        window.setTimeout(() => {
          setCurrentIndex(externalIndex);
        }, 0);
      }
    }, [externalIndex, currentIndex]);

    // Expose goToSlide to parent component via ref
    useImperativeHandle(ref, () => ({
      goToSlide: index => {
        setCurrentIndex(index);
        if (onIndexChange) {
          onIndexChange(index);
        }
      },
      getCurrentIndex: () => currentIndex,
    }));

    return (
      <div className="relative w-full -mx-2 sm:-mx-3 md:mx-0">
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
              const currentQuarter = quarters[index];
              return (
                <div
                  key={index}
                  className="min-w-full shrink-0 px-2 sm:px-3 md:px-6 flex justify-center"
                >
                  <div className="roadmap-card bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl p-4 sm:p-5 md:p-8 lg:p-10 w-full max-w-[320px] sm:max-w-[400px] md:max-w-2xl lg:max-w-4xl mx-auto flex flex-col">
                    {/* Header with quarter tag */}
                    <div className="flex justify-between items-start mb-4 sm:mb-5 md:mb-6">
                      {currentQuarter && (
                        <span
                          className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-lg text-xs sm:text-sm md:text-base font-semibold text-white"
                          style={{ backgroundColor: '#2E7D32' }}
                        >
                          {currentQuarter.label}
                        </span>
                      )}
                      <div
                        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: '#2E7D32' }}
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Card Title */}
                    <h3
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-montserrat font-bold mb-2 sm:mb-3 md:mb-4 leading-tight"
                      style={{ color: '#1a1a1a' }}
                    >
                      {phase.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm sm:text-base md:text-lg lg:text-xl mb-5 sm:mb-6 md:mb-7 leading-relaxed"
                      style={{ color: '#666666' }}
                    >
                      {phase.description}
                    </p>

                    {/* Key Features Section */}
                    <div>
                      <h4
                        className="text-sm sm:text-base md:text-lg font-semibold mb-3.5 sm:mb-4 md:mb-5"
                        style={{ color: '#333333' }}
                      >
                        Características clave:
                      </h4>
                      <div className="space-y-3 sm:space-y-3.5 md:space-y-4">
                        {phase.milestones.map((milestone, milestoneIndex) => (
                          <div
                            key={milestoneIndex}
                            className="flex items-start gap-3 sm:gap-3.5 md:gap-4"
                          >
                            <div
                              className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full mt-1.5 sm:mt-2 md:mt-2.5 shrink-0"
                              style={{ backgroundColor: '#2E7D32' }}
                            ></div>
                            <p
                              className={`text-sm sm:text-base md:text-lg lg:text-xl flex-1 leading-relaxed ${
                                milestone.completed
                                  ? 'text-gray-800'
                                  : 'text-gray-700'
                              }`}
                              style={{
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                              }}
                            >
                              {milestone.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
