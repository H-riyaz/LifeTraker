# LifeOS: Executive Self-Mastery & Sovereign Life Operating System

A high-performance, unified life operating system architected for ruthless execution, biological health optimization, financial sovereignty, and deep analytical clarity. Built for modern high-output individuals, founders, engineers, and knowledge workers.

---

## 🧭 System Architecture & Philosophy

LifeOS consolidates every critical domain of life—time, tasks, habits, biological recovery, fitness, finances, and reflections—into a cohesive, low-latency command center. It eliminates fragmented apps, subscription fatigue, and vendor lock-in with **local sovereign storage** and **grounded server-side AI intelligence**.

```
                           ┌──────────────────────────────┐
                           │      LifeOS Web Interface    │
                           │   (React 18 + TS + Tailwind) │
                           └──────────────┬───────────────┘
                                          │  REST API / JSON
                                          ▼
                           ┌──────────────────────────────┐
                           │   Express Full-Stack Server  │
                           │         (server.ts)          │
                           └──────┬───────────────┬───────┘
                                  │               │
                 ┌────────────────┴────┐     ┌────┴─────────────────┐
                 │  Sovereign Storage  │     │   Gemini 3.8 Flash   │
                 │   data/lifeos.json  │     │ Grounded Intelligence│
                 └─────────────────────┘     └──────────────────────┘
```

---

## ⚡ Core Operational Modules

### 1. Executive Command Dashboard
- **Algorithmic Productivity Score**: Derived mathematically from active data:
  $$\text{Score} = (0.40 \times \text{Focus Ratio}) + (0.35 \times \text{Task Completion Rate}) + (0.25 \times \text{Schedule Adherence})$$
- **Circadian Health & Recovery Gauges**: Real-time display of sleep debt, hydration volume, step counts, and active daily habit streaks.
- **7-Day Trend Analytics**: Responsive interactive velocity graphs comparing deep focus hours against task completion metrics.

### 2. Daily Timeline & Time-Block Scheduling
- 24-hour chronological agenda with dynamic schedule conflict detection.
- Visual categorization across Deep Work, Physical Fitness, Restorative Sleep, Operations, and Meals.
- Planned vs. actual execution duration tracking.
- One-click auto-scheduling powered by server-side Gemini.

### 3. Tasks & Sprint Execution
- Dual-mode workflow: Interactive **Kanban Board** (Backlog, Todo, In Progress, Done) and grouped **Sprint List View**.
- Severity/Priority classification: `Urgent`, `High`, `Medium`, `Low`.
- Granular subtask checklists with auto-calculated progress bars.
- Estimated vs. actual duration analytics for sprint retrospective.

### 4. Master Unified Calendar
- Consolidated monthly agenda synchronizing:
  - Timeline scheduled blocks
  - Task deadlines and delivery commitments
  - Logged physical training sessions
  - Financial cash flow events (incomes & expenses)
- One-click jump to any date across the entire operating system.

### 5. Habit Consistency Matrix
- 14-day trailing completion matrix with visual status pills.
- Streak counters (current active streak and all-time record).
- Frequency constraints (`daily` or `weekly`) with instant check-ins.

### 6. Circadian Routines Protocol
- Structured step-by-step checklists for:
  - **Morning Activation Routine**: Sunlight exposure, hydration, movement, day planning.
  - **Evening Circadian Wind-Down Routine**: Screen cutoff, reading, stretching, environment cooling.
- Daily reset protocol with completion status percentages.

### 7. Deep Work & Focus Sprints
- Embedded Pomodoro & Focus Timer with presets:
  - `25 / 5 min` (Standard Pomodoro)
  - `50 / 10 min` (Ultradian Cycle)
  - `90 min` (Deep Work Sprint)
- Task association with real-time distraction tally counter.
- Daily deep focus volume charts against target hours.

### 8. Physical Fitness & Body Health
- Multi-modality workout logger: Running, Resistance Training, Walking, Cycling, and Mobility.
- Hydration tracker with quick-log increments (+250ml, +500ml) against personalized targets.
- Biometric tracking: Daily steps, morning body weight, and resting heart rate (RHR).

### 9. Sleep & Nocturnal Recovery
- Calculation of restorative sleep volume and trailing **Sleep Debt** (accumulated deficit against target sleep).
- Subjective Sleep Quality rating (1–5 stars) and latency logs.
- 7-day nocturnal duration charts mapped against the 8.0h baseline.

### 10. Screen Time & Digital Hygiene
- Classification of screen usage: **Productive Engineering & Research** vs. **Passive Entertainment & Social**.
- Device breakdown (Workstation, Smartphone, Tablet).
- Application-level breakdown with interactive donut visualization.

### 11. Sovereign Personal Finances
- Default support for **Nepalese Rupee (NPR)**, alongside USD, EUR, GBP, and INR.
- Double-entry income vs. expense cash flow tracking with category breakdown.
- Monthly category budget ceilings with visual progress bars and warning thresholds.
- Net liquid savings and automated **Savings Rate %** calculation.

### 12. Macro Goals & Strategic Milestones
- Multi-quarter strategic life objectives across Career, Wealth, Health, and Knowledge.
- Measurable progress percentages and hierarchical milestone deliverables.

### 13. Private Daily Journal & Retrospective
- Daily retrospective editor with guided prompts (Wins, Bottlenecks, Tomorrow's Priorities).
- Subjective 1–5 daily mood scale.
- 3-part psychological gratitude anchors.

### 14. Statistical Analytics & Bivariate Correlations
- Mathematical Pearson correlation engine ($r$) analyzing cross-domain biological and productivity interactions:
  - **Sleep Duration vs. Deep Focus Hours**
  - **Screen Time vs. Productivity Score**
  - **Physical Exercise vs. Nocturnal Sleep Quality**
- Actionable, data-driven synthesis without speculative claims.

### 15. Executive Performance Reports
- Automated reporting engine across **Daily**, **Weekly**, and **Monthly** time windows.
- Executive performance summary narrative.
- Full daily ledger breakdown table.
- One-click data export to **CSV** and **JSON**.

### 16. Grounded AI Companion & Daily Planner
- Powered by **server-side Gemini 3.8 Flash** (`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`).
- **Grounded Intelligence**: Analyzes genuine recorded tasks, habit adherence, and sleep metrics.
- **Daily Planner**: Generates realistic time-blocked schedules with direct "Apply to Today's Timeline" action.
- Zero AI-slop; answers strictly based on authentic user metrics.

### 17. System Settings & Sovereign Data Backup
- Operator profile customization and circadian target calibration.
- Full database **JSON Snapshot Export** and **Instant Restore/Import**.
- Atomic persistence to disk (`data/lifeos.json`).

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘ + K` or `Ctrl + K` | Open Global Search & Command Palette |
| `Esc` | Dismiss active modal / search sheet |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Recharts
- **Backend**: Node.js, Express, tsx
- **Build Tool**: Vite
- **AI Engine**: `@google/genai` (Gemini 3.8 Flash)
- **Data Layer**: Atomic local JSON persistence with full REST API

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or bun

### 1. Installation
```bash
git clone <repository-url>
cd lifeos
npm install
```

### 2. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
Ensure your `GEMINI_API_KEY` is configured in `.env` if using the AI Daily Planner or Data Inquiries.

### 3. Development Server
Starts the Express API server and Vite client concurrently:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 4. Production Build
```bash
npm run build
npm start
```

---

## 📦 Data Sovereignty & Portability

All records reside locally in `data/lifeos.json`. You own 100% of your data:
- Export your complete life ledger at any time via **Settings > Export JSON Archive** or `/api/data/export?format=json`.
- Export daily performance summaries via `/api/data/export?format=csv`.
- Restore anytime by uploading your JSON archive back into the system.

---

## 📄 License
MIT License. Built for sovereign personal growth and execution excellence.
