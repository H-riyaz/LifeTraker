import React, { useState } from 'react';
import { Plus, Flame, Check } from 'lucide-react';
import { Habit, HabitLog } from '../../types/lifeos';
import { api } from '../../services/api';

interface HabitsViewProps {
  habits: Habit[];
  habitLogs: HabitLog[];
  activeDate: string;
  onRefresh: () => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  habitLogs,
  activeDate,
  onRefresh,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'weekly'>('daily');
  const [targetCount, setTargetCount] = useState(1);
  const [unit, setUnit] = useState('times');
  const [category, setCategory] = useState('Health');

  // Past 14 dates for grid
  const pastDates: string[] = [];
  const curr = new Date(activeDate);
  for (let i = 13; i >= 0; i--) {
    const d = new Date(curr);
    d.setDate(d.getDate() - i);
    pastDates.push(d.toISOString().split('T')[0]);
  }

  const handleToggleHabit = async (habitId: string, date: string) => {
    try {
      await api.toggleHabit(habitId, date);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    try {
      await api.addHabit({
        name,
        description,
        frequency,
        targetCount: Number(targetCount),
        unit,
        category,
        startDate: activeDate,
      });
      setName('');
      setDescription('');
      setShowAddForm(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <span>Identity & Daily Repetition</span>
            <span aria-hidden="true">·</span>
            <span>{habits.length} active habits</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
            Habit Tracker & Consistency Matrix
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Never miss twice. Build compound momentum with daily streak accountability.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Add Habit Form */}
      {showAddForm && (
        <form onSubmit={handleCreateHabit} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-neutral-200">New Habit Accountability</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <input
                type="text"
                required
                placeholder="Habit name (e.g. Read 20 Pages Non-Fiction)"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100"
              />
            </div>
            <div>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-neutral-200"
              >
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays (Mon-Fri)</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-neutral-200"
              >
                <option value="Health">Health</option>
                <option value="Career">Career & Code</option>
                <option value="Education">Education</option>
                <option value="Fitness">Fitness</option>
                <option value="Sleep">Sleep</option>
                <option value="Mindset">Mindset</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Why this habit matters..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={targetCount}
                onChange={e => setTargetCount(Number(e.target.value))}
                placeholder="Target count"
                className="w-1/2 bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-200"
              />
              <input
                type="text"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                placeholder="Unit (e.g. pages, liters)"
                className="w-1/2 bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1 text-xs text-neutral-400">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg">
              Create Habit
            </button>
          </div>
        </form>
      )}

      {/* 14-Day Consistency Matrix */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
              <th className="py-3 px-4 min-w-[220px]">Habit</th>
              <th className="py-3 px-2 text-center">Streak</th>
              <th className="py-3 px-2 text-center">Record</th>
              {pastDates.map((d, i) => (
                <th
                  key={d}
                  className={`py-3 px-1 text-center font-mono text-[10px] ${
                    i === pastDates.length - 1 ? 'text-indigo-400 font-bold' : 'text-neutral-500'
                  }`}
                >
                  {d.slice(5)}
                </th>
              ))}
              <th className="py-3 px-4 text-right">Today</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-850">
            {habits.map(h => {
              const todayLog = habitLogs.find(l => l.habitId === h.id && l.logDate === activeDate);
              const isDoneToday = Boolean(todayLog?.completed);

              return (
                <tr key={h.id} className="hover:bg-neutral-850/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-neutral-200">{h.name}</div>
                    <div className="text-[11px] text-neutral-500 font-mono">
                      {h.targetCount} {h.unit} · {h.category}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="inline-flex items-center gap-1 font-mono text-amber-400 font-bold tabular-nums">
                      <Flame className="w-3.5 h-3.5" />
                      {h.currentStreak}d
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-neutral-400 tabular-nums">
                    {h.longestStreak}d
                  </td>

                  {/* 14-day dots */}
                  {pastDates.map(d => {
                    const log = habitLogs.find(l => l.habitId === h.id && l.logDate === d);
                    const completed = Boolean(log?.completed);
                    return (
                      <td key={d} className="py-3 px-1 text-center">
                        <button
                          onClick={() => handleToggleHabit(h.id, d)}
                          title={`${h.name} on ${d}: ${completed ? 'Done' : 'Missed'}`}
                          className={`w-5 h-5 rounded-xs transition-colors mx-auto flex items-center justify-center ${
                            completed
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold'
                              : 'bg-neutral-800 hover:bg-neutral-700 text-transparent'
                          }`}
                        >
                          {completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                      </td>
                    );
                  })}

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleHabit(h.id, activeDate)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                        isDoneToday
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isDoneToday ? 'Completed' : 'Check In'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
