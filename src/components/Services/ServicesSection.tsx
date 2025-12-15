import React from 'react';
import { ServiceCard } from './ServiceCard';
import { useCarousel } from './useCarousel';

interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  functionality: string;
  advantage: string;
  idealFor: string;
  status: 'available' | 'coming_soon';
}

interface ServicesSectionProps {
  title: string;
  description: string;
  services: Service[];
  swipeHint: string;
  ariaGoToService: string;
  labels: {
    functionality: string;
    advantage: string;
    idealFor: string;
  };
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  title,
  description,
  services,
  swipeHint,
  ariaGoToService,
  labels,
}) => {
  const {
    currentIndex,
    hasInteracted,
    containerRef,
    trackRef,
    sectionRef,
    goToSlide,
    hideSwipeHint,
    handleTouchStart,
    handleTouchEnd,
    handleMouseDown,
  } = useCarousel({
    totalSlides: services.length,
  });

  return (
    <section
      ref={sectionRef}
      className="services-section py-20 bg-primary"
      data-current-index={currentIndex}
    >
      <div className="container mx-auto px-4">
        <div className="text-left mb-16 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{title}</h2>
          <p className="text-lg md:text-xl opacity-90 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div
            ref={containerRef}
            className="carousel-container overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory hide-scrollbar"
          >
            <div
              ref={trackRef}
              className="carousel-track flex"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              style={{ cursor: 'grab', userSelect: 'none' }}
            >
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="carousel-slide min-w-full shrink-0 px-4 snap-center"
                >
                  <ServiceCard
                    title={service.title}
                    subtitle={service.subtitle}
                    description={service.description}
                    icon={service.icon}
                    functionality={service.functionality}
                    advantage={service.advantage}
                    idealFor={service.idealFor}
                    isActive={index === currentIndex}
                    labels={labels}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <p
              className={`swipe-hint text-gray-700 text-sm animate-pulse transition-opacity duration-500 ${
                hasInteracted ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ display: hasInteracted ? 'none' : 'block' }}
            >
              {swipeHint}
            </p>

            <div className="flex justify-center gap-3">
              {services.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-[#2D5A47] w-8'
                      : 'bg-[#2D5A47]/40 hover:bg-[#2D5A47]/60'
                  }`}
                  data-index={index}
                  aria-label={`${ariaGoToService} ${index + 1}`}
                  onClick={() => {
                    goToSlide(index);
                    hideSwipeHint();
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .carousel-track {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        .carousel-slide {
          flex-shrink: 0;
        }

        .carousel-dot {
          transition: all 0.3s ease;
        }

        .carousel-container {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .carousel-container::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
