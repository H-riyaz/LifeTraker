import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LifeOSData, UserProfile, WorkSession } from '../src/types/lifeos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'lifeos_db.json');

function generateInitialSeedData(): LifeOSData {
  const today = '2026-09-24';
  const currency = 'NPR';

  const user: UserProfile = {
    id: 'usr_default_001',
    email: 'hriyaztimalsina2061@gmail.com',
    fullName: 'Riyaz Timalsina',
    currency: 'NPR',
    timezone: 'Asia/Kathmandu',
    theme: 'dark',
    dailySleepGoalMinutes: 480, // 8 hours
    dailyWorkGoalMinutes: 360, // 6 hours
    dailyExerciseGoalMinutes: 45,
    dailyWaterGoalMl: 3000,
    dailyScreenLimitMinutes: 270, // 4.5 hours
  };

  // Timeline events for today
  const timelineEvents = [
    {
      id: 'evt_01',
      title: 'Wake up & Morning Hydration',
      category: 'Health',
      eventDate: today,
      plannedStartTime: '06:30',
      plannedEndTime: '07:00',
      actualStartTime: '06:30',
      actualEndTime: '07:00',
      isCompleted: true,
      color: '#10b981',
      notes: 'Drank 600ml warm water with lemon.',
    },
    {
      id: 'evt_02',
      title: 'Morning 5K Outdoor Run & Mobility',
      category: 'Fitness',
      eventDate: today,
      plannedStartTime: '07:00',
      plannedEndTime: '07:45',
      actualStartTime: '07:05',
      actualEndTime: '07:50',
      isCompleted: true,
      color: '#f59e0b',
      notes: 'Paced at 5:10/km, felt energized.',
    },
    {
      id: 'evt_03',
      title: 'Nutrient-Dense Breakfast & Technical Reading',
      category: 'Routine',
      eventDate: today,
      plannedStartTime: '08:00',
      plannedEndTime: '08:45',
      actualStartTime: '08:00',
      actualEndTime: '08:40',
      isCompleted: true,
      color: '#6366f1',
      notes: 'Oats, eggs, fruits + read 15 pages of Designing Data-Intensive Applications.',
    },
    {
      id: 'evt_04',
      title: 'Deep Work: LifeOS Database & Backend API',
      category: 'Work',
      eventDate: today,
      plannedStartTime: '09:00',
      plannedEndTime: '12:00',
      actualStartTime: '09:00',
      actualEndTime: '12:15',
      isCompleted: true,
      color: '#3b82f6',
      notes: 'Built relational schema, analytics engine, and REST routes.',
    },
    {
      id: 'evt_05',
      title: 'Lunch & Fresh Air Break',
      category: 'Routine',
      eventDate: today,
      plannedStartTime: '12:15',
      plannedEndTime: '13:15',
      actualStartTime: '12:15',
      actualEndTime: '13:15',
      isCompleted: true,
      color: '#10b981',
      notes: 'Healthy home-cooked meal.',
    },
    {
      id: 'evt_06',
      title: 'Computer Science / Algorithms Study',
      category: 'Education',
      eventDate: today,
      plannedStartTime: '13:30',
      plannedEndTime: '15:30',
      actualStartTime: '13:30',
      actualEndTime: '15:15',
      isCompleted: true,
      color: '#8b5cf6',
      notes: 'Practiced graph traversal problems and dynamic programming.',
    },
    {
      id: 'evt_07',
      title: 'Focus Sprint: Frontend Architecture & Dashboards',
      category: 'Work',
      eventDate: today,
      plannedStartTime: '16:00',
      plannedEndTime: '18:30',
      actualStartTime: '16:00',
      actualEndTime: '18:30',
      isCompleted: false,
      color: '#3b82f6',
      notes: 'Implement dark/light layout, zero-pill widgets, and bespoke SVG charts.',
    },
    {
      id: 'evt_08',
      title: 'Brisk Walk & Sunset Reflection',
      category: 'Fitness',
      eventDate: today,
      plannedStartTime: '18:45',
      plannedEndTime: '19:30',
      actualStartTime: undefined,
      actualEndTime: undefined,
      isCompleted: false,
      color: '#10b981',
      notes: 'Unplugged walk, audio podcast.',
    },
    {
      id: 'evt_09',
      title: 'Dinner & Quality Family Time',
      category: 'Routine',
      eventDate: today,
      plannedStartTime: '19:45',
      plannedEndTime: '21:00',
      actualStartTime: undefined,
      actualEndTime: undefined,
      isCompleted: false,
      color: '#f97316',
      notes: 'No screens at the table.',
    },
    {
      id: 'evt_10',
      title: 'Night Routine, Journaling & Sleep Prep',
      category: 'Routine',
      eventDate: today,
      plannedStartTime: '21:30',
      plannedEndTime: '22:30',
      actualStartTime: undefined,
      actualEndTime: undefined,
      isCompleted: false,
      color: '#6366f1',
      notes: 'Daily retrospective and read fiction.',
    },
  ];

  // Tasks
  const tasks = [
    {
      id: 'tsk_01',
      title: 'Complete LifeOS normalized PostgreSQL schema and migration scripts',
      description: 'Define tables for timeline, tasks, habits, finances, sleep, and derived rollups.',
      priority: 'urgent' as const,
      status: 'completed' as const,
      category: 'Programming',
      dueDate: today,
      estimatedDurationMinutes: 120,
      actualDurationMinutes: 110,
      isRecurring: false,
      tags: ['database', 'architecture', 'backend'],
      subtasks: [
        { id: 'sub_1', title: 'Define entities and relationships', completed: true },
        { id: 'sub_2', title: 'Write PostgreSQL DDL in schema.sql', completed: true },
        { id: 'sub_3', title: 'Add indexes for fast date queries', completed: true },
      ],
      completedAt: '2026-09-24T11:45:00Z',
      createdAt: '2026-09-23T14:00:00Z',
    },
    {
      id: 'tsk_02',
      title: 'Implement mathematical analytics engine and derived scores',
      description: 'Compute Productivity Score, Habit Consistency, Schedule Adherence, and Pearson correlations.',
      priority: 'high' as const,
      status: 'completed' as const,
      category: 'Programming',
      dueDate: today,
      estimatedDurationMinutes: 90,
      actualDurationMinutes: 85,
      isRecurring: false,
      tags: ['analytics', 'math', 'core'],
      subtasks: [
        { id: 'sub_4', title: 'Code formula for productivity score', completed: true },
        { id: 'sub_5', title: 'Implement bivariate correlation helper', completed: true },
      ],
      completedAt: '2026-09-24T12:15:00Z',
      createdAt: '2026-09-23T16:00:00Z',
    },
    {
      id: 'tsk_03',
      title: 'Build high-performance bespoke SVG charts for LifeOS',
      description: 'Area trend curves, bar comparison distributions, and scatter correlation charts.',
      priority: 'high' as const,
      status: 'in_progress' as const,
      category: 'Frontend',
      dueDate: today,
      estimatedDurationMinutes: 120,
      actualDurationMinutes: 50,
      isRecurring: false,
      tags: ['ui', 'dataviz', 'react'],
      subtasks: [
        { id: 'sub_6', title: 'AreaTrendChart with gradient fill', completed: true },
        { id: 'sub_7', title: 'BarMetricChart with dual series', completed: true },
        { id: 'sub_8', title: 'ScatterPlot for correlation analysis', completed: false },
      ],
      createdAt: '2026-09-24T08:00:00Z',
    },
    {
      id: 'tsk_04',
      title: 'Review weekly budget utilization and adjust dining spending',
      description: 'Keep food & groceries under NPR 15,000 monthly ceiling.',
      priority: 'medium' as const,
      status: 'todo' as const,
      category: 'Finances',
      dueDate: today,
      estimatedDurationMinutes: 30,
      actualDurationMinutes: 0,
      isRecurring: true,
      recurrenceRule: 'WEEKLY',
      tags: ['finance', 'budget'],
      subtasks: [
        { id: 'sub_9', title: 'Check eSewa transaction log', completed: false },
        { id: 'sub_10', title: 'Calculate remaining disposable cash', completed: false },
      ],
      createdAt: '2026-09-24T08:30:00Z',
    },
    {
      id: 'tsk_05',
      title: 'Read Chapter 4 of System Design Interview',
      description: 'Focus on distributed caching and database partitioning techniques.',
      priority: 'medium' as const,
      status: 'todo' as const,
      category: 'Education',
      dueDate: today,
      estimatedDurationMinutes: 45,
      actualDurationMinutes: 0,
      isRecurring: false,
      tags: ['study', 'reading'],
      subtasks: [],
      createdAt: '2026-09-24T09:00:00Z',
    },
    {
      id: 'tsk_06',
      title: 'Configure server-side Gemini 3.8 Flash assistant endpoints',
      description: 'Privacy-aware context builder for intelligent daily planning and questions.',
      priority: 'urgent' as const,
      status: 'in_progress' as const,
      category: 'Programming',
      dueDate: today,
      estimatedDurationMinutes: 60,
      actualDurationMinutes: 30,
      isRecurring: false,
      tags: ['ai', 'gemini', 'backend'],
      subtasks: [
        { id: 'sub_11', title: 'Set up GoogleGenAI client with server headers', completed: true },
        { id: 'sub_12', title: 'Build structured daily planning prompt', completed: false },
      ],
      createdAt: '2026-09-24T09:30:00Z',
    },
  ];

  // Habits
  const habits = [
    {
      id: 'hbt_01',
      name: 'Drink 3 Liters of Water',
      description: 'Consistent hydration throughout waking hours',
      frequency: 'daily' as const,
      targetCount: 3,
      unit: 'liters',
      category: 'Health',
      reminderTime: '08:00',
      startDate: '2026-08-01',
      archived: false,
      currentStreak: 21,
      longestStreak: 34,
      totalCompletions: 48,
    },
    {
      id: 'hbt_02',
      name: 'Coding & Systems Practice (2+ hrs)',
      description: 'Hands-on programming on high-impact projects or algorithms',
      frequency: 'daily' as const,
      targetCount: 1,
      unit: 'session',
      category: 'Career',
      reminderTime: '09:00',
      startDate: '2026-08-10',
      archived: false,
      currentStreak: 18,
      longestStreak: 26,
      totalCompletions: 42,
    },
    {
      id: 'hbt_03',
      name: 'Physical Exercise / Workout',
      description: 'Run, gym strength training, or mobility work',
      frequency: 'daily' as const,
      targetCount: 1,
      unit: 'workout',
      category: 'Fitness',
      reminderTime: '07:00',
      startDate: '2026-08-01',
      archived: false,
      currentStreak: 9,
      longestStreak: 15,
      totalCompletions: 38,
    },
    {
      id: 'hbt_04',
      name: 'Read 20 Pages of Non-Fiction',
      description: 'Engineering, philosophy, or personal mastery books',
      frequency: 'daily' as const,
      targetCount: 20,
      unit: 'pages',
      category: 'Education',
      reminderTime: '21:00',
      startDate: '2026-08-15',
      archived: false,
      currentStreak: 12,
      longestStreak: 20,
      totalCompletions: 35,
    },
    {
      id: 'hbt_05',
      name: 'Screen-Free 30 Mins Before Bed',
      description: 'Zero phone or laptop screens before sleeping',
      frequency: 'daily' as const,
      targetCount: 1,
      unit: 'night',
      category: 'Sleep',
      reminderTime: '22:30',
      startDate: '2026-09-01',
      archived: false,
      currentStreak: 6,
      longestStreak: 11,
      totalCompletions: 20,
    },
    {
      id: 'hbt_06',
      name: 'Daily Gratitude & Retrospective Log',
      description: 'Write 3 things grateful for and lesson learned',
      frequency: 'daily' as const,
      targetCount: 1,
      unit: 'entry',
      category: 'Mindset',
      reminderTime: '21:45',
      startDate: '2026-08-20',
      archived: false,
      currentStreak: 15,
      longestStreak: 22,
      totalCompletions: 31,
    },
  ];

  // Habit logs for past 14 days
  const habitLogs = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date('2026-09-24');
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    for (const habit of habits) {
      const isCompleted = i === 0
        ? (habit.id === 'hbt_01' || habit.id === 'hbt_02' || habit.id === 'hbt_03') // Today partially completed
        : (i % 7 !== 4); // Occasional rest day
      habitLogs.push({
        id: `log_${habit.id}_${dateStr}`,
        habitId: habit.id,
        logDate: dateStr,
        completedCount: isCompleted ? habit.targetCount : 0,
        completed: isCompleted,
      });
    }
  }

  // Routines
  const routines = [
    {
      id: 'rtn_01',
      title: 'Morning Awakening Routine',
      routineType: 'morning' as const,
      targetTime: '06:30',
      items: [
        { id: 'ri_1', title: 'Immediate cold face wash & hydrate 600ml', durationMinutes: 5, orderIndex: 1, isCompletedToday: true },
        { id: 'ri_2', title: '5-minute breathwork & body scan', durationMinutes: 5, orderIndex: 2, isCompletedToday: true },
        { id: 'ri_3', title: 'Change into running gear & dynamic stretch', durationMinutes: 10, orderIndex: 3, isCompletedToday: true },
        { id: 'ri_4', title: 'Cold shower & dress for day', durationMinutes: 15, orderIndex: 4, isCompletedToday: true },
        { id: 'ri_5', title: 'Nutritious high-protein breakfast', durationMinutes: 20, orderIndex: 5, isCompletedToday: true },
        { id: 'ri_6', title: 'Review LifeOS daily schedule & priorities', durationMinutes: 5, orderIndex: 6, isCompletedToday: true },
      ],
    },
    {
      id: 'rtn_02',
      title: 'Evening Wind-Down Routine',
      routineType: 'night' as const,
      targetTime: '21:30',
      items: [
        { id: 'ri_7', title: 'Shut down workstation and disconnect screens', durationMinutes: 5, orderIndex: 1, isCompletedToday: false },
        { id: 'ri_8', title: 'Prepare clothes & desk for tomorrow', durationMinutes: 10, orderIndex: 2, isCompletedToday: false },
        { id: 'ri_9', title: 'Write LifeOS private journal & gratitude reflection', durationMinutes: 15, orderIndex: 3, isCompletedToday: false },
        { id: 'ri_10', title: 'Read 20 pages of paper book', durationMinutes: 20, orderIndex: 4, isCompletedToday: false },
        { id: 'ri_11', title: 'Dim lights, room temperature to 20°C, sleep', durationMinutes: 10, orderIndex: 5, isCompletedToday: false },
      ],
    },
  ];

  // Work Sessions
  const workSessions: WorkSession[] = [
    {
      id: 'ws_01',
      title: 'Relational Database Schema & System Models',
      category: 'Programming',
      taskId: 'tsk_01',
      sessionDate: today,
      startTime: '2026-09-24T09:00:00Z',
      endTime: '2026-09-24T10:45:00Z',
      durationMinutes: 105,
      sessionMode: '50_10' as const,
      interruptionCount: 0,
      notes: 'Completed 2 blocks of 50 minutes deep focus without social media distraction.',
    },
    {
      id: 'ws_02',
      title: 'Mathematical Analytics & Metric Algorithms',
      category: 'Programming',
      taskId: 'tsk_02',
      sessionDate: today,
      startTime: '2026-09-24T11:00:00Z',
      endTime: '2026-09-24T12:15:00Z',
      durationMinutes: 75,
      sessionMode: '25_5' as const,
      interruptionCount: 1,
      notes: 'Implemented schedule adherence, habit consistency, and Pearson correlation equations.',
    },
    {
      id: 'ws_03',
      title: 'Advanced Data Structures & Graph Algorithms',
      category: 'Education',
      sessionDate: today,
      startTime: '2026-09-24T13:30:00Z',
      endTime: '2026-09-24T15:15:00Z',
      durationMinutes: 105,
      sessionMode: '50_10' as const,
      interruptionCount: 0,
      notes: 'Solved 2 LeetCode hard problems on topological sorting and memoization.',
    },
  ];

  // Populate past 7 days of work sessions
  for (let i = 1; i <= 7; i++) {
    const d = new Date('2026-09-24');
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dur1 = 90 + (i * 10) % 60;
    const dur2 = 120 + (i * 15) % 90;

    workSessions.push(
      {
        id: `ws_hist_${i}_1`,
        title: 'Core Systems Architecture & Backend',
        category: 'Programming',
        sessionDate: dateStr,
        startTime: `${dateStr}T09:15:00Z`,
        endTime: `${dateStr}T11:15:00Z`,
        durationMinutes: dur1,
        sessionMode: '50_10' as const,
        interruptionCount: i % 2,
      },
      {
        id: `ws_hist_${i}_2`,
        title: 'Distributed Systems Study & Research',
        category: 'Education',
        sessionDate: dateStr,
        startTime: `${dateStr}T14:00:00Z`,
        endTime: `${dateStr}T16:30:00Z`,
        durationMinutes: dur2,
        sessionMode: '25_5' as const,
        interruptionCount: 0,
      }
    );
  }

  // Fitness Activities
  const fitnessActivities = [
    {
      id: 'fit_01',
      activityType: 'running' as const,
      activityDate: today,
      startTime: '07:05',
      durationMinutes: 38,
      distanceKm: 5.4,
      calories: 380,
      intensity: 'vigorous' as const,
      notes: 'Morning trail run, steady cadence 172 spm.',
    },
    {
      id: 'fit_02',
      activityType: 'gym' as const,
      activityDate: '2026-09-23',
      startTime: '17:30',
      durationMinutes: 55,
      distanceKm: 0,
      calories: 420,
      intensity: 'vigorous' as const,
      notes: 'Leg day: Squats, Romanian Deadlifts, Calves, Core planks.',
    },
    {
      id: 'fit_03',
      activityType: 'walking' as const,
      activityDate: '2026-09-22',
      startTime: '18:15',
      durationMinutes: 45,
      distanceKm: 3.8,
      calories: 190,
      intensity: 'moderate' as const,
      notes: 'Sunset walk around the neighborhood.',
    },
    {
      id: 'fit_04',
      activityType: 'cycling' as const,
      activityDate: '2026-09-21',
      startTime: '06:45',
      durationMinutes: 50,
      distanceKm: 16.5,
      calories: 480,
      intensity: 'vigorous' as const,
      notes: 'Road cycling uphill interval sprints.',
    },
    {
      id: 'fit_05',
      activityType: 'gym' as const,
      activityDate: '2026-09-20',
      startTime: '17:00',
      durationMinutes: 60,
      distanceKm: 0,
      calories: 440,
      intensity: 'vigorous' as const,
      notes: 'Upper Body: Overhead Press, Pull-ups, Incline DB Bench.',
    },
  ];

  // Body Metrics
  const bodyMetrics = [
    {
      id: 'bm_01',
      metricDate: today,
      weightKg: 68.4,
      heightCm: 176,
      bodyFatPct: 14.8,
      restingHeartRate: 52,
      waterMl: 2400,
      steps: 8420,
    },
    {
      id: 'bm_02',
      metricDate: '2026-09-23',
      weightKg: 68.5,
      restingHeartRate: 54,
      waterMl: 3100,
      steps: 11200,
    },
    {
      id: 'bm_03',
      metricDate: '2026-09-22',
      weightKg: 68.7,
      restingHeartRate: 53,
      waterMl: 2900,
      steps: 9800,
    },
    {
      id: 'bm_04',
      metricDate: '2026-09-21',
      weightKg: 68.6,
      restingHeartRate: 51,
      waterMl: 3200,
      steps: 12400,
    },
    {
      id: 'bm_05',
      metricDate: '2026-09-20',
      weightKg: 68.8,
      restingHeartRate: 55,
      waterMl: 2800,
      steps: 7600,
    },
  ];

  // Sleep Records
  const sleepRecords = [
    {
      id: 'slp_01',
      sleepDate: today,
      sleepStart: '2026-09-23T23:10:00Z',
      sleepEnd: '2026-09-24T06:30:00Z',
      durationMinutes: 440, // 7h 20m
      goalMinutes: 480, // 8h
      qualityRating: 88,
      interruptions: 0,
      notes: 'Deep, uninterrupted sleep. Woke up refreshed.',
    },
    {
      id: 'slp_02',
      sleepDate: '2026-09-23',
      sleepStart: '2026-09-22T23:30:00Z',
      sleepEnd: '2026-09-23T06:45:00Z',
      durationMinutes: 435, // 7h 15m
      goalMinutes: 480,
      qualityRating: 82,
      interruptions: 1,
      notes: 'Brief awakening at 3 AM to drink water.',
    },
    {
      id: 'slp_03',
      sleepDate: '2026-09-22',
      sleepStart: '2026-09-21T22:50:00Z',
      sleepEnd: '2026-09-22T06:30:00Z',
      durationMinutes: 460, // 7h 40m
      goalMinutes: 480,
      qualityRating: 92,
      interruptions: 0,
      notes: 'Excellent deep sleep score, room was cool.',
    },
    {
      id: 'slp_04',
      sleepDate: '2026-09-21',
      sleepStart: '2026-09-20T23:45:00Z',
      sleepEnd: '2026-09-21T06:30:00Z',
      durationMinutes: 405, // 6h 45m
      goalMinutes: 480,
      qualityRating: 75,
      interruptions: 2,
      notes: 'Slightly late bedtime due to coding project.',
    },
    {
      id: 'slp_05',
      sleepDate: '2026-09-20',
      sleepStart: '2026-09-19T23:00:00Z',
      sleepEnd: '2026-09-20T07:15:00Z',
      durationMinutes: 495, // 8h 15m
      goalMinutes: 480,
      qualityRating: 95,
      interruptions: 0,
      notes: 'Full restorative Sunday sleep.',
    },
  ];

  // Screen Time Records
  const screenTimeRecords = [
    {
      id: 'st_01',
      recordDate: today,
      deviceName: 'MacBook Pro',
      appOrSite: 'VS Code & Terminal',
      category: 'Programming' as const,
      durationMinutes: 165,
      isProductive: true,
    },
    {
      id: 'st_02',
      recordDate: today,
      deviceName: 'MacBook Pro',
      appOrSite: 'GitHub & Documentation',
      category: 'Work' as const,
      durationMinutes: 45,
      isProductive: true,
    },
    {
      id: 'st_03',
      recordDate: today,
      deviceName: 'MacBook Pro',
      appOrSite: 'Coursera / Stanford CS',
      category: 'Education' as const,
      durationMinutes: 50,
      isProductive: true,
    },
    {
      id: 'st_04',
      recordDate: today,
      deviceName: 'iPhone',
      appOrSite: 'WhatsApp & Family Calls',
      category: 'Communication' as const,
      durationMinutes: 25,
      isProductive: true,
    },
    {
      id: 'st_05',
      recordDate: today,
      deviceName: 'iPhone',
      appOrSite: 'YouTube Tech Talks',
      category: 'Entertainment' as const,
      durationMinutes: 40,
      isProductive: false,
    },
    {
      id: 'st_06',
      recordDate: today,
      deviceName: 'iPhone',
      appOrSite: 'X / Twitter Tech',
      category: 'Social Media' as const,
      durationMinutes: 20,
      isProductive: false,
    },
  ];

  // Finance Transactions (in NPR)
  const transactions = [
    {
      id: 'tx_01',
      type: 'expense' as const,
      amount: 450,
      currency,
      category: 'Food',
      paymentMethod: 'eSewa',
      transactionDate: today,
      isRecurring: false,
      notes: 'Healthy afternoon fresh juice and roasted nuts',
    },
    {
      id: 'tx_02',
      type: 'expense' as const,
      amount: 400,
      currency,
      category: 'Transport',
      paymentMethod: 'Cash',
      transactionDate: today,
      isRecurring: false,
      notes: 'Fuel / local transit',
    },
    {
      id: 'tx_03',
      type: 'expense' as const,
      amount: 1850,
      currency,
      category: 'Education',
      paymentMethod: 'Khalti',
      transactionDate: '2026-09-22',
      isRecurring: false,
      notes: 'Algorithms and Data Structures textbook print copy',
    },
    {
      id: 'tx_04',
      type: 'expense' as const,
      amount: 2200,
      currency,
      category: 'Bills',
      paymentMethod: 'Bank Transfer',
      transactionDate: '2026-09-20',
      isRecurring: true,
      notes: 'High-speed Fiber Internet monthly bill (300 Mbps)',
    },
    {
      id: 'tx_05',
      type: 'expense' as const,
      amount: 3200,
      currency,
      category: 'Food',
      paymentMethod: 'eSewa',
      transactionDate: '2026-09-18',
      isRecurring: false,
      notes: 'Weekly whole food market groceries (vegetables, eggs, fruits, oats)',
    },
    {
      id: 'tx_06',
      type: 'income' as const,
      amount: 75000,
      currency,
      category: 'Freelance',
      paymentMethod: 'Bank Wire',
      transactionDate: '2026-09-15',
      isRecurring: false,
      notes: 'Full-stack application milestone delivery payment',
    },
    {
      id: 'tx_07',
      type: 'income' as const,
      amount: 45000,
      currency,
      category: 'Consulting',
      paymentMethod: 'Direct Deposit',
      transactionDate: '2026-09-05',
      isRecurring: false,
      notes: 'Backend architecture consulting and optimization',
    },
  ];

  // Budgets (Monthly for 2026-09 in NPR)
  const budgets = [
    { id: 'bdg_01', category: 'Food', monthlyLimit: 14000, currency, monthYear: '2026-09' },
    { id: 'bdg_02', category: 'Transport', monthlyLimit: 4500, currency, monthYear: '2026-09' },
    { id: 'bdg_03', category: 'Education', monthlyLimit: 6000, currency, monthYear: '2026-09' },
    { id: 'bdg_04', category: 'Bills', monthlyLimit: 5000, currency, monthYear: '2026-09' },
    { id: 'bdg_05', category: 'Entertainment', monthlyLimit: 3500, currency, monthYear: '2026-09' },
    { id: 'bdg_06', category: 'Health', monthlyLimit: 5000, currency, monthYear: '2026-09' },
  ];

  // Goals
  const goals = [
    {
      id: 'gol_01',
      title: 'Master Modern Systems Programming & Rust',
      description: 'Complete 100 deep hours of low-level systems programming and concurrent network services.',
      category: 'Career' as const,
      targetValue: 100,
      currentValue: 64,
      unit: 'hours',
      deadline: '2026-11-30',
      isCompleted: false,
      milestones: [
        { id: 'ms_1', title: 'Ownership, Borrowing & Lifetimes mastery', targetValue: 25, isAchieved: true },
        { id: 'ms_2', title: 'Multi-threaded TCP proxy service', targetValue: 50, isAchieved: true },
        { id: 'ms_3', title: 'Asynchronous event loop & Tokyo engine', targetValue: 75, isAchieved: false },
        { id: 'ms_4', title: 'Full distributed key-value store with Raft consensus', targetValue: 100, isAchieved: false },
      ],
      relatedHabitIds: ['hbt_02'],
    },
    {
      id: 'gol_02',
      title: 'Emergency Reserve Fund (6 Months Expenses)',
      description: 'Accumulate liquid savings buffer in high-yield local interest account.',
      category: 'Financial' as const,
      targetValue: 150000,
      currentValue: 112500,
      unit: 'NPR',
      deadline: '2026-12-31',
      isCompleted: false,
      milestones: [
        { id: 'ms_5', title: 'NPR 50,000 Milestone 1', targetValue: 50000, isAchieved: true },
        { id: 'ms_6', title: 'NPR 100,000 Milestone 2', targetValue: 100000, isAchieved: true },
        { id: 'ms_7', title: 'NPR 150,000 Complete Target', targetValue: 150000, isAchieved: false },
      ],
    },
    {
      id: 'gol_03',
      title: 'Sub-48-Minute 10K Running Endurance',
      description: 'Increase VO2 Max and aerobic base through structured polarized training.',
      category: 'Fitness' as const,
      targetValue: 10,
      currentValue: 7.2,
      unit: 'km pace target',
      deadline: '2026-10-31',
      isCompleted: false,
      milestones: [
        { id: 'ms_8', title: '5K in under 24 minutes', targetValue: 5, isAchieved: true },
        { id: 'ms_9', title: '8K sustained threshold run', targetValue: 8, isAchieved: false },
        { id: 'ms_10', title: 'Official 10K under 48 minutes', targetValue: 10, isAchieved: false },
      ],
      relatedHabitIds: ['hbt_03'],
    },
    {
      id: 'gol_04',
      title: 'Read 15 Foundational Engineering Books',
      description: 'System design, operating systems, database internals, and software architecture.',
      category: 'Education' as const,
      targetValue: 15,
      currentValue: 11,
      unit: 'books',
      deadline: '2026-12-31',
      isCompleted: false,
      milestones: [
        { id: 'ms_11', title: 'First 5 Core Architecture Classics', targetValue: 5, isAchieved: true },
        { id: 'ms_12', title: '10 Advanced Distributed Systems Texts', targetValue: 10, isAchieved: true },
        { id: 'ms_13', title: '15 Books Complete Capstone', targetValue: 15, isAchieved: false },
      ],
      relatedHabitIds: ['hbt_04'],
    },
  ];

  // Private Journal
  const journalEntries = [
    {
      id: 'jnl_01',
      entryDate: today,
      title: 'Architectural clarity and deep flow state',
      content: `Today felt unusually crisp and deliberate. Waking at 6:30 AM and immediately heading out for the morning run cleared away any mental fog. Building LifeOS today with normalized relational principles reminded me why software design is such an art form when executed without shortcuts. 

The biggest win was structuring the derived metrics—calculating real productivity scores instead of vanity metrics. Need to remain disciplined about stopping computer work by 21:30 tonight so my sleep quality score stays above 85.`,
      moodScore: 5,
      tags: ['reflection', 'focus', 'deep-work', 'clarity'],
      promptUsed: 'What did I accomplish today that moved the needle most?',
      gratitude: [
        'Energized morning run in cool mountain air',
        'Uninterrupted 3-hour deep work block on core architecture',
        'Fresh home-cooked lunch with family',
      ],
      isPrivate: true,
    },
    {
      id: 'jnl_02',
      entryDate: '2026-09-23',
      title: 'Managing energy over time and staying patient',
      content: `Had a slightly lower energy dip around 3 PM yesterday, but instead of forcing focus or scrolling phone, took a 15-minute eye rest and stretch. That recharged my focus for the evening leg gym workout. 

Consistency is not about 100% perfection every second; it is about keeping the baseline unshakeable. Habit streaks are holding strong.`,
      moodScore: 4,
      tags: ['energy', 'discipline', 'habits'],
      promptUsed: 'What went well and what requires adjustment?',
      gratitude: [
        'Solid squat workout at the gym',
        'Good conversation with a mentor',
        'Fast fiber internet working reliably',
      ],
      isPrivate: true,
    },
    {
      id: 'jnl_03',
      entryDate: '2026-09-22',
      title: 'Books and deliberate practice',
      content: `Received my copy of the data structures and algorithms volume. Reading physical paper pages without notification pings makes comprehension 3x faster. Noticed that when screen time drops under 4 hours, my nocturnal sleep latency drops to under 10 minutes.`,
      moodScore: 5,
      tags: ['reading', 'screen-time', 'sleep'],
      promptUsed: 'What am I grateful for today?',
      gratitude: [
        'Physical paper books',
        'A quiet place to study and think',
        'Good physical health and zero joint pain',
      ],
      isPrivate: true,
    },
  ];

  return {
    user,
    tasks,
    timelineEvents,
    habits,
    habitLogs,
    routines,
    workSessions,
    fitnessActivities,
    bodyMetrics,
    sleepRecords,
    screenTimeRecords,
    transactions,
    budgets,
    goals,
    journalEntries,
  };
}

class LifeOSDatabase {
  private data: LifeOSData;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): LifeOSData {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.user && parsed.tasks) {
          return parsed as LifeOSData;
        }
      }
    } catch (err) {
      console.warn('Could not read existing database file, seeding new state:', err);
    }
    const seed = generateInitialSeedData();
    this.saveData(seed);
    return seed;
  }

  public saveData(data?: LifeOSData) {
    if (data) {
      this.data = data;
    }
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to persist LifeOS database atomically:', err);
    }
  }

  public getData(): LifeOSData {
    return this.data;
  }

  public updateData(updater: (draft: LifeOSData) => void): LifeOSData {
    updater(this.data);
    this.saveData();
    return this.data;
  }
}

export const db = new LifeOSDatabase();
