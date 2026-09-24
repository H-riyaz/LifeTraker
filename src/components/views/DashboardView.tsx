import React from 'react';
import {
  Clock,
  CheckSquare,
  Repeat,
  Flame,
  Moon,
  Monitor,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Plus,
  Sparkles,
} from 'lucide-react';
import { AreaTrendChart } from '../charts/AreaTrendChart';
import { ViewType } from '../layout/Sidebar';
import { api } from '../../services/api';

interface DashboardViewProps {
  data: any;
  onRefresh: () => void;
  onNavigate: (view: ViewType) => void;
  onOpenQuickAdd: () => void;
  onOpenAiPlanner: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  onRefresh,
  onNavigate,
  onOpenQuickAdd,
  onOpenAiPlanner,
}) => {
  if (!data || !data.summary) {
    return <div className="p-8 text-center text-xs text-neutral-400">Loading LifeOS dashboard...</div>;
  }

  const { summary, insights, timeline, tasks, habits, habitLogs, user } = data;
  const currency = user?.currency || 'NPR';

  const handleToggleHabit = async (habitId: string) => {
    try {
      await api.toggleHabit(habitId, data.date);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'completed' ? 'todo' : 'completed';
      await api.updateTask(taskId, { status: nextStatus });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTimelineEvent = async (eventId: string, currentStatus: boolean) => {
    try {
      await api.updateTimelineEvent(eventId, { isCompleted: !currentStatus });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  // Mock mini trend for productivity
  const miniTrendData = [
    { label: '09/18', value: 72 },
    { label: '09/19', value: 78 },
    { label: '09/20', value: 84 },
    { label: '09/21', value: 68 },
    { label: '09/22', value: 89 },
    { label: '09/23', value: 82 },
    { label: '09/24', value: summary.productivityScore || 85 },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Editorial Header & Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <span>{data.date}</span>
            <span aria-hidden="true">·</span>
            <span>Kathmandu (UTC+5:45)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
            Good day, {user?.fullName?.split(' ')[0] || 'Riyaz'}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Your LifeOS command center is synced. Here is your daily operational summary.
          </p>
        </div>

        {/* Quick-action buttons bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Log</span>
          </button>
          <button
            onClick={onOpenAiPlanner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Generate Schedule</span>
          </button>
        </div>
      </div>

      {/* Primary Derived Scores Row (60-30-10 palette, Zero-pill discipline) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* 1. Productivity Score */}
        <div
          onClick={() => onNavigate('analytics')}
          className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Productivity</span>
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-100 tabular-nums">
            {summary.productivityScore}<span className="text-xs text-neutral-400 font-normal">/100</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">
            40% Focus · 35% Tasks · 25% Sched
          </div>
        </div>

        {/* 2. Deep Focus */}
        <div
          onClick={() => onNavigate('work-sessions')}
          className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Focus Time</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-100 tabular-nums">
            {Math.floor(summary.focusMinutes / 60)}h {summary.focusMinutes % 60}m
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            Target: {Math.floor((user?.dailyWorkGoalMinutes || 360) / 60)}h
          </div>
        </div>

        {/* 3. Sleep & Recovery */}
        <div
          onClick={() => onNavigate('sleep')}
          className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Sleep</span>
            <Moon className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-100 tabular-nums">
            {Math.floor(summary.sleepMinutes / 60)}h {summary.sleepMinutes % 60}m
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            Debt: {summary.sleepDebtMinutes}m · 88% Quality
          </div>
        </div>

        {/* 4. Screen Time */}
        <div
          onClick={() => onNavigate('screen-time')}
          className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Screen Time</span>
            <Monitor className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-100 tabular-nums">
            {Math.floor(summary.screenTimeMinutes / 60)}h {summary.screenTimeMinutes % 60}m
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">
            {Math.round((summary.productiveScreenMinutes / (summary.screenTimeMinutes || 1)) * 100)}% Productive
          </div>
        </div>

        {/* 5. Habits Consistency */}
        <div
          onClick={() => onNavigate('habits')}
          className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Habits</span>
            <Repeat className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-100 tabular-nums">
            {summary.habitConsistencyPct}%
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            {habits.length} Active Habits
          </div>
        </div>

        {/* 6. Today's Expenses */}
        <div
          onClick={() => onNavigate('finances')}
          className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Spent Today</span>
            <Wallet className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-100 tabular-nums">
            <span className="text-sm font-normal text-neutral-400">{currency} </span>
            {summary.totalExpense.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            Budget ceiling on track
          </div>
        </div>
      </div>

      {/* High-Signal Insight Strip */}
      {insights?.highlights?.length > 0 && (
        <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
            <span className="text-indigo-200 font-medium">LifeOS Observation:</span>
            <span className="text-neutral-300">{insights.highlights[0]}</span>
          </div>
          <button
            onClick={() => onNavigate('analytics')}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium shrink-0"
          >
            <span>View 14-day analysis</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main 2-Column Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Today's Schedule & Tasks */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Schedule Timeline Snapshot */}
          <div className="p-4 md:p-5 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400" />
                <h3 className="text-sm font-semibold text-neutral-100">Today's Timeline Schedule</h3>
              </div>
              <button
                onClick={() => onNavigate('timeline')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Full 24h Timeline →
              </button>
            </div>

            <div className="space-y-2">
              {timeline.slice(0, 6).map((evt: any) => (
                <div
                  key={evt.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-850 hover:border-neutral-750 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => handleToggleTimelineEvent(evt.id, evt.isCompleted)}
                      className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                        evt.isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-neutral-950'
                          : 'border-neutral-600 hover:border-neutral-400'
                      }`}
                    >
                      {evt.isCompleted && <CheckSquare className="w-3 h-3 stroke-[3]" />}
                    </button>
                    <div className="min-w-0">
                      <div
                        className={`text-xs font-medium truncate ${
                          evt.isCompleted ? 'text-neutral-400 line-through' : 'text-neutral-200'
                        }`}
                      >
                        {evt.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono mt-0.5">
                        <span>{evt.plannedStartTime} – {evt.plannedEndTime}</span>
                        <span aria-hidden="true">·</span>
                        <span>{evt.category}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className="w-2 h-2 rounded-full shrink-0 ml-2"
                    style={{ backgroundColor: evt.color || '#3b82f6' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Today's Tasks & Sprints */}
          <div className="p-4 md:p-5 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-neutral-400" />
                <h3 className="text-sm font-semibold text-neutral-100">Tasks & Deliverables</h3>
              </div>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Task Board →
              </button>
            </div>

            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="text-xs text-neutral-400 py-4 text-center">No tasks due today. Great job!</div>
              ) : (
                tasks.slice(0, 5).map((t: any) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-850 hover:border-neutral-750 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => handleToggleTask(t.id, t.status)}
                        className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                          t.status === 'completed'
                            ? 'bg-emerald-500 border-emerald-500 text-neutral-950'
                            : 'border-neutral-600 hover:border-neutral-400'
                        }`}
                      >
                        {t.status === 'completed' && <CheckSquare className="w-3 h-3 stroke-[3]" />}
                      </button>
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-medium truncate ${
                            t.status === 'completed' ? 'text-neutral-400 line-through' : 'text-neutral-200'
                          }`}
                        >
                          {t.title}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono mt-0.5">
                          <span>{t.estimatedDurationMinutes}m est</span>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">{t.priority}</span>
                          <span aria-hidden="true">·</span>
                          <span>{t.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Habit Streaks & Productivity Trend */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Habit Matrix */}
          <div className="p-4 md:p-5 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-neutral-400" />
                <h3 className="text-sm font-semibold text-neutral-100">Daily Habits & Streaks</h3>
              </div>
              <button
                onClick={() => onNavigate('habits')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Manage Habits →
              </button>
            </div>

            <div className="space-y-2">
              {habits.slice(0, 6).map((h: any) => {
                const log = habitLogs.find((l: any) => l.habitId === h.id);
                const isCompleted = Boolean(log?.completed);

                return (
                  <div
                    key={h.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-850"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-medium text-neutral-200 truncate">{h.name}</div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono mt-0.5">
                        <span className="text-amber-400 font-semibold">{h.currentStreak}d streak</span>
                        <span aria-hidden="true">·</span>
                        <span>Best: {h.longestStreak}d</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleHabit(h.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400'
                      }`}
                    >
                      {isCompleted ? 'Done' : 'Check In'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7-Day Performance Trend Chart */}
          <div className="p-4 md:p-5 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-neutral-100">7-Day Productivity Trend</h3>
              <span className="text-xs text-neutral-400 font-mono">Formula Score</span>
            </div>
            <AreaTrendChart
              data={miniTrendData}
              unit=""
              color="#6366f1"
              height={140}
              showAverage={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
