import React from 'react';
import { Search, Plus, Sparkles, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { ViewType } from './Sidebar';

interface HeaderProps {
  currentView?: ViewType;
  currentViewTitle?: string;
  activeDate: string;
  onPrevDate?: () => void;
  onNextDate?: () => void;
  onDateChange?: (date: string) => void;
  onOpenQuickAdd: () => void;
  onOpenSearch: () => void;
  onOpenAiPlanner?: () => void;
  onToggleMobileMenu?: () => void;
}

const VIEW_TITLES: Record<string, string> = {
  dashboard: 'Executive Dashboard',
  timeline: 'Daily Timeline & Schedule',
  tasks: 'Tasks & Sprints',
  calendar: 'Master Calendar',
  habits: 'Habit Consistency Matrix',
  routines: 'Morning & Night Routines',
  'work-sessions': 'Deep Work Focus Sprints',
  fitness: 'Fitness & Body Health',
  sleep: 'Sleep & Nocturnal Recovery',
  'screen-time': 'Screen Time & Digital Hygiene',
  finances: 'Finances & Budget Ceilings',
  goals: 'Macro Goals & Milestones',
  journal: 'Daily Retrospective & Journal',
  analytics: 'Derived Analytics & Correlations',
  reports: 'Executive Life Reports',
  'ai-assistant': 'AI Companion & Planner',
  assistant: 'AI Companion & Planner',
  settings: 'System Settings & Sovereign Data',
};

export const Header: React.FC<HeaderProps> = ({
  currentView = 'dashboard',
  currentViewTitle,
  activeDate,
  onPrevDate,
  onNextDate,
  onDateChange,
  onOpenQuickAdd,
  onOpenSearch,
  onOpenAiPlanner,
  onToggleMobileMenu,
}) => {
  const displayTitle = currentViewTitle || VIEW_TITLES[currentView] || 'Overview';

  return (
    <header className="h-16 px-4 md:px-8 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Mobile Menu Trigger + Breadcrumb */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200"
            title="Toggle Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-400 hidden sm:inline">LifeOS</span>
          <span className="text-neutral-500 text-xs hidden sm:inline">/</span>
          <h1 className="text-sm md:text-base font-semibold text-neutral-100 tracking-tight truncate">
            {displayTitle}
          </h1>
        </div>
      </div>

      {/* Right: Date navigation + Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Date Selector with prev/next arrows */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
          {onPrevDate && (
            <button
              onClick={onPrevDate}
              title="Previous Day"
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          <input
            type="date"
            value={activeDate}
            onChange={e => onDateChange && onDateChange(e.target.value)}
            className="bg-transparent text-neutral-300 text-xs px-2 py-0.5 font-mono focus:outline-none cursor-pointer"
          />

          {onNextDate && (
            <button
              onClick={onNextDate}
              title="Next Day"
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          title="Search anything (Cmd+K)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden lg:inline text-[10px] font-mono bg-neutral-800 text-neutral-400 px-1 py-0.2 rounded-xs">
            ⌘K
          </kbd>
        </button>

        {/* AI Planner trigger */}
        {onOpenAiPlanner && (
          <button
            onClick={onOpenAiPlanner}
            title="AI Daily Planner"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Plan</span>
          </button>
        )}

        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quick Add</span>
        </button>
      </div>
    </header>
  );
};
