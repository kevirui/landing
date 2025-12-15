import { Lightbulb } from 'lucide-react';
import { formatCurrency } from '@utils/formatters';
import type { ProyeccionTranslations, Scenario } from './ProyeccionDashboard';

interface ScenarioCardProps {
  scenario: Scenario;
  translations: ProyeccionTranslations;
  variant: 'base' | 'scale' | 'mature';
}

export default function ScenarioCard({
  scenario,
  translations: t,
  variant,
}: ScenarioCardProps) {
  const isBase = variant === 'base';

  const variantStyles = {
    base: {
      keyCostBg: 'bg-slate-100',
      keyCostText: 'text-slate-700',
      keyCostValueText: 'text-slate-900',
      badgeBg: 'bg-slate-300',
      badgeText: 'text-slate-800',
    },
    scale: {
      keyCostBg: 'bg-indigo-50 border border-indigo-100',
      keyCostText: 'text-indigo-800',
      keyCostValueText: 'text-indigo-900',
      badgeBg: 'bg-indigo-200',
      badgeText: 'text-indigo-900',
    },
    mature: {
      keyCostBg: 'bg-green-50 border border-green-100',
      keyCostText: 'text-green-800',
      keyCostValueText: 'text-green-900',
      badgeBg: 'bg-green-200',
      badgeText: 'text-green-900',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl shadow-sm p-6">
      <h4 className="text-xl font-bold text-white mb-2">
        {scenario.year}{' '}
        <span className="text-sm font-normal text-slate-300">
          ({scenario.ngos} {t.ngosLabel})
        </span>
      </h4>
      <div className="text-xs text-slate-300 mb-4">
        {t.fundsManaged}:{' '}
        <span className="text-white font-mono">
          {formatCurrency(scenario.funds)}
        </span>
      </div>

      <div className="space-y-4">
        <div className={`p-3 rounded-lg ${styles.keyCostBg}`}>
          <div className="flex justify-between items-center mb-1">
            <div
              className={`text-xs uppercase font-bold ${styles.keyCostText}`}
            >
              {t.keyCost}
            </div>
            <span
              className={`text-xs px-2 rounded-full font-bold ${styles.badgeBg} ${styles.badgeText}`}
            >
              {isBase ? t.base : '+25%'}
            </span>
          </div>
          <div className={`text-xl font-bold ${styles.keyCostValueText}`}>
            {formatCurrency(scenario.keyTotalCost)}
          </div>
        </div>

        {isBase ? (
          <div className="p-3 bg-slate-200/20 rounded-lg border border-slate-500/30">
            <div className="flex justify-between items-center mb-1">
              <div className="text-xs text-slate-300 uppercase font-bold flex items-center gap-1">
                <Lightbulb size={12} /> {t.dao} (0%)
              </div>
            </div>
            <div className="text-xl font-bold text-slate-400">$0</div>
          </div>
        ) : (
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex justify-between items-center mb-1">
              <div className="text-xs text-orange-800 uppercase font-bold flex items-center gap-1">
                <Lightbulb size={12} /> {t.dao}
              </div>
              <span className="text-xs bg-orange-200 text-orange-900 px-2 rounded-full font-bold">
                {scenario.daoPercentageUsed}%
              </span>
            </div>
            <div
              className={`font-bold text-orange-700 ${variant === 'mature' ? 'text-2xl' : 'text-xl'}`}
            >
              {formatCurrency(scenario.daoAmount)}
            </div>
            <div className="text-[10px] text-orange-600 mt-1">{t.rndFund}</div>
          </div>
        )}
      </div>
    </div>
  );
}
