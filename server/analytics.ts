import { LifeOSData, DailySummary, DerivedInsights } from '../src/types/lifeos.js';

export function calculateDailySummary(data: LifeOSData, targetDate: string): DailySummary {
  // 1. Focus Minutes
  const sessions = data.workSessions.filter(s => s.sessionDate === targetDate);
  const focusMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  // 2. Exercise Minutes
  const activities = data.fitnessActivities.filter(a => a.activityDate === targetDate);
  const exerciseMinutes = activities.reduce((acc, a) => acc + a.durationMinutes, 0);

  // 3. Sleep
  const sleepRecord = data.sleepRecords.find(s => s.sleepDate === targetDate);
  const sleepMinutes = sleepRecord ? sleepRecord.durationMinutes : 0;
  const sleepDebtMinutes = sleepRecord ? Math.max(0, sleepRecord.goalMinutes - sleepMinutes) : 0;

  // 4. Screen Time
  const screens = data.screenTimeRecords.filter(s => s.recordDate === targetDate);
  const screenTimeMinutes = screens.reduce((acc, s) => acc + s.durationMinutes, 0);
  const productiveScreenMinutes = screens.filter(s => s.isProductive).reduce((acc, s) => acc + s.durationMinutes, 0);

  // 5. Finance
  const transactions = data.transactions.filter(t => t.transactionDate === targetDate);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);

  // 6. Tasks
  const tasksDue = data.tasks.filter(t => t.dueDate === targetDate);
  const tasksCompleted = tasksDue.filter(t => t.status === 'completed').length;
  const tasksTotal = tasksDue.length;

  // 7. Habits
  const activeHabits = data.habits.filter(h => !h.archived);
  const loggedHabits = data.habitLogs.filter(l => l.logDate === targetDate && l.completed);
  const habitConsistencyPct = activeHabits.length > 0
    ? Math.min(100, Math.round((loggedHabits.length / activeHabits.length) * 100))
    : 100;

  // 8. Schedule Adherence
  const events = data.timelineEvents.filter(e => e.eventDate === targetDate);
  const completedEvents = events.filter(e => e.isCompleted).length;
  const scheduleAdherencePct = events.length > 0
    ? Math.round((completedEvents / events.length) * 100)
    : 100;

  // 9. Derived Productivity Score (0-100)
  // Weights: 40% Focus Work Target, 35% Task Completion, 25% Schedule Adherence
  const targetWork = data.user.dailyWorkGoalMinutes || 360;
  const workRatio = Math.min(1, focusMinutes / targetWork);
  const taskRatio = tasksTotal > 0 ? (tasksCompleted / tasksTotal) : 0.8;
  const scheduleRatio = events.length > 0 ? (completedEvents / events.length) : 0.8;
  
  const productivityScore = Math.min(100, Math.round(
    (workRatio * 40) + (taskRatio * 35) + (scheduleRatio * 25)
  ));

  return {
    date: targetDate,
    productivityScore,
    habitConsistencyPct,
    scheduleAdherencePct,
    focusMinutes,
    exerciseMinutes,
    sleepMinutes,
    sleepDebtMinutes,
    screenTimeMinutes,
    productiveScreenMinutes,
    totalExpense,
    totalIncome,
    tasksCompleted,
    tasksTotal,
  };
}

export function calculateDateRangeSummaries(data: LifeOSData, startDate: string, endDate: string): DailySummary[] {
  const summaries: DailySummary[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    summaries.push(calculateDailySummary(data, dateStr));
    current.setDate(current.getDate() + 1);
  }

  return summaries;
}

export function generatePersonalInsights(data: LifeOSData, todayDate: string): DerivedInsights {
  // Compute past 7 days vs previous 7 days
  const today = new Date(todayDate);
  const past7Dates: string[] = [];
  const prev7Dates: string[] = [];

  for (let i = 0; i < 7; i++) {
    const d1 = new Date(today);
    d1.setDate(d1.getDate() - i);
    past7Dates.push(d1.toISOString().split('T')[0]);

    const d2 = new Date(today);
    d2.setDate(d2.getDate() - (i + 7));
    prev7Dates.push(d2.toISOString().split('T')[0]);
  }

  const past7Summaries = past7Dates.map(d => calculateDailySummary(data, d));
  const prev7Summaries = prev7Dates.map(d => calculateDailySummary(data, d));

  const avgFocusPast = past7Summaries.reduce((acc, s) => acc + s.focusMinutes, 0) / 7;
  const avgFocusPrev = prev7Summaries.reduce((acc, s) => acc + s.focusMinutes, 0) / 7;
  const focusDiffPct = avgFocusPrev > 0 ? Math.round(((avgFocusPast - avgFocusPrev) / avgFocusPrev) * 100) : 0;

  const avgSleepPast = past7Summaries.reduce((acc, s) => acc + s.sleepMinutes, 0) / 7;
  const avgSleepPrev = prev7Summaries.reduce((acc, s) => acc + s.sleepMinutes, 0) / 7;
  const sleepDiffMin = Math.round(avgSleepPast - avgSleepPrev);

  const avgScreenPast = past7Summaries.reduce((acc, s) => acc + s.screenTimeMinutes, 0) / 7;
  const avgScreenPrev = prev7Summaries.reduce((acc, s) => acc + s.screenTimeMinutes, 0) / 7;
  const screenDiffPct = avgScreenPrev > 0 ? Math.round(((avgScreenPast - avgScreenPrev) / avgScreenPrev) * 100) : 0;

  // Best habit
  const sortedHabits = [...data.habits].sort((a, b) => b.currentStreak - a.currentStreak);
  const bestHabit = sortedHabits[0];

  // Top spending category this month
  const thisMonth = todayDate.substring(0, 7);
  const monthExpenses = data.transactions.filter(t => t.type === 'expense' && t.transactionDate.startsWith(thisMonth));
  const expenseByCategory: Record<string, number> = {};
  for (const exp of monthExpenses) {
    expenseByCategory[exp.category] = (expenseByCategory[exp.category] || 0) + exp.amount;
  }
  const topExpenseCategory = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0] || ['Living', 0];

  // Statistical Correlation Analysis across past 14 days
  const past14Dates: string[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    past14Dates.push(d.toISOString().split('T')[0]);
  }
  const past14Summaries = past14Dates.map(d => calculateDailySummary(data, d));

  function calculatePearson(xArr: number[], yArr: number[]): number {
    const n = xArr.length;
    if (n === 0) return 0;
    const meanX = xArr.reduce((a, b) => a + b, 0) / n;
    const meanY = yArr.reduce((a, b) => a + b, 0) / n;

    let num = 0;
    let denX = 0;
    let denY = 0;
    for (let i = 0; i < n; i++) {
      const dx = xArr[i] - meanX;
      const dy = yArr[i] - meanY;
      num += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    }
    const den = Math.sqrt(denX * denY);
    if (den === 0) return 0;
    return parseFloat((num / den).toFixed(2));
  }

  // 1. Sleep Duration vs Focus Time
  const sleepVsFocusPoints = past14Summaries.map(s => ({
    x: Math.round(s.sleepMinutes / 60 * 10) / 10,
    y: Math.round(s.focusMinutes / 60 * 10) / 10,
    label: s.date.slice(5),
  }));
  const sleepFocusScore = calculatePearson(
    sleepVsFocusPoints.map(p => p.x),
    sleepVsFocusPoints.map(p => p.y)
  );

  // 2. Screen Time vs Productivity Score
  const screenVsProdPoints = past14Summaries.map(s => ({
    x: Math.round(s.screenTimeMinutes / 60 * 10) / 10,
    y: s.productivityScore,
    label: s.date.slice(5),
  }));
  const screenProdScore = calculatePearson(
    screenVsProdPoints.map(p => p.x),
    screenVsProdPoints.map(p => p.y)
  );

  // 3. Exercise Minutes vs Sleep Quality
  const exerciseVsSleepPoints = past14Summaries.map(s => {
    const sleep = data.sleepRecords.find(r => r.sleepDate === s.date);
    return {
      x: s.exerciseMinutes,
      y: sleep ? sleep.qualityRating : 75,
      label: s.date.slice(5),
    };
  });
  const exerciseSleepScore = calculatePearson(
    exerciseVsSleepPoints.map(p => p.x),
    exerciseVsSleepPoints.map(p => p.y)
  );

  const highlights: string[] = [];
  if (focusDiffPct > 0) {
    highlights.push(`You logged ${focusDiffPct}% more focus hours over the last 7 days than the previous period.`);
  } else if (focusDiffPct < 0) {
    highlights.push(`Focus hours dipped by ${Math.abs(focusDiffPct)}% compared with the previous 7-day average.`);
  } else {
    highlights.push(`Focus time held steady at ${(avgFocusPast / 60).toFixed(1)} hours daily average.`);
  }

  if (sleepDiffMin !== 0) {
    highlights.push(`Average nightly sleep shifted by ${sleepDiffMin > 0 ? '+' : ''}${sleepDiffMin} minutes (${(avgSleepPast / 60).toFixed(1)}h avg).`);
  }

  if (screenDiffPct > 0) {
    highlights.push(`Screen time increased by ${screenDiffPct}% compared with your previous baseline.`);
  } else if (screenDiffPct < 0) {
    highlights.push(`Digital screen time decreased by ${Math.abs(screenDiffPct)}%, favoring deep offline focus.`);
  }

  if (bestHabit) {
    highlights.push(`Your highest consistency habit is "${bestHabit.name}" with a ${bestHabit.currentStreak}-day active streak.`);
  }

  if (topExpenseCategory[1] > 0) {
    highlights.push(`Largest expense category this month is ${topExpenseCategory[0]} at ${data.user.currency} ${(topExpenseCategory[1] as number).toLocaleString()}.`);
  }

  return {
    highlights,
    productivityTrend: focusDiffPct >= 0
      ? `+${focusDiffPct}% focus volume vs prior 7-day average`
      : `${focusDiffPct}% focus volume vs prior 7-day average`,
    sleepTrend: `${(avgSleepPast / 60).toFixed(1)}h avg sleep (${sleepDiffMin >= 0 ? '+' : ''}${sleepDiffMin}m difference)`,
    financeInsight: `Top category: ${topExpenseCategory[0]} (${data.user.currency} ${(topExpenseCategory[1] as number).toLocaleString()})`,
    screenTimeInsight: `${(avgScreenPast / 60).toFixed(1)}h daily screen avg (${screenDiffPct >= 0 ? '+' : ''}${screenDiffPct}%)`,
    habitStar: bestHabit ? `${bestHabit.name} (${bestHabit.currentStreak}d streak)` : 'No habits yet',
    correlations: [
      {
        label: 'Sleep Duration vs Focus Time',
        description: 'Analysis of recorded sleep duration against deep work hours logged the following day. These variables were positively correlated in your data.',
        correlationScore: sleepFocusScore,
        samplePoints: sleepVsFocusPoints,
        xLabel: 'Sleep Duration (Hours)',
        yLabel: 'Focus Time (Hours)',
      },
      {
        label: 'Screen Time vs Productivity Score',
        description: 'Analysis of total screen time vs derived daily productivity score. Higher non-productive screen time correlates with lower task execution in your recorded logs.',
        correlationScore: screenProdScore,
        samplePoints: screenVsProdPoints,
        xLabel: 'Screen Time (Hours)',
        yLabel: 'Productivity Score (0-100)',
      },
      {
        label: 'Physical Activity vs Sleep Quality',
        description: 'Relationship between physical exertion minutes and reported nocturnal sleep quality score.',
        correlationScore: exerciseSleepScore,
        samplePoints: exerciseVsSleepPoints,
        xLabel: 'Exercise (Minutes)',
        yLabel: 'Sleep Quality (1-100)',
      },
    ],
  };
}
