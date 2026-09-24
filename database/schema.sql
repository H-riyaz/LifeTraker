-- ==============================================================================
-- LifeOS Database Schema (PostgreSQL DDL)
-- Normalized architecture for personal life management and analytics platform
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    default_currency VARCHAR(10) DEFAULT 'NPR',
    timezone VARCHAR(50) DEFAULT 'Asia/Kathmandu',
    theme_preference VARCHAR(10) DEFAULT 'dark',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Profiles / Preferences
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    daily_sleep_goal_minutes INT DEFAULT 480, -- 8h
    daily_work_goal_minutes INT DEFAULT 360, -- 6h
    daily_exercise_goal_minutes INT DEFAULT 45,
    daily_water_goal_ml INT DEFAULT 3000,
    daily_screen_time_limit_minutes INT DEFAULT 240, -- 4h
    monthly_savings_target_percent NUMERIC(5, 2) DEFAULT 30.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categories & Tags
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    module VARCHAR(30) NOT NULL, -- 'tasks', 'finance', 'screen_time', 'events'
    color VARCHAR(20) DEFAULT '#6366f1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, module, name)
);

-- 4. Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'cancelled')),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    due_date DATE,
    due_time TIME,
    estimated_duration_minutes INT DEFAULT 30,
    actual_duration_minutes INT DEFAULT 0,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule VARCHAR(100), -- e.g. 'DAILY', 'WEEKLY'
    tags TEXT[] DEFAULT '{}',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_tasks_user_date ON tasks(user_id, due_date);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);

-- 5. Daily Timeline Events
CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    event_date DATE NOT NULL,
    planned_start_time TIME NOT NULL,
    planned_end_time TIME NOT NULL,
    actual_start_time TIME,
    actual_end_time TIME,
    is_completed BOOLEAN DEFAULT FALSE,
    color VARCHAR(20) DEFAULT '#3b82f6',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_events_user_date ON timeline_events(user_id, event_date);

-- 6. Habits
CREATE TABLE habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    frequency VARCHAR(30) DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekdays', 'weekly', 'custom')),
    target_count INT DEFAULT 1,
    unit VARCHAR(30) DEFAULT 'times',
    category VARCHAR(50) DEFAULT 'Health',
    reminder_time TIME,
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Habit Logs
CREATE TABLE habit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    completed_count INT DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(habit_id, log_date)
);
CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, log_date);

-- 8. Routines & Routine Items
CREATE TABLE routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    routine_type VARCHAR(20) NOT NULL CHECK (routine_type IN ('morning', 'night', 'workday', 'weekend')),
    target_time TIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE routine_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    routine_id UUID REFERENCES routines(id) ON DELETE CASCADE,
    order_index INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    duration_minutes INT DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE routine_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    routine_id UUID REFERENCES routines(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    completed_items INT NOT NULL,
    total_items INT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Work & Study Focus Sessions (Pomodoro)
CREATE TABLE work_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) DEFAULT 'Programming',
    session_date DATE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INT NOT NULL,
    session_mode VARCHAR(20) DEFAULT '25_5' CHECK (session_mode IN ('25_5', '50_10', 'custom', 'stopwatch')),
    interruption_count INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_work_sessions_user_date ON work_sessions(user_id, session_date);

-- 10. Physical Fitness Activities
CREATE TABLE fitness_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- walking, running, gym, cycling, sports, stretching
    activity_date DATE NOT NULL,
    start_time TIME,
    duration_minutes INT NOT NULL,
    distance_km NUMERIC(6, 2) DEFAULT 0.00,
    calories INT DEFAULT 0,
    intensity VARCHAR(20) DEFAULT 'moderate' CHECK (intensity IN ('light', 'moderate', 'vigorous', 'maximum')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_fitness_user_date ON fitness_activities(user_id, activity_date);

-- 11. Body & Health Metrics
CREATE TABLE body_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    weight_kg NUMERIC(5, 2),
    height_cm NUMERIC(5, 1),
    body_fat_pct NUMERIC(4, 1),
    resting_heart_rate INT,
    water_ml INT DEFAULT 0,
    steps INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, metric_date)
);

-- 12. Sleep Records
CREATE TABLE sleep_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sleep_date DATE NOT NULL,
    sleep_start TIMESTAMP WITH TIME ZONE NOT NULL,
    sleep_end TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INT NOT NULL,
    goal_minutes INT DEFAULT 480,
    quality_rating INT CHECK (quality_rating BETWEEN 1 AND 100),
    interruptions INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, sleep_date)
);
CREATE INDEX idx_sleep_user_date ON sleep_records(user_id, sleep_date);

-- 13. Screen Time Records
CREATE TABLE screen_time_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    device_name VARCHAR(50) DEFAULT 'MacBook / Phone',
    app_or_site VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Social Media, Entertainment, Education, Programming, Work, Gaming, etc.
    duration_minutes INT NOT NULL,
    is_productive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_screen_time_user_date ON screen_time_records(user_id, record_date);

-- 14. Financial Expenses & Income
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('expense', 'income')),
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NPR',
    category VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'E-Sewa / Cash',
    transaction_date DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_interval VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);

-- 15. Budgets
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    monthly_limit NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NPR',
    month_year VARCHAR(7) NOT NULL, -- '2026-09'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category, month_year)
);

-- 16. Goals & Milestones
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'Career', -- Fitness, Education, Career, Financial, Personal, Projects
    target_value NUMERIC(10, 2) NOT NULL,
    current_value NUMERIC(10, 2) DEFAULT 0.00,
    unit VARCHAR(30) NOT NULL, -- hours, books, NPR, kg, etc.
    deadline DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goal_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    target_value NUMERIC(10, 2) NOT NULL,
    is_achieved BOOLEAN DEFAULT FALSE,
    achieved_at TIMESTAMP WITH TIME ZONE
);

-- 17. Private Journal
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    mood_score INT CHECK (mood_score BETWEEN 1 AND 5), -- 1: Bad, 3: Neutral, 5: Excellent
    tags TEXT[] DEFAULT '{}',
    prompt_used VARCHAR(255),
    gratitude TEXT[] DEFAULT '{}',
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, entry_date)
);

-- 18. Daily Rollup Aggregations (Pre-computed Performance Metrics)
CREATE TABLE daily_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    summary_date DATE NOT NULL,
    productivity_score NUMERIC(5, 2) DEFAULT 0.00,
    habit_consistency_pct NUMERIC(5, 2) DEFAULT 0.00,
    schedule_adherence_pct NUMERIC(5, 2) DEFAULT 0.00,
    focus_minutes INT DEFAULT 0,
    exercise_minutes INT DEFAULT 0,
    sleep_minutes INT DEFAULT 0,
    sleep_debt_minutes INT DEFAULT 0,
    screen_time_minutes INT DEFAULT 0,
    productive_screen_minutes INT DEFAULT 0,
    total_expense NUMERIC(12, 2) DEFAULT 0.00,
    total_income NUMERIC(12, 2) DEFAULT 0.00,
    tasks_completed INT DEFAULT 0,
    tasks_total INT DEFAULT 0,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, summary_date)
);
CREATE INDEX idx_daily_summaries_user_date ON daily_summaries(user_id, summary_date);
