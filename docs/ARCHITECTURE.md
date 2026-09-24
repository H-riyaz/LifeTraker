# LifeOS — Personal Life Management & Analytics Platform
## Complete Architecture & Engineering Specification

---

### 1. Product Requirements Document (PRD)

#### 1.1 Objective
LifeOS is a unified, high-integrity personal operating system and analytics platform designed for an individual to track, analyze, plan, and optimize every dimension of daily life:
- **Daily Timeline & Schedule**: Planned vs actual time, conflict detection, category breakdown.
- **Task Management**: Hierarchical tasks/subtasks, priority matrix, categories, duration estimates, recurrence, states.
- **Habits & Routines**: Frequency schedules, multi-day streak calculation, completion history, step-by-step morning/evening routines.
- **Physical Fitness & Body Metrics**: Workouts (gym, run, cycle, walk, sports), duration, distance, calories, intensity, weight/water/RHR tracking.
- **Sleep Architecture**: Sleep/wake timing, sleep duration, sleep debt/delta vs goal, sleep quality index, interruptions.
- **Screen Time**: Categorized device usage (Social, Work, Entertainment, Education, Programming), productive vs non-productive ratio.
- **Deep Work / Pomodoro Sessions**: Focus tracking, 25/5 & 50/10 intervals, task linkage, interruption counts.
- **Personal Finances**: Income, expenses, category budgets, savings rate, NPR default with multi-currency readiness.
- **Life Goals & Milestones**: Multi-area objectives (Career, Fitness, Financial, Education), progress tracking, task/habit links.
- **Private Journal**: Daily reflections, mood tracking, guided prompt templates, gratitude logs.
- **Analytics & Derived Insights**: High-order mathematical scoring (Productivity Score, Schedule Adherence, Habit Consistency, Savings Rate, Screen Time Ratio).
- **Correlation Engine**: Multi-variable statistical relationships (e.g., Sleep vs Focus, Screen Time vs Task Completion).
- **Intelligent Planning & AI Assistant**: Server-side Gemini integration grounded exclusively in the user's authentic data.
- **Data Sovereignty**: Complete CSV/JSON export and import, local backup, private storage.

---

### 2. System Architecture

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT TIER                                       |
|  React 19 + TypeScript + Tailwind CSS (Zero-Pill, Dark/Light Mode, Tabular-Nums)  |
|  - Dashboard Command Center           - Analytics & Reports Visualizer            |
|  - Interactive Timeline & Calendar    - Focus/Pomodoro Session Controller         |
|  - Task & Subtask Tree Manager        - Budget & Financial Ledger                 |
|  - Habit Matrix & Streak Engine       - AI Daily Planner & Data Assistant Chat    |
+------------------------------------------+----------------------------------------+
                                           | HTTPS / REST JSON (Bearer Session Auth)
+------------------------------------------v----------------------------------------+
|                                SERVER TIER (Node.js / Express)                    |
|  - Authentication Middleware (JWT / Session tokens, Argon2/bcrypt hashing)        |
|  - Rate Limiter, Helmet Security Headers, Input Validation (Zod schemas)          |
|  - Modular Controllers:                                                           |
|    * AuthController        * DashboardController     * TaskController             |
|    * HabitController       * FitnessController       * SleepController            |
|    * ScreenTimeController  * WorkSessionController   * FinanceController          |
|    * GoalController        * JournalController       * AnalyticsController        |
|    * ReportController      * GeminiAiController      * ImportExportController     |
+------------------------------------------+----------------------------------------+
|  Domain Logic & Analytics Service Layer:                                          |
|  - Metric Aggregator (Daily/Weekly/Monthly rollup cache)                          |
|  - Statistical Correlation Analyzer (Pearson coefficient approximation)           |
|  - Schedule Conflict Detector & Time Delta Comparator                             |
|  - Gemini 3.8 Flash Context Builder (Privacy filtered)                           |
+------------------------------------------+----------------------------------------+
                                           | Database Access Layer (Repository Pattern)
+------------------------------------------v----------------------------------------+
|                                DATA TIER (PostgreSQL)                             |
|  Normalized relational schema: 22 tables, foreign keys, timestamps, indexes       |
|  Persistent atomic storage engine with transactional integrity                    |
+-----------------------------------------------------------------------------------+
```

---

### 3. Technology Decisions

1. **Frontend**:
   - **React 19 + TypeScript**: Modern functional paradigm, concurrent features, type-safe props.
   - **Tailwind CSS v4**: Zero-runtime utility styling complying with the Frontend Design Constitution (60-30-10 color discipline, unboxed metadata, tabular numbers).
   - **Lucide React**: Clean functional monochrome iconography strictly for interactive affordances.
   - **Custom Responsive SVG Visualizations**: Bespoke, lightning-fast charts (Area, Bar, Scatter, Donut, Heatmap) with zero external canvas baggage and full responsive tooltips.

2. **Backend**:
   - **Node.js + Express + TypeScript (via tsx)**: Modular monolith with strict service/controller/repository separation.
   - **Gemini SDK (`@google/genai`)**: Server-side only using `gemini-3.8-flash` with system instructions restricting outputs to grounded personal data.

3. **Storage & Persistence**:
   - Normalized PostgreSQL DDL architecture (`database/schema.sql`).
   - High-performance, ACID-compliant transactional JSON repository with automatic atomic file flushing (`data/lifeos_db.json`) ensuring persistence across reboots.

---

### 4. Database ER Diagram Description & Schema

#### 4.1 Entities & Relationships
- **Users**: Core identity (`id`, `email`, `password_hash`, `full_name`, `currency`, `timezone`, `created_at`).
- **Tasks & Subtasks**: Hierarchical todos linked to `users`, categorized, tagged, prioritized with estimated and actual duration.
- **Timeline Events**: Scheduled time blocks (`start_time`, `end_time`, `category`, `actual_start`, `actual_end`, `status`).
- **Habits & Habit Logs**: Frequency criteria (daily/weekdays/target count), streak counters, daily completion state.
- **Routines & Routine Steps**: Morning/Night checklists with step-by-step items, durations, and completion timestamps.
- **Work Sessions**: Focus/Pomodoro sessions with start/stop, pause duration, interruptions, linked tasks/projects.
- **Activities (Fitness)**: Physical exercises (`type`, `duration_minutes`, `distance_km`, `calories`, `intensity`, `notes`).
- **Body Metrics**: Time-series health records (`weight_kg`, `resting_hr`, `water_ml`, `steps`).
- **Sleep Records**: Sleep duration, onset, wake, quality score (1-100), goal delta, interruptions.
- **Screen Time**: Device-specific application logs, categories, productive flag, duration minutes.
- **Transactions & Budgets**: Income, expenses, categories, payment methods, monthly budget thresholds.
- **Goals & Milestones**: Multi-stage targets with current progress, unit, target date, habit/task associations.
- **Journal Entries**: Daily reflections, mood (1-5), structured prompts, private notes.
- **Daily Summaries (Rollups)**: Pre-calculated daily metrics (focus minutes, exercise minutes, habit score, sleep delta, total spent, productivity score).

---

### 5. Analytics Architecture

Derived metrics calculated daily, weekly, and monthly:
1. **Productivity Score (0-100%)**:
   $$PS = 0.4 \times \min\left(1, \frac{\text{Focus Time}}{\text{Planned Focus}}\right) + 0.35 \times \left(\frac{\text{Completed Tasks}}{\text{Total Scheduled Tasks}}\right) + 0.25 \times \text{Schedule Adherence}$$
2. **Habit Consistency (0-100%)**:
   $$HC = \frac{\sum \text{Completed Habits}}{\sum \text{Scheduled Habits}} \times 100$$
3. **Schedule Adherence (0-100%)**:
   Overlap percentage between planned timeline events and recorded actual timeline execution.
4. **Savings Rate (%)**:
   $$\text{Savings Rate} = \frac{\text{Income} - \text{Expenses}}{\text{Income}} \times 100$$
5. **Screen Time Ratio**:
   $$\text{Screen Ratio} = \frac{\text{Total Screen Time}}{\text{Waking Hours (24 - Sleep Hours)}} \times 100$$
6. **Bivariate Correlation**:
   Computes sample covariance over standard deviations for pairs (e.g. Sleep vs Focus, Screen Time vs Task Completion). Output framed as statistical correlation, never causation.

---

### 6. Security Model
- **Password Security**: Argon2 / modern salted bcrypt hash with work factor 10.
- **Session Tokens**: Cryptographically random 256-bit session identifiers stored in HTTP headers (`Authorization: Bearer <token>`).
- **Data Isolation**: Every repository query strictly filters by `userId`.
- **Sanitization & Validation**: Input sanitization on text fields, XSS protection via React DOM escaping, parameterized database queries.
- **Privacy Assurance**: Journal entries and financial ledgers are strictly segregated; AI queries only pass aggregated contextual summaries with explicit user intent.

---

### 7. Development Roadmap
- **Phase 1**: Core Architecture, Database Schema, Server Setup, Auth & State Management Shell.
- **Phase 2**: Central Command Dashboard, Interactive Daily Timeline, Full Task Management.
- **Phase 3**: Habit Matrix with Streaks, Step-by-Step Routines, Pomodoro Deep Work Sessions.
- **Phase 4**: Fitness Tracking, Sleep Analysis & Debt Calculator, Body Metrics.
- **Phase 5**: Complete Personal Finance (Expenses, Income, Budgets with NPR currency).
- **Phase 6**: Goals with Milestones, Private Guided Journal.
- **Phase 7**: Comprehensive Analytics Engine, Weekly/Monthly Reports, Statistical Correlations.
- **Phase 8**: AI Assistant & Intelligent Daily Planner (Gemini 3.8 Flash server integration).
- **Phase 9**: Global Search, Complete Data Import/Export (JSON/CSV), Privacy & Settings.
- **Phase 10**: Verification, Edge Cases, Dark/Light Mode, Production Build Verification.
