export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';
export type HabitFrequency = 'daily' | 'weekdays' | 'weekly' | 'custom';
export type ActivityType = 'walking' | 'running' | 'cycling' | 'gym' | 'stretching' | 'sports' | 'custom';
export type Intensity = 'light' | 'moderate' | 'vigorous' | 'maximum';
export type ScreenCategory = 'Social Media' | 'Entertainment' | 'Education' | 'Programming' | 'Work' | 'Communication' | 'Gaming' | 'Other';
export type TransactionType = 'expense' | 'income';
export type GoalCategory = 'Fitness' | 'Education' | 'Career' | 'Financial' | 'Personal' | 'Projects';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  currency: string; // Default 'NPR'
  timezone: string; // e.g. 'Asia/Kathmandu'
  theme: 'dark' | 'light';
  dailySleepGoalMinutes: number; // e.g. 480 (8h)
  dailyWorkGoalMinutes: number; // e.g. 360 (6h)
  dailyExerciseGoalMinutes: number; // e.g. 45
  dailyWaterGoalMl: number; // e.g. 3000
  dailyScreenLimitMinutes: number; // e.g. 240
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export type Subtask = SubTask;

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  category: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  estimatedDurationMinutes: number;
  actualDurationMinutes: number;
  isRecurring: boolean;
  recurrenceRule?: string;
  tags: string[];
  subtasks: SubTask[];
  completedAt?: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  category: string;
  eventDate: string; // YYYY-MM-DD
  plannedStartTime: string; // HH:mm
  plannedEndTime: string; // HH:mm
  actualStartTime?: string; // HH:mm
  actualEndTime?: string; // HH:mm
  isCompleted: boolean;
  color: string;
  notes?: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  targetCount: number;
  unit: string;
  category: string;
  reminderTime?: string;
  startDate: string;
  archived: boolean;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
}

export interface HabitLog {
  id: string;
  habitId: string;
  logDate: string; // YYYY-MM-DD
  completedCount: number;
  completed: boolean;
  notes?: string;
}

export interface RoutineItem {
  id: string;
  title: string;
  durationMinutes: number;
  orderIndex: number;
  isCompletedToday?: boolean;
}

export interface Routine {
  id: string;
  title: string;
  routineType: 'morning' | 'night' | 'workday' | 'weekend';
  targetTime: string;
  items: RoutineItem[];
}

export interface WorkSession {
  id: string;
  title: string;
  category: string;
  taskId?: string;
  sessionDate: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  durationMinutes: number;
  sessionMode: '25_5' | '50_10' | 'custom' | 'stopwatch';
  interruptionCount: number;
  notes?: string;
}

export interface FitnessActivity {
  id: string;
  activityType: ActivityType;
  activityDate: string; // YYYY-MM-DD
  startTime?: string;
  durationMinutes: number;
  distanceKm: number;
  calories: number;
  intensity: Intensity;
  notes?: string;
}

export interface BodyMetric {
  id: string;
  metricDate: string; // YYYY-MM-DD
  weightKg?: number;
  heightCm?: number;
  bodyFatPct?: number;
  restingHeartRate?: number;
  waterMl: number;
  steps: number;
}

export interface SleepRecord {
  id: string;
  sleepDate: string; // YYYY-MM-DD
  sleepStart: string; // ISO or HH:mm
  sleepEnd: string; // ISO or HH:mm
  durationMinutes: number;
  goalMinutes: number;
  qualityRating: number; // 1-100
  interruptions: number;
  notes?: string;
}

export interface ScreenTimeRecord {
  id: string;
  recordDate: string; // YYYY-MM-DD
  deviceName: string;
  appOrSite: string;
  category: ScreenCategory;
  durationMinutes: number;
  isProductive: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  category: string;
  paymentMethod: string;
  transactionDate: string; // YYYY-MM-DD
  isRecurring: boolean;
  notes?: string;
}

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  currency: string;
  monthYear: string; // YYYY-MM
}

export interface GoalMilestone {
  id: string;
  title: string;
  targetValue: number;
  isAchieved: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  isCompleted: boolean;
  milestones: GoalMilestone[];
  relatedHabitIds?: string[];
  relatedTaskIds?: string[];
}

export interface JournalEntry {
  id: string;
  entryDate: string; // YYYY-MM-DD
  title: string;
  content: string;
  moodScore: number; // 1 to 5
  tags: string[];
  promptUsed?: string;
  gratitude: string[];
  isPrivate: boolean;
}

export interface DailySummary {
  date: string;
  productivityScore: number; // 0 - 100
  habitConsistencyPct: number; // 0 - 100
  scheduleAdherencePct: number; // 0 - 100
  focusMinutes: number;
  exerciseMinutes: number;
  sleepMinutes: number;
  sleepDebtMinutes: number;
  screenTimeMinutes: number;
  productiveScreenMinutes: number;
  totalExpense: number;
  totalIncome: number;
  tasksCompleted: number;
  tasksTotal: number;
}

export interface DerivedInsights {
  highlights: string[];
  productivityTrend: string;
  sleepTrend: string;
  financeInsight: string;
  screenTimeInsight: string;
  habitStar: string;
  correlations: {
    label: string;
    description: string;
    correlationScore: number; // -1 to 1
    samplePoints: { x: number; y: number; label: string }[];
    xLabel: string;
    yLabel: string;
  }[];
}

export interface LifeOSData {
  user: UserProfile;
  tasks: Task[];
  timelineEvents: TimelineEvent[];
  habits: Habit[];
  habitLogs: HabitLog[];
  routines: Routine[];
  workSessions: WorkSession[];
  fitnessActivities: FitnessActivity[];
  bodyMetrics: BodyMetric[];
  sleepRecords: SleepRecord[];
  screenTimeRecords: ScreenTimeRecord[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  journalEntries: JournalEntry[];
}
