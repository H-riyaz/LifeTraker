import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame, CheckCircle, Clock } from 'lucide-react';
import { WorkSession, Task } from '../../types/lifeos';
import { BarMetricChart } from '../charts/BarMetricChart';
import { api } from '../../services/api';

interface WorkSessionsViewProps {
  sessions: WorkSession[];
  tasks: Task[];
  activeDate: string;
  onRefresh: () => void;
}

export const WorkSessionsView: React.FC<WorkSessionsViewProps> = ({
  sessions,
  tasks,
  activeDate,
  onRefresh,
}) => {
  const [mode, setMode] = useState<'25_5' | '50_10' | 'custom'>('50_10');
  const [targetSeconds, setTargetSeconds] = useState(50 * 60);
  const [secondsRemaining, setSecondsRemaining] = useState(50 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionTopic, setSessionTopic] = useState('Core Architecture & Systems');
  const [category, setCategory] = useState('Programming');
  const [linkedTaskId, setLinkedTaskId] = useState('');
  const [interruptions, setInterruptions] = useState(0);

  // Switch modes
  const handleSelectMode = (newMode: '25_5' | '50_10' | 'custom') => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === '25_5') {
      setTargetSeconds(25 * 60);
      setSecondsRemaining(25 * 60);
    } else if (newMode === '50_10') {
      setTargetSeconds(50 * 60);
      setSecondsRemaining(50 * 60);
    } else {
      setTargetSeconds(90 * 60);
      setSecondsRemaining(90 * 60);
    }
  };

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
      handleCompleteSession();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  const handleCompleteSession = async () => {
    const elapsedMinutes = Math.max(1, Math.round((targetSeconds - secondsRemaining) / 60));
    try {
      await api.logWorkSession({
        title: sessionTopic || 'Deep Work Sprint',
        category,
        taskId: linkedTaskId || undefined,
        sessionDate: activeDate,
        durationMinutes: elapsedMinutes,
        sessionMode: mode,
        interruptionCount: interruptions,
      });
      setIsActive(false);
      setSecondsRemaining(targetSeconds);
      setInterruptions(0);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progressPct = ((targetSeconds - secondsRemaining) / targetSeconds) * 100;

  // Chart data for recent days
  const recentDays = ['09/18', '09/19', '09/20', '09/21', '09/22', '09/23', '09/24'];
  const chartData = recentDays.map(day => {
    const daySessions = sessions.filter(s => s.sessionDate.endsWith(day.replace('/', '-')));
    const totalMin = daySessions.reduce((a, b) => a + b.durationMinutes, 0);
    return {
      label: day,
      value: Math.round(totalMin / 60 * 10) / 10,
    };
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-5">
        <div className="text-xs text-neutral-400 font-mono">Cognitive Flow State</div>
        <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
          Deep Work & Focus Sprints
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Eliminate digital distractions with time-boxed Pomodoro blocks linked to deliverable tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pomodoro Timer Console (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center text-center space-y-6">
          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-950 border border-neutral-800 rounded-lg">
            <button
              onClick={() => handleSelectMode('25_5')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
                mode === '25_5' ? 'bg-indigo-600 text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              25 / 5 Classic
            </button>
            <button
              onClick={() => handleSelectMode('50_10')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
                mode === '50_10' ? 'bg-indigo-600 text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              50 / 10 Flow
            </button>
            <button
              onClick={() => handleSelectMode('custom')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
                mode === 'custom' ? 'bg-indigo-600 text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              90m Ultradian
            </button>
          </div>

          {/* Session Topic & Task link */}
          <div className="w-full max-w-sm space-y-2 text-left">
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Focus Target</label>
              <input
                type="text"
                value={sessionTopic}
                onChange={e => setSessionTopic(e.target.value)}
                placeholder="What are you focusing on?"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200"
                >
                  <option value="Programming">Programming</option>
                  <option value="Education">Education</option>
                  <option value="System Design">System Design</option>
                  <option value="Writing">Writing</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Link Task</label>
                <select
                  value={linkedTaskId}
                  onChange={e => setLinkedTaskId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200"
                >
                  <option value="">None (Independent)</option>
                  {tasks.slice(0, 8).map(t => (
                    <option key={t.id} value={t.id}>{t.title.slice(0, 20)}...</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Big Digital Clock Display */}
          <div className="space-y-2">
            <div className="text-6xl md:text-7xl font-mono font-bold text-neutral-100 tracking-tight tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="w-64 h-1.5 bg-neutral-800 rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isActive ? 'Pause Sprint' : 'Start Focus'}</span>
            </button>
            <button
              onClick={() => {
                setIsActive(false);
                setSecondsRemaining(targetSeconds);
              }}
              title="Reset Timer"
              className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleCompleteSession}
              title="Finish & Log Early"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Log Session</span>
            </button>
          </div>
        </div>

        {/* Right: Work Volume Trend & Recent Sessions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-4 md:p-5 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-neutral-100">Daily Focus Volume (Hours)</h3>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <BarMetricChart
              data={chartData}
              unit="h"
              primaryColor="#6366f1"
              height={140}
            />
          </div>

          {/* Session history list */}
          <div className="p-4 md:p-5 rounded-xl bg-neutral-900 border border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-100 mb-3">Logged Focus Sessions</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {sessions.slice(0, 6).map(s => (
                <div
                  key={s.id}
                  className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-850 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-medium text-neutral-200 truncate">{s.title}</div>
                    <div className="text-[11px] text-neutral-500 font-mono">
                      {s.sessionDate} · {s.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono text-indigo-400 font-bold tabular-nums shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{s.durationMinutes}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
