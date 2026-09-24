import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { api } from '../../services/api';

interface ReportsViewProps {
  activeDate: string;
  currency: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ activeDate, currency }) => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.getReport(period, activeDate);
        setReport(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [period, activeDate]);

  if (loading || !report) {
    return <div className="p-8 text-center text-xs text-neutral-400">Compiling executive life report...</div>;
  }

  const handleExportCsv = () => {
    window.open('/api/data/export?format=csv', '_blank');
  };

  const handleExportJson = () => {
    window.open('/api/data/export?format=json', '_blank');
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <span>Executive Performance Summary</span>
            <span aria-hidden="true">·</span>
            <span>{report.startDate} to {report.endDate}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
            LifeOS Executive Report
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Retrospective aggregation across execution, biological health, and wealth disciplines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period Selector */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
            {(['daily', 'weekly', 'monthly'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                  period === p ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-xs font-medium uppercase text-neutral-400">Total Deep Focus</div>
          <div className="text-2xl font-bold font-mono text-indigo-400 tabular-nums mt-1">
            {(report.totalFocusMinutes / 60).toFixed(1)} <span className="text-xs text-neutral-500 font-normal">hrs</span>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            Avg: {(report.totalFocusMinutes / (report.summaries.length || 1) / 60).toFixed(1)}h/day
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-xs font-medium uppercase text-neutral-400">Physical Exercise</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
            {(report.totalExerciseMinutes / 60).toFixed(1)} <span className="text-xs text-neutral-500 font-normal">hrs</span>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            Running, gym & walking
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-xs font-medium uppercase text-neutral-400">Average Sleep</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums mt-1">
            {(report.averageSleepMinutes / 60).toFixed(1)} <span className="text-xs text-neutral-500 font-normal">hrs</span>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            Nocturnal restorative avg
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-xs font-medium uppercase text-neutral-400">Net Liquid Savings</div>
          <div className="text-2xl font-bold font-mono text-neutral-100 tabular-nums mt-1">
            <span className="text-xs text-neutral-400 font-normal">{currency} </span>
            {report.netSavings.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-400 font-mono mt-1">
            {report.savingsRatePct}% Savings Rate
          </div>
        </div>
      </div>

      {/* Narrative Synthesis */}
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-100">Performance Assessment</h3>
        <p className="text-xs text-neutral-300 leading-relaxed">
          Over the selected {period} window from <span className="font-mono text-neutral-100">{report.startDate}</span> to{' '}
          <span className="font-mono text-neutral-100">{report.endDate}</span>, you logged an average productivity score of{' '}
          <strong className="text-indigo-400 font-mono font-bold">{report.averageProductivityScore}/100</strong> and maintained a habit consistency rating of{' '}
          <strong className="text-emerald-400 font-mono font-bold">{report.averageHabitConsistencyPct}%</strong>. Total task completion stood at{' '}
          <span className="font-mono font-bold text-neutral-200">{report.tasksCompleted}</span> out of {report.tasksTotal} planned deliverables.
        </p>
      </div>

      {/* Daily Breakdown Table */}
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3 overflow-x-auto">
        <h3 className="text-sm font-semibold text-neutral-100">Daily Ledger Snapshot</h3>
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-400 text-[11px]">
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3 text-center">Score</th>
              <th className="py-2.5 px-3 text-center">Focus</th>
              <th className="py-2.5 px-3 text-center">Exercise</th>
              <th className="py-2.5 px-3 text-center">Sleep</th>
              <th className="py-2.5 px-3 text-center">Screen</th>
              <th className="py-2.5 px-3 text-right">Expense ({currency})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-850 text-neutral-300 tabular-nums">
            {report.summaries.map((s: any) => (
              <tr key={s.date} className="hover:bg-neutral-850/50 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-neutral-200">{s.date}</td>
                <td className="py-2.5 px-3 text-center font-bold text-indigo-400">{s.productivityScore}</td>
                <td className="py-2.5 px-3 text-center">{Math.floor(s.focusMinutes / 60)}h {s.focusMinutes % 60}m</td>
                <td className="py-2.5 px-3 text-center">{s.exerciseMinutes}m</td>
                <td className="py-2.5 px-3 text-center">{Math.floor(s.sleepMinutes / 60)}h {s.sleepMinutes % 60}m</td>
                <td className="py-2.5 px-3 text-center">{Math.floor(s.screenTimeMinutes / 60)}h {s.screenTimeMinutes % 60}m</td>
                <td className="py-2.5 px-3 text-right">{s.totalExpense.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
