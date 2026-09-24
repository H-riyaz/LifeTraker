import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './server/db.js';
import { calculateDailySummary, calculateDateRangeSummaries, generatePersonalInsights } from './server/analytics.js';
import { askLifeAssistant, generateAiDailyPlan } from './server/gemini.js';
import { Task, TimelineEvent, Habit, FitnessActivity, SleepRecord, ScreenTimeRecord, Transaction, Goal, JournalEntry, WorkSession } from './src/types/lifeos.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: '15mb' }));

// -----------------------------------------------------------------------------
// REST API ROUTES
// -----------------------------------------------------------------------------

// 1. Full Data
app.get('/api/data', (_req, res) => {
  res.json(db.getData());
});

// 2. Dashboard Aggregated Command Center
app.get('/api/dashboard', (req, res) => {
  const targetDate = (req.query.date as string) || '2026-09-24';
  const data = db.getData();
  const summary = calculateDailySummary(data, targetDate);
  const insights = generatePersonalInsights(data, targetDate);

  const todayEvents = data.timelineEvents
    .filter(e => e.eventDate === targetDate)
    .sort((a, b) => a.plannedStartTime.localeCompare(b.plannedStartTime));

  const priorityTasks = data.tasks
    .filter(t => t.dueDate === targetDate || t.status === 'in_progress')
    .slice(0, 8);

  const activeHabits = data.habits.filter(h => !h.archived);
  const habitLogsToday = data.habitLogs.filter(l => l.logDate === targetDate);

  const todayFitness = data.fitnessActivities.filter(a => a.activityDate === targetDate);
  const todaySleep = data.sleepRecords.find(s => s.sleepDate === targetDate);
  const todayScreen = data.screenTimeRecords.filter(s => s.recordDate === targetDate);
  const todayWork = data.workSessions.filter(w => w.sessionDate === targetDate);
  const todayExpenses = data.transactions.filter(t => t.transactionDate === targetDate && t.type === 'expense');

  res.json({
    date: targetDate,
    user: data.user,
    summary,
    insights,
    timeline: todayEvents,
    tasks: priorityTasks,
    habits: activeHabits,
    habitLogs: habitLogsToday,
    fitness: todayFitness,
    sleep: todaySleep,
    screenTime: todayScreen,
    workSessions: todayWork,
    expenses: todayExpenses,
    goals: data.goals.slice(0, 4),
  });
});

// 3. Analytics & Correlations
app.get('/api/analytics', (req, res) => {
  const data = db.getData();
  const todayStr = (req.query.date as string) || '2026-09-24';
  const days = parseInt((req.query.days as string) || '14', 10);

  const end = new Date(todayStr);
  const start = new Date(todayStr);
  start.setDate(start.getDate() - (days - 1));

  const summaries = calculateDateRangeSummaries(
    data,
    start.toISOString().split('T')[0],
    end.toISOString().split('T')[0]
  );
  const insights = generatePersonalInsights(data, todayStr);

  res.json({
    summaries,
    insights,
  });
});

// 4. Reports (Daily, Weekly, Monthly)
app.get('/api/reports/:period', (req, res) => {
  const { period } = req.params;
  const dateStr = (req.query.date as string) || '2026-09-24';
  const data = db.getData();

  let days = 7;
  if (period === 'daily') days = 1;
  else if (period === 'monthly') days = 30;

  const end = new Date(dateStr);
  const start = new Date(dateStr);
  start.setDate(start.getDate() - (days - 1));

  const summaries = calculateDateRangeSummaries(
    data,
    start.toISOString().split('T')[0],
    end.toISOString().split('T')[0]
  );

  const totalFocusMin = summaries.reduce((a, s) => a + s.focusMinutes, 0);
  const totalExerciseMin = summaries.reduce((a, s) => a + s.exerciseMinutes, 0);
  const avgSleepMin = summaries.reduce((a, s) => a + s.sleepMinutes, 0) / (summaries.length || 1);
  const totalScreenMin = summaries.reduce((a, s) => a + s.screenTimeMinutes, 0);
  const totalExpense = summaries.reduce((a, s) => a + s.totalExpense, 0);
  const totalIncome = summaries.reduce((a, s) => a + s.totalIncome, 0);
  const completedTasks = summaries.reduce((a, s) => a + s.tasksCompleted, 0);
  const totalTasks = summaries.reduce((a, s) => a + s.tasksTotal, 0);
  const avgHabitConsistency = summaries.reduce((a, s) => a + s.habitConsistencyPct, 0) / (summaries.length || 1);
  const avgProductivityScore = summaries.reduce((a, s) => a + s.productivityScore, 0) / (summaries.length || 1);

  res.json({
    period,
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
    totalFocusMinutes: totalFocusMin,
    totalExerciseMinutes: totalExerciseMin,
    averageSleepMinutes: Math.round(avgSleepMin),
    totalScreenTimeMinutes: totalScreenMin,
    totalExpense,
    totalIncome,
    netSavings: totalIncome - totalExpense,
    savingsRatePct: totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0,
    tasksCompleted: completedTasks,
    tasksTotal: totalTasks,
    averageHabitConsistencyPct: Math.round(avgHabitConsistency),
    averageProductivityScore: Math.round(avgProductivityScore),
    summaries,
  });
});

// 5. Timeline Events CRUD
app.post('/api/timeline', (req, res) => {
  const event: TimelineEvent = {
    ...req.body,
    id: req.body.id || `evt_${Date.now()}`,
    isCompleted: req.body.isCompleted || false,
  };
  db.updateData(draft => {
    draft.timelineEvents.push(event);
  });
  res.json(event);
});

app.patch('/api/timeline/:id', (req, res) => {
  const { id } = req.params;
  let updated: TimelineEvent | null = null;
  db.updateData(draft => {
    const idx = draft.timelineEvents.findIndex(e => e.id === id);
    if (idx !== -1) {
      draft.timelineEvents[idx] = { ...draft.timelineEvents[idx], ...req.body };
      updated = draft.timelineEvents[idx];
    }
  });
  if (!updated) return res.status(404).json({ error: 'Event not found' });
  res.json(updated);
});

app.delete('/api/timeline/:id', (req, res) => {
  const { id } = req.params;
  db.updateData(draft => {
    draft.timelineEvents = draft.timelineEvents.filter(e => e.id !== id);
  });
  res.json({ success: true, id });
});

// 6. Tasks & Subtasks CRUD
app.post('/api/tasks', (req, res) => {
  const newTask: Task = {
    id: `tsk_${Date.now()}`,
    title: req.body.title,
    description: req.body.description || '',
    priority: req.body.priority || 'medium',
    status: req.body.status || 'todo',
    category: req.body.category || 'General',
    dueDate: req.body.dueDate || '2026-09-24',
    dueTime: req.body.dueTime,
    estimatedDurationMinutes: Number(req.body.estimatedDurationMinutes) || 30,
    actualDurationMinutes: Number(req.body.actualDurationMinutes) || 0,
    isRecurring: Boolean(req.body.isRecurring),
    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    subtasks: Array.isArray(req.body.subtasks) ? req.body.subtasks : [],
    createdAt: new Date().toISOString(),
  };

  db.updateData(draft => {
    draft.tasks.unshift(newTask);
  });
  res.json(newTask);
});

app.patch('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  let updated: Task | null = null;
  db.updateData(draft => {
    const idx = draft.tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      const current = draft.tasks[idx];
      const next = { ...current, ...req.body };
      if (req.body.status === 'completed' && current.status !== 'completed') {
        next.completedAt = new Date().toISOString();
      }
      draft.tasks[idx] = next;
      updated = next;
    }
  });
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json(updated);
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.updateData(draft => {
    draft.tasks = draft.tasks.filter(t => t.id !== id);
  });
  res.json({ success: true, id });
});

// 7. Habits & Habit Logs
app.post('/api/habits', (req, res) => {
  const habit: Habit = {
    id: `hbt_${Date.now()}`,
    name: req.body.name,
    description: req.body.description || '',
    frequency: req.body.frequency || 'daily',
    targetCount: Number(req.body.targetCount) || 1,
    unit: req.body.unit || 'times',
    category: req.body.category || 'Health',
    reminderTime: req.body.reminderTime,
    startDate: req.body.startDate || '2026-09-24',
    archived: false,
    currentStreak: 0,
    longestStreak: 0,
    totalCompletions: 0,
  };
  db.updateData(draft => {
    draft.habits.push(habit);
  });
  res.json(habit);
});

app.post('/api/habits/:id/toggle', (req, res) => {
  const { id } = req.params;
  const logDate = req.body.date || '2026-09-24';

  let habitResult: Habit | null = null;
  let completed = false;

  db.updateData(draft => {
    const habit = draft.habits.find(h => h.id === id);
    if (!habit) return;

    const logIdx = draft.habitLogs.findIndex(l => l.habitId === id && l.logDate === logDate);
    if (logIdx !== -1) {
      const current = draft.habitLogs[logIdx];
      completed = !current.completed;
      draft.habitLogs[logIdx].completed = completed;
      draft.habitLogs[logIdx].completedCount = completed ? habit.targetCount : 0;
    } else {
      completed = true;
      draft.habitLogs.push({
        id: `log_${id}_${logDate}`,
        habitId: id,
        logDate,
        completed: true,
        completedCount: habit.targetCount,
      });
    }

    if (completed) {
      habit.currentStreak += 1;
      if (habit.currentStreak > habit.longestStreak) {
        habit.longestStreak = habit.currentStreak;
      }
      habit.totalCompletions += 1;
    } else {
      habit.currentStreak = Math.max(0, habit.currentStreak - 1);
      habit.totalCompletions = Math.max(0, habit.totalCompletions - 1);
    }
    habitResult = habit;
  });

  if (!habitResult) return res.status(404).json({ error: 'Habit not found' });
  res.json({ habit: habitResult, completed, date: logDate });
});

// 8. Work / Study Focus Sessions (Pomodoro)
app.post('/api/work-sessions', (req, res) => {
  const session: WorkSession = {
    id: `ws_${Date.now()}`,
    title: req.body.title || 'Focus Session',
    category: req.body.category || 'Programming',
    taskId: req.body.taskId,
    sessionDate: req.body.sessionDate || '2026-09-24',
    startTime: req.body.startTime || new Date().toISOString(),
    endTime: req.body.endTime || new Date().toISOString(),
    durationMinutes: Number(req.body.durationMinutes) || 25,
    sessionMode: req.body.sessionMode || '25_5',
    interruptionCount: Number(req.body.interruptionCount) || 0,
    notes: req.body.notes,
  };

  db.updateData(draft => {
    draft.workSessions.unshift(session);
    if (session.taskId) {
      const task = draft.tasks.find(t => t.id === session.taskId);
      if (task) {
        task.actualDurationMinutes += session.durationMinutes;
      }
    }
  });

  res.json(session);
});

// 9. Fitness & Body Metrics
app.post('/api/fitness', (req, res) => {
  const activity: FitnessActivity = {
    id: `fit_${Date.now()}`,
    activityType: req.body.activityType || 'running',
    activityDate: req.body.activityDate || '2026-09-24',
    startTime: req.body.startTime,
    durationMinutes: Number(req.body.durationMinutes) || 30,
    distanceKm: Number(req.body.distanceKm) || 0,
    calories: Number(req.body.calories) || 0,
    intensity: req.body.intensity || 'moderate',
    notes: req.body.notes,
  };
  db.updateData(draft => {
    draft.fitnessActivities.unshift(activity);
  });
  res.json(activity);
});

app.post('/api/body-metrics', (req, res) => {
  const date = req.body.metricDate || '2026-09-24';
  let metric: any = null;
  db.updateData(draft => {
    const idx = draft.bodyMetrics.findIndex(m => m.metricDate === date);
    if (idx !== -1) {
      draft.bodyMetrics[idx] = { ...draft.bodyMetrics[idx], ...req.body };
      metric = draft.bodyMetrics[idx];
    } else {
      metric = {
        id: `bm_${Date.now()}`,
        metricDate: date,
        weightKg: req.body.weightKg ? Number(req.body.weightKg) : undefined,
        heightCm: req.body.heightCm ? Number(req.body.heightCm) : undefined,
        bodyFatPct: req.body.bodyFatPct ? Number(req.body.bodyFatPct) : undefined,
        restingHeartRate: req.body.restingHeartRate ? Number(req.body.restingHeartRate) : undefined,
        waterMl: Number(req.body.waterMl) || 0,
        steps: Number(req.body.steps) || 0,
      };
      draft.bodyMetrics.unshift(metric);
    }
  });
  res.json(metric);
});

// 10. Sleep Tracking
app.post('/api/sleep', (req, res) => {
  const record: SleepRecord = {
    id: `slp_${Date.now()}`,
    sleepDate: req.body.sleepDate || '2026-09-24',
    sleepStart: req.body.sleepStart || '23:00',
    sleepEnd: req.body.sleepEnd || '07:00',
    durationMinutes: Number(req.body.durationMinutes) || 480,
    goalMinutes: Number(req.body.goalMinutes) || 480,
    qualityRating: Number(req.body.qualityRating) || 85,
    interruptions: Number(req.body.interruptions) || 0,
    notes: req.body.notes,
  };
  db.updateData(draft => {
    const idx = draft.sleepRecords.findIndex(s => s.sleepDate === record.sleepDate);
    if (idx !== -1) {
      draft.sleepRecords[idx] = record;
    } else {
      draft.sleepRecords.unshift(record);
    }
  });
  res.json(record);
});

// 11. Screen Time
app.post('/api/screen-time', (req, res) => {
  const screen: ScreenTimeRecord = {
    id: `st_${Date.now()}`,
    recordDate: req.body.recordDate || '2026-09-24',
    deviceName: req.body.deviceName || 'MacBook',
    appOrSite: req.body.appOrSite || 'Browser',
    category: req.body.category || 'Work',
    durationMinutes: Number(req.body.durationMinutes) || 30,
    isProductive: Boolean(req.body.isProductive),
  };
  db.updateData(draft => {
    draft.screenTimeRecords.unshift(screen);
  });
  res.json(screen);
});

// 12. Finances: Expenses, Income, Budgets
app.post('/api/finances/transaction', (req, res) => {
  const currentCurrency = db.getData().user.currency || 'NPR';
  const tx: Transaction = {
    id: `tx_${Date.now()}`,
    type: req.body.type || 'expense',
    amount: Number(req.body.amount) || 0,
    currency: req.body.currency || currentCurrency,
    category: req.body.category || 'Other',
    paymentMethod: req.body.paymentMethod || 'eSewa / Cash',
    transactionDate: req.body.transactionDate || '2026-09-24',
    isRecurring: Boolean(req.body.isRecurring),
    notes: req.body.notes,
  };
  db.updateData(draft => {
    draft.transactions.unshift(tx);
  });
  res.json(tx);
});

app.post('/api/finances/budget', (req, res) => {
  const { category, monthlyLimit, monthYear } = req.body;
  const currentCurrency = db.getData().user.currency || 'NPR';
  let budgetObj: any = null;

  db.updateData(draft => {
    const idx = draft.budgets.findIndex(b => b.category === category && b.monthYear === monthYear);
    if (idx !== -1) {
      draft.budgets[idx].monthlyLimit = Number(monthlyLimit);
      budgetObj = draft.budgets[idx];
    } else {
      budgetObj = {
        id: `bdg_${Date.now()}`,
        category,
        monthlyLimit: Number(monthlyLimit),
        currency: currentCurrency,
        monthYear,
      };
      draft.budgets.push(budgetObj);
    }
  });

  res.json(budgetObj);
});

// 13. Goals & Milestones
app.post('/api/goals', (req, res) => {
  const goal: Goal = {
    id: `gol_${Date.now()}`,
    title: req.body.title,
    description: req.body.description || '',
    category: req.body.category || 'Career',
    targetValue: Number(req.body.targetValue) || 100,
    currentValue: Number(req.body.currentValue) || 0,
    unit: req.body.unit || 'units',
    deadline: req.body.deadline,
    isCompleted: false,
    milestones: Array.isArray(req.body.milestones) ? req.body.milestones : [],
    relatedHabitIds: req.body.relatedHabitIds || [],
    relatedTaskIds: req.body.relatedTaskIds || [],
  };
  db.updateData(draft => {
    draft.goals.push(goal);
  });
  res.json(goal);
});

app.patch('/api/goals/:id', (req, res) => {
  const { id } = req.params;
  let updated: Goal | null = null;
  db.updateData(draft => {
    const idx = draft.goals.findIndex(g => g.id === id);
    if (idx !== -1) {
      draft.goals[idx] = { ...draft.goals[idx], ...req.body };
      if (draft.goals[idx].currentValue >= draft.goals[idx].targetValue) {
        draft.goals[idx].isCompleted = true;
      }
      updated = draft.goals[idx];
    }
  });
  if (!updated) return res.status(404).json({ error: 'Goal not found' });
  res.json(updated);
});

// 14. Private Journal
app.post('/api/journal', (req, res) => {
  const entryDate = req.body.entryDate || '2026-09-24';
  let entry: JournalEntry | null = null;

  db.updateData(draft => {
    const idx = draft.journalEntries.findIndex(j => j.entryDate === entryDate);
    if (idx !== -1) {
      draft.journalEntries[idx] = { ...draft.journalEntries[idx], ...req.body };
      entry = draft.journalEntries[idx];
    } else {
      entry = {
        id: `jnl_${Date.now()}`,
        entryDate,
        title: req.body.title || 'Daily Reflection',
        content: req.body.content || '',
        moodScore: Number(req.body.moodScore) || 4,
        tags: Array.isArray(req.body.tags) ? req.body.tags : [],
        promptUsed: req.body.promptUsed,
        gratitude: Array.isArray(req.body.gratitude) ? req.body.gratitude : [],
        isPrivate: true,
      };
      draft.journalEntries.unshift(entry);
    }
  });
  res.json(entry);
});

// 15. Routines Step Completion
app.post('/api/routines/:id/step', (req, res) => {
  const { id } = req.params;
  const { stepId, completed } = req.body;
  let updatedRoutine: any = null;

  db.updateData(draft => {
    const routine = draft.routines.find(r => r.id === id);
    if (routine) {
      const item = routine.items.find(i => i.id === stepId);
      if (item) {
        item.isCompletedToday = completed;
      }
      updatedRoutine = routine;
    }
  });

  if (!updatedRoutine) return res.status(404).json({ error: 'Routine not found' });
  res.json(updatedRoutine);
});

// 16. User Settings & Preferences
app.post('/api/user/settings', (req, res) => {
  let updatedUser: any = null;
  db.updateData(draft => {
    draft.user = { ...draft.user, ...req.body };
    updatedUser = draft.user;
  });
  res.json(updatedUser);
});

// 17. AI Assistant & AI Daily Planner (Server-side Gemini 3.8 Flash)
app.post('/api/gemini/assistant', async (req, res) => {
  const { query, date } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }
  const targetDate = date || '2026-09-24';
  const data = db.getData();
  const answer = await askLifeAssistant(query, data, targetDate);
  res.json({ answer });
});

app.post('/api/gemini/planner', async (req, res) => {
  const { date, preferences, applyToTimeline } = req.body;
  const targetDate = date || '2026-09-24';
  const data = db.getData();
  const plan = await generateAiDailyPlan(data, targetDate, preferences);

  // If user requests to apply the suggested schedule directly to their timeline
  if (applyToTimeline && plan.schedule && plan.schedule.length > 0) {
    db.updateData(draft => {
      // Remove existing pending events for the date to avoid duplicate clutter
      draft.timelineEvents = draft.timelineEvents.filter(
        e => !(e.eventDate === targetDate && !e.isCompleted)
      );

      for (const item of plan.schedule) {
        const times = item.time.split('-').map(s => s.trim());
        const start = times[0] || '09:00';
        const end = times[1] || '10:00';

        const categoryColorMap: Record<string, string> = {
          Work: '#3b82f6',
          Fitness: '#10b981',
          Health: '#06b6d4',
          Routine: '#6366f1',
          Education: '#8b5cf6',
          Rest: '#f59e0b',
        };

        draft.timelineEvents.push({
          id: `evt_ai_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          title: item.title,
          category: item.category,
          eventDate: targetDate,
          plannedStartTime: start,
          plannedEndTime: end,
          isCompleted: false,
          color: categoryColorMap[item.category] || '#6366f1',
          notes: item.rationale,
        });
      }
    });
  }

  res.json({ plan, applied: Boolean(applyToTimeline) });
});

// 18. Global Search
app.get('/api/search', (req, res) => {
  const query = ((req.query.q as string) || '').toLowerCase().trim();
  if (!query) {
    return res.json({ results: [] });
  }

  const data = db.getData();
  const results: Array<{ id: string; module: string; title: string; detail: string; date?: string }> = [];

  // Tasks
  for (const t of data.tasks) {
    if (t.title.toLowerCase().includes(query) || (t.description && t.description.toLowerCase().includes(query))) {
      results.push({ id: t.id, module: 'Tasks', title: t.title, detail: `Priority: ${t.priority} · Status: ${t.status}`, date: t.dueDate });
    }
  }

  // Habits
  for (const h of data.habits) {
    if (h.name.toLowerCase().includes(query) || (h.description && h.description.toLowerCase().includes(query))) {
      results.push({ id: h.id, module: 'Habits', title: h.name, detail: `${h.currentStreak} day streak · Target: ${h.targetCount} ${h.unit}` });
    }
  }

  // Journal
  for (const j of data.journalEntries) {
    if (j.title.toLowerCase().includes(query) || j.content.toLowerCase().includes(query)) {
      results.push({ id: j.id, module: 'Journal', title: j.title, detail: `Mood: ${j.moodScore}/5`, date: j.entryDate });
    }
  }

  // Goals
  for (const g of data.goals) {
    if (g.title.toLowerCase().includes(query) || (g.description && g.description.toLowerCase().includes(query))) {
      results.push({ id: g.id, module: 'Goals', title: g.title, detail: `Progress: ${g.currentValue}/${g.targetValue} ${g.unit}` });
    }
  }

  // Transactions
  for (const tx of data.transactions) {
    if (tx.category.toLowerCase().includes(query) || (tx.notes && tx.notes.toLowerCase().includes(query))) {
      results.push({ id: tx.id, module: 'Finance', title: `${tx.type === 'expense' ? '-' : '+'}${tx.currency} ${tx.amount}`, detail: `${tx.category} · ${tx.paymentMethod}`, date: tx.transactionDate });
    }
  }

  res.json({ results: results.slice(0, 20) });
});

// 19. Data Export & Import
app.get('/api/data/export', (req, res) => {
  const format = req.query.format || 'json';
  const data = db.getData();

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="lifeos_backup.json"');
    return res.send(JSON.stringify(data, null, 2));
  }

  // CSV export: Tasks & Transactions
  let csv = 'Module,ID,Date,Title/Category,Value/Amount,Status/Notes\n';
  for (const t of data.tasks) {
    csv += `"Task","${t.id}","${t.dueDate}","${t.title.replace(/"/g, '""')}","${t.estimatedDurationMinutes}m","${t.status}"\n`;
  }
  for (const tx of data.transactions) {
    csv += `"Finance","${tx.id}","${tx.transactionDate}","${tx.category}","${tx.amount} ${tx.currency}","${tx.type}"\n`;
  }
  for (const h of data.habits) {
    csv += `"Habit","${h.id}","${h.startDate}","${h.name.replace(/"/g, '""')}","${h.currentStreak}d streak","${h.frequency}"\n`;
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="lifeos_export.csv"');
  res.send(csv);
});

app.post('/api/data/import', (req, res) => {
  const incoming = req.body;
  if (!incoming || !incoming.user || !incoming.tasks) {
    return res.status(400).json({ error: 'Invalid LifeOS backup file format' });
  }
  db.saveData(incoming);
  res.json({ success: true, message: 'Data imported and persisted successfully' });
});

// -----------------------------------------------------------------------------
// VITE MIDDLEWARE (DEV) & STATIC SERVING (PROD)
// -----------------------------------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`LifeOS server running on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start LifeOS server:', err);
  process.exit(1);
});
