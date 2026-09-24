import React, { useState } from 'react';
import { Plus, Target, CheckCircle2, Circle } from 'lucide-react';
import { Goal } from '../../types/lifeos';
import { api } from '../../services/api';

interface GoalsViewProps {
  goals: Goal[];
  onRefresh: () => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({ goals, onRefresh }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Career' | 'Financial' | 'Fitness' | 'Education' | 'Personal'>('Career');
  const [targetValue, setTargetValue] = useState(100);
  const [unit, setUnit] = useState('hours');
  const [deadline, setDeadline] = useState('2026-12-31');

  const handleToggleMilestone = async (goal: Goal, milestoneId: string) => {
    const nextMilestones = goal.milestones.map(m =>
      m.id === milestoneId ? { ...m, isAchieved: !m.isAchieved } : m
    );
    const achievedCount = nextMilestones.filter(m => m.isAchieved).length;
    const progressPct = nextMilestones.length > 0 ? achievedCount / nextMilestones.length : 0;
    const nextVal = Math.round(progressPct * goal.targetValue);

    try {
      await api.updateGoal(goal.id, {
        milestones: nextMilestones,
        currentValue: nextVal,
        isCompleted: achievedCount === nextMilestones.length,
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      await api.addGoal({
        title,
        description,
        category,
        targetValue: Number(targetValue),
        currentValue: 0,
        unit,
        deadline,
        milestones: [
          { id: `ms_${Date.now()}_1`, title: 'Milestone 1: Foundation & Setup', targetValue: Math.round(targetValue * 0.25), isAchieved: false },
          { id: `ms_${Date.now()}_2`, title: 'Milestone 2: Execution Halfway Point', targetValue: Math.round(targetValue * 0.5), isAchieved: false },
          { id: `ms_${Date.now()}_3`, title: 'Milestone 3: Final Completion', targetValue: targetValue, isAchieved: false },
        ],
      });
      setTitle('');
      setDescription('');
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
            <span>Macro Life Objectives & Milestones</span>
            <span aria-hidden="true">·</span>
            <span>{goals.length} active initiatives</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
            Goals & Strategic Milestones
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Deconstruct multi-month engineering, financial, and fitness objectives into measurable milestones.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <form onSubmit={handleCreateGoal} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-neutral-200">Create Strategic Life Goal</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <input
                type="text"
                required
                placeholder="Goal title (e.g. Master Distributed Systems Architecture)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100"
              />
            </div>
            <div>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-neutral-200"
              >
                <option value="Career">Career & Systems</option>
                <option value="Financial">Financial Reserve</option>
                <option value="Fitness">Fitness Endurance</option>
                <option value="Education">Education & Books</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="number"
              value={targetValue}
              onChange={e => setTargetValue(Number(e.target.value))}
              placeholder="Target value"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs font-mono text-neutral-200"
            />
            <input
              type="text"
              value={unit}
              onChange={e => setUnit(e.target.value)}
              placeholder="Unit (hours, NPR, km)"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200"
            />
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs font-mono text-neutral-200"
            />
          </div>
          <div>
            <textarea
              rows={2}
              placeholder="Rationale and execution criteria..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1 text-xs text-neutral-400">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg">
              Save Goal
            </button>
          </div>
        </form>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(g => {
          const progressPct = Math.min(100, Math.round((g.currentValue / (g.targetValue || 1)) * 100));

          return (
            <div key={g.id} className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-xs bg-neutral-800 text-indigo-400 font-mono">
                      {g.category}
                    </span>
                    {g.deadline && (
                      <span className="text-[11px] text-neutral-400 font-mono">
                        Deadline: {g.deadline}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-100 mt-1">{g.title}</h3>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold font-mono text-indigo-400 tabular-nums">
                    {progressPct}%
                  </div>
                </div>
              </div>

              {g.description && (
                <p className="text-xs text-neutral-400 leading-relaxed">{g.description}</p>
              )}

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                  <span>Progress</span>
                  <span>{g.currentValue.toLocaleString()} / {g.targetValue.toLocaleString()} {g.unit}</span>
                </div>
                <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Milestones Checklist */}
              {g.milestones.length > 0 && (
                <div className="pt-3 border-t border-neutral-850 space-y-2">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Milestones
                  </div>
                  <div className="space-y-1.5">
                    {g.milestones.map(ms => (
                      <div
                        key={ms.id}
                        onClick={() => handleToggleMilestone(g, ms.id)}
                        className="flex items-center gap-2 text-xs text-neutral-300 hover:text-neutral-100 cursor-pointer"
                      >
                        {ms.isAchieved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-neutral-600 shrink-0" />
                        )}
                        <span className={ms.isAchieved ? 'line-through text-neutral-500' : ''}>
                          {ms.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
