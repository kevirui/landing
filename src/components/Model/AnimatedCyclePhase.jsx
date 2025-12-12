import React, { useState, useEffect } from 'react';

const AnimatedCyclePhase = ({ phases, interval = 5000 }) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhaseIndex(prevIndex => (prevIndex + 1) % phases.length);
    }, interval);

    return () => clearInterval(timer);
  }, [phases.length, interval]);

  const currentPhase = phases[currentPhaseIndex];

  const getNodeVariant = index => {
    if (currentPhaseIndex === 0) {
      return index === 1 ? 'light' : index === 3 ? 'gray' : 'dark';
    } else if (currentPhaseIndex === 1) {
      return index % 2 === 0 ? 'light' : 'dark';
    } else {
      return index % 2 === 0 ? 'dark' : 'light';
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

  return (
    <div className="bg-[#1A5F38] rounded-2xl p-8 relative overflow-hidden">
      <div className="transition-opacity duration-500" key={currentPhaseIndex}>
        <h3 className="text-2xl font-bold mb-4 text-white">
          {currentPhase.title}
        </h3>
        <p className="text-sm mb-12 max-w-2xl text-white">
          {currentPhase.description}
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

          {currentPhase.nodes.map((node, index) => {
            const variant = getNodeVariant(index);
            const nodeClasses = getNodeClasses(variant);

            return (
              <div
                key={index}
                className="relative flex flex-col items-center"
                style={{ zIndex: 10 }}
              >
                <div
                  className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center text-center p-4 transition-all duration-500 ${nodeClasses}`}
                >
                  <span className="text-sm font-bold leading-tight">
                    {node}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimatedCyclePhase;
