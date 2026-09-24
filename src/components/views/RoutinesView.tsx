import React from 'react';
import { Sparkles, Moon, Check, Clock } from 'lucide-react';
import { Routine } from '../../types/lifeos';
import { api } from '../../services/api';

interface RoutinesViewProps {
  routines: Routine[];
  onRefresh: () => void;
}

export const RoutinesView: React.FC<RoutinesViewProps> = ({ routines, onRefresh }) => {
  const morningRoutine = routines.find(r => r.routineType === 'morning');
  const nightRoutine = routines.find(r => r.routineType === 'night');

  const handleToggleStep = async (routineId: string, stepId: string, current: boolean) => {
    try {
      await api.toggleRoutineStep(routineId, stepId, !current);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const renderRoutineCard = (routine?: Routine, icon?: any, title?: string, color?: string) => {
    if (!routine) return null;
    const Icon = icon;
    const completedCount = routine.items.filter(i => i.isCompletedToday).length;
    const totalCount = routine.items.length;
    const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-neutral-800 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">{title || routine.title}</h3>
              <div className="text-xs text-neutral-500 font-mono">
                Target: {routine.targetTime} · {routine.items.reduce((a, b) => a + b.durationMinutes, 0)}m total
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-neutral-300 font-bold tabular-nums">
              {completedCount}/{totalCount} ({progressPct}%)
            </div>
            <div className="w-24 h-1.5 bg-neutral-800 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Items */}
        <div className="space-y-2 pt-2 border-t border-neutral-850">
          {routine.items.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => handleToggleStep(routine.id, item.id, Boolean(item.isCompletedToday))}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                item.isCompletedToday
                  ? 'bg-neutral-950/60 border-neutral-850 opacity-75'
                  : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  className={`w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 transition-colors ${
                    item.isCompletedToday
                      ? 'bg-emerald-500 border-emerald-500 text-neutral-950 font-bold'
                      : 'border-neutral-600'
                  }`}
                >
                  {item.isCompletedToday && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <span className="text-xs text-neutral-500 font-mono">{idx + 1}.</span>
                <span
                  className={`text-xs font-medium truncate ${
                    item.isCompletedToday ? 'text-neutral-500 line-through' : 'text-neutral-200'
                  }`}
                >
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono shrink-0 ml-2">
                <Clock className="w-3 h-3" />
                <span>{item.durationMinutes}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-neutral-800 pb-5">
        <div className="text-xs text-neutral-400 font-mono">Circadian Anchors</div>
        <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
          Morning & Night Routines
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Establish deterministic start and end anchors for your day to protect mental clarity and sleep.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderRoutineCard(morningRoutine, Sparkles, 'Morning Awakening Protocol', 'text-amber-400')}
        {renderRoutineCard(nightRoutine, Moon, 'Evening Wind-Down Protocol', 'text-indigo-400')}
      </div>
    </div>
  );
};
