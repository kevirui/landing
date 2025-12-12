import { useState, useRef } from 'react';
import Timeline from '@components/Roadmap/Timeline.jsx';
import RoadmapCarousel from '@components/Roadmap/RoadmapCarousel.jsx';

export default function RoadmapContainer({ quarters, phases }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const handleQuarterClick = index => {
    if (index < phases.length) {
      setCurrentIndex(index);
      if (carouselRef.current) {
        carouselRef.current.goToSlide(index);
      }
    }
  };

  const handleIndexChange = index => {
    setCurrentIndex(index);
  };

  return (
    <>
      {/* Timeline */}
      <Timeline
        quarters={quarters}
        currentIndex={currentIndex}
        onQuarterClick={handleQuarterClick}
      />

      {/* Roadmap Carousel */}
      <RoadmapCarousel
        ref={carouselRef}
        phases={phases}
        quarters={quarters}
        currentIndex={currentIndex}
        onIndexChange={handleIndexChange}
      />
    </>
  );
}
