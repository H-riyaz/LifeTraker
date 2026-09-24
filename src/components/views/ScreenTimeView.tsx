import React, { useState } from 'react';
import { Monitor, Plus } from 'lucide-react';
import { ScreenTimeRecord } from '../../types/lifeos';
import { DonutBreakdownChart } from '../charts/DonutBreakdownChart';
import { api } from '../../services/api';

interface ScreenTimeViewProps {
  records: ScreenTimeRecord[];
  activeDate: string;
  onRefresh: () => void;
}

export const ScreenTimeView: React.FC<ScreenTimeViewProps> = ({
  records,
  activeDate,
  onRefresh,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [deviceName, setDeviceName] = useState('MacBook Pro');
  const [appOrSite, setAppOrSite] = useState('');
  const [category, setCategory] = useState<any>('Programming');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [isProductive, setIsProductive] = useState(true);

  const todayRecords = records.filter(r => r.recordDate === activeDate);
  const totalMinutes = todayRecords.reduce((a, b) => a + b.durationMinutes, 0);
  const productiveMinutes = todayRecords.filter(r => r.isProductive).reduce((a, b) => a + b.durationMinutes, 0);
  const distractionMinutes = totalMinutes - productiveMinutes;
  const productivePct = totalMinutes > 0 ? Math.round((productiveMinutes / totalMinutes) * 100) : 100;

  // Donut chart slices by app/site
  const donutColors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
  const chartData = todayRecords.map((r, i) => ({
    label: r.appOrSite,
    value: r.durationMinutes,
    color: donutColors[i % donutColors.length],
  }));

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appOrSite) return;
    try {
      await api.logScreenTime({
        recordDate: activeDate,
        deviceName,
        appOrSite,
        category,
        durationMinutes: Number(durationMinutes),
        isProductive,
      });
      setAppOrSite('');
      setShowAddModal(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <span>Digital Consumption vs Creation</span>
            <span aria-hidden="true">·</span>
            <span>{activeDate}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
            Screen Time & Digital Hygiene
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Differentiate high-leverage engineering time from passive social media entertainment.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Screen Time</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-xs uppercase text-neutral-400 font-medium">Total Screen Time</div>
          <div className="text-3xl font-bold font-mono text-neutral-100 tabular-nums mt-1">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            Daily limit: 4h 30m
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-xs uppercase text-neutral-400 font-medium">Productive Focus</div>
          <div className="text-3xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
            {Math.floor(productiveMinutes / 60)}h {productiveMinutes % 60}m
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">
            {productivePct}% of screen exposure
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-xs uppercase text-neutral-400 font-medium">Passive / Social</div>
          <div className="text-3xl font-bold font-mono text-rose-400 tabular-nums mt-1">
            {Math.floor(distractionMinutes / 60)}h {distractionMinutes % 60}m
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            YouTube & Twitter/X
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-xs uppercase text-neutral-400 font-medium">Primary Device</div>
          <div className="text-xl font-bold text-neutral-200 mt-2 truncate">
            MacBook Pro
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            78% of total device usage
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <form onSubmit={handleSaveRecord} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-neutral-200">Log Screen Time Entry</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Device</label>
              <select
                value={deviceName}
                onChange={e => setDeviceName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200"
              >
                <option value="MacBook Pro">MacBook Pro</option>
                <option value="iPhone">iPhone</option>
                <option value="iPad">iPad</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">App or Website</label>
              <input
                type="text"
                required
                placeholder="e.g. VS Code, YouTube"
                value={appOrSite}
                onChange={e => setAppOrSite(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200"
              >
                <option value="Programming">Programming</option>
                <option value="Work">Work</option>
                <option value="Education">Education</option>
                <option value="Communication">Communication</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Social Media">Social Media</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Minutes</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isProd"
              checked={isProductive}
              onChange={e => setIsProductive(e.target.checked)}
              className="rounded-xs accent-indigo-500 w-3.5 h-3.5"
            />
            <label htmlFor="isProd" className="text-xs text-neutral-300">
              Classify as productive engineering / educational usage
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1 text-xs text-neutral-400">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg">
              Save Entry
            </button>
          </div>
        </form>
      )}

      {/* Chart & Table */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-6 p-5 rounded-xl bg-neutral-900 border border-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-100 mb-2">Application Distribution</h3>
          <DonutBreakdownChart data={chartData} unit="m" size={170} />
        </div>

        <div className="md:col-span-6 p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
          <h3 className="text-sm font-semibold text-neutral-100">Application Breakdown</h3>
          <div className="space-y-2">
            {todayRecords.map(r => (
              <div
                key={r.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-850"
              >
                <div>
                  <div className="text-xs font-medium text-neutral-200">{r.appOrSite}</div>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    {r.deviceName} · {r.category}
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono tabular-nums">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-xs ${r.isProductive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                    {r.isProductive ? 'Productive' : 'Distraction'}
                  </span>
                  <span className="text-xs font-bold text-neutral-200">{r.durationMinutes}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
