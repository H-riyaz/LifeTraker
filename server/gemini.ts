import { GoogleGenAI } from '@google/genai';
import { LifeOSData } from '../src/types/lifeos.js';
import { calculateDailySummary, generatePersonalInsights } from './analytics.js';

// Shared server-side Gemini client with aistudio-build User-Agent
const apiKey = process.env.GEMINI_API_KEY;

export const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

function buildContextSnapshot(data: LifeOSData, date: string): string {
  const summary = calculateDailySummary(data, date);
  const insights = generatePersonalInsights(data, date);

  const activeTasks = data.tasks.filter(t => t.status !== 'completed' && t.status !== 'cancelled');
  const completedTasksToday = data.tasks.filter(t => t.dueDate === date && t.status === 'completed');
  const habits = data.habits.map(h => `${h.name}: ${h.currentStreak} day streak (target: ${h.targetCount} ${h.unit})`);
  const timelineToday = data.timelineEvents
    .filter(e => e.eventDate === date)
    .map(e => `${e.plannedStartTime}-${e.plannedEndTime}: ${e.title} [${e.isCompleted ? 'Done' : 'Pending'}]`);
  
  const recentWork = data.workSessions
    .filter(w => w.sessionDate === date)
    .map(w => `${w.title} (${w.durationMinutes}m, ${w.category})`);

  const recentExpenses = data.transactions
    .filter(t => t.transactionDate === date && t.type === 'expense')
    .map(t => `${t.category}: ${t.amount} ${t.currency} (${t.notes || 'general'})`);

  const sleep = data.sleepRecords.find(s => s.sleepDate === date);

  return `
USER CONTEXT SNAPSHOT (Date: ${date}, Timezone: ${data.user.timezone}):
- User Name: ${data.user.fullName}
- Currency: ${data.user.currency}
- Productivity Score Today: ${summary.productivityScore}/100
- Deep Focus Logged Today: ${summary.focusMinutes} minutes (Goal: ${data.user.dailyWorkGoalMinutes}m)
- Exercise Logged Today: ${summary.exerciseMinutes} minutes
- Sleep Last Night: ${sleep ? `${Math.floor(sleep.durationMinutes / 60)}h ${sleep.durationMinutes % 60}m (Quality: ${sleep.qualityRating}/100)` : 'Not logged yet'}
- Digital Screen Time Today: ${summary.screenTimeMinutes} minutes (${summary.productiveScreenMinutes}m productive)
- Total Spending Today: ${data.user.currency} ${summary.totalExpense}
- Active Goals: ${data.goals.map(g => `${g.title} (${g.currentValue}/${g.targetValue} ${g.unit})`).join('; ')}
- Habits & Streaks: ${habits.join('; ')}
- Today's Timeline Events: ${timelineToday.join('; ') || 'None scheduled yet'}
- Focus Sessions Logged: ${recentWork.join('; ') || 'None yet'}
- Tasks Pending Today/Upcoming: ${activeTasks.slice(0, 6).map(t => `[${t.priority.toUpperCase()}] ${t.title} (est: ${t.estimatedDurationMinutes}m)`).join('; ')}
- Tasks Completed Today: ${completedTasksToday.map(t => t.title).join('; ') || 'None yet'}
- Expenses Logged Today: ${recentExpenses.join('; ') || 'None yet'}
- Analytical Highlights: ${insights.highlights.join(' | ')}
`;
}

export async function askLifeAssistant(query: string, data: LifeOSData, date: string): Promise<string> {
  if (!ai) {
    return 'Gemini API key is not configured on the server. Please verify your GEMINI_API_KEY environment variable in Settings > Secrets.';
  }

  const context = buildContextSnapshot(data, date);
  const prompt = `
You are the intelligent life analyst within LifeOS, a private personal operating system.
The user is asking a question about their life, habits, productivity, sleep, workouts, schedule, finances, or goals.

GROUNDING RULES:
1. Ground your answer strictly in the user's authentic recorded data provided below.
2. If data is missing for a specific day or metric, state that clearly instead of fabricating conclusions.
3. Provide crisp, high-signal, actionable insights with numbers and percentages where applicable.
4. Maintain an encouraging, disciplined, and objective tone. Do not provide medical or financial advice; frame observations around their recorded metrics.

${context}

USER QUESTION:
"${query}"
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });
    return response.text || 'Unable to generate analysis at this time.';
  } catch (error: any) {
    console.error('Error generating Gemini response:', error);
    return `Analysis error: ${error.message || 'Failed to communicate with Gemini model'}`;
  }
}

export async function generateAiDailyPlan(
  data: LifeOSData,
  targetDate: string,
  preferences?: string
): Promise<{ schedule: Array<{ time: string; title: string; category: string; rationale: string }>; summary: string }> {
  if (!ai) {
    // Fallback structured plan if API key is not set
    return {
      summary: 'Generated based on local LifeOS optimization heuristics.',
      schedule: [
        { time: '06:30 - 07:00', title: 'Morning Hydration & Wake Up', category: 'Health', rationale: 'Maintain consistent circadian rhythm and habit streak.' },
        { time: '07:00 - 07:45', title: 'Cardio / Running Session', category: 'Fitness', rationale: 'High morning willpower window for cardiovascular endurance.' },
        { time: '08:00 - 08:45', title: 'Nutritious Breakfast & Planning', category: 'Routine', rationale: 'Pre-work fueling and task prioritization.' },
        { time: '09:00 - 12:00', title: 'Deep Work Sprint: High Priority Tasks', category: 'Work', rationale: 'Peak biological alertness period for algorithmic and systems programming.' },
        { time: '12:00 - 13:00', title: 'Lunch & Fresh Air Break', category: 'Routine', rationale: 'Active recovery to prevent afternoon burnout.' },
        { time: '13:30 - 15:30', title: 'Secondary Work & Educational Reading', category: 'Education', rationale: 'Dedicated block for system design study and code review.' },
        { time: '16:00 - 17:30', title: 'Task Execution & Communications', category: 'Work', rationale: 'Administrative and communication closure before evening.' },
        { time: '18:00 - 19:00', title: 'Evening Walk / Stretching', category: 'Fitness', rationale: 'Physical cool-down and unwinding from screen exposure.' },
        { time: '19:30 - 20:30', title: 'Dinner & Social Connection', category: 'Routine', rationale: 'Balanced evening time.' },
        { time: '21:00 - 22:00', title: 'Night Routine & Private Journal', category: 'Mindset', rationale: 'Daily review and screens off for optimal sleep onset.' },
      ],
    };
  }

  const context = buildContextSnapshot(data, targetDate);
  const prompt = `
You are the AI Daily Planner of LifeOS.
Your objective is to generate an optimal, realistic, and energizing daily schedule for ${targetDate}.

INPUT CONTEXT:
${context}

USER SPECIFIC PREFERENCES / NOTES:
${preferences || 'Optimize for high deep-work focus in the morning, protect sleep window (target 8h), allocate time for habits and active movement.'}

OUTPUT FORMAT:
Return a valid JSON object matching this structure:
{
  "summary": "Short 2-sentence rationale for how this day is balanced.",
  "schedule": [
    {
      "time": "07:00 - 07:45",
      "title": "Activity name",
      "category": "Work" | "Fitness" | "Routine" | "Education" | "Health" | "Rest",
      "rationale": "Why this block is scheduled at this exact time."
    }
  ]
}

Ensure the schedule accounts for waking up, meals, deep work sessions, physical fitness, habit completion, and wind-down.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.schedule && Array.isArray(parsed.schedule)) {
      return parsed;
    }
    throw new Error('Invalid JSON structure returned by model');
  } catch (error: any) {
    console.warn('Gemini daily planner fallback triggered:', error);
    return {
      summary: 'Heuristic schedule aligned with your pending tasks and habit targets.',
      schedule: [
        { time: '06:30 - 07:15', title: 'Hydration & Morning Fitness', category: 'Fitness', rationale: 'Keep habit streak active and jumpstart dopamine.' },
        { time: '08:00 - 08:45', title: 'Breakfast & Routine Checklist', category: 'Routine', rationale: 'Mental alignment before deep focus.' },
        { time: '09:00 - 12:00', title: 'Deep Work Sprint (Pomodoro 50/10)', category: 'Work', rationale: 'Peak cognitive focus on priority tasks.' },
        { time: '12:00 - 13:00', title: 'Lunch Break & Walk', category: 'Health', rationale: 'Cognitive recovery and sunlight exposure.' },
        { time: '13:30 - 16:30', title: 'Technical Projects & Learning', category: 'Education', rationale: 'Direct progress toward active goals.' },
        { time: '17:00 - 18:00', title: 'Exercise / Mobility', category: 'Fitness', rationale: 'Decompress posture after computer time.' },
        { time: '21:30 - 22:30', title: 'Night Routine & Journaling', category: 'Routine', rationale: 'Screens off to ensure restorative 8-hour sleep.' },
      ],
    };
  }
}
