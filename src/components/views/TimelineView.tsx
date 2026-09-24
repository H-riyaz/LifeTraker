import React, { useState } from 'react';
import { Clock, Plus, AlertCircle, CheckSquare, Trash2 } from 'lucide-react';
import { TimelineEvent } from '../../types/lifeos';
import { api } from '../../services/api';

interface TimelineViewProps {
  events: TimelineEvent[];
  activeDate: string;
  onRefresh: () => void;
  onOpenAiPlanner: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  events,
  activeDate,
  onRefresh,
  onOpenAiPlanner,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [notes, setNotes] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const todayEvents = events
    .filter(e => e.eventDate === activeDate)
    .sort((a, b) => a.plannedStartTime.localeCompare(b.plannedStartTime));

  const filteredEvents = filterCategory === 'all'
    ? todayEvents
    : todayEvents.filter(e => e.category === filterCategory);

  // Conflict detection: check if two events overlap in planned hours
  const conflicts: string[] = [];
  for (let i = 0; i < todayEvents.length; i++) {
    for (let j = i + 1; j < todayEvents.length; j++) {
      const e1 = todayEvents[i];
      const e2 = todayEvents[j];
      if (e1.plannedStartTime < e2.plannedEndTime && e2.plannedStartTime < e1.plannedEndTime) {
        conflicts.push(`${e1.title} overlaps with ${e2.title} (${e2.plannedStartTime})`);
      }
    }
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      const categoryColorMap: Record<string, string> = {
        Work: '#3b82f6',
        Fitness: '#10b981',
        Health: '#06b6d4',
        Routine: '#6366f1',
        Education: '#8b5cf6',
        Rest: '#f59e0b',
      };
      await api.addTimelineEvent({
        title,
        category,
        eventDate: activeDate,
        plannedStartTime: startTime,
        plannedEndTime: endTime,
        color: categoryColorMap[category] || '#3b82f6',
        notes,
      });
      setTitle('');
      setNotes('');
      setShowAddForm(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleEvent = async (id: string, current: boolean) => {
    try {
      await api.updateTimelineEvent(id, { isCompleted: !current });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await api.deleteTimelineEvent(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['all', 'Work', 'Fitness', 'Education', 'Routine', 'Health', 'Rest'];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <span>24-Hour Chronological Flow</span>
            <span aria-hidden="true">·</span>
            <span>{activeDate}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
            Daily Execution Timeline
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Planned calendar blocks, actual completion timestamps, and schedule adherence tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiPlanner}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 font-medium"
          >
            Auto-Schedule with AI
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {/* Conflict banner */}
      {conflicts.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-amber-300">Schedule Conflicts Detected: </span>
            <span className="text-neutral-300">{conflicts.join('; ')}</span>
          </div>
        </div>
      )}

      {/* Add form */}
      {showAddForm && (
        <form onSubmit={handleAddEvent} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-neutral-200">New Timeline Block</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <input
                type="text"
                required
                placeholder="Block title (e.g. Distributed Consensus Paper Review)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100"
              />
            </div>
            <div>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-neutral-200"
              >
                <option value="Work">Work</option>
                <option value="Fitness">Fitness</option>
                <option value="Education">Education</option>
                <option value="Routine">Routine</option>
                <option value="Health">Health</option>
                <option value="Rest">Rest</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-1/2 bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-2 text-xs font-mono text-neutral-200"
              />
              <span className="text-xs text-neutral-500">to</span>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-1/2 bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-2 text-xs font-mono text-neutral-200"
              />
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Rationale or notes (optional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-xs text-neutral-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg"
            >
              Add Block
            </button>
          </div>
        </form>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
              filterCategory === cat
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 24-Hour Visual Schedule */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-xl">
            No events scheduled for {activeDate}. Click "+ Add Block" or "Auto-Schedule with AI".
          </div>
        ) : (
          filteredEvents.map(evt => (
            <div
              key={evt.id}
              className={`flex items-start justify-between p-4 rounded-xl border transition-colors ${
                evt.isCompleted
                  ? 'bg-neutral-950/80 border-neutral-850 opacity-75'
                  : 'bg-neutral-900 border-neutral-800'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <button
                  onClick={() => handleToggleEvent(evt.id, evt.isCompleted)}
                  className={`mt-0.5 w-5 h-5 rounded-xs border flex items-center justify-center transition-colors ${
                    evt.isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-neutral-950'
                      : 'border-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  {evt.isCompleted && <CheckSquare className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: evt.color || '#3b82f6' }}
                    >
                      {evt.plannedStartTime} – {evt.plannedEndTime}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      ({evt.category})
                    </span>
                  </div>
                  <h4
                    className={`text-sm font-medium mt-0.5 ${
                      evt.isCompleted ? 'text-neutral-400 line-through' : 'text-neutral-100'
                    }`}
                  >
                    {evt.title}
                  </h4>
                  {evt.notes && (
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{evt.notes}</p>
                  )}
                  {evt.actualStartTime && (
                    <div className="text-[11px] text-neutral-500 font-mono mt-1">
                      Actual: {evt.actualStartTime} – {evt.actualEndTime || 'ongoing'}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDeleteEvent(evt.id)}
                title="Delete event"
                className="text-neutral-600 hover:text-rose-400 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
