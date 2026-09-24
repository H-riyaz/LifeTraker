import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';
import { TimelineEvent, Task, FitnessActivity, Transaction } from '../../types/lifeos';

interface CalendarViewProps {
  events: TimelineEvent[];
  tasks: Task[];
  activities: FitnessActivity[];
  transactions: Transaction[];
  activeDate: string;
  onSelectDate: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  tasks,
  activities,
  transactions,
  activeDate,
  onSelectDate,
}) => {
  // Month grid for September 2026 (September 1, 2026 is Tuesday)
  // Days: 30 days in September
  const daysInMonth = 30;
  const startDayOfWeek = 2; // 0=Sun, 1=Mon, 2=Tue

  const days = [];
  // Empty slots for padding
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = `2026-09-${String(d).padStart(2, '0')}`;
    days.push(dayStr);
  }

  const selectedDateEvents = events.filter(e => e.eventDate === activeDate);
  const selectedDateTasks = tasks.filter(t => t.dueDate === activeDate);
  const selectedDateWorkouts = activities.filter(a => a.activityDate === activeDate);
  const selectedDateExpenses = transactions.filter(t => t.transactionDate === activeDate && t.type === 'expense');

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <span>Unified Life Agenda</span>
            <span aria-hidden="true">·</span>
            <span>September 2026</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
            Master Calendar
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Cross-domain view synthesizing schedule events, task deadlines, workouts, and expenses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5">
            <CalIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-neutral-200">September 2026</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Month Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-neutral-500 font-medium">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((dayStr, idx) => {
              if (!dayStr) {
                return <div key={`empty_${idx}`} className="h-20 bg-neutral-950/40 rounded-lg" />;
              }

              const isSelected = dayStr === activeDate;
              const hasEvents = events.some(e => e.eventDate === dayStr);
              const hasTasks = tasks.some(t => t.dueDate === dayStr);
              const hasWorkouts = activities.some(a => a.activityDate === dayStr);
              const hasExpense = transactions.some(t => t.transactionDate === dayStr && t.type === 'expense');

              return (
                <button
                  key={dayStr}
                  onClick={() => onSelectDate(dayStr)}
                  className={`h-20 p-2 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                    isSelected
                      ? 'bg-neutral-800 border-indigo-500 ring-1 ring-indigo-500'
                      : 'bg-neutral-950 border-neutral-850 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${isSelected ? 'text-indigo-400' : 'text-neutral-300'}`}>
                      {dayStr.slice(-2)}
                    </span>
                  </div>

                  {/* Multi-domain indicator dots */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {hasEvents && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Schedule Block" />}
                    {hasTasks && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Task Due" />}
                    {hasWorkouts && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Workout Logged" />}
                    {hasExpense && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" title="Expense" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-[11px] text-neutral-400 font-mono pt-2 border-t border-neutral-850 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" /> Timeline Events
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Tasks Due
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Workouts
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" /> Expenses
            </span>
          </div>
        </div>

        {/* Selected Day Agenda Drawer (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="border-b border-neutral-850 pb-3">
            <div className="text-xs text-neutral-400 font-mono">Day Agenda</div>
            <div className="text-base font-bold text-neutral-100 mt-0.5">{activeDate}</div>
          </div>

          {/* Events */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-neutral-300">Schedule Events ({selectedDateEvents.length})</div>
            {selectedDateEvents.length === 0 ? (
              <div className="text-xs text-neutral-500 py-1">No timeline blocks.</div>
            ) : (
              selectedDateEvents.map(e => (
                <div key={e.id} className="p-2 rounded-lg bg-neutral-950 border border-neutral-850 text-xs">
                  <div className="font-medium text-neutral-200">{e.title}</div>
                  <div className="text-[11px] text-neutral-500 font-mono">{e.plannedStartTime} - {e.plannedEndTime}</div>
                </div>
              ))
            )}
          </div>

          {/* Tasks */}
          <div className="space-y-2 pt-2 border-t border-neutral-850">
            <div className="text-xs font-semibold text-neutral-300">Tasks Due ({selectedDateTasks.length})</div>
            {selectedDateTasks.length === 0 ? (
              <div className="text-xs text-neutral-500 py-1">No tasks due today.</div>
            ) : (
              selectedDateTasks.map(t => (
                <div key={t.id} className="p-2 rounded-lg bg-neutral-950 border border-neutral-850 text-xs">
                  <div className="font-medium text-neutral-200">{t.title}</div>
                  <div className="text-[11px] text-neutral-500 font-mono capitalize">{t.priority} · {t.status}</div>
                </div>
              ))
            )}
          </div>

          {/* Workouts */}
          <div className="space-y-2 pt-2 border-t border-neutral-850">
            <div className="text-xs font-semibold text-neutral-300">Physical Workouts ({selectedDateWorkouts.length})</div>
            {selectedDateWorkouts.length === 0 ? (
              <div className="text-xs text-neutral-500 py-1">No workouts logged.</div>
            ) : (
              selectedDateWorkouts.map(w => (
                <div key={w.id} className="p-2 rounded-lg bg-neutral-950 border border-neutral-850 text-xs">
                  <div className="font-medium text-neutral-200 capitalize">{w.activityType}</div>
                  <div className="text-[11px] text-neutral-500 font-mono">{w.durationMinutes}m · {w.calories} kcal</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
