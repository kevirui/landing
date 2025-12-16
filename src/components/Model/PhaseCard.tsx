interface PhaseCardProps {
  phase: number;
  description: string;
  variant: 'base' | 'scale' | 'mature';
  year: number;
  phaseLabel: string;
  phaseName: string;
}

export default function PhaseCard({
  phase,
  description,
  variant,
  year,
  phaseLabel,
  phaseName,
}: PhaseCardProps) {
  const variantConfig = {
    base: {
      borderColor: 'border-blue-500/30',
      bgGradient: 'from-blue-500/10 to-transparent',
      badgeBg: 'bg-blue-500/20',
      badgeText: 'text-blue-300',
      badgeBorder: 'border-blue-500/50',
      icon: '🚀',
    },
    scale: {
      borderColor: 'border-purple-500/30',
      bgGradient: 'from-purple-500/10 to-transparent',
      badgeBg: 'bg-purple-500/20',
      badgeText: 'text-purple-300',
      badgeBorder: 'border-purple-500/50',
      icon: '📈',
    },
    mature: {
      borderColor: 'border-green-500/30',
      bgGradient: 'from-green-500/10 to-transparent',
      badgeBg: 'bg-green-500/20',
      badgeText: 'text-green-300',
      badgeBorder: 'border-green-500/50',
      icon: '🎯',
    },
  };

  const config = variantConfig[variant];

  return (
    <div
      className={`relative bg-black/80 backdrop-blur-sm border ${config.borderColor} rounded-xl shadow-lg p-6 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${config.bgGradient} opacity-50`}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl">{config.icon}</span>
          <span
            className={`text-xs px-3 py-1 rounded-full font-bold border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`}
          >
            {phaseLabel} {phase}
          </span>
        </div>

        {/* Phase Name */}
        <h4 className="text-lg font-bold text-white mb-3">
          {year} - {phaseName}
        </h4>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed">{description}</p>

        {/* Decorative bar */}
        <div className="mt-4 h-1 w-20 bg-linear-to-r from-white/50 to-transparent rounded-full"></div>
      </div>
    </div>
  );
}
