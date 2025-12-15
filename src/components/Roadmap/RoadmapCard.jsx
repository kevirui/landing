/**
 * RoadmapCard Component
 * Displays a single phase card in the roadmap carousel
 */

import SparkleIcon from '@components/icons/SparkleIcon.jsx';

export default function RoadmapCard({
  phase,
  quarter,
  keyFeaturesLabel = 'Características clave:',
  icon: Icon = SparkleIcon,
}) {
  const phaseId = phase.id || `phase-${phase.title}`;

  return (
    <div className="roadmap-card bg-white dark:bg-[#1B4D3E] rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl p-4 sm:p-5 md:p-8 lg:p-10 w-full max-w-[320px] sm:max-w-[400px] md:max-w-2xl lg:max-w-4xl mx-auto flex flex-col">
      <div className="flex justify-between items-start mb-4 sm:mb-5 md:mb-6">
        {quarter && (
          <span className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-lg text-xs sm:text-sm md:text-base font-semibold text-white bg-[#10260d]">
            {quarter.label}
          </span>
        )}
        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center bg-[#10260d]">
          <Icon />
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-montserrat font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">
        {phase.title}
      </h3>

      <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-5 sm:mb-6 md:mb-7 leading-relaxed">
        {phase.description}
      </p>

      <div>
        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-3.5 sm:mb-4 md:mb-5">
          {keyFeaturesLabel}
        </h4>
        <div className="space-y-3 sm:space-y-3.5 md:space-y-4">
          {phase.milestones.map((milestone, milestoneIndex) => {
            const milestoneId =
              milestone.id || `${phaseId}-milestone-${milestoneIndex}`;
            return (
              <div
                key={milestoneId}
                className="flex items-start gap-3 sm:gap-3.5 md:gap-4"
              >
                <div
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full mt-1.5 sm:mt-2 md:mt-2.5 shrink-0"
                  style={{
                    backgroundColor: 'var(--color-tertiary)',
                  }}
                ></div>
                <p
                  className="text-sm sm:text-base md:text-lg lg:text-xl flex-1 leading-relaxed"
                  style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  {milestone.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
