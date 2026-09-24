import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, ViewType } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { TimelineView } from './components/views/TimelineView';
import { TasksView } from './components/views/TasksView';
import { HabitsView } from './components/views/HabitsView';
import { RoutinesView } from './components/views/RoutinesView';
import { WorkSessionsView } from './components/views/WorkSessionsView';
import { FitnessView } from './components/views/FitnessView';
import { SleepView } from './components/views/SleepView';
import { ScreenTimeView } from './components/views/ScreenTimeView';
import { FinancesView } from './components/views/FinancesView';
import { GoalsView } from './components/views/GoalsView';
import { JournalView } from './components/views/JournalView';
import { CalendarView } from './components/views/CalendarView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ReportsView } from './components/views/ReportsView';
import { AiAssistantView } from './components/views/AiAssistantView';
import { SettingsView } from './components/views/SettingsView';

import { api } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [activeDate, setActiveDate] = useState('2026-09-24');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getDashboard(activeDate);
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeDate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Keyboard shortcuts (Cmd/Ctrl + K for search, Escape to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsQuickAddOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDateChange = (deltaDays: number) => {
    const d = new Date(activeDate);
    d.setDate(d.getDate() + deltaDays);
    setActiveDate(d.toISOString().split('T')[0]);
  };

  const handleOpenAiPlanner = () => {
    setCurrentView('ai-assistant');
  };

  const currency = dashboardData?.user?.currency || 'NPR';

  return (
    <div className="flex h-screen w-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans select-none antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={view => {
          setCurrentView(view);
          setMobileMenuOpen(false);
        }}
        isMobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-neutral-950">
        <Header
          currentView={currentView}
          activeDate={activeDate}
          onPrevDate={() => handleDateChange(-1)}
          onNextDate={() => handleDateChange(1)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {loading && !dashboardData ? (
            <div className="flex items-center justify-center h-64 text-neutral-400 text-xs font-mono">
              Loading LifeOS Engine...
            </div>
          ) : (
            <>
              {currentView === 'dashboard' && (
                <DashboardView
                  data={dashboardData}
                  onRefresh={fetchDashboard}
                  onNavigate={setCurrentView}
                  onOpenQuickAdd={() => setIsQuickAddOpen(true)}
                  onOpenAiPlanner={handleOpenAiPlanner}
                />
              )}

              {currentView === 'timeline' && (
                <TimelineView
                  events={dashboardData?.timeline || []}
                  activeDate={activeDate}
                  onRefresh={fetchDashboard}
                  onOpenAiPlanner={handleOpenAiPlanner}
                />
              )}

              {currentView === 'tasks' && (
                <TasksView
                  tasks={dashboardData?.tasks || []}
                  activeDate={activeDate}
                  onRefresh={fetchDashboard}
                />
              )}

              {currentView === 'habits' && (
                <HabitsView
                  habits={dashboardData?.habits || []}
                  habitLogs={dashboardData?.habitLogs || []}
                  activeDate={activeDate}
                  onRefresh={fetchDashboard}
                />
              )}

              {currentView === 'routines' && (
                <RoutinesView
                  routines={dashboardData?.routines || []}
                  onRefresh={fetchDashboard}
                />
              )}

              {currentView === 'work-sessions' && (
                <WorkSessionsView
                  sessions={dashboardData?.workSessions || []}
                  tasks={dashboardData?.tasks || []}
                  activeDate={activeDate}
                  onRefresh={fetchDashboard}
                />
              )}

              {currentView === 'fitness' && (
                <FitnessView
                  activities={dashboardData?.fitnessActivities || []}
                  metrics={dashboardData?.bodyMetrics || []}
                  activeDate={activeDate}
                  onRefresh={fetchDashboard}
                />
              )}

              {currentView === 'sleep' && (
                <SleepView
                  sleepRecords={dashboardData?.sleepRecords || []}
                  activeDate={activeDate}
                  onRefresh={fetchDashboard}
                />
              )}

              {currentView === 'screen-time' && (
                <ScreenTimeView
                  records={dashboardData?.screenTimeRecords || []}
                  activeDate={activeDate}
                  onRefresh={fetchDashboard}
                />
              )}

              {currentView === 'finances' && (
                <FinancesView
                  transactions={dashboardData?.transactions || []}
                  budgets={dashboardData?.budgets || []}
                  activeDate={activeDate}
                  currency={currency}
                  onRefresh={fetchDashboard}
                />
              )}

              {currentView === 'goals' && (
                <GoalsView
                  goals={dashboardData?.goals || []}
                  onRefresh={fetchDashboard}
                />
              )}

              {currentView === 'journal' && (
                <JournalView
                  entries={dashboardData?.journalEntries || []}
                  activeDate={activeDate}
                  onRefresh={fetchDashboard}
                />
              )}

              {currentView === 'calendar' && (
                <CalendarView
                  events={dashboardData?.timeline || []}
                  tasks={dashboardData?.tasks || []}
                  activities={dashboardData?.fitnessActivities || []}
                  transactions={dashboardData?.transactions || []}
                  activeDate={activeDate}
                  onSelectDate={date => setActiveDate(date)}
                />
              )}

              {currentView === 'analytics' && (
                <AnalyticsView activeDate={activeDate} />
              )}

              {currentView === 'reports' && (
                <ReportsView activeDate={activeDate} currency={currency} />
              )}

              {currentView === 'ai-assistant' && (
                <AiAssistantView
                  activeDate={activeDate}
                  onRefresh={fetchDashboard}
                />
              )}

              {currentView === 'settings' && (
                <SettingsView
                  user={dashboardData?.user}
                  onRefresh={fetchDashboard}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        activeDate={activeDate}
        currency={currency}
        onSuccess={fetchDashboard}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={view => setCurrentView(view)}
      />
    </div>
  );
}
