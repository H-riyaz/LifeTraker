import React from 'react';
import {
  LayoutDashboard,
  Clock,
  CheckSquare,
  Sparkles,
  Repeat,
  Flame,
  Dumbbell,
  Moon,
  Monitor,
  Wallet,
  Target,
  BookOpen,
  Calendar as CalendarIcon,
  TrendingUp,
  FileText,
  Bot,
  Settings,
} from 'lucide-react';

export type ViewType =
  | 'dashboard'
  | 'timeline'
  | 'tasks'
  | 'calendar'
  | 'habits'
  | 'routines'
  | 'work-sessions'
  | 'fitness'
  | 'sleep'
  | 'screen-time'
  | 'finances'
  | 'goals'
  | 'journal'
  | 'analytics'
  | 'reports'
  | 'ai-assistant'
  | 'assistant'
  | 'settings';

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  isOpenMobile?: boolean;
  isMobileOpen?: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isOpenMobile,
  isMobileOpen,
  onCloseMobile,
}) => {
  const isMobileVisible = isMobileOpen ?? isOpenMobile ?? false;
  const navSections = [
    {
      heading: 'Command',
      items: [
        { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'timeline' as ViewType, label: 'Daily Timeline', icon: Clock },
        { id: 'tasks' as ViewType, label: 'Tasks & Sprints', icon: CheckSquare },
        { id: 'calendar' as ViewType, label: 'Master Calendar', icon: CalendarIcon },
      ],
    },
    {
      heading: 'Productivity & Habits',
      items: [
        { id: 'habits' as ViewType, label: 'Habits & Streaks', icon: Repeat },
        { id: 'routines' as ViewType, label: 'Daily Routines', icon: Sparkles },
        { id: 'work-sessions' as ViewType, label: 'Deep Work (Pomodoro)', icon: Flame },
      ],
    },
    {
      heading: 'Health & Recovery',
      items: [
        { id: 'fitness' as ViewType, label: 'Fitness & Body', icon: Dumbbell },
        { id: 'sleep' as ViewType, label: 'Sleep & Recovery', icon: Moon },
        { id: 'screen-time' as ViewType, label: 'Screen Time', icon: Monitor },
      ],
    },
    {
      heading: 'Wealth & Mindset',
      items: [
        { id: 'finances' as ViewType, label: 'Finances & Budget', icon: Wallet },
        { id: 'goals' as ViewType, label: 'Goals & Milestones', icon: Target },
        { id: 'journal' as ViewType, label: 'Private Journal', icon: BookOpen },
      ],
    },
    {
      heading: 'Intelligence',
      items: [
        { id: 'analytics' as ViewType, label: 'Analytics & Correlations', icon: TrendingUp },
        { id: 'reports' as ViewType, label: 'Life Reports', icon: FileText },
        { id: 'ai-assistant' as ViewType, label: 'AI Companion & Planner', icon: Bot },
        { id: 'settings' as ViewType, label: 'Settings & Backup', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileVisible && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isMobileVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Lockup */}
        <div className="h-16 px-6 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
              L
            </div>
            <span className="font-bold text-sm tracking-tight text-neutral-100">LifeOS</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">v2.4</span>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navSections.map((sec, idx) => (
            <div key={idx}>
              <div className="px-3 mb-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                {sec.heading}
              </div>
              <div className="space-y-0.5">
                {sec.items.map(item => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectView(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-neutral-800 text-white font-semibold'
                          : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-neutral-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Card */}
        <div className="p-3 border-t border-neutral-800 shrink-0">
          <button
            onClick={() => {
              onSelectView('settings');
              onCloseMobile();
            }}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-900 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-semibold text-neutral-300">
              RT
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-neutral-200 truncate">Riyaz Timalsina</div>
              <div className="text-[10px] text-neutral-400 truncate">NPR · Asia/Kathmandu</div>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
