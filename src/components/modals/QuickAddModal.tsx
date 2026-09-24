import React, { useState } from 'react';
import { X, CheckSquare, Wallet, Clock, Dumbbell, Flame, Repeat, Moon, BookOpen } from 'lucide-react';
import { api } from '../../services/api';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDate: string;
  onSuccess: () => void;
  currency: string;
}

type TabType = 'task' | 'finance' | 'event' | 'fitness' | 'focus' | 'habit' | 'sleep' | 'journal';

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  activeDate,
  onSuccess,
  currency,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('task');
  const [loading, setLoading] = useState(false);

  // Form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [taskCategory, setTaskCategory] = useState('Programming');
  const [taskDuration, setTaskDuration] = useState(45);

  const [financeType, setFinanceType] = useState<'expense' | 'income'>('expense');
  const [financeAmount, setFinanceAmount] = useState('');
  const [financeCategory, setFinanceCategory] = useState('Food');
  const [financeMethod, setFinanceMethod] = useState('eSewa');
  const [financeNotes, setFinanceNotes] = useState('');

  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState('Work');
  const [eventStart, setEventStart] = useState('10:00');
  const [eventEnd, setEventEnd] = useState('11:30');

  const [fitType, setFitType] = useState<'running' | 'gym' | 'walking' | 'cycling'>('running');
  const [fitDuration, setFitDuration] = useState(35);
  const [fitDistance, setFitDistance] = useState('4.5');
  const [fitCalories, setFitCalories] = useState(300);

  const [focusTitle, setFocusTitle] = useState('');
  const [focusMinutes, setFocusMinutes] = useState(50);
  const [focusCategory, setFocusCategory] = useState('Programming');

  const [habitName, setHabitName] = useState('');
  const [habitFrequency, setHabitFrequency] = useState<'daily' | 'weekdays' | 'weekly'>('daily');

  const [sleepStart, setSleepStart] = useState('23:00');
  const [sleepEnd, setSleepEnd] = useState('07:00');
  const [sleepQuality, setSleepQuality] = useState(85);

  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState(5);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'task') {
        if (!taskTitle) return;
        await api.addTask({
          title: taskTitle,
          priority: taskPriority,
          category: taskCategory,
          dueDate: activeDate,
          estimatedDurationMinutes: Number(taskDuration),
        });
      } else if (activeTab === 'finance') {
        if (!financeAmount) return;
        await api.addTransaction({
          type: financeType,
          amount: Number(financeAmount),
          currency,
          category: financeCategory,
          paymentMethod: financeMethod,
          transactionDate: activeDate,
          notes: financeNotes,
        });
      } else if (activeTab === 'event') {
        if (!eventTitle) return;
        await api.addTimelineEvent({
          title: eventTitle,
          category: eventCategory,
          eventDate: activeDate,
          plannedStartTime: eventStart,
          plannedEndTime: eventEnd,
          color: '#3b82f6',
        });
      } else if (activeTab === 'fitness') {
        await api.logFitness({
          activityType: fitType,
          activityDate: activeDate,
          durationMinutes: Number(fitDuration),
          distanceKm: Number(fitDistance) || 0,
          calories: Number(fitCalories) || 0,
        });
      } else if (activeTab === 'focus') {
        if (!focusTitle) return;
        await api.logWorkSession({
          title: focusTitle,
          category: focusCategory,
          sessionDate: activeDate,
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          durationMinutes: Number(focusMinutes),
          sessionMode: '50_10',
        });
      } else if (activeTab === 'habit') {
        if (!habitName) return;
        await api.addHabit({
          name: habitName,
          frequency: habitFrequency,
          startDate: activeDate,
        });
      } else if (activeTab === 'sleep') {
        const startH = parseInt(sleepStart.split(':')[0]);
        const endH = parseInt(sleepEnd.split(':')[0]);
        const diffH = endH >= startH ? endH - startH : endH + 24 - startH;
        await api.logSleep({
          sleepDate: activeDate,
          sleepStart,
          sleepEnd,
          durationMinutes: diffH * 60,
          qualityRating: Number(sleepQuality),
        });
      } else if (activeTab === 'journal') {
        if (!journalTitle) return;
        await api.saveJournalEntry({
          entryDate: activeDate,
          title: journalTitle,
          content: journalContent,
          moodScore: Number(journalMood),
          tags: ['quick-log'],
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'task', label: 'Task', icon: CheckSquare },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'event', label: 'Event', icon: Clock },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell },
    { id: 'focus', label: 'Focus', icon: Flame },
    { id: 'habit', label: 'Habit', icon: Repeat },
    { id: 'sleep', label: 'Sleep', icon: Moon },
    { id: 'journal', label: 'Journal', icon: BookOpen },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-neutral-100">Quick Log Entry</h3>
            <span className="text-xs font-mono text-neutral-400">({activeDate})</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="px-4 py-2 border-b border-neutral-800 flex items-center gap-1.5 overflow-x-auto bg-neutral-950/40">
          {tabs.map(t => {
            const Icon = t.icon;
            const isSel = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isSel ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* TASK FORM */}
          {activeTab === 'task' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design database migrations for analytics"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Category</label>
                  <select
                    value={taskCategory}
                    onChange={e => setTaskCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Education">Education</option>
                    <option value="Career">Career</option>
                    <option value="Personal">Personal</option>
                    <option value="Health">Health</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Est. Minutes</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={taskDuration}
                    onChange={e => setTaskDuration(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FINANCE FORM */}
          {activeTab === 'finance' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-lg border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setFinanceType('expense')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                    financeType === 'expense' ? 'bg-rose-500/20 text-rose-400 font-semibold' : 'text-neutral-400'
                  }`}
                >
                  Expense (-)
                </button>
                <button
                  type="button"
                  onClick={() => setFinanceType('income')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                    financeType === 'income' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-neutral-400'
                  }`}
                >
                  Income (+)
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Amount ({currency})</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 850"
                    value={financeAmount}
                    onChange={e => setFinanceAmount(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Category</label>
                  <select
                    value={financeCategory}
                    onChange={e => setFinanceCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Food">Food & Groceries</option>
                    <option value="Transport">Transport</option>
                    <option value="Education">Education & Books</option>
                    <option value="Bills">Bills & Internet</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Health">Health & Fitness</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Notes / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Afternoon healthy lunch"
                  value={financeNotes}
                  onChange={e => setFinanceNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* EVENT FORM */}
          {activeTab === 'event' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Work: LifeOS Core Engine"
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={eventStart}
                    onChange={e => setEventStart(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs font-mono text-neutral-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">End Time</label>
                  <input
                    type="time"
                    value={eventEnd}
                    onChange={e => setEventEnd(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs font-mono text-neutral-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={e => setEventCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-neutral-200"
                  >
                    <option value="Work">Work</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Routine">Routine</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* FITNESS FORM */}
          {activeTab === 'fitness' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Activity Type</label>
                  <select
                    value={fitType}
                    onChange={e => setFitType(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-neutral-200"
                  >
                    <option value="running">Running</option>
                    <option value="gym">Gym / Strength</option>
                    <option value="walking">Walking</option>
                    <option value="cycling">Cycling</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={fitDuration}
                    onChange={e => setFitDuration(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-neutral-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={fitDistance}
                    onChange={e => setFitDistance(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-neutral-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Calories Burned</label>
                  <input
                    type="number"
                    value={fitCalories}
                    onChange={e => setFitCalories(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-neutral-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FOCUS SPRINT FORM */}
          {activeTab === 'focus' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Focus Task / Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Consensus Engine"
                  value={focusTitle}
                  onChange={e => setFocusTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Minutes</label>
                  <input
                    type="number"
                    value={focusMinutes}
                    onChange={e => setFocusMinutes(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-neutral-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Category</label>
                  <select
                    value={focusCategory}
                    onChange={e => setFocusCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-neutral-200"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Education">Education</option>
                    <option value="Writing">Writing</option>
                    <option value="System Design">System Design</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* HABIT FORM */}
          {activeTab === 'habit' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 20 Pages Non-Fiction"
                  value={habitName}
                  onChange={e => setHabitName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Frequency</label>
                <select
                  value={habitFrequency}
                  onChange={e => setHabitFrequency(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-neutral-200"
                >
                  <option value="daily">Daily</option>
                  <option value="weekdays">Weekdays only</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          )}

          {/* SLEEP FORM */}
          {activeTab === 'sleep' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Bedtime</label>
                  <input
                    type="time"
                    value={sleepStart}
                    onChange={e => setSleepStart(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-neutral-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Wake Time</label>
                  <input
                    type="time"
                    value={sleepEnd}
                    onChange={e => setSleepEnd(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-neutral-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Quality Rating (1-100)</label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={sleepQuality}
                  onChange={e => setSleepQuality(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <div className="text-right text-xs font-mono text-neutral-300">{sleepQuality}/100</div>
              </div>
            </div>
          )}

          {/* JOURNAL FORM */}
          {activeTab === 'journal' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Entry Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evening Reflection & High Signal Moments"
                  value={journalTitle}
                  onChange={e => setJournalTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Reflection Content</label>
                <textarea
                  rows={3}
                  placeholder="What moved the needle most today? What should be improved tomorrow?"
                  value={journalContent}
                  onChange={e => setJournalContent(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
            >
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
