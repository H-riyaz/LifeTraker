import React, { useState, useEffect } from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { AreaTrendChart } from '../charts/AreaTrendChart';
import { ScatterCorrelationChart } from '../charts/ScatterCorrelationChart';
import { api } from '../../services/api';

interface AnalyticsViewProps {
  activeDate: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ activeDate }) => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.getAnalytics(activeDate, 14);
        setAnalyticsData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeDate]);

  if (loading || !analyticsData) {
    return <div className="p-8 text-center text-xs text-neutral-400">Computing mathematical analytics & correlations...</div>;
  }

  const { summaries, insights } = analyticsData;

  const productivityChartData = summaries.map((s: any) => ({
    label: s.date.slice(5),
    value: s.productivityScore,
  }));

  const focusVsScreenData = summaries.map((s: any) => ({
    label: s.date.slice(5),
    value: Math.round((s.focusMinutes / 60) * 10) / 10,
    secondaryValue: Math.round((s.screenTimeMinutes / 60) * 10) / 10,
  }));

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-5">
        <div className="text-xs text-neutral-400 font-mono">Mathematical Intelligence & Cross-Domain Pearson Analytics</div>
        <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
          Life Analytics & Statistical Correlations
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Derived multi-variable indexes and empirical correlations across your past 14 days of recorded logs.
        </p>
      </div>

      {/* Derived Metric Methodology Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>Productivity Score Formula</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            <code className="text-indigo-300 font-mono text-[11px] block bg-neutral-950 p-1.5 rounded-md my-1">
              (Focus/Goal * 40) + (Task% * 35) + (Schedule% * 25)
            </code>
            Combines deep flow volume, task execution velocity, and calendar discipline into an uncheatable index (0-100).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>Habit Consistency Ratio</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            <code className="text-emerald-300 font-mono text-[11px] block bg-neutral-950 p-1.5 rounded-md my-1">
              (Completed Active Habits / Total Active Habits) * 100
            </code>
            Measures baseline habit integrity across hydration, systems programming, and physical workouts.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
            <Info className="w-3.5 h-3.5 text-purple-400" />
            <span>Screen Efficiency Index</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            <code className="text-purple-300 font-mono text-[11px] block bg-neutral-950 p-1.5 rounded-md my-1">
              (Productive Screen Mins / Total Screen Mins) * 100
            </code>
            Separates productive software engineering and reading from passive social entertainment.
          </p>
        </div>
      </div>

      {/* 14-Day Productivity Score Trend */}
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
        <h3 className="text-sm font-semibold text-neutral-100">14-Day Derived Productivity Score Curve</h3>
        <AreaTrendChart
          data={productivityChartData}
          unit="/100"
          color="#6366f1"
          height={180}
          showAverage={true}
        />
      </div>

      {/* Focus vs Screen Time Comparative */}
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
        <h3 className="text-sm font-semibold text-neutral-100">Focus Hours (Line) vs Total Screen Hours (Dashed)</h3>
        <AreaTrendChart
          data={focusVsScreenData}
          unit="h"
          color="#10b981"
          secondaryColor="#f43f5e"
          height={180}
        />
      </div>

      {/* Section 23: Statistical Correlation Analysis */}
      <div className="space-y-4 pt-4 border-t border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-neutral-100">Bivariate Empirical Correlations (r)</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Pearson coefficient analysis computed directly from your recorded logs across the past 14 days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights?.correlations?.map((corr: any, idx: number) => (
            <ScatterCorrelationChart
              key={idx}
              points={corr.samplePoints}
              correlationScore={corr.correlationScore}
              xLabel={corr.xLabel}
              yLabel={corr.yLabel}
              title={corr.label}
              description={corr.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
