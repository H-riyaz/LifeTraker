import { LifeOSData, Task, TimelineEvent, Habit, FitnessActivity, SleepRecord, ScreenTimeRecord, Transaction, Goal, JournalEntry, WorkSession, UserProfile } from '../types/lifeos';

const BASE = '/api';

export const api = {
  async getData(): Promise<LifeOSData> {
    const res = await fetch(`${BASE}/data`);
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  },

  async getDashboard(date?: string): Promise<any> {
    const q = date ? `?date=${encodeURIComponent(date)}` : '';
    const res = await fetch(`${BASE}/dashboard${q}`);
    if (!res.ok) throw new Error('Failed to fetch dashboard');
    return res.json();
  },

  async getAnalytics(date?: string, days: number = 14): Promise<any> {
    const q = `?date=${encodeURIComponent(date || '2026-09-24')}&days=${days}`;
    const res = await fetch(`${BASE}/analytics${q}`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  async getReport(period: 'daily' | 'weekly' | 'monthly', date?: string): Promise<any> {
    const q = date ? `?date=${encodeURIComponent(date)}` : '';
    const res = await fetch(`${BASE}/reports/${period}${q}`);
    if (!res.ok) throw new Error('Failed to fetch report');
    return res.json();
  },

  // Timeline
  async addTimelineEvent(event: Partial<TimelineEvent>): Promise<TimelineEvent> {
    const res = await fetch(`${BASE}/timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    return res.json();
  },

  async updateTimelineEvent(id: string, updates: Partial<TimelineEvent>): Promise<TimelineEvent> {
    const res = await fetch(`${BASE}/timeline/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async deleteTimelineEvent(id: string): Promise<void> {
    await fetch(`${BASE}/timeline/${id}`, { method: 'DELETE' });
  },

  // Tasks
  async addTask(task: Partial<Task>): Promise<Task> {
    const res = await fetch(`${BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return res.json();
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const res = await fetch(`${BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async deleteTask(id: string): Promise<void> {
    await fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' });
  },

  // Habits
  async addHabit(habit: Partial<Habit>): Promise<Habit> {
    const res = await fetch(`${BASE}/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habit),
    });
    return res.json();
  },

  async toggleHabit(id: string, date: string): Promise<any> {
    const res = await fetch(`${BASE}/habits/${id}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    });
    return res.json();
  },

  // Routines
  async toggleRoutineStep(routineId: string, stepId: string, completed: boolean): Promise<any> {
    const res = await fetch(`${BASE}/routines/${routineId}/step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepId, completed }),
    });
    return res.json();
  },

  // Focus sessions
  async logWorkSession(session: Partial<WorkSession>): Promise<WorkSession> {
    const res = await fetch(`${BASE}/work-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
    return res.json();
  },

  // Fitness & Body Metrics
  async logFitness(activity: Partial<FitnessActivity>): Promise<FitnessActivity> {
    const res = await fetch(`${BASE}/fitness`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    return res.json();
  },

  async logBodyMetric(metric: any): Promise<any> {
    const res = await fetch(`${BASE}/body-metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
    });
    return res.json();
  },

  // Sleep
  async logSleep(record: Partial<SleepRecord>): Promise<SleepRecord> {
    const res = await fetch(`${BASE}/sleep`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },

  // Screen Time
  async logScreenTime(record: Partial<ScreenTimeRecord>): Promise<ScreenTimeRecord> {
    const res = await fetch(`${BASE}/screen-time`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return res.json();
  },

  // Finances
  async addTransaction(tx: Partial<Transaction>): Promise<Transaction> {
    const res = await fetch(`${BASE}/finances/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tx),
    });
    return res.json();
  },

  async setBudget(budget: { category: string; monthlyLimit: number; monthYear: string }): Promise<any> {
    const res = await fetch(`${BASE}/finances/budget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budget),
    });
    return res.json();
  },

  // Goals
  async addGoal(goal: Partial<Goal>): Promise<Goal> {
    const res = await fetch(`${BASE}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal),
    });
    return res.json();
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
    const res = await fetch(`${BASE}/goals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  // Journal
  async saveJournalEntry(entry: Partial<JournalEntry>): Promise<JournalEntry> {
    const res = await fetch(`${BASE}/journal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    return res.json();
  },

  // Settings
  async updateSettings(settings: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch(`${BASE}/user/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.json();
  },

  async updateUserProfile(settings: Partial<UserProfile>): Promise<UserProfile> {
    return this.updateSettings(settings);
  },

  // AI
  async askAiAssistant(query: string, date?: string): Promise<string> {
    const res = await fetch(`${BASE}/gemini/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, date }),
    });
    const data = await res.json();
    return data.answer || 'No response received.';
  },

  async generateAiDailyPlan(date?: string, preferences?: string, applyToTimeline: boolean = false): Promise<any> {
    const res = await fetch(`${BASE}/gemini/planner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, preferences, applyToTimeline }),
    });
    return res.json();
  },

  // Search
  async search(query: string): Promise<any[]> {
    const res = await fetch(`${BASE}/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.results || [];
  },

  // Import
  async importData(data: LifeOSData): Promise<any> {
    const res = await fetch(`${BASE}/data/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
