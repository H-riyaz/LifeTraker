import React, { useState } from 'react';
import { Moon, Plus, Check } from 'lucide-react';
import { SleepRecord } from '../../types/lifeos';
import { AreaTrendChart } from '../charts/AreaTrendChart';
import { api } from '../../services/api';

interface SleepViewProps {
  sleepRecords: SleepRecord[];
  activeDate: string;
  onRefresh: () => void;
}

export const SleepView: React.FC<SleepViewProps> = ({
  sleepRecords,
  activeDate,
  onRefresh,
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [quality, setQuality] = useState(85);
  const [notes, setNotes] = useState('');

  const currentSleep = sleepRecords.find(s => s.sleepDate === activeDate) || sleepRecords[0];

  const chartData = [...sleepRecords].reverse().map(s => ({
    label: s.sleepDate.slice(5),
    value: Math.round((s.durationMinutes / 60) * 10) / 10,
    secondaryValue: Math.round((s.goalMinutes / 60) * 10) / 10,
  }));

  const handleSaveSleep = async (e: React.FormEvent) => {
    e.preventDefault();
    const startH = parseInt(bedtime.split(':')[0]);
    const endH = parseInt(wakeTime.split(':')[0]);
    const durationMin = ((endH >= startH ? endH - startH : endH + 24 - startH) * 60);

    try {
      await api.logSleep({
        sleepDate: activeDate,
        sleepStart: bedtime,
        sleepEnd: wakeTime,
        durationMinutes: durationMin,
        qualityRating: Number(quality),
        notes,
      });
      setShowLogModal(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const sleepHours = currentSleep ? (currentSleep.durationMinutes / 60).toFixed(1) : '7.3';
  const sleepDebt = currentSleep ? Math.max(0, currentSleep.goalMinutes - currentSleep.durationMinutes) : 40;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <span>Circadian Restoration & Cognitive Readiness</span>
            <span aria-hidden="true">·</span>
            <span>{activeDate}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
            Sleep & Recovery
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Optimize REM & Deep sleep duration, reduce sleep debt, and track nocturnal consistency.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(!showLogModal)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Sleep</span>
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-xs uppercase text-neutral-400 font-medium">Recorded Sleep</div>
          <div className="text-3xl font-bold font-mono text-neutral-100 tabular-nums mt-1">
            {sleepHours} <span className="text-sm font-normal text-neutral-400">hours</span>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            Goal: 8.0h ({Math.round((Number(sleepHours) / 8) * 100)}%)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-xs uppercase text-neutral-400 font-medium">Sleep Debt</div>
          <div className="text-3xl font-bold font-mono text-neutral-100 tabular-nums mt-1">
            {sleepDebt} <span className="text-sm font-normal text-neutral-400">min</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">
            Within healthy threshold (&lt;60m)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-xs uppercase text-neutral-400 font-medium">Quality Rating</div>
          <div className="text-3xl font-bold font-mono text-neutral-100 tabular-nums mt-1">
            {currentSleep?.qualityRating || 85}<span className="text-sm font-normal text-neutral-400">/100</span>
          </div>
          <div className="text-[11px] text-indigo-400 font-mono mt-1">
            Deep restorative sleep
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-xs uppercase text-neutral-400 font-medium">Bedtime Consistency</div>
          <div className="text-3xl font-bold font-mono text-neutral-100 tabular-nums mt-1">
            23:10
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            Wake up: 06:30 AM
          </div>
        </div>
      </div>

      {/* Log Sleep Modal */}
      {showLogModal && (
        <form onSubmit={handleSaveSleep} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-neutral-200">Log Sleep Episode</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Bedtime</label>
              <input
                type="time"
                value={bedtime}
                onChange={e => setBedtime(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Wake Time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={e => setWakeTime(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Quality ({quality}/100)</label>
              <input
                type="range"
                min="40"
                max="100"
                value={quality}
                onChange={e => setQuality(Number(e.target.value))}
                className="w-full accent-indigo-500 mt-2"
              />
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Notes (e.g. read paper book before sleep, room 19°C)..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowLogModal(false)} className="px-3 py-1 text-xs text-neutral-400">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg">
              Save Sleep
            </button>
          </div>
        </form>
      )}

      {/* Sleep Trend Chart */}
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
        <h3 className="text-sm font-semibold text-neutral-100">Sleep Duration vs 8-Hour Goal (Hours)</h3>
        <AreaTrendChart
          data={chartData}
          unit="h"
          color="#38bdf8"
          secondaryColor="#64748b"
          height={180}
        />
      </div>

      {/* Sleep Hygiene Protocol */}
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-100">Circadian Hygiene Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-850 flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-neutral-200">No Screens 30m Prior</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Eliminate blue light melatonin suppression.</div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-850 flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-neutral-200">Cool Environment (19-20°C)</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Facilitates natural core body temperature drop.</div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-850 flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-neutral-200">Caffeine Cutoff at 14:00</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Prevents adenosine receptor disruption.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
