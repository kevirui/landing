import { useMemo, useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { LabelProps } from 'recharts';
import { formatCurrency } from '@utils/formatters';
import ScenarioCard from './ScenarioCard';
import PhaseCard from './PhaseCard';

interface ScenarioConfig {
  year: number;
  ngos: number;
  daoPercentage: number;
}

export interface Scenario {
  year: number;
  ngos: number;
  funds: number;
  keyTotalCost: number;
  daoAmount: number;
  totalSystemCost: number;
  daoPercentageUsed: number;
  globalEfficiencyPct: number;
  daoShareOfBudget: string;
}

interface ChartDataItem {
  name: string;
  ngos: number;
  Fondos: number;
  CostoKEY: number;
  FondoDAO: number;
  globalPct: string;
  daoUsed: number;
  daoShareLabel: string;
}

interface BarLabelProps extends LabelProps {
  x?: number;
  y?: number;
  width?: number;
  value?: number;
  payload?: ChartDataItem;
}

export interface ProyeccionTranslations {
  title: string;
  subtitle: string;
  globalLabel: string;
  globalDescription: string;
  fundsManaged: string;
  keyCost: string;
  base: string;
  dao: string;
  rndFund: string;
  chartTitle: string;
  chartSubtitle: string;
  legendAUM: string;
  legendKeyCost: string;
  legendDAO: string;
  tableYear: string;
  tableFunds: string;
  tableKeyCost: string;
  tableDaoFund: string;
  tableDaoDefinition: string;
  tableGlobalPercent: string;
  daoOnKey: string;
  ngosLabel: string;
  phaseLabel?: string;
  phaseNames?: {
    base: string;
    scale: string;
    mature: string;
  };
  phases?: Array<{ description: string }>;
}

interface ProyeccionDashboardProps {
  translations: ProyeccionTranslations;
  baseFunds?: number;
  baseKeyCost?: number;
  scenarios?: ScenarioConfig[];
}

const DEFAULT_SCENARIOS: ScenarioConfig[] = [
  { year: 2026, ngos: 5, daoPercentage: 0 },
  { year: 2027, ngos: 12, daoPercentage: 5.08 },
  { year: 2028, ngos: 25, daoPercentage: 9.33 },
];

export default function ProyeccionDashboard({
  translations: t,
  baseFunds = 1440000,
  baseKeyCost = 221800,
  scenarios = DEFAULT_SCENARIOS,
}: ProyeccionDashboardProps) {
  const [barSize, setBarSize] = useState(40);

  useEffect(() => {
    const updateBarSize = () => {
      if (window.innerWidth < 640) {
        setBarSize(20);
      } else if (window.innerWidth < 1024) {
        setBarSize(30);
      } else {
        setBarSize(40);
      }
    };

    updateBarSize();
    window.addEventListener('resize', updateBarSize);
    return () => window.removeEventListener('resize', updateBarSize);
  }, []);

  const scenarioData = useMemo(() => {
    const calculateScenario = (config: ScenarioConfig): Scenario => {
      const { year, ngos, daoPercentage } = config;
      const multiplier = ngos / 5;
      const funds = baseFunds * multiplier;

      let keyTotalCost = baseKeyCost;
      if (year === 2027) keyTotalCost = baseKeyCost * 1.25;
      if (year === 2028) keyTotalCost = baseKeyCost * 1.25 * 1.25;

      const daoAmount = keyTotalCost * (daoPercentage / 100);
      const totalSystemCost = keyTotalCost + daoAmount;
      const globalEfficiencyPct = (totalSystemCost / funds) * 100;

      const daoShareOfBudget =
        daoAmount > 0
          ? ((daoAmount / totalSystemCost) * 100).toFixed(1) + '%'
          : '';

      return {
        year,
        ngos,
        funds,
        keyTotalCost,
        daoAmount,
        totalSystemCost,
        daoPercentageUsed: daoPercentage,
        globalEfficiencyPct,
        daoShareOfBudget,
      };
    };

    return scenarios.map(calculateScenario);
  }, [baseFunds, baseKeyCost, scenarios]);

  const chartData: ChartDataItem[] = useMemo(
    () =>
      scenarioData.map(s => ({
        name: s.year.toString(),
        ngos: s.ngos,
        Fondos: s.funds,
        CostoKEY: s.keyTotalCost,
        FondoDAO: s.daoAmount,
        globalPct: s.globalEfficiencyPct.toFixed(2),
        daoUsed: s.daoPercentageUsed,
        daoShareLabel: s.daoShareOfBudget,
      })),
    [scenarioData]
  );

  const [scenario2026, scenario2027, scenario2028] = scenarioData;

  const renderBarLabel = (props: BarLabelProps) => {
    const { x = 0, y = 0, width = 0, value, payload } = props;
    if (!value || value <= 0 || !payload) return null;
    const labelText = payload.daoShareLabel || '';
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill="#fb923c"
        textAnchor="middle"
        fontSize={12}
        fontWeight="bold"
      >
        {labelText}
      </text>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center bg-black/80 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-sm">
        <div>
          <h3 className="text-2xl font-bold text-white">{t.title}</h3>
          <p className="text-slate-300 mt-1">{t.subtitle}</p>
        </div>
        <div className="mt-4 md:mt-0 bg-blue-900/50 px-4 py-2 rounded-lg border border-blue-500/30">
          <span className="text-xs font-bold text-blue-300 uppercase block mb-1">
            {t.globalLabel}
          </span>
          <span className="text-sm text-blue-100">{t.globalDescription}</span>
        </div>
      </div>

      {/* Phases Cards */}
      {t.phases && t.phases.length === 3 && t.phaseLabel && t.phaseNames && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PhaseCard
            phase={1}
            description={t.phases[0].description}
            variant="base"
            year={2026}
            phaseLabel={t.phaseLabel}
            phaseName={t.phaseNames.base}
          />
          <PhaseCard
            phase={2}
            description={t.phases[1].description}
            variant="scale"
            year={2027}
            phaseLabel={t.phaseLabel}
            phaseName={t.phaseNames.scale}
          />
          <PhaseCard
            phase={3}
            description={t.phases[2].description}
            variant="mature"
            year={2028}
            phaseLabel={t.phaseLabel}
            phaseName={t.phaseNames.mature}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScenarioCard scenario={scenario2026} translations={t} variant="base" />
        <ScenarioCard
          scenario={scenario2027}
          translations={t}
          variant="scale"
        />
        <ScenarioCard
          scenario={scenario2028}
          translations={t}
          variant="mature"
        />
      </div>

      <div className="bg-black/80 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-sm">
        <h4 className="text-lg font-bold text-white mb-2">{t.chartTitle}</h4>
        <p className="text-sm text-slate-300 mb-6">{t.chartSubtitle}</p>

        <div className="h-96 w-full min-w-[300px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="name"
                tick={{ fill: '#ffffff', fontWeight: 'bold' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={val => {
                  if (val >= 1000000) return `$${val / 1000000}M`;
                  return `$${val / 1000}k`;
                }}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#cccccc' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0, 0, 0, 0.5)' }}
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name,
                ]}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
                  backgroundColor: '#1e293b',
                  color: 'white',
                }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Legend wrapperStyle={{ color: '#ffffff' }} />

              <Bar
                dataKey="Fondos"
                name={t.legendAUM}
                fill="#4ade80"
                radius={[4, 4, 0, 0]}
                barSize={barSize}
              />

              <Bar
                dataKey="CostoKEY"
                name={t.legendKeyCost}
                stackId="a"
                fill="#818cf8"
                barSize={barSize}
              />
              <Bar
                dataKey="FondoDAO"
                name={t.legendDAO}
                stackId="a"
                fill="#fb923c"
                radius={[4, 4, 0, 0]}
                barSize={barSize}
                label={renderBarLabel}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl shadow-sm p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-300 text-xs uppercase border-b border-slate-600">
              <th className="py-3 px-4">{t.tableYear}</th>
              <th className="py-3 px-4">{t.tableFunds}</th>
              <th className="py-3 px-4 text-indigo-300">{t.tableKeyCost}</th>
              <th className="py-3 px-4 text-orange-300">{t.tableDaoFund}</th>
              <th className="py-3 px-4 text-orange-300">
                {t.tableDaoDefinition}
              </th>
              <th className="py-3 px-4 text-green-400 font-extrabold">
                {t.tableGlobalPercent}
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {chartData.map(row => (
              <tr
                key={row.name}
                className="border-b border-slate-600 hover:bg-white/5"
              >
                <td className="py-4 px-4 font-bold text-white">
                  {row.name} ({row.ngos} {t.ngosLabel})
                </td>
                <td className="py-4 px-4 font-mono text-green-400">
                  {formatCurrency(row.Fondos)}
                </td>
                <td className="py-4 px-4 font-mono text-indigo-300">
                  {formatCurrency(row.CostoKEY)}
                </td>
                <td className="py-4 px-4 font-mono text-orange-300">
                  {formatCurrency(row.FondoDAO)}
                </td>
                <td className="py-4 px-4 text-orange-300 text-xs">
                  {row.daoUsed}% {t.daoOnKey}
                </td>
                <td className="py-4 px-4 font-bold text-green-400 text-lg">
                  {row.globalPct}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
