import React, { useState } from 'react';
import { Plus, Dumbbell, Droplets, Footprints, Heart, Scale } from 'lucide-react';
import { FitnessActivity, BodyMetric } from '../../types/lifeos';
import { api } from '../../services/api';

interface FitnessViewProps {
  activities: FitnessActivity[];
  metrics: BodyMetric[];
  activeDate: string;
  onRefresh: () => void;
}

export const FitnessView: React.FC<FitnessViewProps> = ({
  activities,
  metrics,
  activeDate,
  onRefresh,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activityType, setActivityType] = useState<'running' | 'gym' | 'walking' | 'cycling'>('running');
  const [durationMinutes, setDurationMinutes] = useState(40);
  const [distanceKm, setDistanceKm] = useState('5.0');
  const [calories, setCalories] = useState(350);
  const [notes, setNotes] = useState('');

  // Quick water update
  const todayMetric = metrics.find(m => m.metricDate === activeDate) || {
    metricDate: activeDate,
    waterMl: 2400,
    steps: 8420,
    weightKg: 68.4,
    restingHeartRate: 52,
  };

  const handleAddWater = async (deltaMl: number) => {
    try {
      const nextWater = Math.max(0, (todayMetric.waterMl || 0) + deltaMl);
      await api.logBodyMetric({
        metricDate: activeDate,
        waterMl: nextWater,
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.logFitness({
        activityType,
        activityDate: activeDate,
        durationMinutes: Number(durationMinutes),
        distanceKm: Number(distanceKm) || 0,
        calories: Number(calories) || 0,
        intensity: 'vigorous',
        notes,
      });
      setShowAddModal(false);
      setNotes('');
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
            <span>Physical Vitality & Body Composition</span>
            <span aria-hidden="true">·</span>
            <span>{activeDate}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
            Fitness & Body Health
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Log workouts, track daily hydration, resting heart rate, and step count.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Workout</span>
        </button>
      </div>

      {/* Body Metric Vitals Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Water */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase">Hydration</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-100 tabular-nums">
            {(todayMetric.waterMl / 1000).toFixed(1)} <span className="text-xs text-neutral-500 font-normal">/ 3.0L</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={() => handleAddWater(250)}
              className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-cyan-300 rounded-md text-[11px] font-mono font-medium"
            >
              +250ml
            </button>
            <button
              onClick={() => handleAddWater(500)}
              className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-cyan-300 rounded-md text-[11px] font-mono font-medium"
            >
              +500ml
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase">Daily Steps</span>
            <Footprints className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-100 tabular-nums">
            {todayMetric.steps?.toLocaleString() || '0'}
          </div>
          <div className="text-[11px] text-neutral-500 font-mono">
            Goal: 10,000 steps (84%)
          </div>
        </div>

        {/* Weight */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase">Body Weight</span>
            <Scale className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-100 tabular-nums">
            {todayMetric.weightKg || '68.4'} <span className="text-xs text-neutral-500 font-normal">kg</span>
          </div>
          <div className="text-[11px] text-neutral-500 font-mono">
            Target: 68.0 kg (Steady)
          </div>
        </div>

        {/* Resting HR */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase">Resting HR</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-100 tabular-nums">
            {todayMetric.restingHeartRate || 52} <span className="text-xs text-neutral-500 font-normal">bpm</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">
            Optimal recovery zone
          </div>
        </div>
      </div>

      {/* Add Workout Form */}
      {showAddModal && (
        <form onSubmit={handleCreateActivity} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-neutral-200">Log Physical Activity</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Activity</label>
              <select
                value={activityType}
                onChange={e => setActivityType(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200"
              >
                <option value="running">Running (Outdoor / Trail)</option>
                <option value="gym">Gym / Strength Training</option>
                <option value="walking">Brisk Walking</option>
                <option value="cycling">Road Cycling</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Duration (Min)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Distance (km)</label>
              <input
                type="number"
                step="0.1"
                value={distanceKm}
                onChange={e => setDistanceKm(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Calories Burned</label>
              <input
                type="number"
                value={calories}
                onChange={e => setCalories(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-200"
              />
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Session notes (pace, sets, intensity feeling)..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1 text-xs text-neutral-400">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg">
              Save Workout
            </button>
          </div>
        </form>
      )}

      {/* Activity Log List */}
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
        <h3 className="text-sm font-semibold text-neutral-100">Recent Workout Logs</h3>
        <div className="divide-y divide-neutral-850">
          {activities.map(act => (
            <div key={act.id} className="py-3 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-neutral-800 text-amber-400 mt-0.5">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-200 capitalize">
                      {act.activityType}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">{act.activityDate}</span>
                  </div>
                  {act.notes && (
                    <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{act.notes}</p>
                  )}
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono mt-1">
                    <span>{act.durationMinutes} minutes</span>
                    {act.distanceKm > 0 && <span>· {act.distanceKm} km</span>}
                    {act.calories > 0 && <span>· {act.calories} kcal</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
