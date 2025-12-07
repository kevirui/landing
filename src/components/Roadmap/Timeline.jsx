export default function Timeline({ quarters, currentIndex, onQuarterClick }) {
  return (
    <div className="relative w-full mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-1 sm:px-2 md:px-4">
      {/* Timeline line */}
      <div className="absolute top-5 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 lg:left-12 right-4 sm:right-6 md:right-8 lg:right-12 h-0.5 sm:h-1 border-t-2 border-dashed border-white/40 sm:border-white/30"></div>
      
      {/* Timeline points */}
      <div className="relative flex justify-between items-start px-0">
        {quarters.map((quarter, index) => (
          <div key={index} className="flex flex-col items-center flex-1 min-w-0">
            {/* Timeline point */}
            <button
              onClick={() => onQuarterClick && onQuarterClick(index)}
              className={`roadmap-timeline-button relative z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 ${
                quarter.completed
                  ? 'bg-[#4A9B7F] border-2 sm:border-[3px] border-[#4A9B7F] shadow-lg'
                  : currentIndex === index
                  ? 'bg-white/30 border-2 sm:border-[3px] border-white shadow-md'
                  : 'bg-transparent border-2 sm:border-[3px] border-white/60'
              }`}
              aria-label={`Ir a ${quarter.label}`}
            >
              {quarter.completed && (
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
            {/* Quarter label */}
            <div className="mt-2 sm:mt-3 md:mt-4 text-white text-[10px] sm:text-xs md:text-sm lg:text-base font-montserrat font-medium text-center px-0.5 sm:px-1 leading-tight">
              {quarter.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

