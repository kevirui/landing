import React, { useState, useEffect } from 'react';

const AnimatedCyclePhase = ({ phases, interval = 5000 }) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentPhaseIndex(prevIndex => (prevIndex + 1) % phases.length);

        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 400);
    }, interval);

    return () => clearInterval(timer);
  }, [phases.length, interval]);

  const prevPhaseIndex =
    (currentPhaseIndex - 1 + phases.length) % phases.length;
  const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;

  const prevPhase = phases[prevPhaseIndex];
  const currentPhase = phases[currentPhaseIndex];
  const nextPhase = phases[nextPhaseIndex];

  const getNodeVariant = (phaseIndex, nodeIndex) => {
    if (phaseIndex === 0) {
      return nodeIndex === 1 ? 'light' : nodeIndex === 3 ? 'gray' : 'dark';
    } else if (phaseIndex === 1) {
      return nodeIndex % 2 === 0 ? 'light' : 'dark';
    } else {
      return nodeIndex % 2 === 0 ? 'dark' : 'light';
    }
  };

  const getNodeClasses = variant => {
    if (variant === 'light') {
      return 'bg-white text-black shadow-lg';
    } else if (variant === 'gray') {
      return 'bg-[#E8E8E8] text-black shadow-md';
    } else {
      return 'bg-[#4B9C8E] text-white shadow-lg';
    }
  };

  const renderPhaseCard = (phase, phaseIndex, position) => {
    const isCenter = position === 'current';
    const isPrev = position === 'prev';
    const isNext = position === 'next';

    const positionClasses = isCenter
      ? 'translate-x-0 scale-100 opacity-100 blur-0 z-20'
      : isPrev
        ? '-translate-x-[80%] scale-80 opacity-50 blur-[2px] z-10'
        : 'translate-x-[80%] scale-80 opacity-50 blur-[2px] z-10';

    const contentOpacity =
      isCenter && !isTransitioning
        ? 'opacity-100'
        : isCenter && isTransitioning
          ? 'opacity-0'
          : 'opacity-60';
    const contentTransform =
      isCenter && !isTransitioning
        ? 'translate-y-0'
        : isCenter && isTransitioning
          ? 'translate-y-2'
          : 'translate-y-0';

    return (
      <div
        className={`absolute inset-0 transition-all duration-[800ms] ease-in-out ${positionClasses}`}
        style={{
          pointerEvents: isCenter ? 'auto' : 'none',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="bg-[#1A5F38] rounded-2xl p-8 h-full shadow-2xl">
          <div
            className={`transition-all duration-500 ease-in-out ${contentOpacity} ${contentTransform}`}
          >
            <h3 className="text-2xl font-bold mb-4 text-white">
              {phase.title}
            </h3>
            <p className="text-sm mb-12 max-w-2xl text-white">
              {phase.description}
            </p>
          </div>

          <div className="relative py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative">
              <svg
                className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 hidden md:block pointer-events-none"
                style={{ zIndex: 1 }}
                preserveAspectRatio="none"
                viewBox="0 0 1000 100"
              >
                <path
                  d="M 60 50 Q 200 20, 333 50 T 666 50 T 940 50"
                  fill="none"
                  stroke="black"
                  strokeWidth="3"
                  strokeDasharray="15 10"
                  opacity="0.5"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-50"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>

                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                  <g key={i}>
                    <polygon points="0,-6 15,0 0,6" fill="#4B9C8E">
                      <animateMotion
                        dur="5s"
                        repeatCount="indefinite"
                        begin={`${i * 0.7}s`}
                        path="M 60 50 Q 200 20, 333 50 T 666 50 T 940 50"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;0.05;0.92;1"
                        dur="5s"
                        repeatCount="indefinite"
                        begin={`${i * 0.7}s`}
                      />
                    </polygon>
                  </g>
                ))}
              </svg>

              {phase.nodes.map((node, index) => {
                const variant = getNodeVariant(phaseIndex, index);
                const nodeClasses = getNodeClasses(variant);

                const nodeAnimation =
                  isCenter && !isTransitioning
                    ? 'scale-100 opacity-100'
                    : isCenter && isTransitioning
                      ? 'scale-95 opacity-80'
                      : 'scale-90 opacity-70';

                return (
                  <div
                    key={index}
                    className="relative flex flex-col items-center"
                    style={{ zIndex: 10 }}
                  >
                    <div
                      className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center text-center p-4 transition-all duration-500 ease-out ${nodeClasses} ${nodeAnimation}`}
                      style={{
                        transitionProperty:
                          'transform, opacity, background-color, box-shadow',
                      }}
                    >
                      <span className="text-sm font-bold leading-tight transition-all duration-300">
                        {node}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative w-full overflow-visible"
      style={{ minHeight: '500px' }}
    >
      {renderPhaseCard(prevPhase, prevPhaseIndex, 'prev')}

      {renderPhaseCard(currentPhase, currentPhaseIndex, 'current')}

      {renderPhaseCard(nextPhase, nextPhaseIndex, 'next')}
    </div>
  );
};

export default AnimatedCyclePhase;
